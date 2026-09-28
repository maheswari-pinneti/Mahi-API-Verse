import { ApiPassport, Endpoint } from '@mahi-api-verse/schemas';
import { createDefaultLanguageMatrix } from '@mahi-api-verse/language-matrix-generator';

export interface DocumentationBundle {
  overview: string;
  authentication: string;
  endpoints: Record<string, string>;
}

export class OverviewGenerator {
  public static async build(passport: ApiPassport): Promise<string> {
    return `
# ${passport.name} API

**State:** ${passport.state}
**Base URL:** ${passport.baseUrls.join(', ')}
${passport.website ? `**Website:** [${passport.website}](${passport.website})` : ''}

${passport.overview ? JSON.stringify(passport.overview, null, 2) : 'No overview provided.'}
    `.trim();
  }
}

export class AuthenticationGenerator {
  public static async build(passport: ApiPassport): Promise<string> {
    if (!passport.authentication || passport.authentication.length === 0) {
      return 'No authentication required.';
    }
    
    return `
## Authentication

This API uses the following authentication methods:

\`\`\`json
${JSON.stringify(passport.authentication, null, 2)}
\`\`\`
    `.trim();
  }
}

export class EndpointGenerator {
  public static async build(endpoints: Endpoint[], baseUrl?: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const languageMatrix = createDefaultLanguageMatrix();
    
    for (const endpoint of endpoints) {
      const key = `${endpoint.method} ${endpoint.path}`;
      
      // Compute the URL by joining baseUrl and path safely
      const computedUrl = baseUrl 
        ? `${baseUrl.replace(/\/$/, '')}/${endpoint.path.replace(/^\//, '')}`
        : endpoint.path;
      
      // Generate snippets
      const snippets = languageMatrix.generateSnippets({
        ...endpoint,
        url: computedUrl
      });
      
      let snippetsMarkdown = '';
      if (snippets.length > 0) {
        snippetsMarkdown = '\n#### Code Snippets\n\n';
        for (const snippet of snippets) {
          snippetsMarkdown += `##### ${snippet.language} (${snippet.framework || 'native'})\n`;
          snippetsMarkdown += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
        }
      }

      results[key] = `
### ${endpoint.name || key}

**Method:** \`${endpoint.method}\`
**Path:** \`${endpoint.path}\`

${endpoint.description || 'No description provided.'}

#### Parameters
\`\`\`json
${JSON.stringify(endpoint.parameters || [], null, 2)}
\`\`\`
${snippetsMarkdown}
      `.trim();
    }
    
    return results;
  }
}

export class ApiDocumentationGenerator {
  public static async generate(passport: ApiPassport): Promise<DocumentationBundle> {
    const overview = await OverviewGenerator.build(passport);
    const authentication = await AuthenticationGenerator.build(passport);
    const baseUrl = passport.baseUrls && passport.baseUrls.length > 0 ? passport.baseUrls[0] : undefined;
    const endpoints = await EndpointGenerator.build(passport.endpoints, baseUrl);
    
    return {
      overview,
      authentication,
      endpoints
    };
  }
}
