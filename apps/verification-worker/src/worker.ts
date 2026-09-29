import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import * as dns from 'dns';
import * as tls from 'tls';
import { promisify } from 'util';
import { db, eq, apis, verificationLogs } from '@mahi-api-verse/database';
import { validateOutboundUrl } from '@mahi-api-verse/network-security';

const resolveDns = promisify(dns.resolve);

// ---------------------------------------------------------
// 1. Queue Connection Setup
// ---------------------------------------------------------
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

console.log('🩺 Mahi API Verse Verification Worker Booting...');

// ---------------------------------------------------------
// Helper: Real TLS Verification
// ---------------------------------------------------------
function verifyTls(hostname: string): Promise<{ valid: boolean; issuer?: string; validTo?: string }> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        timeout: 5000,
      },
      () => {
        const authorized = socket.authorized;
        const cert = socket.getPeerCertificate(true);
        socket.end();
        resolve({
          valid: authorized,
          issuer: Array.isArray(cert?.issuer?.O) ? cert.issuer.O[0] : (cert?.issuer?.O as string) || (Array.isArray(cert?.issuer?.CN) ? cert.issuer.CN[0] : (cert?.issuer?.CN as string)),
          validTo: cert?.valid_to
        });
      }
    );

    socket.on('error', () => resolve({ valid: false }));
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ valid: false });
    });
  });
}

// ---------------------------------------------------------
// 2. The Verification Pipeline Worker
// ---------------------------------------------------------
const verificationWorker = new Worker(
  'api-verification',
  async (job: Job) => {
    const { apiId, url, method = 'GET' } = job.data;
    console.log(`[VERIFICATION] Processing Job ${job.id} for API: ${apiId} at ${url}`);

    const startTime = Date.now();
    let dnsValid = false;
    let endpointReachable = false;
    let tlsValid = false;
    let tlsDetails = {};
    let rawResponseData = null;

    try {
      const parsedUrl = new URL(url);
      
      // Step 1: DNS Resolution Check
      console.log(`[VERIFICATION] Resolving DNS for ${parsedUrl.hostname}...`);
      try {
        const addresses = await resolveDns(parsedUrl.hostname);
        dnsValid = addresses && addresses.length > 0;
      } catch (dnsErr) {
        console.warn(`[VERIFICATION] DNS resolution failed for ${parsedUrl.hostname}`);
      }

      // Step 2: TLS Check
      if (parsedUrl.protocol === 'https:') {
        console.log(`[VERIFICATION] Checking TLS Certificate for ${parsedUrl.hostname}...`);
        const tlsResult = await verifyTls(parsedUrl.hostname);
        tlsValid = tlsResult.valid;
        tlsDetails = { issuer: tlsResult.issuer, validTo: tlsResult.validTo };
      }

      // STRICT SSRF CHECK BEFORE AXIOS PING
      const isSafe = await validateOutboundUrl(url);
      if (!isSafe) {
        throw new Error(`SSRF Validation Failed for ${url}`);
      }

      // Step 3: Endpoint Reachability Check
      console.log(`[VERIFICATION] Executing HTTPS Ping to ${url}...`);
      const response = await axios({
        method,
        url,
        timeout: 5000,
        headers: { 'User-Agent': 'Mahi-API-Verse-Verification-Bot/1.0' }
      });

      endpointReachable = response.status >= 200 && response.status < 500;
      rawResponseData = response.data;
      
    } catch (error: any) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        endpointReachable = true;
        rawResponseData = error.response.data;
      } else {
        console.error(`[VERIFICATION] Endpoint Unreachable:`, error.message);
      }
    }

    const latencyMs = Date.now() - startTime;
    
    // Determine overall lifecycle status
    let lifecycleStatus = 'UNVERIFIED';
    if (dnsValid && endpointReachable && tlsValid) {
      lifecycleStatus = 'VERIFIED';
    } else if (dnsValid && endpointReachable && !tlsValid) {
      lifecycleStatus = 'PARTIALLY_VERIFIED';
    } else {
      lifecycleStatus = 'OFFLINE';
    }

    console.log(`[VERIFICATION] Result for ${apiId}: DNS=${dnsValid}, TLS=${tlsValid}, Reachable=${endpointReachable}, Latency=${latencyMs}ms. Status -> ${lifecycleStatus}`);

    // Step 4: Write Verification Logs to Drizzle ORM
    try {
      await db.insert(verificationLogs).values({
        apiId,
        dnsValid,
        tlsValid,
        endpointReachable,
        latencyMs: latencyMs.toString(),
        rawResponse: rawResponseData ? JSON.stringify(rawResponseData).substring(0, 1000) : null // Keep it bounded
      });

      // Update API Status
      await db.update(apis)
        .set({ 
          lastVerifiedAt: new Date(),
          lifecycle: lifecycleStatus
        })
        .where(eq(apis.id, apiId));
        
    } catch (dbErr) {
      console.error(`[VERIFICATION] Database update failed for ${apiId}:`, dbErr);
      throw dbErr;
    }

    return { 
      status: 'success', 
      apiId, 
      dnsValid,
      tlsValid,
      endpointReachable,
      latencyMs 
    };
  },
  {
    connection: redisConnection,
    concurrency: 20, 
  }
);

// ---------------------------------------------------------
// 3. Graceful Shutdown & Error Handling
// ---------------------------------------------------------
verificationWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} verified successfully.`);
});

verificationWorker.on('failed', (job, err) => {
  console.log(`❌ Job ${job?.id} verification failed:`, err.message);
});

process.on('SIGINT', async () => {
  console.log('Shutting down Verification Worker...');
  await verificationWorker.close();
  process.exit(0);
});
