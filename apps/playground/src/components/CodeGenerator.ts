/**
 * PHASE 12: CODE GENERATOR (Part of Playground)
 * 
 * Generates copy-paste ready code snippets for the Playground UI.
 */

export class CodeGenerator {
  static generateCurl(method: string, url: string, headers: Record<string, string>, body?: string): string {
    let curl = `curl -X ${method} "${url}"`;
    for (const [key, val] of Object.entries(headers)) {
      if (val) curl += ` \\\n  -H "${key}: ${val}"`;
    }
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      curl += ` \\\n  -d '${body}'`;
    }
    return curl;
  }

  static generateFetch(method: string, url: string, headers: Record<string, string>, body?: string): string {
    return `
const response = await fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
  ${body && ['POST', 'PUT', 'PATCH'].includes(method) ? `body: JSON.stringify(${body})` : ''}
});
const data = await response.json();
console.log(data);
    `.trim();
  }

  static generatePython(method: string, url: string, headers: Record<string, string>, body?: string): string {
    return `
import requests
import json

url = "${url}"
headers = ${JSON.stringify(headers, null, 2)}
${body && ['POST', 'PUT', 'PATCH'].includes(method) ? `payload = ${body}\n` : ''}
response = requests.request("${method}", url, headers=headers${body ? ', json=payload' : ''})

print(response.json())
    `.trim();
  }
}
