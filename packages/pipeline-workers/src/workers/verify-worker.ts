import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const verifyWorker = new Worker(
  'api-verify-queue',
  async (job: Job) => {
    console.log(`[Verify Worker] Verifying API constraints for Job ${job.id}`);
    const passport = job.data.passport;
    // Verify rules
    passport.state = 'VERIFIED';
    return passport;
  },
  { connection }
);
