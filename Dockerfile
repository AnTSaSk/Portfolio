# syntax=docker/dockerfile:1
# Multi-stage build for Nuxt 3 monorepo (PNPM 10)

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Skip husky install in Docker
ENV HUSKY=0

# libvips for sharp, used by the build-time image variant generation on musl
RUN apk add --no-cache vips=~8.18

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

# Sentry source map upload (build-time). Empty when secrets absent -> upload skipped, build still succeeds.
ARG SENTRY_AUTH_TOKEN=""
ARG SENTRY_ORG=""
ARG SENTRY_PROJECT=""
ARG SENTRY_RELEASE=""
ARG SENTRY_ENVIRONMENT="production"
# Client-side DSN is read via import.meta.env, which Vite resolves at build time:
# absent here, it is inlined as undefined and no runtime env can restore it.
ARG NUXT_PUBLIC_SENTRY_DSN=""
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN \
    SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT=$SENTRY_PROJECT \
    SENTRY_RELEASE=$SENTRY_RELEASE \
    NUXT_PUBLIC_SENTRY_RELEASE=$SENTRY_RELEASE \
    NUXT_PUBLIC_SENTRY_DSN=$NUXT_PUBLIC_SENTRY_DSN \
    SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

# Umami tracker: the script tag lands in app.head at build time and its origin
# feeds the generated CSP, so both are decided here. Empty means no tag emitted.
ARG NUXT_PUBLIC_UMAMI_SRC=""
ARG NUXT_PUBLIC_UMAMI_WEBSITE_ID=""
ARG NUXT_PUBLIC_UMAMI_DOMAINS=""
ENV NUXT_PUBLIC_UMAMI_SRC=$NUXT_PUBLIC_UMAMI_SRC \
    NUXT_PUBLIC_UMAMI_WEBSITE_ID=$NUXT_PUBLIC_UMAMI_WEBSITE_ID \
    NUXT_PUBLIC_UMAMI_DOMAINS=$NUXT_PUBLIC_UMAMI_DOMAINS

# @nuxt/content bakes content.database.filename into the Nitro bundle at build time
# and offers no runtime override, so this must be set here, not only in the
# production stage.
ENV NUXT_CONTENT_DB=/app/.data/content/contents.sqlite

# Generate image variants first, on a cache mount: COPY above is invalidated by
# any source change, but variants are keyed on the hash of the images themselves,
# so only new or modified visuals are re-encoded.
RUN --mount=type=cache,target=/app/packages/website/.image-cache,sharing=locked \
    pnpm --filter @antsask/website images:build

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

# Writable dir for the @nuxt/content runtime SQLite DB (restored + written lazily
# per collection). The node:sqlite driver needs no native package on musl.
# The named volume mounted here copies this ownership and mode when it is first
# created; mode 1777 also keeps the path writable if it is ever backed by a tmpfs,
# which under `docker stack deploy` inherits the mode but not the ownership.
RUN mkdir -p /app/.data/content && chmod 1777 /app/.data/content && chown -R nodeuser:nodejs /app/.data

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_CONTENT_DB=/app/.data/content/contents.sqlite

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:3000/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
