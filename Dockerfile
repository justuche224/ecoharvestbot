# syntax=docker/dockerfile:1.7

FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS typecheck
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx tsc --noEmit

FROM oven/bun:1-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --chown=bun:bun . .

USER bun
CMD ["bun", "run", "index.ts"]
