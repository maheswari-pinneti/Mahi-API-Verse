import { ApiRecord } from '@mahi-api-verse/schemas';

/**
 * PHASE 7: API VERIFICATION
 * 
 * Pipeline Stage: Health Checking
 * Safely verifies if an API is online without aggressive scanning.
 * 
 * STRICT SECURITY RULES IMPLEMENTED:
 * - Never bypass authentication (a 401 response actually proves the API is alive)
 * - Strict timeout enforcement (5 seconds max)
 * - No destructive requests (HEAD only for base URL pings)
 */
export class HealthChecker {
  // Security constraints
  private readonly TIMEOUT_MS = 5000; 

  /**
   * Safely checks the health of the API's primary Base URL and updates the Verification block.
   */
  public async verify(api: ApiRecord): Promise<ApiRecord> {
    if (!api.baseUrls || api.baseUrls.length === 0) {
      api.verification.status = 'unverified';
      api.verification.last_checked = new Date().toISOString();
      return api;
    }

    const targetUrl = api.baseUrls[0];
    const startTime = Date.now();

    try {
      console.log(`[HealthChecker] 📡 Pinging ${targetUrl} (Timeout: ${this.TIMEOUT_MS}ms)...`);
      
      // Strict timeout enforcement using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      // Using a safe HTTP HEAD request to check availability without triggering actions
      // In production, this would also include SSRF and Private-IP blocking logic
      const response = await fetch(targetUrl, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mahi-API-Verse-Verification-Bot/1.0 (+https://github.com/maheswari-pinneti/mahi-api-verse)'
        }
      });

      clearTimeout(timeoutId);

      const latency = Date.now() - startTime;
      const status = response.status;

      // Update the verification block
      api.verification.http_status = status;
      api.verification.latency_ms = latency;
      api.verification.last_checked = new Date().toISOString();

      // If it responds with anything (200 OK, 401 Unauthorized, 403 Forbidden), 
      // the server exists and the API is technically "alive" at the network layer.
      if (status >= 200 && status < 500) {
        api.verification.status = 'verified';
        console.log(`[HealthChecker] ✅ VERIFIED: ${targetUrl} [HTTP ${status}] in ${latency}ms`);
      } else {
        api.verification.status = 'partially_verified';
        console.log(`[HealthChecker] ⚠️ PARTIAL: ${targetUrl} [HTTP ${status}]`);
      }

    } catch (error: any) {
      // DNS failures, Timeouts, Connection Refused
      api.verification.status = 'offline';
      api.verification.http_status = null;
      api.verification.latency_ms = null;
      api.verification.last_checked = new Date().toISOString();
      console.error(`[HealthChecker] ❌ OFFLINE: ${targetUrl} - ${error.name || error.message}`);
    }

    return api;
  }
}
