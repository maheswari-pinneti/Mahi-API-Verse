import { BaseGenerator, EndpointDefinition, CodeGeneratorOptions } from './BaseGenerator';

export class PythonGenerator extends BaseGenerator {
  protected language = 'Python 3 (Requests)';

  protected generateRequest(endpoint: EndpointDefinition, options: CodeGeneratorOptions): string {
    const lines: string[] = ['import requests'];
    if (options.includeErrorHandling) {
      lines.push('from requests.exceptions import HTTPError');
    }
    lines.push('');

    const headersStr = endpoint.headers ? `headers = ${JSON.stringify(endpoint.headers, null, 4)}` : '';
    if (headersStr) lines.push(headersStr);

    const dataStr = endpoint.body ? `json_data = ${JSON.stringify(endpoint.body, null, 4)}` : '';
    if (dataStr) lines.push(dataStr);

    lines.push('');
    lines.push('try:');
    
    let reqLine = `    response = requests.${endpoint.method.toLowerCase()}('${endpoint.url}'`;
    if (endpoint.headers) reqLine += `, headers=headers`;
    if (endpoint.body) reqLine += `, json=json_data`;
    if (options.timeoutMs) reqLine += `, timeout=${options.timeoutMs / 1000}`;
    reqLine += `)`;
    
    lines.push(reqLine);
    
    if (options.includeErrorHandling) {
      lines.push('    response.raise_for_status()');
    }
    
    lines.push('    print(response.json())');
    
    if (options.includeErrorHandling) {
      lines.push('except HTTPError as http_err:');
      lines.push('    print(f"HTTP error occurred: {http_err}")');
      lines.push('except Exception as err:');
      lines.push('    print(f"Other error occurred: {err}")');
    }

    return lines.join('\n');
  }
}
