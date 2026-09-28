import { BaseGenerator, EndpointDefinition, CodeGeneratorOptions } from './BaseGenerator';

export class CurlGenerator extends BaseGenerator {
  protected language = 'cURL';

  protected generateRequest(endpoint: EndpointDefinition, options: CodeGeneratorOptions): string {
    const lines: string[] = [`curl -X ${endpoint.method} "${endpoint.url}" \\`];
    
    if (endpoint.headers) {
      for (const [key, value] of Object.entries(endpoint.headers)) {
        lines.push(`  -H "${key}: ${value}" \\`);
      }
    }

    if (endpoint.body) {
      lines.push(`  -d '${JSON.stringify(endpoint.body)}'`);
    }

    // Remove trailing backslash if no body was added
    if (lines[lines.length - 1].endsWith(' \\')) {
      lines[lines.length - 1] = lines[lines.length - 1].slice(0, -2);
    }

    return lines.join('\n');
  }
}
