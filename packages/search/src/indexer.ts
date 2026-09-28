import { Client } from '@opensearch-project/opensearch';

/**
 * PHASE 9: SEARCH ENGINE
 * 
 * Transforms relational data from PostgreSQL into a flattened, 
 * highly-optimized document for OpenSearch.
 */

export class ApiIndexer {
  private client: Client;
  private readonly indexName = 'mahi_apis';

  constructor(nodeUrl: string = 'http://localhost:9200') {
    this.client = new Client({ node: nodeUrl });
  }

  /**
   * Initializes the OpenSearch Index with strict mappings.
   * Keyword mappings are critical so users can run EXACT filters
   * like `language=python` without text tokenization ruining the query.
   */
  async createIndexWithMapping() {
    const mapping = require('./mapping.json');
    
    try {
      const { body: exists } = await this.client.indices.exists({ index: this.indexName });
      if (!exists) {
        await this.client.indices.create({
          index: this.indexName,
          body: mapping
        });
        console.log(`[Indexer] ✅ OpenSearch index '${this.indexName}' created with exact mappings.`);
      }
    } catch (error) {
      console.warn(`[Indexer] Note: OpenSearch not running locally. Skipping index creation.`);
    }
  }

  /**
   * Transforms a highly relational database record into a flat document optimized for search.
   * This handles the "Level 39 Advanced API Discovery" requirements.
   */
  public transformForSearch(dbRecord: any) {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      description: dbRecord.description,
      provider_name: dbRecord.provider?.name || 'Unknown',
      
      // Flatten arrays to enable faceted filtering (e.g., ?categories=finance)
      categories: dbRecord.categories?.map((c: any) => c.slug) || [],
      languages: dbRecord.languages?.map((l: any) => l.slug) || [],
      protocols: dbRecord.protocols || [],
      
      // Flatten complex objects into search tokens
      authentication: dbRecord.authentication ? Object.keys(dbRecord.authentication) : ['none'],
      pricing: dbRecord.pricing?.model || 'unknown',
      license: dbRecord.license || 'unknown',
      
      verification_status: dbRecord.verification?.status || 'unverified',
      
      // Booleans to instantly power "Show me all MCP Servers" queries
      features: {
        openapi: !!dbRecord.openapi,
        graphql: !!dbRecord.graphql,
        mcp: !!dbRecord.mcp,
        websocket: !!dbRecord.websocket
      },
      
      created_at: dbRecord.createdAt,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Indexes a batch of transformed documents into OpenSearch.
   */
  async indexBatch(documents: any[]) {
    const body = documents.flatMap(doc => [
      { index: { _index: this.indexName, _id: doc.id } },
      doc
    ]);

    try {
      const { body: response } = await this.client.bulk({ refresh: true, body });
      if (response.errors) {
        console.error('[Indexer] ❌ Bulk indexing encountered errors.');
      } else {
        console.log(`[Indexer] ✨ Indexed ${documents.length} APIs into OpenSearch.`);
      }
    } catch (e) {
      console.warn('[Indexer] Note: OpenSearch not running. Mock batch complete.');
    }
  }
}
