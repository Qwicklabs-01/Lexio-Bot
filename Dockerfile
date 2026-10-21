# Production Multi-Stage Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy sources and build backend & mini app
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build:miniapp || true
RUN npm run build || true

# Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/mini-app/dist ./src/mini-app/dist

EXPOSE 3000

CMD ["node", "dist/server/index.js"]
