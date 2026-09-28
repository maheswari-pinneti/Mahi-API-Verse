# 🌐 Mahi API Verse

**The Global API Discovery & Intelligence Platform.**

Mahi API Verse is a planet-scale architecture designed to ingest, normalize, verify, and index over **10,000,000 APIs** and map them against a compatibility matrix of **700+ programming languages**. 

This is not a static list; it is a live, machine-readable registry of the global API economy.

## 🚀 Enterprise Architecture

This repository is structured as a high-performance Monorepo:

- **Frontend (`apps/web`)**: Next.js App Router, leveraging Incremental Static Regeneration (ISR) to cache 10M pages globally at the Edge.
- **Backend API (`apps/api`)**: Fastify REST API built for extreme throughput, secured by OWASP protocols and Redis rate limiting.
- **Database (`packages/database`)**: PostgreSQL with Drizzle ORM, utilizing a powerful mathematical matrix to map 10M APIs × 700 Languages without redundancy.
- **Search Engine (`packages/search`)**: OpenSearch cluster for sub-millisecond faceted queries, aggregations, and vector intelligence.
- **Ingestion Workers (`apps/ingestion-worker`)**: Autonomous agents that crawl OpenAPI specs, GitHub, and provider docs to extract endpoints, auth, and SDKs.
- **Mahi AI (`packages/ai`)**: Gemini-powered Developer Advocate that answers complex API integration questions autonomously.

## 📦 Quick Start (Docker Compose)

Spin up the entire ecosystem (PostgreSQL, OpenSearch, Redis, API, and Web Portal) locally with one command:

```bash
docker compose up -d
```

- **Web Portal**: http://localhost:3000
- **REST API**: http://localhost:3001
- **Database**: localhost:5432
- **OpenSearch**: localhost:9200

## 💻 The GitHub-Native Drill-Down

The repository itself is a navigable universe. Explore the `catalog/apis/` directory to see the exact structure. For every API, you will find:
* Core Metadata (Auth, Pricing, OpenAPI schema)
* Endpoint definitions
* A **700+ language matrix** containing exactly mapped statuses (`OFFICIAL`, `COMMUNITY`, `GENERATED`, `EXAMPLE_ONLY`, `UNSUPPORTED`).

## 🛠️ Tech Stack
* **TypeScript** (100% End-to-end type safety)
* **Node.js 20+**
* **Next.js 14** (React, Tailwind/CSS Modules)
* **Fastify**
* **PostgreSQL & Drizzle ORM**
* **OpenSearch**
* **Docker & Kubernetes**
