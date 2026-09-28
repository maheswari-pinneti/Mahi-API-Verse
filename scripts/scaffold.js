const fs = require('fs');
const path = require('path');

const directories = [
  'data/apis',
  'data/languages',
  'data/categories',
  'data/providers',
  'schemas',
  'indexes',
  'examples',
  'mcp',
  'openapi'
];

const categories = [
  'ai', 'developer', 'cloud', 'finance', 'social', 'ecommerce', 
  'security', 'government', 'health', 'education', 'travel', 
  'media', 'gaming', 'science', 'maps', 'weather', 'business', 
  'communication', 'automation', 'infrastructure', 'emerging'
];

// Create base directories
console.log("🚀 Initializing Global API Universe Structure...\n");

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// Create category shards in data/apis
console.log("\n⚡ Creating Data Shards...\n");
categories.forEach(category => {
  const catPath = path.join(__dirname, '..', 'data/apis', category);
  if (!fs.existsSync(catPath)) {
    fs.mkdirSync(catPath, { recursive: true });
    console.log(`🗄️ Created shard: data/apis/${category}`);
  }
});

console.log("\n✅ Scaffolding complete!");
