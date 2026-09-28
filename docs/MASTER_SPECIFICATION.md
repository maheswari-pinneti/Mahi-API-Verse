# 🌐 Mahi API Verse — Master Specification

## The Core Philosophy
Mahi API Verse is not just a list of APIs. It is a globally searchable, verifiable, machine-readable universe of APIs, developer tools, SDKs, protocols, and programming-language integrations.

---

## 🏗️ The Universal API Architecture Rule

> **Every API record in Mahi API Verse MUST follow the same canonical drill-down architecture. Every API must have a standardized profile containing metadata, provider, documentation, endpoints, protocols, authentication, pricing, licensing, versions, SDKs, verification, provenance, and a programming-language compatibility matrix. The language matrix must support a target registry of 700+ programming languages and classify each API-language relationship as official, community, generated, example-only, metadata-only, unsupported, or unknown. API-language examples must be generated from real API specifications or safely constructed HTTP examples and must never be presented as official SDKs unless officially published by the API provider.**

---

## 1. The Master Pipeline

Every API (10M+) flows through this exact ingestion queue, processed asynchronously by workers:

\`\`\`text
DISCOVER → IMPORT → NORMALIZE → DEDUPLICATE → LICENSE/PROVENANCE 
  → VALIDATE → PARSE → EXTRACT (Endpoints, Protocols, Auth, SDKs) 
  → MAP 700+ LANGUAGES → GENERATE EXAMPLES → VERIFY → INDEX → PUBLISH
\`\`\`

---

## 2. The Universal Profile

Whether it's a Weather API, the GitHub API, or a local MCP Agent Server, every API record is mapped to this exact profile structure:

\`\`\`text
API
├── Overview, Provider, Website, Documentation, Versions
├── Base URLs, Endpoints, Operations
├── Protocols, Authentication, Pricing, License
├── Categories, Tags
├── SDKs, Programming Languages, Code Examples
├── OpenAPI, GraphQL, gRPC, AsyncAPI, WebSocket, Webhooks, MCP
├── Health, Verification, Changelog
├── Alternatives, Similar APIs, Provenance
\`\`\`

---

## 3. The 700+ Language Drill-Down

Every API intersects with a matrix of 700+ programming languages. We do **not** fabricate 700 SDKs. We use a matrix table (\`api_languages\`) to map the relationship.

Status Classifications:
* \`OFFICIAL\`
* \`COMMUNITY\`
* \`GENERATED\`
* \`EXAMPLE_ONLY\`
* \`METADATA_ONLY\`
* \`UNSUPPORTED\`
* \`UNKNOWN\`

*This yields powerful drill-downs: \`Weather API → Forecast Endpoint → Rust → Generated Example\`.*

---

## 4. Database Topology (The Matrix)

The Canonical PostgreSQL Database (Phase 8) enforces this mathematically via join tables, preventing billions of redundant rows:

\`\`\`text
apis
 ├── api_endpoints
 ├── api_protocols
 ├── api_authentication
 ├── api_sdks
 ├── api_verifications
 └── api_languages (The 700+ Bridge)
        ├── languageId
        ├── support_status
        ├── sdk_id
        ├── example_id
        └── package
\`\`\`

---

## 5. The Universal User Interface

Every page in the Next.js Web Portal (Phase 14) executes the same dynamic routing:

\`\`\`text
┌──────────────────────────────────────────────┐
│              MAHI API VERSE                  │
├──────────────────────────────────────────────┤
│ Overview │ Endpoints │ SDKs │ Languages      │
│ Auth     │ Pricing   │ Docs │ Verification   │
│ Protocol │ Examples  │ Health │ History      │
└──────────────────────────────────────────────┘
\`\`\`

When a user clicks "Languages", they see the full 700+ language grid filtered by support tier.

---

## 6. The 112 Precision Categories

The platform automatically classifies all incoming records into one of 112 precision categories:
01 Fundamentals → 40 Search → 72 AI → 80 MCP → 112 Experimental APIs.
