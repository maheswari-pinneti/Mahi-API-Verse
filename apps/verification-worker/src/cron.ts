import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { db, apis, lt } from '@mahi-api-verse/database';

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

const apiVerificationQueue = new Queue('api-verification', { connection: redisConnection });

async function enqueueStaleApis() {
  console.log('⏰ [CRON] Scanning for stale APIs requiring re-verification...');
  
  // Find APIs that haven't been verified in the last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  try {
    const staleApis = await db.select({
      id: apis.id,
      sourceUrl: apis.sourceUrl
    }).from(apis)
    .where(lt(apis.lastVerifiedAt, twentyFourHoursAgo));
    
    console.log(`⏰ [CRON] Found ${staleApis.length} stale APIs.`);
    
    for (const api of staleApis) {
      if (!api.sourceUrl) continue;
      
      await apiVerificationQueue.add('verify-endpoint', {
        apiId: api.id,
        url: api.sourceUrl, // Should ideally be endpoints from the DB, but sourceUrl acts as ping
        method: 'GET'
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true
      });
    }
    
    console.log(`⏰ [CRON] Enqueued ${staleApis.length} verification jobs.`);
  } catch (error) {
    console.error('⏰ [CRON] Failed to query stale APIs:', error);
  }
}

// Run immediately, then every 6 hours
enqueueStaleApis();
setInterval(enqueueStaleApis, 6 * 60 * 60 * 1000);
