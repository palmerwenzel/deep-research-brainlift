import FirecrawlApp from '@mendable/firecrawl-js';

async function testFirecrawl() {
  console.log('Testing Firecrawl connection...');

  const firecrawl = new FirecrawlApp({
    apiUrl: process.env.FIRECRAWL_BASE_URL,
  });

  try {
    // Test a simple search
    const result = await firecrawl.search('test query');

    console.log('Firecrawl connection successful!');
    console.log('Search result:', result);
  } catch (error) {
    console.error('Firecrawl connection failed:', error);
  }
}

testFirecrawl(); 