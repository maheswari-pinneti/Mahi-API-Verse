export interface GraphNode {
  id: string;
  label: 'Provider' | 'API' | 'Endpoint' | 'Language' | 'SDK' | 'Category';
  properties: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: 'OWNS' | 'HAS_ENDPOINT' | 'SUPPORTS_LANGUAGE' | 'HAS_SDK' | 'CATEGORIZED_AS';
  weight?: number;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * The Knowledge Graph Builder dynamically compiles relational data from the
 * canonical Postgres Database into a flattened Graph Structure.
 * This can be exported to Neo4j, OpenSearch, or used directly by the frontend
 * for interactive D3.js visual node exploration.
 */
export class GraphBuilder {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  public addNode(node: GraphNode): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
    }
  }

  public addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  /**
   * Constructs the relational graph for a specific API.
   * e.g. Stripe (Provider) -> Stripe API (API) -> /v1/charges (Endpoint)
   * Stripe API (API) -> Python (Language) -> stripe-python (SDK)
   */
  public buildApiSubGraph(apiId: string, apiMetadata: any, endpoints: any[], languages: any[]): KnowledgeGraphData {
    
    // 1. Map the API Node
    this.addNode({
      id: apiId,
      label: 'API',
      properties: { name: apiMetadata.name, version: apiMetadata.version }
    });

    // 2. Map the Provider Node
    const providerId = `provider_${apiMetadata.providerId}`;
    this.addNode({
      id: providerId,
      label: 'Provider',
      properties: { name: apiMetadata.providerName }
    });
    this.addEdge({ source: providerId, target: apiId, relationship: 'OWNS' });

    // 3. Map Endpoints
    for (const ep of endpoints) {
      const epId = `endpoint_${ep.id}`;
      this.addNode({
        id: epId,
        label: 'Endpoint',
        properties: { path: ep.path, method: ep.method }
      });
      this.addEdge({ source: apiId, target: epId, relationship: 'HAS_ENDPOINT' });
    }

    // 4. Map Language Matrix
    for (const lang of languages) {
      const langId = `lang_${lang.name}`;
      this.addNode({
        id: langId,
        label: 'Language',
        properties: { name: lang.name, ecosystem: lang.ecosystem }
      });
      this.addEdge({ source: apiId, target: langId, relationship: 'SUPPORTS_LANGUAGE' });

      if (lang.sdkName) {
        const sdkId = `sdk_${lang.sdkName}`;
        this.addNode({
          id: sdkId,
          label: 'SDK',
          properties: { name: lang.sdkName, verified: lang.verified }
        });
        this.addEdge({ source: langId, target: sdkId, relationship: 'HAS_SDK' });
      }
    }

    return this.export();
  }

  public export(): KnowledgeGraphData {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges
    };
  }
}
