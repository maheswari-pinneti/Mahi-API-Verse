# 🛡️ Security Policy

## Supported Versions

Currently, only the `main` branch of Mahi API Verse is actively supported for security updates.

| Version | Supported          |
| ------- | ------------------ |
| v1.0.0  | :white_check_mark: |
| legacy  | :x:                |

## Reporting a Vulnerability

Security is a core pillar of the Mahi API Verse architecture. We take all vulnerabilities seriously.

If you discover a security vulnerability (e.g., bypasses to the Redis rate-limiting, SQL injections in the Drizzle ORM layer, or OpenSearch unauthenticated access vectors), **please do NOT report it by creating a public GitHub issue.**

Instead, please send an email to the security team or use the GitHub Security Advisory feature. We will acknowledge your report within 48 hours and work with you to patch the vulnerability before public disclosure.

### Scope
- `apps/api`: Fastify REST endpoints
- `apps/web`: Next.js portal
- `packages/database`: PostgreSQL matrix
- `k8s/`: Kubernetes manifests

We run automated Dependabot scans weekly to ensure Alpine Docker images and Node dependencies are patched against the latest CVEs.
