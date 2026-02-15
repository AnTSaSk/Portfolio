# syntax=docker/dockerfile:1
# Multi-stage build for Nuxt 3 monorepo (PNPM 10)

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Skip husky install in Docker
ENV HUSKY=0

# Copy PNPM workspace config for layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./

# Copy all package.json files (root + workspaces) for dependency resolution
COPY packages/styleguide/package.json packages/styleguide/
COPY packages/website/package.json packages/website/

# Install all dependencies (frozen lockfile)
# hadolint ignore=DL3059
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY packages/ packages/

# Regenerate Nuxt types (postinstall ran before source was available) then build
RUN pnpm --filter @antsask/website exec nuxt prepare && pnpm build:website

# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

# Create non-root user for security (matching infra-vps convention: UID 1001)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nodeuser

# Copy built output from builder stage
# Nuxt .output is self-contained (bundled dependencies included)
COPY --from=builder --chown=nodeuser:nodejs /app/packages/website/.output .output

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:3000/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
