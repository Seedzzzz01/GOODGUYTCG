#!/bin/sh
set -e

echo "Running Prisma migrations..."
node /app/node_modules/prisma/build/index.js migrate deploy --schema /app/prisma/schema.prisma 2>&1 || echo "Migration: no pending changes"

echo "Starting Next.js..."
exec node server.js
