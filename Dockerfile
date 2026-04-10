# ─────────────────────────────────────────────────────────────
# Stage 1: base
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

# ─────────────────────────────────────────────────────────────
# Stage 2: deps
# ─────────────────────────────────────────────────────────────
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────
# Stage 3: builder
# ─────────────────────────────────────────────────────────────
FROM deps AS builder

COPY . .

# Next.js collects telemetry — disable during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time env: inside Docker the API lives at the compose service name
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 4: production
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js standalone output copies only what's needed
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# ─────────────────────────────────────────────────────────────
# Development: hot-reload (use with docker-compose.dev.yml)
# ─────────────────────────────────────────────────────────────
FROM deps AS development

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3001

CMD ["npm", "run", "dev", "--", "-p", "3001"]
