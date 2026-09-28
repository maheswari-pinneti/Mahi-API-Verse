import crypto from 'crypto';

/**
 * PHASE 6: API DEDUPLICATION
 * 
 * Generates robust deterministic fingerprints to detect when multiple sources 
 * (e.g., GitHub, RapidAPI, SwaggerHub, Official Docs) describe the exact same API.
 */
export class FingerprintGenerator {
  
  /**
   * Generates a canonical fingerprint based on the most immutable 
   * characteristics of an API.
   */
  public generate(apiRecord: any): string {
    const components = [];

    // 1. Base URL is the strongest indicator of identity
    if (apiRecord.baseUrls && apiRecord.baseUrls.length > 0) {
      // Normalize to lowercase and remove trailing slashes to prevent false mismatches
      const normalizedUrls = apiRecord.baseUrls
        .map((url: string) => url.toLowerCase().replace(/\/$/, ''))
        .sort();
      components.push(`urls:${normalizedUrls.join(',')}`);
    }

    // 2. OpenAPI Schema identity (if available)
    if (apiRecord.openapi?.info?.title) {
      components.push(`openapi_title:${apiRecord.openapi.info.title.toLowerCase()}`);
    }

    // 3. Provider Domain
    if (apiRecord.provider?.domain) {
      components.push(`provider:${apiRecord.provider.domain.toLowerCase()}`);
    }

    // Hash the combined deterministic string
    const signature = components.join('|');
    return crypto.createHash('sha256').update(signature).digest('hex');
  }

  /**
   * Converts a raw SHA256 fingerprint into our canonical ID format
   */
  public toCanonicalId(fingerprint: string): string {
    // Take the first 12 characters of the hash for the global ID
    return `api_${fingerprint.substring(0, 12)}`;
  }
}
