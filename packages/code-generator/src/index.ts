import { PythonGenerator } from './generators/PythonGenerator';
import { CurlGenerator } from './generators/CurlGenerator';
import { EndpointDefinition, CodeGeneratorOptions } from './generators/BaseGenerator';

export class UniversalCodeGenerator {
  public static generate(
    language: 'python' | 'curl' | 'node' | 'go' | 'rust', // expanded later to 700+
    endpoint: EndpointDefinition,
    options: CodeGeneratorOptions = {}
  ): string {
    switch (language) {
      case 'python':
        return new PythonGenerator().generate(endpoint, options);
      case 'curl':
        return new CurlGenerator().generate(endpoint, options);
      default:
        throw new Error(`Code generation for language '${language}' is not yet implemented.`);
    }
  }
}

export { EndpointDefinition, CodeGeneratorOptions } from './generators/BaseGenerator';
