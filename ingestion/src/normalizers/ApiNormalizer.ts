import { ApiRecord } from '@mahi-api-verse/schemas';
import { DiscoveryResult } from '../discovery/BaseAdapter';

/**
 * PHASE 5: NORMALIZATION ENGINE
 * 
 * Pipeline Stage: Normalize
 * 
 * Takes raw discovery payloads (like a messy Swagger file) and strictly 
 * maps them to the Global Data Model. 
 * 
 * CRITICAL RULE: "Never fabricate API records." Unknowns must be null.
 */
export class ApiNormalizer {
  
  public normalize(result: DiscoveryResult): ApiRecord {
    const raw = result.raw_payload;
    const info = raw?.info || {};
    const servers = raw?.servers || [];

    const baseUrls = servers.map((s: any) => s.url).filter(Boolean);
    
    // Fallback safe ID generator. Real IDs are generated in Phase 6 Deduplication.
    const safeId = `api_${result.source_id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    return {
      id: safeId,
      name: info.title || "Unknown API",
      slug: (info.title || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      
      // Enforcing non-fabrication. If there's no description, it is null.
      description: info.description || null, 
      
      provider: null,
      categories: ["developer-utilities"], // Pending AI/ML classification pipeline
      tags: [],
      
      documentation: null,
      website: null,
      baseUrls: baseUrls,
      
      protocols: ["REST"],
      authentication: null,
      pricing: null,
      license: info.license || null,
      
      // Attach the spec payload if it exists
      openapi: raw.openapi ? raw : null,
      graphql: null,
      grpc: null,
      asyncapi: null,
      websocket: null,
      webhooks: null,
      mcp: null,
      
      sdks: [],
      languages: [],
      examples: [],
      
      // Default state for newly ingested records before Phase 7 (Verification)
      verification: {
        status: 'unverified',
        last_checked: null,
        http_status: null,
        latency_ms: null
      },
      
      // Carried over securely from Phase 4
      provenance: result.provenance
    };
  }
}
