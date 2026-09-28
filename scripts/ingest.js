const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * PHASE 2: THE INGESTION & DEDUPLICATION ENGINE
 * 
 * This script simulates the pipeline that parses raw API data,
 * normalizes it into our strict schema, generates fingerprints 
 * to prevent duplicates, and saves it into the correct shard.
 */

// 1. Build the Deduplication Engine (Fingerprinting)
function generateFingerprint(url) {
  // Generates a deterministic hash for deduplication based on base URL
  return crypto.createHash('sha256').update(url.toLowerCase().trim()).digest('hex');
}

// 2. Implement Normalization
function normalizeAPI(rawInput) {
  const domainHash = generateFingerprint(rawInput.baseUrl);
  
  // Generating a unique ID based on the domain hash
  // (In a real 10M DB, you might use a global auto-incrementing sequence)
  const numericId = String(parseInt(domainHash.substring(0, 8), 16)).padStart(10, '0').slice(0, 10);
  
  const normalized = {
    id: `api_${numericId}`,
    name: rawInput.name,
    providerId: rawInput.providerId || "provider_unknown",
    categoryIds: rawInput.categories || ["emerging"],
    protocols: rawInput.protocols || ["REST"],
    documentationUrl: rawInput.docs || "",
    baseUrls: [rawInput.baseUrl],
    authentication: rawInput.auth || ["none"],
    pricing: rawInput.pricing || "free",
    features: {
      openapi: rawInput.hasOpenApi || false,
      graphql: rawInput.hasGraphql || false,
      grpc: rawInput.hasGrpc || false,
      websocket: rawInput.hasWebsocket || false,
      webhook: rawInput.hasWebhook || false,
      mcp: rawInput.hasMcp || false
    },
    status: rawInput.status || "active",
    source: {
      type: rawInput.sourceType || "manual",
      url: rawInput.sourceUrl || "",
      repository: rawInput.repo || "",
      license: rawInput.license || "unknown",
      discoveredAt: new Date().toISOString(),
      lastImportedAt: new Date().toISOString()
    }
  };
  
  return normalized;
}

// 3. Setup Sharding Storage
function saveToShard(apiRecord) {
  // Use the primary category as the storage shard
  const primaryCategory = apiRecord.categoryIds[0];
  const targetDir = path.join(__dirname, '..', 'data/apis', primaryCategory);
  
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Shard directory does not exist: data/apis/${primaryCategory}`);
    return false;
  }
  
  const filePath = path.join(targetDir, `${apiRecord.id}.json`);
  
  // Deduplication check: if file already exists, we skip (or in advanced cases, merge)
  if (fs.existsSync(filePath)) {
    console.log(`⚠️ Deduplication: API ${apiRecord.id} already exists in shard '${primaryCategory}'.`);
    return false;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(apiRecord, null, 2));
  console.log(`✅ Normalized & Saved API: ${apiRecord.name} -> data/apis/${primaryCategory}/${apiRecord.id}.json`);
  return true;
}

// ==========================================
// TEST EXECUTION: Mock Raw Input Adapter
// ==========================================

const rawGithubApi = {
  name: "GitHub REST API",
  providerId: "provider_github",
  categories: ["developer"], // Will route to data/apis/developer/
  protocols: ["REST"],
  docs: "https://docs.github.com/en/rest",
  baseUrl: "https://api.github.com",
  auth: ["oauth2", "personal_access_token"],
  pricing: "freemium",
  hasOpenApi: true,
  sourceType: "github",
  sourceUrl: "https://github.com/github/rest-api-description"
};

console.log("🚀 Starting Ingestion Pipeline...");
const normalizedRecord = normalizeAPI(rawGithubApi);
saveToShard(normalizedRecord);
