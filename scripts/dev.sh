#!/bin/bash

# Start the database container in the background
echo "🚀 Starting Postgres container..."
docker compose up -d

# Wait for Postgres to be ready
echo "⏳ Waiting for Postgres to be ready..."
until docker compose exec db pg_isready -U devuser -d blog_db > /dev/null 2>&1; do
  sleep 1
done

# Ensure database is synced with schema
echo "🔄 Syncing database with Prisma schema..."
npx prisma db push

# Start the Next.js dev server
echo "✨ Starting Next.js dev server..."
npm run dev
