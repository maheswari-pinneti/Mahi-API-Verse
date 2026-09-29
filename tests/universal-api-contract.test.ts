import { describe, it, expect } from 'vitest';
import { ApiDocumentationGenerator } from '../packages/api-documentation/src/generator';
import { ApiPassport } from '../packages/schemas/src/api-passport';

describe('Phase 95: Universal API Contract Verification', () => {
  it('should generate all required documentation sections without fabricating data', async () => {
    // Create a synthetic API Passport
    const syntheticPassport = {
      id: 'api_test123',
      name: 'Test Synthetic API',
      slug: 'test-synthetic-api',
      state: 'VALIDATED',
      baseUrls: ['https://api.example.com/v1'],
      website: 'https://example.com',
      overview: {
        description: 'A test API for verification.'
      },
      authentication: [
        { type: 'Bearer', format: 'JWT' }
      ],
      endpoints: [
        {
          id: 'ep_1',
          name: 'Get Users',
          method: 'GET',
          path: '/users',
          description: 'Fetch a list of users.',
          parameters: [],
          languages: ['curl', 'python', 'node']
        }
      ]
    } as unknown as ApiPassport;

    const docBundle = await ApiDocumentationGenerator.generate(syntheticPassport);

    // Assert that every required documentation section is successfully generated
    expect(docBundle).toBeDefined();
    expect(docBundle.overview).toContain('Test Synthetic API');
    expect(docBundle.overview).toContain('https://api.example.com/v1');
    expect(docBundle.authentication).toContain('Bearer');
    expect(Object.keys(docBundle.endpoints).length).toBe(1);
    
    const endpointDoc = docBundle.endpoints['GET /users'];
    expect(endpointDoc).toBeDefined();
    expect(endpointDoc).toContain('Get Users');
    expect(endpointDoc).toContain('GET');
    expect(endpointDoc).toContain('/users');
  });
});
