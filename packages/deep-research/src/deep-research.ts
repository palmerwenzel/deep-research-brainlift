import FirecrawlApp, { SearchResponse } from '@mendable/firecrawl-js';
import { generateObject } from 'ai';
import { compact } from 'lodash-es';
import pLimit from 'p-limit';
import { z } from 'zod';

import { o3MiniModel, trimPrompt } from './ai/providers';
import { config } from './config';
import { systemPrompt } from './prompt';
import { OutputManager } from './output-manager';

// Initialize output manager for coordinated console/progress output
const output = new OutputManager();

// Replace console.log with output.log
function log(...args: any[]) {
  output.log(...args);
}

export type ResearchProgress = {
  currentDepth: number;
  totalDepth: number;
  currentBreadth: number;
  totalBreadth: number;
  currentQuery?: string;
  totalQueries: number;
  completedQueries: number;
};

export type ResearchResult = {
  learnings: string[];
  visitedUrls: string[];
};

// increase this if you have higher API rate limits
const ConcurrencyLimit = config.firecrawl.concurrencyLimit;

// Initialize Firecrawl with configuration
let firecrawl: FirecrawlApp;

function initializeFirecrawl() {
  if (!firecrawl) {
    if (!config.firecrawl.baseUrl) {
      throw new FirecrawlError('Firecrawl base URL is not configured');
    }
    
    firecrawl = new FirecrawlApp({
      apiKey: config.firecrawl.apiKey,
      apiUrl: config.firecrawl.baseUrl,
    });
  }
  return firecrawl;
}

// Error types for better error handling
export class FirecrawlError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'FirecrawlError';
  }
}

export class ResearchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ResearchError';
  }
}

// take en user query, return a list of SERP queries
export async function generateSerpQueries({
  query,
  numQueries = 3,
  learnings,
}: {
  query: string;
  numQueries?: number;
  learnings?: string[];
}): Promise<Array<{ query: string; researchGoal: string }>> {
  try {
    const res = await generateObject({
      model: o3MiniModel,
      system: systemPrompt(),
      prompt: `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of ${numQueries} queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: <prompt>${query}</prompt>\n\n${
        learnings
          ? `Here are some learnings from previous research, use them to generate more specific queries: ${learnings.join(
              '\n',
            )}`
          : ''
      }`,
      schema: z.object({
        queries: z
          .array(
            z.object({
              query: z.string().describe('The SERP query'),
              researchGoal: z
                .string()
                .describe(
                  'First talk about the goal of the research that this query is meant to accomplish, then go deeper into how to advance the research once the results are found, mention additional research directions. Be as specific as possible, especially for additional research directions.',
                ),
            }),
          )
          .describe(`List of SERP queries, max of ${numQueries}`),
      }),
    });

    log(
      `Created ${res.object.queries.length} queries`,
      res.object.queries,
    );

    return res.object.queries.slice(0, numQueries);
  } catch (error) {
    throw new ResearchError('Failed to generate SERP queries', error);
  }
}

export interface ProcessedResult {
  learnings: string[];
  followUpQuestions: string[];
  visitedUrls: string[];
}

export async function processSerpResult({
  query,
  result,
  numLearnings = 3,
  numFollowUpQuestions = 3,
}: {
  query: string;
  result: SearchResponse;
  numLearnings?: number;
  numFollowUpQuestions?: number;
}): Promise<ProcessedResult> {
  try {
    const contents = compact(result.data.map(item => item.markdown)).map(
      content => trimPrompt(content),
    );

    if (contents.length === 0) {
      throw new ResearchError('No valid content found in search results');
    }

    const res = await generateObject({
      model: o3MiniModel,
      system: systemPrompt(),
      prompt: `Given the following search results for the query "${query}", extract exactly ${numLearnings} key learnings and generate exactly ${numFollowUpQuestions} follow-up questions:\n\n${contents.join(
        '\n---\n',
      )}`,
      schema: z.object({
        learnings: z
          .array(z.string())
          .describe(
            'Key learnings from the search results. Be specific and detailed.',
          ),
        followUpQuestions: z
          .array(z.string())
          .describe(
            'Follow-up questions to explore based on the learnings. Make these specific and targeted.',
          ),
      }),
    });

    // Post-process to ensure we don't exceed the limits
    return {
      learnings: res.object.learnings.slice(0, numLearnings),
      followUpQuestions: res.object.followUpQuestions.slice(0, numFollowUpQuestions),
      visitedUrls: compact(result.data.map(item => item.url)),
    };
  } catch (error) {
    if (error instanceof ResearchError) {
      throw error;
    }
    throw new ResearchError('Failed to process search results', error);
  }
}

export async function writeFinalReport({
  prompt,
  learnings,
  visitedUrls,
}: {
  prompt: string;
  learnings: string[];
  visitedUrls: string[];
}) {
  const learningsString = trimPrompt(
    learnings
      .map(learning => `<learning>\n${learning}\n</learning>`)
      .join('\n'),
    150_000,
  );

  const res = await generateObject({
    model: o3MiniModel,
    system: systemPrompt(),
    prompt: `Given the following prompt from the user, write a final report on the topic using the learnings from research. Make it as as detailed as possible, aim for 3 or more pages, include ALL the learnings from research:\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from previous research:\n\n<learnings>\n${learningsString}\n</learnings>`,
    schema: z.object({
      reportMarkdown: z
        .string()
        .describe('Final report on the topic in Markdown'),
    }),
  });

  // Append the visited URLs section to the report
  const urlsSection = `\n\n## Sources\n\n${visitedUrls.map(url => `- ${url}`).join('\n')}`;
  return res.object.reportMarkdown + urlsSection;
}

export async function deepResearch({
  query,
  breadth,
  depth,
  learnings = [],
  visitedUrls = [],
  onProgress,
  signal,
}: {
  query: string;
  breadth: number;
  depth: number;
  learnings?: string[];
  visitedUrls?: string[];
  onProgress?: (progress: ResearchProgress) => void;
  signal?: AbortSignal;
}): Promise<ResearchResult> {
  const progress: ResearchProgress = {
    currentDepth: depth,
    totalDepth: depth,
    currentBreadth: breadth,
    totalBreadth: breadth,
    totalQueries: 0,
    completedQueries: 0,
  };
  
  const reportProgress = (update: Partial<ResearchProgress>) => {
    Object.assign(progress, update);
    onProgress?.(progress);
  };

  const serpQueries = await generateSerpQueries({
    query,
    learnings,
    numQueries: breadth,
  });
  
  reportProgress({
    totalQueries: serpQueries.length,
    currentQuery: serpQueries[0]?.query
  });
  
  const limit = pLimit(ConcurrencyLimit);

  const results = await Promise.all(
    serpQueries.map(serpQuery =>
      limit(async () => {
        try {
          const fc = initializeFirecrawl();
          const result = await fc.search(serpQuery.query, {
            timeout: 15000,
            limit: 5,
            scrapeOptions: { formats: ['markdown'] },
          });

          // Collect URLs from this search
          const newUrls = compact(result.data.map(item => item.url));
          const newBreadth = Math.ceil(breadth / 2);
          const newDepth = depth - 1;

          const newLearnings = await processSerpResult({
            query: serpQuery.query,
            result,
            numFollowUpQuestions: newBreadth,
          });
          const allLearnings = [...learnings, ...newLearnings.learnings];
          const allUrls = [...visitedUrls, ...newUrls];

          if (newDepth > 0) {
            log(
              `Researching deeper, breadth: ${newBreadth}, depth: ${newDepth}`,
            );

            reportProgress({
              currentDepth: newDepth,
              currentBreadth: newBreadth,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query,
            });

            const nextQuery = `
            Previous research goal: ${serpQuery.researchGoal}
            Follow-up research directions: ${newLearnings.followUpQuestions.map(q => `\n${q}`).join('')}
          `.trim();

            return deepResearch({
              query: nextQuery,
              breadth: newBreadth,
              depth: newDepth,
              learnings: allLearnings,
              visitedUrls: allUrls,
              onProgress,
              signal,
            });
          } else {
            reportProgress({
              currentDepth: 0,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query,
            });
            return {
              learnings: allLearnings,
              visitedUrls: allUrls,
            };
          }
        } catch (e: any) {
          if (e.message && e.message.includes('Timeout')) {
            log(
              `Timeout error running query: ${serpQuery.query}: `,
              e,
            );
          } else {
            log(`Error running query: ${serpQuery.query}: `, e);
          }
          return {
            learnings: [],
            visitedUrls: [],
          };
        }
      }),
    ),
  );

  return {
    learnings: [...new Set(results.flatMap(r => r.learnings))],
    visitedUrls: [...new Set(results.flatMap(r => r.visitedUrls))],
  };
}
