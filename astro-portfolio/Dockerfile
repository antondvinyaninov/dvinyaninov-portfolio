FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY astro-portfolio/package.json astro-portfolio/package-lock.json ./
RUN npm ci

# Build the app
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY astro-portfolio/ .
RUN npm run build
RUN ls -la dist/
RUN ls -la dist/client/ || echo "No client folder"

# Production image with Node.js server
FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

# Принимаем build args и устанавливаем как ENV
ARG TELEGRAM_BOT_TOKEN
ARG TELEGRAM_CHAT_ID
ENV TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
ENV TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 80
CMD ["node", "./dist/server/entry.mjs"]
