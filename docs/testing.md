# Testing Guide for Deep Research Agent

## Overview
This document outlines the testing conventions and commands used in the Deep Research Agent project. It serves as a reference for developers to ensure consistent testing practices across the codebase.

## Service Health Checks

### SearXNG Testing
Test the SearXNG service's JSON API endpoint:
```bash
# Basic search query
curl 'http://localhost:8080/search?q=test+query&format=json&engines=google'

# Specific search with multiple engines
curl 'http://localhost:8080/search?q=artificial+intelligence+quantum+computing&format=json&engines=google,duckduckgo,bing'
```

Expected response: JSON object containing search results, including:
- query string
- number_of_results
- results array with URLs, titles, and content
- suggestions array

### Firecrawl Testing
Test the Firecrawl service using the provided test script:
```bash
# From the deep-research package directory
pnpm tsx --env-file=.env.local src/test-firecrawl.ts
```

Expected response: Successful connection message and search results.

## Integration Testing

### Deep Research Module Testing
Test the complete research pipeline using the test script:
```bash
# From the deep-research package directory
pnpm tsx --env-file=.env.local src/test-deep-research.ts
```

This test:
- Executes a sample research query
- Tests the integration between Firecrawl and SearXNG
- Validates the research output format

## Common Issues and Solutions

### SearXNG Issues
1. 403 Forbidden Error
   - Check `settings.yml` for proper API configuration
   - Ensure `api.key` is set to `false` for development
   - Verify CORS settings are properly configured

2. Empty Results
   - Verify search engines are properly enabled in `settings.yml`
   - Check network connectivity
   - Ensure proper URL formatting in requests

### Firecrawl Issues
1. Connection Errors
   - Verify Firecrawl container is running
   - Check environment variables in `.env.local`
   - Ensure proper network configuration in `docker-compose.yml`

## Testing Conventions

1. **Environment Variables**
   - Always use `.env.local` for local testing
   - Never commit sensitive API keys
   - Use example values in documentation

2. **Test Scripts**
   - Keep test scripts in `src/` directory with `test-` prefix
   - Use TypeScript for all test files
   - Include proper error handling and logging

3. **Manual Testing**
   - Document curl commands for API testing
   - Include expected response formats
   - Note any required headers or parameters

## Future Test Coverage

Planned test implementations:
1. Unit tests for core research functions
2. Integration tests for the complete pipeline
3. End-to-end tests for the web interface
4. Performance benchmarking tests

## Monitoring and Debugging

For local development, monitor services using:
```bash
# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f searxng
docker compose logs -f firecrawl
``` 