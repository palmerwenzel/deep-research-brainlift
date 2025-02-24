#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Create the Docker network if it doesn't exist
if ! docker network ls | grep -q "deep_research_network"; then
  echo "Creating deep_research_network..."
  docker network create deep_research_network
fi

# Start the development services
echo "Starting development services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
timeout=30
elapsed=0
while ! curl -s http://localhost:3002/health > /dev/null && ! curl -s http://localhost:8080/health > /dev/null; do
  if [ $elapsed -ge $timeout ]; then
    echo "Timeout waiting for services to start"
    exit 1
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

echo "Services are ready!"
echo "You can now start the web app with: pnpm --filter @deep-research-brainlift/web dev" 