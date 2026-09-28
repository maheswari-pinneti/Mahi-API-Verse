import pino from 'pino';
import * as promClient from 'prom-client';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * PHASE 23: OBSERVABILITY & TELEMETRY
 * 
 * Centralized logging and metrics tracking across the entire monorepo.
 * Ensures we can track p99 latencies and 500 errors when scaling to 10M APIs.
 */

// 1. STRUCTURED LOGGING (Pino)
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // In production, we stream this JSON directly to Datadog or AWS CloudWatch.
  // In development, we use pino-pretty for human-readable console output.
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  })
});

// 2. PROMETHEUS METRICS
// Initialize the default Node.js metrics (Event loop lag, Heap memory, CPU)
promClient.collectDefaultMetrics();

// Custom Histogram to track exactly how fast our Fastify API routes are
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 50, 100, 300, 500, 1000, 5000] // Defines our SLA buckets
});

const httpErrorsCounter = new promClient.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code']
});

// 3. FASTIFY OBSERVABILITY HOOKS
export const observabilityMiddleware = {
  
  // Track when a request starts
  onRequest: async (request: FastifyRequest) => {
    // Start a timer on the request object
    (request as any).startTime = process.hrtime();
  },

  // Track when a request finishes (Record Telemetry)
  onResponse: async (request: FastifyRequest, reply: FastifyReply) => {
    const start = (request as any).startTime;
    if (!start) return;

    const diff = process.hrtime(start);
    const latencyMs = (diff[0] * 1e3) + (diff[1] * 1e-6);

    // Record the latency in Prometheus
    httpRequestDurationMicroseconds
      .labels(request.method, request.routeOptions.url || request.url, reply.statusCode.toString())
      .observe(latencyMs);

    // If it's a 500 server error, sound the alarm
    if (reply.statusCode >= 500) {
      httpErrorsCounter
        .labels(request.method, request.routeOptions.url || request.url, reply.statusCode.toString())
        .inc();
      
      logger.error({
        msg: '🚨 CRITICAL SERVER ERROR',
        requestId: request.headers['x-mahi-request-id'],
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        latencyMs: latencyMs.toFixed(2)
      });
    } else {
      // Normal access logging
      logger.info({
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        latencyMs: latencyMs.toFixed(2)
      });
    }
  }
};

// Function to expose the /metrics endpoint for Prometheus scrapers
export const getPrometheusMetrics = async () => {
  return await promClient.register.metrics();
};
