# Base server
FROM node:20-alpine as base

RUN apk add --no-cache gcompat

USER node
WORKDIR /app

COPY --chown=node:node package.json package-lock.json prisma ./prisma/ ./

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
RUN npx prisma generate
COPY --chown=node:node . .
RUN npm run build && \
    npm prune --production

# Production
FROM base as prod
ENV NODE_ENV=prod

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node docker-entrypoint.sh ./


# Passer à l'utilisateur root pour modifier les permissions
USER root
RUN chmod +x docker-entrypoint.sh

# Revenir à l'utilisateur node
USER node

ENTRYPOINT ["./docker-entrypoint.sh"]
