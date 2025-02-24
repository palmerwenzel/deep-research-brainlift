import { vi } from 'vitest';

// Mock the ai package
vi.mock('ai', () => ({
  generateObject: vi.fn()
}));

// Mock the OutputManager
vi.mock('../../output-manager', () => ({
  OutputManager: vi.fn().mockImplementation(() => ({
    log: vi.fn()
  }))
}));

// Mock the ai providers
vi.mock('../../ai/providers', () => ({
  o3MiniModel: {
    id: 'gpt-4',
    name: 'GPT-4',
    maxTokens: 8000
  },
  trimPrompt: vi.fn((text) => text)
}));

// Mock Firecrawl
vi.mock('@mendable/firecrawl-js', () => ({
  default: vi.fn().mockImplementation(() => ({
    apiKey: 'test-key',
    apiUrl: 'http://localhost:3002',
    isCloudService: false,
    scrapeUrl: 'http://localhost:3002/scrape',
    search: vi.fn().mockResolvedValue({
      success: true,
      data: [
        {
          url: 'https://example.com/1',
          title: 'Test Result 1',
          markdown: 'Test content 1',
          actions: {}
        },
        {
          url: 'https://example.com/2',
          title: 'Test Result 2',
          markdown: 'Test content 2',
          actions: {}
        }
      ]
    }),
    scrape: vi.fn(),
    scrapeMultiple: vi.fn(),
    scrapeWithOptions: vi.fn(),
    scrapeWithOptionsMultiple: vi.fn(),
    scrapeWithOptionsStream: vi.fn(),
    scrapeStream: vi.fn(),
    scrapeMultipleStream: vi.fn(),
    scrapeWithOptionsMultipleStream: vi.fn(),
    searchWithOptions: vi.fn(),
    searchStream: vi.fn(),
    searchWithOptionsStream: vi.fn(),
    searchMultiple: vi.fn(),
    searchMultipleStream: vi.fn(),
    searchWithOptionsMultiple: vi.fn(),
    searchWithOptionsMultipleStream: vi.fn(),
    getJobStatus: vi.fn(),
    getJobResult: vi.fn(),
    waitForJob: vi.fn(),
    waitForJobs: vi.fn(),
    cancelJob: vi.fn(),
    cancelJobs: vi.fn(),
    getJobResults: vi.fn(),
    getJobStatuses: vi.fn(),
    getJobsInQueue: vi.fn(),
    getQueueStatus: vi.fn(),
    getQueueStatuses: vi.fn(),
    clearQueue: vi.fn(),
    clearQueues: vi.fn()
  }))
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { generateObject } from 'ai';
import { deepResearch } from '../../deep-research';
import { o3MiniModel } from '../../ai/providers';
import FirecrawlApp from '@mendable/firecrawl-js';

describe('Deep Research Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deepResearch', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should perform recursive research with progress updates', async () => {
      const mockQueries = [
        {
          query: 'test query 1',
          researchGoal: 'research goal 1'
        }
      ];

      const mockProcessedResult = {
        learnings: ['learning 1'],
        followUpQuestions: ['follow up 1'],
        visitedUrls: ['https://example.com/1']
      };

      vi.mocked(generateObject)
        .mockResolvedValueOnce({
          object: { queries: mockQueries }
        } as any)
        .mockResolvedValueOnce({
          object: mockProcessedResult
        } as any);

      const onProgress = vi.fn();

      const result = await deepResearch({
        query: 'test topic',
        breadth: 1,
        depth: 1,
        onProgress
      });

      expect(result.learnings).toContain('learning 1');
      expect(result.visitedUrls).toContain('https://example.com/1');
      expect(onProgress).toHaveBeenCalled();
    });

    it('should handle search errors gracefully', async () => {
      const mockQueries = [
        {
          query: 'test query 1',
          researchGoal: 'research goal 1'
        }
      ];

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: { queries: mockQueries }
      } as any);

      vi.mocked(FirecrawlApp).mockImplementationOnce(() => ({
        search: vi.fn().mockRejectedValue(new Error('Search failed'))
      }) as unknown as FirecrawlApp);

      const result = await deepResearch({
        query: 'test topic',
        breadth: 1,
        depth: 1
      });

      expect(result.learnings).toHaveLength(0);
      expect(result.visitedUrls).toHaveLength(0);
    });

    it('should respect breadth and depth parameters', async () => {
      const mockQueries = [
        {
          query: 'test query 1',
          researchGoal: 'research goal 1'
        },
        {
          query: 'test query 2',
          researchGoal: 'research goal 2'
        }
      ];

      const mockProcessedResult1 = {
        learnings: ['learning 1'],
        followUpQuestions: ['follow up 1'],
        visitedUrls: ['https://example.com/1']
      };

      const mockProcessedResult2 = {
        learnings: ['learning 2'],
        followUpQuestions: ['follow up 2'],
        visitedUrls: ['https://example.com/2']
      };

      vi.mocked(generateObject)
        .mockResolvedValueOnce({
          object: { queries: mockQueries }
        } as any)
        .mockResolvedValueOnce({
          object: mockProcessedResult1
        } as any)
        .mockResolvedValueOnce({
          object: mockProcessedResult2
        } as any);

      const result = await deepResearch({
        query: 'test topic',
        breadth: 2,
        depth: 1
      });

      expect(result.learnings).toEqual(['learning 1', 'learning 2']);
      expect(result.visitedUrls).toEqual(['https://example.com/1', 'https://example.com/2']);
    });
  });
}); 