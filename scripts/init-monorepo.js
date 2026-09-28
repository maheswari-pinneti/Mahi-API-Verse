const fs = require('fs');
const path = require('path');

const dirs = [
  // Apps
  'apps/api', 'apps/web', 'apps/docs', 'apps/admin', 'apps/playground', 'apps/status',
  // Packages
  'packages/types', 'packages/schemas', 'packages/api-client', 'packages/sdk', 'packages/cli',
  'packages/search', 'packages/openapi-parser', 'packages/graphql-parser', 'packages/asyncapi-parser', 'packages/mcp',
  // Catalog Data Model
  'catalog/apis', 'catalog/providers', 'catalog/categories', 'catalog/tags', 'catalog/protocols', 
  'catalog/authentication', 'catalog/pricing', 'catalog/licenses', 'catalog/sdks', 'catalog/languages',
  // Services & Infrastructure
  'data', 'ingestion', 'verification', 'languages', 'examples', 'database', 'search', 'discovery', 'tests', 'scripts', '.github'
];

console.log("🚀 Initializing Mahi API Verse Monorepo Architecture...\n");

dirs.forEach(d => {
  const fullPath = path.join(__dirname, '..', d);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${d}`);
  }
});

console.log("\n✅ Monorepo scaffolding complete!");
