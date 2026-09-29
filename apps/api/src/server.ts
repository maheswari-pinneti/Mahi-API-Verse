import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';

import { db, apis, endpoints, apiLanguages, count, eq } from '@mahi-api-verse/database';
import { requirePermission, Permission } from './plugins/rbac';

const server = Fastify({
  logger: true,
  trustProxy: ['127.0.0.1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'] // Trust only internal load balancers
});

// ---------------------------------------------------------
// Global Plugins
// ---------------------------------------------------------
server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  hidePoweredBy: true,
});

server.register(cors, {
  origin: ['https://mahi-api-verse.com', 'https://www.mahi-api-verse.com', 'http://localhost:3000'],
  credentials: true
});

server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// ---------------------------------------------------------
// Routes: Global Stats
// ---------------------------------------------------------
server.get('/v1/stats', async (request, reply) => {
  const [totalApis] = await db.select({ value: count() }).from(apis);
  const [totalEndpoints] = await db.select({ value: count() }).from(endpoints);
  const [languagesMapped] = await db.select({ value: count() }).from(apiLanguages);

  return {
    status: 'success',
    data: {
      total_apis_indexed: totalApis?.value || 0,
      total_endpoints: totalEndpoints?.value || 0,
      languages_mapped: languagesMapped?.value || 0,
      last_updated: new Date().toISOString()
    }
  };
});

// ---------------------------------------------------------
// Routes: API Core Intelligence
// ---------------------------------------------------------
server.get(
  '/v1/apis',
  async (request, reply) => {
    const allApis = await db.select().from(apis).limit(50);
    const [total] = await db.select({ value: count() }).from(apis);

  return {
    status: 'success',
    data: allApis,
    meta: {
      limit: 50,
      offset: 0,
      total: total?.value || 0
    }
  };
});

server.get('/v1/apis/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  
  let result;
  if (isUUID) {
    result = await db.select().from(apis).where(eq(apis.id, id)).limit(1);
  } else {
    // Treat as slug
    // We need to cast as any because Drizzle doesn't see slug on apis yet if we didn't migrate properly
    // or just assume it is there.
    result = await db.select().from(apis as any).where(eq((apis as any).slug, id)).limit(1);
  }

  if (!result || result.length === 0) {
    return reply.status(404).send({ status: 'error', message: 'API not found' });
  }

  // Fetch endpoints too
  const apiEndpoints = await db.select().from(endpoints as any).where(eq((endpoints as any).apiId, result[0].id));

  return {
    status: 'success',
    data: {
      ...result[0],
      endpoints: apiEndpoints
    }
  };
});

// ---------------------------------------------------------
// Routes: Endpoints & Language Matrix
// ---------------------------------------------------------
server.get('/v1/apis/:id/endpoints', async (request, reply) => {
  const { id } = request.params as { id: string };
  const apiEndpoints = await db.select().from(endpoints).where(eq(endpoints.apiId, id));

  return {
    status: 'success',
    data: apiEndpoints
  };
});

server.get('/v1/apis/:id/languages', async (request, reply) => {
  const { id } = request.params as { id: string };
  const languagesList = await db.select().from(apiLanguages).where(eq(apiLanguages.apiId, id));

  return {
    status: 'success',
    data: languagesList
  };
});

// ---------------------------------------------------------
// Routes: Protected Admin Endpoints
// ---------------------------------------------------------
server.post(
  '/v1/admin/sync',
  { preHandler: [requirePermission(Permission.ADMIN_SYSTEM)] },
  async (request, reply) => {
    return {
      status: 'success',
      message: 'System sync initiated (RBAC Enforced)'
    };
  }
);

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
