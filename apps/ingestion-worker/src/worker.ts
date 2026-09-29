import { Worker, Job, Queue } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import * as crypto from 'crypto';
import { db, eq, apis, endpoints, apiAuthentication } from '@mahi-api-verse/database';
import { validateOutboundUrl } from '@mahi-api-verse/network-security';

// ---------------------------------------------------------
// 1. Queue Connection Setup
// ---------------------------------------------------------
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

const apiVerificationQueue = new Queue('api-verification', { connection: redisConnection });

console.log('🚀 Mahi API Verse Ingestion Worker Booting...');

// ---------------------------------------------------------
// 2. The Ingestion Pipeline Worker
// ---------------------------------------------------------
// This distributed worker listens to the 'api-ingestion' queue.
// When a discovery agent finds a new OpenAPI spec URL, this worker:
// 1. Downloads the raw JSON/YAML
// 2. Normalizes it into the canonical Mahi API Intelligence schema
// 3. Deduplicates it against the Postgres Database
// 4. Parses all Endpoints and Authentication modes
// 5. Enqueues the 'language-generation' verification task
const ingestionWorker = new Worker(
  'api-ingestion',
  async (job: Job) => {
    console.log(`[INGESTION] Processing Job ${job.id}: ${job.data.url}`);
    const { url, sourceUrl } = job.data;

    try {
      // Step 1: Network Request to Fetch the Schema
      const isSafe = await validateOutboundUrl(url);
      if (!isSafe) {
        throw new Error(`SSRF Validation Failed for ${url}. Aborting ingestion.`);
      }

      console.log(`[INGESTION] Fetching OpenAPI schema from ${url}...`);
      const { data: spec } = await axios.get(url, { maxContentLength: 10 * 1024 * 1024, timeout: 10000 });
      
      const specString = typeof spec === 'string' ? spec : JSON.stringify(spec);
      const hash = crypto.createHash('sha256').update(specString).digest('hex');

      // Step 2: Drizzle ORM Deduplication Check
      console.log(`[INGESTION] Checking Deduplication Engine for existing signatures...`);
      const existing = await db.select().from(apis).where(eq(apis.sourceUrl, url)).limit(1);
      
      let apiId = '';
      const version = spec?.info?.version || '1.0.0';
      const name = spec?.info?.title || 'Unknown API';
      const description = spec?.info?.description || null;

      if (existing.length > 0) {
        if (existing[0].version === version) {
          console.log(`[INGESTION] Idempotency: API version ${version} already processed for ${url}. Skipping.`);
          return { status: 'skipped', reason: 'idempotent' };
        }
        apiId = existing[0].id;
        console.log(`[INGESTION] Updating existing API ${apiId} to version ${version}`);
        await db.update(apis).set({ version, name, description }).where(eq(apis.id, apiId));
      } else {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + crypto.randomUUID().split('-')[0];
        console.log(`[INGESTION] Committing normalized API Passport to PostgreSQL...`);
        const inserted = await db.insert(apis).values({
          slug,
          name,
          version,
          category: 'General',
          description,
          sourceUrl: url,
        }).returning({ id: apis.id });
        apiId = inserted[0].id;
      }

      // Step 3: Normalization & Parse
      console.log(`[INGESTION] Parsing API endpoints and extracting authentication mechanisms...`);
      
      // Extract Authentication Mechanisms
      const securitySchemes = spec?.components?.securitySchemes || {};
      for (const [key, scheme] of Object.entries(securitySchemes)) {
        let authType = 'UNKNOWN';
        let authPlacement = 'HEADER';
        
        const anyScheme = scheme as any;
        if (anyScheme.type === 'http' && anyScheme.scheme === 'bearer') authType = 'JWT';
        else if (anyScheme.type === 'http' && anyScheme.scheme === 'basic') authType = 'BASIC';
        else if (anyScheme.type === 'apiKey') {
          authType = 'API_KEY';
          authPlacement = anyScheme.in?.toUpperCase() || 'HEADER';
        }
        else if (anyScheme.type === 'oauth2') authType = 'OAUTH2';
        
        await db.insert(apiAuthentication).values({
          apiId,
          type: authType,
          placement: authPlacement,
          details: { key, raw: scheme }
        }).onConflictDoNothing();
      }

      let endpointCount = 0;
      const paths = spec?.paths || {};
      const serverUrl = spec?.servers?.[0]?.url || new URL(url).origin;

      for (const [pathStr, pathItem] of Object.entries(paths)) {
        for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
          if ((pathItem as any)[method]) {
            const op = (pathItem as any)[method];
            
            // Extract Schemas
            const parameters = op.parameters ? JSON.stringify(op.parameters) : null;
            const requestSchema = op.requestBody ? JSON.stringify(op.requestBody) : null;
            
            const responseSchemaObj = op.responses?.['200'] || op.responses?.['201'] || null;
            const responseSchema = responseSchemaObj ? JSON.stringify(responseSchemaObj) : null;
            
            const errorSchemasObj = op.responses?.['400'] || op.responses?.['404'] || op.responses?.['500'] || null;
            const errorSchemas = errorSchemasObj ? JSON.stringify(errorSchemasObj) : null;

            await db.insert(endpoints).values({
              apiId,
              method: method.toUpperCase(),
              path: pathStr,
              summary: op.summary || null,
              parameters: parameters ? JSON.parse(parameters) : null,
              requestSchema: requestSchema ? JSON.parse(requestSchema) : null,
              responseSchema: responseSchema ? JSON.parse(responseSchema) : null,
              errorSchemas: errorSchemas ? JSON.parse(errorSchemas) : null,
              isIdempotent: ['GET', 'PUT', 'DELETE'].includes(method.toUpperCase())
            }).onConflictDoNothing(); // If we had unique constraint
            endpointCount++;

            // Step 5: Queue Downstream Work
            await apiVerificationQueue.add('verify-endpoint', {
              apiId,
              url: `${serverUrl}${pathStr.replace(/\{[^}]+\}/g, '1')}`, // simple substitution for tests
              method: method.toUpperCase()
            }, {
              attempts: 3,
              backoff: { type: 'exponential', delay: 1000 },
              removeOnComplete: true,
              removeOnFail: 100 // DLQ setup
            });
          }
        }
      }

      console.log(`[INGESTION] Success. Dispatched ${endpointCount} downstream verification jobs.`);
      return { status: 'success', parsed_endpoints: endpointCount };
      
    } catch (error) {
      console.error(`[INGESTION] Failed to process ${url}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10, // Process 10 schemas concurrently per pod
  }
);

// ---------------------------------------------------------
// 3. Graceful Shutdown & Error Handling
// ---------------------------------------------------------
ingestionWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully.`);
});

ingestionWorker.on('failed', (job, err) => {
  console.log(`❌ Job ${job?.id} failed:`, err.message);
});

process.on('SIGINT', async () => {
  console.log('Shutting down Ingestion Worker...');
  await ingestionWorker.close();
  process.exit(0);
});
