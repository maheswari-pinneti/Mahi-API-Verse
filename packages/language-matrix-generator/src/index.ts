export * from './types';
export * from './engine/LanguageMatrix';
export * from './generators/CurlGenerator';
export * from './generators/PythonGenerator';
export * from './generators/NodeGenerator';

import { LanguageMatrixEngine } from './engine/LanguageMatrix';
import { CurlGenerator } from './generators/CurlGenerator';
import { PythonGenerator } from './generators/PythonGenerator';
import { NodeGenerator } from './generators/NodeGenerator';

/**
 * Creates and configures a default instance of the LanguageMatrixEngine
 * pre-populated with standard language generators.
 */
export function createDefaultLanguageMatrix(): LanguageMatrixEngine {
  const engine = new LanguageMatrixEngine();
  
  engine.registerGenerator(new CurlGenerator());
  engine.registerGenerator(new PythonGenerator());
  engine.registerGenerator(new NodeGenerator());
  
  // Future: dynamically import and register the remaining 697+ language generators
  
  return engine;
}
