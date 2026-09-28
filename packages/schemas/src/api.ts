import { z } from 'zod';

/**
 * PHASE 2: GLOBAL DATA MODEL
 * 
 * Rule: Never fabricate API records. 
 * Unknown information MUST be `null` or "unknown".
 */

export const ProvenanceSchema = z.object({
  source: z.string(),
  source_url: z.string().url().nullable(),
  repository: z.string().url().nullable(),
  license: z.string().nullable(),
  retrieved_at: z.string().datetime(),
  source_version: z.string().nullable(),
  attribution_required: z.boolean()
});

export const VerificationSchema = z.object({
  status: z.enum(['verified', 'partially_verified', 'unverified', 'offline', 'deprecated', 'unknown']),
  last_checked: z.string().datetime().nullable(),
  http_status: z.number().nullable(),
  latency_ms: z.number().nullable()
});

export const ApiRecordSchema = z.object({
  id: z.string().regex(/^api_[0-9A-Za-z]+$/),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(), // Nullable enforces "do not fabricate"
  
  // Entities
  provider: z.record(z.unknown()).nullable(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  
  // Resources
  documentation: z.record(z.unknown()).nullable(),
  website: z.record(z.unknown()).nullable(),
  baseUrls: z.array(z.string().url()),
  
  // Technical Metadata
  protocols: z.array(z.string()),
  authentication: z.record(z.unknown()).nullable(),
  pricing: z.record(z.unknown()).nullable(),
  license: z.record(z.unknown()).nullable(),
  
  // Spec Interfaces
  openapi: z.record(z.unknown()).nullable(),
  graphql: z.record(z.unknown()).nullable(),
  grpc: z.record(z.unknown()).nullable(),
  asyncapi: z.record(z.unknown()).nullable(),
  websocket: z.record(z.unknown()).nullable(),
  webhooks: z.record(z.unknown()).nullable(),
  mcp: z.record(z.unknown()).nullable(),
  
  // Integration Matrix
  sdks: z.array(z.string()),
  languages: z.array(z.string()),
  examples: z.array(z.string()),
  
  // Auditing & Health
  verification: VerificationSchema,
  provenance: ProvenanceSchema
});

// Extract TypeScript type directly from the Zod Schema
export type ApiRecord = z.infer<typeof ApiRecordSchema>;
