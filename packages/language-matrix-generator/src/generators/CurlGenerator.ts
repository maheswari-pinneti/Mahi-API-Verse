import { LanguageGenerator, CodeSnippet } from '../types';

export class CurlGenerator implements LanguageGenerator {
  public language = 'curl';
  public frameworks = ['cli'];

  public generate(endpoint: any): CodeSnippet[] {
    const method = (endpoint.method || 'GET').toUpperCase();
    const url = endpoint.url || 'https://api.example.com';
    let code = `curl -X ${method} "${url}"`;

    if (endpoint.headers && endpoint.headers.length > 0) {
      endpoint.headers.forEach((h: any) => {
        code += ` \\\n  -H "${h.key}: ${h.value || 'string'}"`;
      });
    }

    if (endpoint.body) {
      code += ` \\\n  -d '${JSON.stringify(endpoint.body, null, 2)}'`;
    }

    return [{
      language: this.language,
      framework: 'cli',
      method,
      code,
    }];
  }
}
