import type { Config } from 'drizzle-kit';

/**
 * PHASE 8: DRIZZLE ORM CONFIGURATION
 * 
 * Defines the configuration for the database migration generator.
 * This tool reads the schema.ts definitions and physically creates 
 * the 10M x 700 matrix tables inside PostgreSQL.
 */
export default {
  schema: './src/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/mahi_api_verse',
  },
} satisfies Config;
