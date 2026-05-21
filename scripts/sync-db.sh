#!/bin/bash

# Check if production URL is provided
if [ -z "$1" ]; then
  echo "❌ Error: No production database URL provided."
  echo "Usage: ./sync-db.sh <PROD_DATABASE_URL>"
  exit 1
fi

PROD_URL=$1

# 1. Ensure the local container is running
echo "🚀 Ensuring local database is running..."
docker compose up -d db

# 2. Wait for local DB to be ready
echo "⏳ Waiting for local database to be ready..."
until docker compose exec db pg_isready -U devuser -d blog_db > /dev/null 2>&1; do
  sleep 1
done

# 3. Perform the sync
echo "📥 Cloning production data to local database..."
echo "⚠️  This will overwrite all local data in 'blog_db'."

# We use a temporary container to run pg_dump so the user doesn't need local postgres tools
# We pipe the output directly into the local container's psql
docker run --rm --network host postgres:17-alpine pg_dump --clean --if-exists --no-owner --no-privileges "$PROD_URL" | docker compose exec -T db psql -U devuser -d blog_db

if [ $? -eq 0 ]; then
  echo "✅ Database synchronization complete!"
  
  # 4. Optional: Run Prisma generate to ensure types are fresh
  echo "🛠️  Updating Prisma client..."
  npx prisma generate
else
  echo "❌ Error: Database synchronization failed."
  exit 1
fi
