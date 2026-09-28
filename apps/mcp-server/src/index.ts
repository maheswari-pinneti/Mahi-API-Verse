import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3001/v1";

const server = new Server(
  { name: "mahi-api-verse-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ---------------------------------------------------------
// Register Tools for AI Agents
// ---------------------------------------------------------
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_apis",
        description: "Search across the 10M+ APIs indexed in the Mahi API Verse. Returns verified APIs matching the query.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term (e.g. 'stripe', 'weather', 'payments')" }
          },
          required: ["query"]
        }
      },
      {
        name: "get_api_endpoints",
        description: "Fetch all available endpoints and methods for a specific Canonical API ID.",
        inputSchema: {
          type: "object",
          properties: {
            apiId: { type: "string", description: "The Canonical ID of the API" }
          },
          required: ["apiId"]
        }
      }
    ]
  };
});

// ---------------------------------------------------------
// Tool Execution Logic
// ---------------------------------------------------------
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "search_apis") {
      const query = request.params.arguments?.query as string;
      const response = await axios.get(`${API_BASE}/apis?q=${encodeURIComponent(query)}`);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
      };
    }

    if (request.params.name === "get_api_endpoints") {
      const apiId = request.params.arguments?.apiId as string;
      const response = await axios.get(`${API_BASE}/apis/${apiId}/endpoints`);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
      };
    }

    throw new Error(`Tool not found: ${request.params.name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: error.response?.data?.error || error.message }]
    };
  }
});

// ---------------------------------------------------------
// Boot Sequence
// ---------------------------------------------------------
async function start() {
  console.error("🚀 Starting Mahi API Verse MCP Server on STDIO...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

start().catch(console.error);
