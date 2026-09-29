import { CodeSnippet, LanguageGenerator } from '../types';

/**
 * Phase 13: Language Matrix Generator Engine
 * Core orchestration engine to dispatch Universal API Endpoints to registered
 * language generators, producing code snippets across 700+ supported targets.
 */
export class LanguageMatrixEngine {
  private generators: Map<string, LanguageGenerator> = new Map();
  private cache: Map<string, CodeSnippet[]> = new Map(); // Dynamic on-demand caching

  /**
   * Register a new language generator module.
   */
  public registerGenerator(generator: LanguageGenerator) {
    this.generators.set(generator.language, generator);
  }

  /**
   * Generate code snippets for a given API endpoint across all registered languages.
   * @param endpoint The universal endpoint object (from Passport schema)
   * @param targetLanguages Optional array of specific languages to generate. Defaults to all.
   * @returns Array of CodeSnippets
   */
  public generateSnippets(endpoint: any, targetLanguages?: string[]): CodeSnippet[] {
    const cacheKey = `snippet_${endpoint.id || endpoint.path}_${targetLanguages?.join(',') || 'ALL'}`;
    
    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      console.log(`[LanguageMatrixEngine] Returning cached snippets for ${cacheKey}`);
      return this.cache.get(cacheKey)!;
    }

    const snippets: CodeSnippet[] = [];
    
    for (const [lang, generator] of this.generators.entries()) {
      if (targetLanguages && !targetLanguages.includes(lang)) {
        continue; // Skip if a specific subset was requested
      }
      
      try {
        const langSnippets = generator.generate(endpoint);
        snippets.push(...langSnippets);
      } catch (err) {
        console.error(`[LanguageMatrixEngine] Failed to generate snippets for language: ${lang}`, err);
      }
    }
    
    // Store in cache
    this.cache.set(cacheKey, snippets);
    
    return snippets;
  }
}
