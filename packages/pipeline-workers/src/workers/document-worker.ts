import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const documentWorker = new Worker(
  'api-document-queue',
  async (job: Job) => {
    console.log(`[Document Worker] Generating Docs for Job ${job.id}`);
    const passport = job.data.passport;
    // Generate docs...
    passport.state = 'DOCUMENTED';
    return passport;
  },
  { connection }
);
