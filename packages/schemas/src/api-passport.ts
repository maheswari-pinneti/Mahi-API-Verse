import { z } from 'zod';
import { ProvenanceSchema, VerificationSchema } from './api';

/**
 * PHASE 9: UNIVERSAL API PASSPORT
 * 
 * Every API MUST have an API Passport.
 */

export const EndpointSchema = z.object({
  id: z.string(),
  name: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT']),
  path: z.string(),
  description: z.string().nullable(),
  authentication: z.array(z.string()),
  parameters: z.array(z.record(z.unknown())),
  headers: z.array(z.record(z.unknown())),
  queryParameters: z.array(z.record(z.unknown())),
  pathParameters: z.array(z.record(z.unknown())),
  requestBody: z.record(z.unknown()).nullable(),
  requestSchema: z.record(z.unknown()).nullable(),
  response: z.record(z.unknown()).nullable(),
  responseSchema: z.record(z.unknown()).nullable(),
  statusCodes: z.array(z.number()),
  errors: z.array(z.record(z.unknown())),
  rateLimits: z.array(z.record(z.unknown())),
  pagination: z.record(z.unknown()).nullable(),
  examples: z.array(z.record(z.unknown())),
  sdkExamples: z.array(z.record(z.unknown())),
  languages: z.array(z.string())
});

export const DocumentationCompletenessSchema = z.object({
  overview: z.boolean(),
  website: z.boolean(),
  docs: z.boolean(),
  auth: z.boolean(),
  baseUrl: z.boolean(),
  endpoints: z.boolean(),
  schemas: z.boolean(),
  examples: z.boolean(),
  sdk: z.boolean(),
  languages: z.boolean(),
  pricing: z.boolean(),
  license: z.boolean(),
  verification: z.boolean(),
  score: z.number().min(0).max(13) // The x/13 completeness score
});

export const ApiStateSchema = z.enum([
  'DISCOVERED',
  'IMPORTED',
  'NORMALIZED',
  'DEDUPLICATED',
  'VALIDATED',
  'DOCUMENTED',
  'PARSED',
  'ENRICHED',
  'LANGUAGE_MAPPED',
  'CODE_GENERATED',
  'VERIFIED',
  'INDEXED',
  'PUBLISHED',
  'MONITORED',
  'IMPORT_FAILED',
  'PARSE_FAILED',
  'VERIFICATION_FAILED',
  'DOCUMENTATION_FAILED',
  'INDEX_FAILED'
]);

export const ApiPassportSchema = z.object({
  id: z.string().regex(/^api_[0-9A-Za-z]+$/),
  name: z.string().nullable(), // Nullable if not verified
  slug: z.string(),
  
  state: ApiStateSchema,
  documentationCompleteness: DocumentationCompletenessSchema,
  
  provider: z.record(z.unknown()).nullable(),
  overview: z.record(z.unknown()).nullable(),
  website: z.string().url().nullable(),
  documentation: z.record(z.unknown()).nullable(),
  developerPortal: z.string().url().nullable(),
  versions: z.array(z.string()),
  baseUrls: z.array(z.string().url()),
  protocols: z.array(z.string()),
  authentication: z.array(z.record(z.unknown())),
  
  endpoints: z.array(EndpointSchema),
  schemas: z.array(z.record(z.unknown())),
  errors: z.array(z.record(z.unknown())),
  rateLimits: z.array(z.record(z.unknown())),
  pricing: z.record(z.unknown()).nullable(),
  license: z.record(z.unknown()).nullable(),
  
  sdks: z.array(z.record(z.unknown())),
  languages: z.array(z.record(z.unknown())),
  examples: z.array(z.record(z.unknown())),
  
  quickStart: z.record(z.unknown()).nullable(),
  clone: z.record(z.unknown()).nullable(),
  testing: z.record(z.unknown()).nullable(),
  security: z.record(z.unknown()).nullable(),
  
  health: z.record(z.unknown()).nullable(),
  verification: VerificationSchema,
  
  history: z.array(z.record(z.unknown())),
  changes: z.array(z.record(z.unknown())),
  
  provenance: ProvenanceSchema,
  conflicting_metadata: z.boolean().default(false)
});

export type ApiPassport = z.infer<typeof ApiPassportSchema>;
export type Endpoint = z.infer<typeof EndpointSchema>;
export type ApiState = z.infer<typeof ApiStateSchema>;
