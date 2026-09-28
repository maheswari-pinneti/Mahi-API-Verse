import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { WebhookDispatcher, WebhookConfig } from '@mahi-api-verse/webhook-dispatcher';

const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export interface WebhookJobData {
  config: WebhookConfig;
  event: string;
  payload: any;
}

export const webhookWorker = new Worker<WebhookJobData>(
  'webhooks',
  async (job: Job<WebhookJobData>) => {
    console.log(`🚀 [WebhookWorker] Dispatching webhook for event ${job.data.event} to ${job.data.config.endpointUrl}`);
    
    const success = await WebhookDispatcher.dispatch(
      job.data.config,
      job.data.event,
      job.data.payload
    );

    if (!success) {
      throw new Error(`Failed to dispatch webhook to ${job.data.config.endpointUrl}`);
    }

    console.log(`✅ [WebhookWorker] Successfully dispatched event ${job.data.event}`);
    return true;
  },
  {
    connection: redis,
    concurrency: 10,
    limiter: {
      max: 100,
      duration: 1000 // Simple rate limiting: max 100 webhooks per second per worker
    }
  }
);

webhookWorker.on('failed', (job, err) => {
  if (job) {
    console.error(`❌ [WebhookWorker] Job ${job.id} failed:`, err.message);
  }
});
