#!/bin/sh

until npx prisma migrate deploy; do
  echo "Waiting for the database to be ready..."
  sleep 2
done

npx prisma migrate status

# Démarrer l'application
node dist/main
