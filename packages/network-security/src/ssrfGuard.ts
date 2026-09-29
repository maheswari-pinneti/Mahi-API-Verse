import * as dns from 'dns';
import { promisify } from 'util';
import { URL } from 'url';

const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

/**
 * Validates a URL to prevent Server-Side Request Forgery (SSRF)
 * This must be executed before ANY outbound network request in the platform.
 */
export async function validateOutboundUrl(targetUrl: string): Promise<boolean> {
  try {
    const parsed = new URL(targetUrl);
    
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Invalid protocol: ${parsed.protocol}`);
    }

    const host = parsed.hostname;
    
    // Resolve IPv4
    let ipv4s: string[] = [];
    try {
      ipv4s = await resolve4(host);
    } catch (e) {
      // Ignore if no A record
    }

    // Resolve IPv6
    let ipv6s: string[] = [];
    try {
      ipv6s = await resolve6(host);
    } catch (e) {
      // Ignore if no AAAA record
    }

    const allIps = [...ipv4s, ...ipv6s];
    if (allIps.length === 0) {
      throw new Error('Host could not be resolved');
    }

    // Check against forbidden ranges (simplistic checks for IPv4)
    for (const ip of allIps) {
      if (isForbiddenIp(ip)) {
        throw new Error(`SSRF Blocked: Resolves to forbidden IP ${ip}`);
      }
    }

    return true;
  } catch (err: any) {
    console.error(`[SSRF GUARD] Blocked URL ${targetUrl}: ${err.message}`);
    return false;
  }
}

function isForbiddenIp(ip: string): boolean {
  // Catch IPv4 localhost, private, and reserved metadata endpoints
  if (ip === '127.0.0.1' || ip.startsWith('127.')) return true;
  if (ip === '0.0.0.0') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (ip.startsWith('169.254.')) return true; // Cloud metadata
  
  // 172.16.0.0/12 check
  if (ip.startsWith('172.')) {
    const secondOctet = parseInt(ip.split('.')[1]);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }
  
  // IPv6 loopback and link-local
  if (ip === '::1' || ip.toLowerCase().startsWith('fe80:')) return true;

  return false;
}

/**
 * A hardened wrapper around the global fetch API that enforces SSRF checks.
 */
export async function safeFetch(targetUrl: string, init?: RequestInit): Promise<Response> {
  const isSafe = await validateOutboundUrl(targetUrl);
  if (!isSafe) {
    throw new Error(`SSRF Blocked: The target URL ${targetUrl} resolves to a forbidden internal address.`);
  }
  return globalThis.fetch(targetUrl, init);
}
