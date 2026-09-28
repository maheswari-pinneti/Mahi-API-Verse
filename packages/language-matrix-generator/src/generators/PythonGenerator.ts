import { LanguageGenerator, CodeSnippet } from '../types';

export class PythonGenerator implements LanguageGenerator {
  public language = 'python';
  public frameworks = ['requests'];

  public generate(endpoint: any): CodeSnippet[] {
    const method = (endpoint.method || 'GET').toUpperCase();
    const url = endpoint.url || 'https://api.example.com';
    
    let code = `import requests\n\n`;
    code += `url = "${url}"\n\n`;
    
    if (endpoint.headers && endpoint.headers.length > 0) {
      code += `headers = {\n`;
      endpoint.headers.forEach((h: any) => {
        code += `    "${h.key}": "${h.value || 'string'}",\n`;
      });
      code += `}\n\n`;
    }

    if (endpoint.body) {
      code += `payload = ${JSON.stringify(endpoint.body, null, 4)}\n\n`;
    }

    code += `response = requests.request("${method}", url`;
    if (endpoint.headers && endpoint.headers.length > 0) code += `, headers=headers`;
    if (endpoint.body) code += `, json=payload`;
    code += `)\n\n`;
    code += `print(response.text)`;

    return [{
      language: this.language,
      framework: 'requests',
      method,
      code,
    }];
  }
}
