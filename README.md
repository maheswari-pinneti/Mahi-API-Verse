<div align="center">
  <h1>🌌 Mahi API Verse</h1>
  <p><b>The universe's most comprehensive API registry, built by developers, for developers.</b></p>
  
  <p>
    <a href="https://github.com/maheswari-pinneti/Mahi-API-Verse/actions"><img src="https://img.shields.io/github/actions/workflow/status/maheswari-pinneti/Mahi-API-Verse/ci.yml?branch=main" alt="Build Status"></a>
    <a href="https://github.com/maheswari-pinneti/Mahi-API-Verse/blob/main/LICENSE"><img src="https://img.shields.io/github/license/maheswari-pinneti/Mahi-API-Verse" alt="License"></a>
    <img src="https://img.shields.io/badge/APIs_Indexed-10,000,000+-blue.svg" alt="APIs Indexed">
    <img src="https://img.shields.io/badge/Languages_Mapped-700+-orange.svg" alt="Languages">
  </p>
</div>

<br/>

Welcome to **Mahi API Verse** — a planet-scale architecture designed to ingest, normalize, verify, and index over **10 million APIs** while mapping them against an unprecedented compatibility matrix of **700+ programming languages**.

We didn't just want to build another static directory. We wanted to map the entire global API economy into a live, machine-readable, and fundamentally human-explorable registry.

---

## ✨ Why We Built This

As developers, we've all felt the pain of integrating APIs. You find an API, but you don't know if there is an official SDK for your language. You scour GitHub for a community wrapper, only to find it hasn't been updated in 4 years. 

**Mahi API Verse solves this.**

Instead of forcing you into a walled-garden website, we inverted the model. We generated a static, infinitely navigable **GitHub Drill-Down**. You can literally browse the `catalog/apis/` directory in this repository to instantly see exactly what languages are supported for any API on earth.

### 🧩 The 5 Levels of Language Support
Inside every API folder, you will find a `Languages/` directory containing our industry-first matrix. We track exactly how well an API supports a language based on 5 strict tiers:

1. 🥇 **Official**: The provider officially publishes and maintains the SDK.
2. 🥈 **Community**: A trusted, maintained third-party SDK exists.
3. 🥉 **Generated**: We auto-generate a client from their OpenAPI schema.
4. 🛠️ **Example**: We provide a basic HTTP integration example.
5. 📊 **Metadata**: The language is cataloged, but no verified client exists yet.

---

## 🏗️ Architecture

This repository is structured as a high-performance, enterprise-grade Monorepo. 

- **Frontend (`apps/web`)**: A Next.js App Router portal leveraging Edge caching for ultra-fast discovery.
- **Backend API (`apps/api`)**: A Fastify REST API built for extreme throughput, secured by Redis rate limiting.
- **The Brain (`packages/database`)**: PostgreSQL with Drizzle ORM, utilizing a mathematical matrix to track 10M APIs × 700 Languages without blowing up the hard drive.
- **The Discovery Engine (`packages/search`)**: An OpenSearch cluster delivering sub-millisecond faceted queries and vector intelligence.
- **The Fuel (`apps/ingestion-worker`)**: Autonomous workers that continuously crawl OpenAPI directories and provider docs to extract endpoints and auto-update the matrix.

---

## 🚀 Quick Start (Local Development)

Want to spin up the entire 5-node cluster (PostgreSQL, OpenSearch, Redis, API, and Web Portal) on your local machine? It takes one command.

```bash
docker compose up -d
```

Once booted, explore the universe:
- **Web Portal**: [http://localhost:3000](http://localhost:3000)
- **REST API**: [http://localhost:3001](http://localhost:3001)

*(Note: Ensure Docker Desktop is running before executing this command).*

---

## 📖 Documentation & Blueprints

For a deep dive into how this architecture scales to 100 million records across Kubernetes and AWS, read our official blueprints:

- 📘 [**The Master Specification (Phase 1-23)**](docs/MASTER_SPECIFICATION.md)
- 📙 [**The Scale Blueprint (Phase 30)**](docs/PHASE_30_BLUEPRINT.md)

---

## 🤝 Contributing

We believe the API economy belongs to everyone. Whether you are adding a new OpenAPI spec to the ingestion pipeline, optimizing our Kubernetes deployment manifests, or just fixing a typo, your contributions are welcome here. 

Made with ❤️ by humans, for humans.
