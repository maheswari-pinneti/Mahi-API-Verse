import { Client } from '@opensearch-project/opensearch';

export interface SearchHit {
  id: string;
  name: string;
  description: string;
  providerName: string;
  score: number;
}

/**
 * OpenSearch / ElasticSearch Integration Engine
 * Provides ultra-fast full-text search across 10M APIs using BM25 algorithms,
 * drastically outperforming Postgres `LIKE` or standard `tsvector` queries.
 */
export class SearchEngine {
  private client: Client;
  private readonly INDEX_NAME = 'mahi_apis';

  constructor(node: string = process.env.OPENSEARCH_URL || 'http://localhost:9200') {
    this.client = new Client({ node });
  }

  /**
   * Bootstraps the Index with explicit mappings for high-performance searching.
   */
  public async initializeIndex(): Promise<void> {
    const { body: exists } = await this.client.indices.exists({ index: this.INDEX_NAME });
    if (exists) return;

    await this.client.indices.create({
      index: this.INDEX_NAME,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            name: { type: 'text', analyzer: 'english' },
            description: { type: 'text', analyzer: 'english' },
            providerName: { type: 'text' },
            categories: { type: 'keyword' },
            lifecycle: { type: 'keyword' }
          }
        }
      }
    });
    console.log(`[SEARCH ENGINE] Initialized Index: ${this.INDEX_NAME}`);
  }

  /**
   * Syncs an API from PostgreSQL into the OpenSearch cluster.
   * Called by the Ingestion Worker upon successful DB commit.
   */
  public async indexApi(api: any): Promise<void> {
    await this.client.index({
      index: this.INDEX_NAME,
      id: api.id,
      body: {
        id: api.id,
        name: api.name,
        description: api.description,
        providerName: api.providerName,
        categories: api.categories || [],
        lifecycle: api.lifecycle
      },
      refresh: true // Wait for doc to be searchable
    });
  }

  /**
   * Performs a blazing fast multi-match search across name, description, and provider.
   */
  public async search(query: string, limit: number = 10): Promise<SearchHit[]> {
    const { body } = await this.client.search({
      index: this.INDEX_NAME,
      body: {
        size: limit,
        query: {
          multi_match: {
            query,
            fields: ['name^3', 'providerName^2', 'description'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    return body.hits.hits.map((hit: any) => ({
      id: hit._source.id,
      name: hit._source.name,
      description: hit._source.description,
      providerName: hit._source.providerName,
      score: hit._score
    }));
  }
}
