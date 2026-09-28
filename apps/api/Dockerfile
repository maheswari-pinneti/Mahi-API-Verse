FROM node:20-alpine AS alpine
RUN apk update && apk add --no-cache libc6-compat
# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune stage
FROM alpine AS builder
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=@mahi-api-verse/api --docker

# 2. Install stage
FROM alpine AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 3. Build stage
COPY --from=builder /app/out/full/ .
RUN pnpm exec turbo run build --filter=@mahi-api-verse/api...

# 4. Final production stage
FROM alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app .

EXPOSE 3001
CMD ["node", "apps/api/dist/server.js"]
