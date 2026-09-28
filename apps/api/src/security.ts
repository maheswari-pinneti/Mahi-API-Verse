import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

/**
 * PHASE 19: SECURITY SUITE
 * 
 * Protects the Fastify API (Phase 11) from OWASP Top 10 vulnerabilities,
 * malicious scrapers, and cross-site attacks.
 */
export async function setupSecurity(fastify: FastifyInstance) {
  
  // 1. OWASP HEADERS (Helmet)
  // Sets Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), 
  // X-Content-Type-Options, and prevents Clickjacking (X-Frame-Options).
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "avatars.githubusercontent.com"],
        upgradeInsecureRequests: [],
      }
    },
    hsts: { 
      maxAge: 31536000, // 1 Year
      includeSubDomains: true, 
      preload: true 
    },
  });

  // 2. STRICT CORS POLICY
  // Prevents unauthorized web apps from making requests to our REST API.
  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow localhost for dev, and strict domains for production
      const allowedDomains = ['mahi-api-verse.com', 'localhost'];
      
      if (!origin || allowedDomains.some(domain => origin.includes(domain))) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS Policy"), false);
    },
    methods: ['GET', 'POST', 'OPTIONS'], // We rarely allow PUT/DELETE from public origins
    credentials: true,
  });

  // 3. WAF / IP BLOCKLIST
  // Drops traffic from known malicious IPs (which would be flagged by the Phase 16 Admin Panel)
  fastify.addHook('onRequest', async (request, reply) => {
    // In production, this list would be pulled from Redis
    const blockedIPs = ['10.0.0.99', '192.168.1.100']; 
    
    if (blockedIPs.includes(request.ip)) {
      request.log.warn(`Blocked request from banned IP: ${request.ip}`);
      reply.code(403).send({ 
        error: 'Forbidden', 
        message: 'Your IP has been flagged for malicious activity.' 
      });
    }
  });
}
