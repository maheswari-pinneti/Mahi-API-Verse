# 🔒 Privacy Policy

**Last Updated:** September 2026

Your privacy is critically important to us at **Mahi API Verse**. This policy outlines how we collect, use, and protect your data.

## 1. Information We Collect
- **Developer Telemetry**: When accessing our API or Web Portal, we collect standard telemetry data (IP addresses, request latency, and user-agent strings) for APM monitoring via Prometheus/Grafana.
- **Account Data**: If you authenticate to push API schemas, we store your OAuth tokens and GitHub metadata securely.
- **API Payloads**: The ingestion engine temporarily processes OpenAPI specs (`swagger.json`). We do not store sensitive payloads, only structural schema metadata.

## 2. How We Use Information
We use the collected information solely to:
- Monitor cluster health and scale Kubernetes pods dynamically.
- Enforce rate limits and mitigate DDoS attacks.
- Improve the accuracy of the OpenSearch discovery engine.

## 3. Data Protection
All sensitive data, including database passwords and TLS certificates, are encrypted and managed via Kubernetes Secrets. We strictly adhere to OWASP security standards.

## 4. Third-Party Sharing
We do not sell, trade, or rent your personal identification information or proprietary API schema structures to third parties.

## 5. Contact Us
If you have questions about this Privacy Policy, please open an issue in this repository.
