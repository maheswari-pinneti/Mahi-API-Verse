import { z } from 'zod';

/**
 * PHASE 3: 700+ PROGRAMMING LANGUAGE UNIVERSE
 * 
 * Rules:
 * - Languages are cataloged independently from APIs.
 * - API integration is mapped via apiSupport without duplicating the API itself.
 */

export const ApiSupportStatus = z.enum([
  'official',       // Official SDK maintained by provider
  'community',      // Well-supported community SDK
  'generated',      // Auto-generated via OpenAPI/gRPC
  'example',        // Code examples exist, but no full SDK
  'metadata_only',  // We know it exists, but no verified integrations yet
  'unsupported'     // Explicitly unsupported or deprecated integration
]);

export const LanguageRecordSchema = z.object({
  id: z.string().regex(/^lang_[a-z0-9_]+$/),
  name: z.string(),
  family: z.string().nullable(),
  paradigms: z.array(z.string()),
  status: z.enum(['active', 'historical', 'academic', 'esoteric', 'dsl', 'embedded']),
  website: z.string().url().nullable(),
  repository: z.string().url().nullable(),
  packageManagers: z.array(z.string()),
  
  /**
   * The matrix mapping: Which APIs does this language support?
   * e.g., { "api_github_rest": "official", "api_stripe": "community" }
   */
  apiSupport: z.record(ApiSupportStatus).optional()
});

export type LanguageRecord = z.infer<typeof LanguageRecordSchema>;
