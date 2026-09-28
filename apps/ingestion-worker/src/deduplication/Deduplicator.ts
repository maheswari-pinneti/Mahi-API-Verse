import { FingerprintGenerator } from './FingerprintGenerator';
import { ApiRecord } from '@mahi-api-verse/schemas';

export class Deduplicator {
  private fingerprintGen = new FingerprintGenerator();
  
  // In production (Phase 8), this maps to PostgreSQL or a fast Redis store
  // Mapping: Deterministic Fingerprint -> Canonical API ID
  private identityStore: Map<string, string> = new Map();

  /**
   * Evaluates an incoming normalized API record. 
   * If it's a duplicate, it returns the existing Canonical ID so we merge sources.
   * If it's new, it registers a new Canonical ID.
   */
  public process(record: ApiRecord): { isDuplicate: boolean; canonicalId: string } {
    const fingerprint = this.fingerprintGen.generate(record);
    
    if (this.identityStore.has(fingerprint)) {
      const canonicalId = this.identityStore.get(fingerprint)!;
      console.log(`[Deduplicator] ⚠️ Duplicate Detected: Merging source into Canonical ID ${canonicalId}`);
      return { isDuplicate: true, canonicalId };
    }

    // Register new API entity
    const newCanonicalId = this.fingerprintGen.toCanonicalId(fingerprint);
    this.identityStore.set(fingerprint, newCanonicalId);
    
    console.log(`[Deduplicator] ✨ New API Discovered. Assigned Canonical ID: ${newCanonicalId}`);
    return { isDuplicate: false, canonicalId: newCanonicalId };
  }
}
