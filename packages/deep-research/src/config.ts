/**
 * config.ts
 * -----------
 * Configuration settings for the Deep Research Agent.
 * Manages service endpoints, API keys, and runtime parameters.
 */

import { z } from 'zod';

// Configuration schema for type safety
export const ConfigSchema = z.object({
  firecrawl: z.object({
    baseUrl: z.string().default('http://localhost:3002'),
    apiKey: z.string().optional(),
    concurrencyLimit: z.number().min(1).default(2),
  }),
  openai: z.object({
    apiKey: z.string(),
    model: z.string().default('gpt-4'),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

// Load configuration from environment variables
export function loadConfig(): Config {
  return ConfigSchema.parse({
    firecrawl: {
      baseUrl: process.env.FIRECRAWL_BASE_URL ?? 'http://localhost:3002',
      apiKey: process.env.FIRECRAWL_KEY,
      concurrencyLimit: Number(process.env.FIRECRAWL_CONCURRENCY_LIMIT ?? '2'),
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY ?? '',
      model: process.env.OPENAI_MODEL ?? 'gpt-4',
    },
  });
}

// Export a singleton instance of the configuration
export const config = loadConfig(); 