export interface EndpointDefinition {
  method: string;
  url: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: any;
}

export interface CodeGeneratorOptions {
  includeErrorHandling?: boolean;
  includeAsync?: boolean;
  timeoutMs?: number;
}

export abstract class BaseGenerator {
  protected abstract language: string;
  protected abstract generateRequest(endpoint: EndpointDefinition, options: CodeGeneratorOptions): string;
  
  public generate(endpoint: EndpointDefinition, options: CodeGeneratorOptions = {}): string {
    const code = this.generateRequest(endpoint, options);
    return `// Generated for ${this.language} by Mahi API Verse\n${code}`;
  }
}
