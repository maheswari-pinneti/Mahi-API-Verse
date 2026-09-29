FROM node:20-alpine AS alpine
RUN apk update && apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune stage
FROM alpine AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@mahi-api-verse/web --docker

# 2. Install stage
FROM alpine AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 3. Build stage
COPY --from=builder /app/out/full/ .
RUN pnpm exec turbo run build --filter=@mahi-api-verse/web...

# 4. Final production stage
FROM alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .
COPY --from=installer /app/apps/web/public ./public
COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
