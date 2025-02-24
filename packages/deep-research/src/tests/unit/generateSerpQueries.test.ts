import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateObject } from 'ai';
import { generateSerpQueries } from '../../deep-research';
import { o3MiniModel } from '../../ai/providers';

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
  trimPrompt: vi.fn()
}));

describe('generateSerpQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate the specified number of queries', async () => {
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

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        queries: mockQueries
      }
    } as any);

    const result = await generateSerpQueries({
      query: 'test topic',
      numQueries: 2
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual(mockQueries);
    expect(generateObject).toHaveBeenCalledTimes(1);
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: o3MiniModel,
        prompt: expect.stringContaining('test topic')
      })
    );
  });

  it('should handle previous learnings in query generation', async () => {
    const mockQueries = [
      {
        query: 'advanced query',
        researchGoal: 'deeper research goal'
      }
    ];

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        queries: mockQueries
      }
    } as any);

    const learnings = ['previous learning 1', 'previous learning 2'];
    const result = await generateSerpQueries({
      query: 'test topic',
      numQueries: 1,
      learnings
    });

    expect(result).toHaveLength(1);
    expect(result).toEqual(mockQueries);
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: o3MiniModel,
        prompt: expect.stringContaining('previous learning 1')
      })
    );
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(generateObject).mockRejectedValueOnce(new Error('AI API Error'));

    await expect(generateSerpQueries({
      query: 'test topic'
    })).rejects.toThrow('Failed to generate SERP queries');
  });

  it('should respect maximum query limit', async () => {
    const mockQueries = Array(5).fill({
      query: 'test query',
      researchGoal: 'test goal'
    });

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        queries: mockQueries
      }
    } as any);

    const result = await generateSerpQueries({
      query: 'test topic',
      numQueries: 3
    });

    expect(result).toHaveLength(3);
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: o3MiniModel,
        prompt: expect.stringContaining('maximum of 3 queries')
      })
    );
  });
}); 