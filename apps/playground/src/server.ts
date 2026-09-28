import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import axios from 'axios';

const server = Fastify({ logger: true });

// ---------------------------------------------------------
// Global Plugins
// ---------------------------------------------------------
server.register(cors, {
  origin: '*' // In production, restrict this strictly to the Next.js portal URL
});

server.register(rateLimit, {
  max: 30, // Extremely tight rate limits on the playground proxy to prevent abuse
  timeWindow: '1 minute'
});

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------
interface PlaygroundRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

// ---------------------------------------------------------
// Abuse Prevention & SSRF Guard
// ---------------------------------------------------------
const isUrlAllowed = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr);
    
    // Explicitly block internal networks (SSRF Protection)
    const blockedHostnames = ['localhost', '127.0.0.1', '169.254.169.254', '::1'];
    if (blockedHostnames.includes(url.hostname)) {
      return false;
    }
    
    // Block non-HTTP protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------
// Routes: Playground Bridge
// ---------------------------------------------------------
server.post('/v1/execute', async (request, reply) => {
  const reqBody = request.body as PlaygroundRequest;
  
  if (!reqBody.url || !reqBody.method) {
    return reply.status(400).send({ error: 'Missing required fields: url, method' });
  }
  
  if (!isUrlAllowed(reqBody.url)) {
    return reply.status(403).send({ error: 'SSRF Protection: The requested URL is prohibited.' });
  }

  const startTime = Date.now();

  try {
    const response = await axios({
      method: reqBody.method,
      url: reqBody.url,
      headers: {
        ...reqBody.headers,
        'User-Agent': 'Mahi-API-Verse-Playground/1.0', // Transparent User-Agent
      },
      data: reqBody.body,
      timeout: 10000, // Maximum execution time: 10 seconds
      validateStatus: () => true // Resolve on all HTTP codes (e.g. 404, 500) so we can proxy them back
    });

    return reply.send({
      proxy_meta: {
        latency_ms: Date.now() - startTime,
        status: response.status,
      },
      headers: response.headers,
      data: response.data
    });

  } catch (error: any) {
    server.log.error(error);
    return reply.status(502).send({
      error: 'Playground Execution Failed',
      details: error.message
    });
  }
});

// ---------------------------------------------------------
// Boot Sequence
// ---------------------------------------------------------
const start = async () => {
  try {
    await server.listen({ port: 3002, host: '0.0.0.0' });
    console.log('🧪 Mahi API Verse Playground Server running on http://localhost:3002');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
