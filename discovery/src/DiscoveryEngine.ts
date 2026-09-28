import { Client } from '@opensearch-project/opensearch';

/**
 * PHASE 10: API DISCOVERY
 * 
 * Generates dynamic feeds and relationships based on measurable signals,
 * explicitly avoiding arbitrary manual labels. Uses OpenSearch Query DSL.
 */
export class DiscoveryEngine {
  private client: Client;
  private readonly indexName = 'mahi_apis';

  constructor(nodeUrl: string = 'http://localhost:9200') {
    this.client = new Client({ node: nodeUrl });
  }

  // ==========================================
  // 1. DYNAMIC FEEDS
  // ==========================================

  /**
   * /trending: Based on a measurable signal (e.g., view velocity or recent GitHub stars)
   * rather than a manual "trending" tag.
   */
  async getTrending() {
    return this.client.search({
      index: this.indexName,
      body: {
        query: { 
          function_score: { 
            field_value_factor: { field: "view_velocity", modifier: "log1p" } 
          } 
        },
        sort: [{ _score: "desc" }],
        size: 20
      }
    });
  }

  /**
   * /underrated: High verification/uptime score, but low view count.
   * This surfaces hidden gems computationally.
   */
  async getUnderrated() {
    return this.client.search({
      index: this.indexName,
      body: {
        query: {
          bool: {
            must: [{ term: { verification_status: "verified" } }],
            filter: [{ range: { view_count: { lte: 1000 } } }]
          }
        },
        size: 20
      }
    });
  }

  /**
   * /new: Strictly based on ingestion timestamp.
   */
  async getNew() {
    return this.client.search({
      index: this.indexName,
      body: { sort: [{ created_at: "desc" }], size: 20 }
    });
  }

  /**
   * /free & /no-auth: Specific hard filters for developer utility.
   */
  async getFreeNoAuth() {
    return this.client.search({
      index: this.indexName,
      body: {
        query: {
          bool: {
            must: [
              { term: { pricing: "free" } },
              { term: { authentication: "none" } }
            ]
          }
        },
        size: 20
      }
    });
  }

  /**
   * /mcp & /ai: Protocol and Category specific routes
   */
  async getMcpServers() {
    return this.client.search({
      index: this.indexName,
      body: { query: { term: { "features.mcp": true } }, size: 20 }
    });
  }

  // ==========================================
  // 2. RELATIONSHIP GRAPH (Similar, Alternatives)
  // ==========================================

  /**
   * Similar APIs: Uses OpenSearch's "More Like This" (MLT) on categories, 
   * descriptions, and protocols to computationally find similar APIs.
   */
  async getSimilar(apiId: string) {
    return this.client.search({
      index: this.indexName,
      body: {
        query: {
          more_like_this: {
            fields: ["categories", "description", "protocols"],
            like: [{ _index: this.indexName, _id: apiId }],
            min_term_freq: 1,
            max_query_terms: 12
          }
        },
        size: 5
      }
    });
  }

  /**
   * Same Provider APIs (e.g., "See more from Google Cloud")
   */
  async getSameProvider(providerName: string) {
    return this.client.search({
      index: this.indexName,
      body: {
        query: { term: { provider_name: providerName } },
        size: 10
      }
    });
  }
}
