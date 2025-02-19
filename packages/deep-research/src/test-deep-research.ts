/**
 * test-deep-research.ts
 * ---------------------
 * Test suite for verifying the core deep research functionality.
 */

import { deepResearch } from './deep-research';
import { config } from './config';

async function testDeepResearch() {
  console.log('🧪 Starting Deep Research tests...\n');

  // Test 1: Basic Research Flow
  console.log('Test 1: Basic Research Flow');
  try {
    const result = await deepResearch({
      query: 'What are the main principles of quantum computing?',
      breadth: 2,
      depth: 1,
      onProgress: (progress) => {
        console.log('Progress:', JSON.stringify(progress, null, 2));
      },
    });
    
    console.log('✅ Research completed successfully:');
    console.log('Learnings:', result.learnings.length);
    console.log('URLs visited:', result.visitedUrls.length);
    console.log('\nSample learnings:');
    result.learnings.slice(0, 3).forEach((learning, i) => {
      console.log(`${i + 1}. ${learning}`);
    });
  } catch (error) {
    console.error('❌ Research flow failed:', error);
    process.exit(1);
  }
}

// Run tests
console.log('🔬 Deep Research Test Suite');
console.log('Configuration:', {
  firecrawlUrl: config.firecrawl.baseUrl,
  concurrencyLimit: config.firecrawl.concurrencyLimit,
});

testDeepResearch().catch(console.error); 