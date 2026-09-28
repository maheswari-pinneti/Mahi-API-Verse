import { Worker } from 'bullmq';
import { SearchEngine } from '@mahi-api-verse/search-engine';
import { ApiPassport } from '@mahi-api-verse/schemas';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const engine = new SearchEngine();

// Ensure the index exists before starting the worker
engine.initializeIndex().catch((err: any) => {
  console.error('[Index Worker] Failed to initialize search index', err);
});

export const indexWorker = new Worker(
  'api-indexing',
  async (job) => {
    console.log(`[Index Worker] Processing job ${job.id}`);
    const passport: ApiPassport = job.data;
    
    // We map the ApiPassport to the expected indexed payload format
    await engine.indexApi({
      id: passport.id || `api_${Date.now()}`,
      name: passport.name,
      description: typeof passport.overview === 'string' ? passport.overview : JSON.stringify(passport.overview),
      providerName: passport.provider?.name || 'Unknown',
      categories: [],
      lifecycle: passport.state
    });
    
    console.log(`[Index Worker] Successfully indexed API ${passport.name}`);
    return { status: 'indexed', apiName: passport.name };
  },
  { connection }
);

indexWorker.on('failed', (job, err) => {
  console.error(`[Index Worker] Job ${job?.id} failed:`, err);
});
