/**
 * PHASE 4: API SOURCE DISCOVERY
 * 
 * Base Adapter defining the strict contract for all source discovery.
 * Ensures every discovered API comes with complete provenance metadata
 * before it ever reaches the normalizer.
 */

export interface DiscoveryResult {
  source_id: string; // ID from the origin (e.g., repo name, marketplace ID)
  raw_payload: any;  // The raw OpenAPI/GraphQL/JSON object
  
  // Phase 4 Provenance Requirement
  provenance: {
    source: string;
    source_url: string | null;
    repository: string | null;
    license: string | null;
    retrieved_at: string;
    source_version: string | null;
    attribution_required: boolean;
  };
}

export abstract class BaseAdapter {
  protected abstract sourceName: string;
  
  /**
   * Scans a target and yields discovered APIs with provenance attached.
   */
  abstract discover(target: string): Promise<DiscoveryResult[]>;
}
