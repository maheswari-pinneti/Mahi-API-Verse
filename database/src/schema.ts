import { pgTable, text, timestamp, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';

/**
 * PHASE 8: DATABASE ARCHITECTURE
 * 
 * The Canonical PostgreSQL Schema powered by Drizzle ORM.
 * This is the ultimate source of truth after APIs pass through Ingestion,
 * Deduplication (assigning the canonical ID), and Verification.
 */

// ==========================================
// 1. CORE ENTITIES
// ==========================================

export const providers = pgTable('providers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').unique(),
  website: text('website')
});

export const apis = pgTable('apis', {
  id: text('id').primaryKey(), // The Canonical ID generated in Phase 6
  providerId: text('provider_id').references(() => providers.id),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  
  // Notice this is nullable, strictly enforcing "Never fabricate"
  description: text('description'), 
  
  baseUrls: jsonb('base_urls').default('[]').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 2. TAXONOMIES & REGISTRIES
// ==========================================

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export const languages = pgTable('languages', {
  id: text('id').primaryKey(), // lang_typescript, etc.
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // general-purpose, web, hardware
});

// ==========================================
// 3. THE RELATIONAL MATRIX (MANY-TO-MANY)
// ==========================================

export const apiCategories = pgTable('api_categories', {
  apiId: text('api_id').references(() => apis.id),
  categoryId: text('category_id').references(() => categories.id)
}, (t) => ({
  pk: primaryKey({ columns: [t.apiId, t.categoryId] })
}));

export const apiLanguages = pgTable('api_languages', {
  apiId: text('api_id').references(() => apis.id),
  languageId: text('language_id').references(() => languages.id),
  
  // This explicitly prevents "duplicating 1 API 700 times". 
  // We just create 1 row mapping the API to the Language with its support level.
  supportType: text('support_type').notNull(), // 'official', 'community', 'metadata_only'
}, (t) => ({
  pk: primaryKey({ columns: [t.apiId, t.languageId] })
}));

// ==========================================
// 4. VERIFICATION & PROVENANCE
// ==========================================

export const verificationResults = pgTable('verification_results', {
  apiId: text('api_id').primaryKey().references(() => apis.id),
  status: text('status').notNull(), // verified, partially_verified, offline
  httpStatus: integer('http_status'),
  latencyMs: integer('latency_ms'),
  lastChecked: timestamp('last_checked').notNull()
});

export const provenance = pgTable('provenance', {
  apiId: text('api_id').primaryKey().references(() => apis.id),
  sourceType: text('source_type').notNull(), // github, OpenAPI Directory, government portal
  sourceUrl: text('source_url'),
  license: text('license'),
  retrievedAt: timestamp('retrieved_at').notNull()
});

// Extended specs like openapi_documents, mcp_servers, webhooks 
// would follow this same pattern by attaching to the api_id foreign key.
