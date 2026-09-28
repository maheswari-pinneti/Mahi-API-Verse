import { pgTable, text, timestamp, boolean, jsonb, uuid, primaryKey } from 'drizzle-orm/pg-core';

// ---------------------------------------------------------
// 1. Core API Intelligence Model
// ---------------------------------------------------------
export const providers = pgTable('providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(), // e.g. "stripe"
  name: text('name').notNull(),
  website: text('website'),
  developerPortalUrl: text('developer_portal_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const apis = pgTable('apis', {
  id: uuid('id').primaryKey().defaultRandom(),
  providerId: uuid('provider_id').references(() => providers.id),
  slug: text('slug').notNull().unique(), // e.g. "stripe-payments-v1"
  name: text('name').notNull(),
  version: text('version').notNull(),
  
  // Intelligence Metadata
  category: text('category').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  documentationUrl: text('documentation_url'),
  statusPageUrl: text('status_page_url'),
  
  // Lifecycle & Status
  lifecycle: text('lifecycle').notNull().default('DISCOVERED'), // DISCOVERED, VERIFIED, DEPRECATED
  commercialStatus: text('commercial_status'), // FREE, FREEMIUM, ENTERPRISE
  
  // Verification & Provenance
  sourceUrl: text('source_url'),
  firstDiscoveredAt: timestamp('first_discovered_at').defaultNow(),
  lastVerifiedAt: timestamp('last_verified_at'),
  deprecatedAt: timestamp('deprecated_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ---------------------------------------------------------
// 2. Protocols & Authentication
// ---------------------------------------------------------
export const apiProtocols = pgTable('api_protocols', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiId: uuid('api_id').references(() => apis.id).notNull(),
  type: text('type').notNull(), // REST, GRAPHQL, GRPC, WEBSOCKET
  version: text('version'),     // HTTP/1.1, HTTP/2
});

export const apiAuthentication = pgTable('api_authentication', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiId: uuid('api_id').references(() => apis.id).notNull(),
  type: text('type').notNull(), // OAUTH2, API_KEY, JWT, MTLS
  placement: text('placement'), // HEADER, QUERY
  details: jsonb('details'),    // Schema mapping for scopes, token urls
});

// ---------------------------------------------------------
// 3. Endpoint Intelligence
// ---------------------------------------------------------
export const endpoints = pgTable('endpoints', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiId: uuid('api_id').references(() => apis.id).notNull(),
  method: text('method').notNull(), // GET, POST, PUT, etc.
  path: text('path').notNull(),     // /v1/payments
  summary: text('summary'),
  
  // Schemas stored as normalized JSONB for high-throughput reads
  parameters: jsonb('parameters'),
  requestSchema: jsonb('request_schema'),
  responseSchema: jsonb('response_schema'),
  errorSchemas: jsonb('error_schemas'),
  
  // Telemetry
  rateLimitDetails: jsonb('rate_limit_details'),
  isIdempotent: boolean('is_idempotent').default(false),
});

// ---------------------------------------------------------
// 4. The 700+ Language Matrix Engine
// ---------------------------------------------------------
export const languages = pgTable('languages', {
  id: text('id').primaryKey(), // "python", "rust", "typescript"
  name: text('name').notNull(),
  ecosystem: text('ecosystem'), // pypi, crates.io, npm
});

export const apiLanguages = pgTable('api_languages', {
  apiId: uuid('api_id').references(() => apis.id).notNull(),
  languageId: text('language_id').references(() => languages.id).notNull(),
  
  supportStatus: text('support_status').notNull(), // OFFICIAL, COMMUNITY, GENERATED, EXAMPLE, METADATA
  
  // Package Management Integration
  packageName: text('package_name'),
  repositoryUrl: text('repository_url'),
  isVerified: boolean('is_verified').default(false),
  lastVerifiedAt: timestamp('last_verified_at'),
  
}, (t) => ({
  pk: primaryKey({ columns: [t.apiId, t.languageId] }),
}));

// ---------------------------------------------------------
// 5. Verification & Health History
// ---------------------------------------------------------
export const verificationLogs = pgTable('verification_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiId: uuid('api_id').references(() => apis.id).notNull(),
  
  dnsValid: boolean('dns_valid'),
  tlsValid: boolean('tls_valid'),
  endpointReachable: boolean('endpoint_reachable'),
  latencyMs: text('latency_ms'), // Integer representation
  
  rawResponse: jsonb('raw_response'),
  createdAt: timestamp('created_at').defaultNow(),
});
