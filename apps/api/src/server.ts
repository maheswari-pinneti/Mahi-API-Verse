import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

const server = Fastify({
  logger: true,
  trustProxy: true
});

// ---------------------------------------------------------
// Global Plugins
// ---------------------------------------------------------
server.register(cors, {
  origin: '*'
});

server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// ---------------------------------------------------------
// Routes: Global Stats
// ---------------------------------------------------------
server.get('/v1/stats', async (request, reply) => {
  // In a real implementation, this would run a `COUNT(*)` via Drizzle ORM
  // against the APIs table. Returning a mock representing the verified subset.
  return {
    status: 'success',
    data: {
      total_apis_indexed: 14205,
      total_endpoints: 125902,
      languages_mapped: 704,
      last_updated: new Date().toISOString()
    }
  };
});

// ---------------------------------------------------------
// Routes: API Core Intelligence
// ---------------------------------------------------------
server.get('/v1/apis', async (request, reply) => {
  return {
    status: 'success',
    data: [], // Drizzle query: db.select().from(apis).limit(50)
    meta: {
      limit: 50,
      offset: 0,
      total: 14205
    }
  };
});

server.get('/v1/apis/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  return {
    status: 'success',
    data: {
      id,
      name: 'Weather API Mock',
      lifecycle: 'VERIFIED'
    }
  };
});

// ---------------------------------------------------------
// Routes: Endpoints & Language Matrix
// ---------------------------------------------------------
server.get('/v1/apis/:id/endpoints', async (request, reply) => {
  const { id } = request.params as { id: string };
  return {
    status: 'success',
    data: [] // Drizzle query: db.select().from(endpoints).where(eq(endpoints.apiId, id))
  };
});

server.get('/v1/apis/:id/languages', async (request, reply) => {
  const { id } = request.params as { id: string };
  return {
    status: 'success',
    data: [] // Drizzle query across apiLanguages join table
  };
});

// ---------------------------------------------------------
// Boot Sequence
// ---------------------------------------------------------
const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🌌 Mahi API Verse Fastify Server running on http://localhost:3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
