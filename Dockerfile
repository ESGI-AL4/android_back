# Base server
FROM node:20-alpine as base

# hadolint ignore=DL3018
RUN apk add --no-cache gcompat

USER node
WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./

ENV PORT $PORT
EXPOSE $PORT

# Development
FROM base as dev
ENV NODE_ENV=dev
RUN npm ci
COPY --chown=node:node . .
CMD ["npm", "run", "start:dev"]

# Build
FROM base as build
RUN npm ci
COPY --chown=node:node . .
RUN npm run build && \
    npm prune --production

# Production
FROM base as prod
ENV NODE_ENV=prod
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
CMD ["npm", "start"]