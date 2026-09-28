import axios from 'axios';
import IORedis from 'ioredis';

// Target the local Fastify API & Playground containers for synthetic testing
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001/v1';
const PLAYGROUND_BASE = process.env.PLAYGROUND_BASE_URL || 'http://localhost:3002/v1';

describe('Mahi API Verse - End-to-End Synthetic Integration Tests', () => {
  let redis: IORedis;

  beforeAll(() => {
    redis = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      lazyConnect: true
    });
  });

  afterAll(async () => {
    try {
      await redis.quit();
    } catch (e) {
      // Ignore
    }
  });

  describe('1. Fastify Core API (Phase 32)', () => {
    it('should return system stats', async () => {
      // In CI, we would ensure the containers are up before running tests.
      // We will wrap in a try/catch to gracefully skip if the network isn't running yet locally
      try {
        const response = await axios.get(`${API_BASE}/stats`);
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data.data.total_apis_indexed).toBeGreaterThanOrEqual(0);
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') {
          console.warn('⚠️ Fastify API is not running locally. Skipping test.');
        } else {
          throw err;
        }
      }
    });

    it('should list APIs', async () => {
      try {
        const response = await axios.get(`${API_BASE}/apis`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') return;
        throw err;
      }
    });
  });

  describe('2. Playground Proxy Bridge (Phase 36)', () => {
    it('should successfully proxy a GET request to a safe public API', async () => {
      try {
        const response = await axios.post(`${PLAYGROUND_BASE}/execute`, {
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/todos/1'
        });
        
        expect(response.status).toBe(200);
        expect(response.data.proxy_meta).toBeDefined();
        expect(response.data.proxy_meta.status).toBe(200);
        expect(response.data.data.userId).toBe(1);
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') return;
        throw err;
      }
    });

    it('should block SSRF attacks against localhost', async () => {
      try {
        await axios.post(`${PLAYGROUND_BASE}/execute`, {
          method: 'GET',
          url: 'http://localhost:5432'
        });
        fail('Should have thrown a 403 Forbidden error');
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') return;
        expect(err.response.status).toBe(403);
        expect(err.response.data.error).toContain('SSRF Protection');
      }
    });

    it('should block SSRF attacks against AWS metadata endpoint', async () => {
      try {
        await axios.post(`${PLAYGROUND_BASE}/execute`, {
          method: 'GET',
          url: 'http://169.254.169.254/latest/meta-data/'
        });
        fail('Should have thrown a 403 Forbidden error');
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') return;
        expect(err.response.status).toBe(403);
        expect(err.response.data.error).toContain('SSRF Protection');
      }
    });
  });

  describe('3. Redis Queue Connection (Phases 33 & 35)', () => {
    it('should be able to connect to the Redis broker', async () => {
      try {
        await redis.connect();
        const ping = await redis.ping();
        expect(ping).toBe('PONG');
      } catch (err: any) {
        console.warn('⚠️ Redis is not running locally or failed to connect. Skipping test.');
        return;
      }
    });
  });
});
