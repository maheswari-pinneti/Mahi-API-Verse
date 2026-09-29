import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const normalizeWorker = new Worker(
  'api-normalize-queue',
  async (job: Job) => {
    console.log(`[Normalize Worker] Processing Job ${job.id}`);
    const passport = job.data.passport;
    // Normalize logic goes here...
    
    // Check for conflicting metadata sources (Phase 8 logic)
    if (job.data.sources && job.data.sources.length > 1) {
       passport.conflicting_metadata = true;
       console.warn(`[Normalize Worker] Conflict detected for API ${passport.id}`);
    }

    passport.state = 'NORMALIZED';
    return passport;
  },
  { connection }
);
