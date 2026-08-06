# syntax=docker/dockerfile:1
# Multi-stage build for Storybook static site (PNPM monorepo)

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

# Build Storybook static output to packages/styleguide/storybook-static
RUN pnpm build:styleguide

# Stage 2: Production: nginx serves static files
# NOTE: tmpfs mounts are required at runtime for read_only container compatibility:
#   /var/cache/nginx, /var/run, /tmp
FROM nginx:1.31-alpine AS production

# Remove default nginx config and replace with minimal static-file config
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/packages/styleguide/storybook-static /usr/share/nginx/html

# Minimal nginx config: serve static files on port 8080 (non-root compatible)
COPY <<'NGINX' /etc/nginx/conf.d/storybook.conf
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /health {
        access_log off;
        return 200 "ok";
        add_header Content-Type text/plain;
    }
}
NGINX

# A tmpfs inherits the mode of the directory it covers, never its owner, and
# stack deploy drops the mount's own mode: the permission has to come from here.
RUN chmod 1777 /var/cache/nginx /var/run

EXPOSE 8080

# Run as the image's own nginx user: the root entrypoint would chown the cache
# dirs to it, which cap_drop:[ALL] refuses (nginx exits [emerg] at boot).
USER nginx

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1
