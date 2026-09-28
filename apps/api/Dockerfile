# PHASE 25: DOCKERIZATION (Backend API)
# Multi-stage build for ultra-small image size

FROM node:20-alpine AS builder
WORKDIR /app

# Install monorepo dependencies
COPY package*.json ./
COPY packages/ ./packages/
COPY apps/api/package*.json ./apps/api/
RUN npm ci

# Copy source and build
COPY apps/api/ ./apps/api/
RUN npm run build -w @mahi-api-verse/api

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy the built output and prod dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/

EXPOSE 3001

CMD ["node", "apps/api/dist/server.js"]
