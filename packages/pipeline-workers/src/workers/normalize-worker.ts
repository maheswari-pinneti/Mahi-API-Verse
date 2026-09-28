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
    passport.state = 'NORMALIZED';
    return passport;
  },
  { connection }
);
