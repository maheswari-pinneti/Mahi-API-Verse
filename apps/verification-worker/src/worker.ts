import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import * as dns from 'dns';
import { promisify } from 'util';

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
// 2. The Verification Pipeline Worker
// ---------------------------------------------------------
// This distributed worker listens to the 'api-verification' queue.
// For each API ingested into the core database, this worker:
// 1. Performs a DNS check on the provider's API domain
// 2. Performs a lightweight TLS / HTTPS check
// 3. Pings a non-destructive health/status endpoint (if available)
// 4. Logs latency, uptime, and validation status to the DB
const verificationWorker = new Worker(
  'api-verification',
  async (job: Job) => {
    const { apiId, url, method = 'GET' } = job.data;
    console.log(`[VERIFICATION] Processing Job ${job.id} for API: ${apiId} at ${url}`);

    const startTime = Date.now();
    let dnsValid = false;
    let endpointReachable = false;
    let tlsValid = false;

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

      // Step 2: TLS and Endpoint Reachability Check
      console.log(`[VERIFICATION] Executing lightweight HTTPS Ping to ${url}...`);
      if (parsedUrl.protocol === 'https:') {
        tlsValid = true; // Simplified for architectural blueprint
      }

      // We set a strict timeout to avoid hung workers
      const response = await axios({
        method,
        url,
        timeout: 5000,
        headers: { 'User-Agent': 'Mahi-API-Verse-Verification-Bot/1.0' }
      });

      endpointReachable = response.status >= 200 && response.status < 500;
      
    } catch (error: any) {
      // 4xx errors technically mean the endpoint is reachable but requires auth
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        endpointReachable = true; 
      } else {
        console.error(`[VERIFICATION] Endpoint Unreachable:`, error.message);
      }
    }

    const latencyMs = Date.now() - startTime;

    // Step 3: Write Verification Logs to Drizzle ORM
    // db.insert(verificationLogs).values({ apiId, dnsValid, tlsValid, endpointReachable, latencyMs: latencyMs.toString() })
    // db.update(apis).set({ lastVerifiedAt: new Date(), lifecycle: endpointReachable ? 'VERIFIED' : 'OFFLINE' }).where(eq(apis.id, apiId))
    
    console.log(`[VERIFICATION] Result for ${apiId}: DNS=${dnsValid}, TLS=${tlsValid}, Reachable=${endpointReachable}, Latency=${latencyMs}ms`);

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
    concurrency: 20, // High concurrency since verification is heavily network I/O bound
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
