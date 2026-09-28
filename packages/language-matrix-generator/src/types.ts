export interface CodeSnippet {
  language: string;
  framework?: string;
  code: string;
  method: string;
}

export interface LanguageGenerator {
  language: string;
  frameworks: string[];
  generate(endpoint: any): CodeSnippet[];
}
