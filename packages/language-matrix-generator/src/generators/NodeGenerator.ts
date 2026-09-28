import { LanguageGenerator, CodeSnippet } from '../types';

export class NodeGenerator implements LanguageGenerator {
  public language = 'javascript';
  public frameworks = ['fetch'];

  public generate(endpoint: any): CodeSnippet[] {
    const method = (endpoint.method || 'GET').toUpperCase();
    const url = endpoint.url || 'https://api.example.com';
    
    let code = `const options = {\n`;
    code += `  method: '${method}',\n`;
    
    if (endpoint.headers && endpoint.headers.length > 0) {
      code += `  headers: {\n`;
      endpoint.headers.forEach((h: any) => {
        code += `    '${h.key}': '${h.value || 'string'}',\n`;
      });
      code += `  },\n`;
    }

    if (endpoint.body) {
      code += `  body: JSON.stringify(${JSON.stringify(endpoint.body, null, 4).split('\\n').join('\\n  ')})\n`;
    }

    code += `};\n\n`;
    code += `fetch('${url}', options)\n`;
    code += `  .then(response => response.json())\n`;
    code += `  .then(response => console.log(response))\n`;
    code += `  .catch(err => console.error(err));`;

    return [{
      language: this.language,
      framework: 'fetch',
      method,
      code,
    }];
  }
}
