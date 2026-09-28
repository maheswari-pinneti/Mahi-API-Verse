# 🤝 Contributing to Mahi API Verse

First off, thank you for considering contributing to the Mahi API Verse! It is people like you that make this the most powerful API registry in the world.

## How to Contribute

### 1. Adding a New API
If our autonomous ingestion worker missed an API, you can add it manually:
1. Fork the repository.
2. Navigate to the appropriate category in `catalog/apis/`.
3. Create the API directory structure following the master specification.
4. Ensure the `Languages/` matrix is correctly formatted.

### 2. Improving the Codebase
- **Next.js Portal**: UI improvements are welcome in `apps/web/`.
- **Fastify API**: Performance optimizations can be made in `apps/api/`.
- **Kubernetes**: If you have EKS/GKE expertise, feel free to optimize the `.yaml` manifests in `k8s/`.

## Pull Request Process
1. Ensure your code passes all CI/CD pipelines (Linting, Typechecking, Playwright E2E testing).
2. Update the `README.md` with details of changes to the interface, this includes new environment variables or exposed ports.
3. Your PR will be reviewed by the maintainers and merged once approved.

## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. We are a welcoming and inclusive community of developers. Harassment or toxic behavior will not be tolerated.
