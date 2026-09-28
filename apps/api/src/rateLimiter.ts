import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

/**
 * PHASE 19: ADVANCED RATE LIMITING
 * 
 * Crucial for preventing competitor bots from scraping our entire 10M+ database.
 * Implements dynamic limits based on authentication status.
 */
export async function setupRateLimiting(fastify: FastifyInstance) {
  
  await fastify.register(rateLimit, {
    // In production, this connects to the Redis Cluster (Phase 16)
    // redis: new Redis(process.env.REDIS_URL),
    
    max: (request) => {
      // Authenticated users get massive quotas (e.g. 10,000 per hour)
      // Anonymous IPs are strictly capped to prevent scraping
      if (request.headers['x-api-key']) return 10000;
      return 60; // 60 requests per minute for public endpoints
    },
    
    timeWindow: '1 minute',
    
    keyGenerator: (request) => {
      // Track by API Key if they are logged in, otherwise track by IP address
      return (request.headers['x-api-key'] as string) || request.ip;
    },
    
    errorResponseBuilder: (request, context) => {
      return {
        code: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. You hit the cap. Please wait ${context.after} before retrying.`,
        retryAfter: context.ttl // ms until quota resets
      };
    }
  });
}
