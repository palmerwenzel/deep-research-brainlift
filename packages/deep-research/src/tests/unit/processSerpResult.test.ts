import { describe, it, expect, vi } from 'vitest';
import { generateObject } from 'ai';
import { processSerpResult } from '../../deep-research';
import { o3MiniModel } from '../../ai/providers';
import type { SearchResponse, FirecrawlDocument } from '@mendable/firecrawl-js';

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

describe('processSerpResult', () => {
  it('should process search results into learnings and follow-up questions', async () => {
    const mockResult: SearchResponse = {
      success: true,
      data: [
        {
          url: 'https://example.com/1',
          title: 'Test Result 1',
          markdown: 'Test content 1',
          actions: {} as FirecrawlDocument['actions']
        },
        {
          url: 'https://example.com/2',
          title: 'Test Result 2',
          markdown: 'Test content 2',
          actions: {} as FirecrawlDocument['actions']
        }
      ]
    };

    const mockProcessedResult = {
      learnings: ['learning 1', 'learning 2', 'learning 3'],
      followUpQuestions: ['question 1', 'question 2', 'question 3']
    };

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: mockProcessedResult
    } as any);

    const result = await processSerpResult({
      query: 'test query',
      result: mockResult,
      numLearnings: 3,
      numFollowUpQuestions: 3
    });

    expect(result.learnings).toEqual(mockProcessedResult.learnings);
    expect(result.followUpQuestions).toEqual(mockProcessedResult.followUpQuestions);
    expect(result.visitedUrls).toEqual(['https://example.com/1', 'https://example.com/2']);
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: o3MiniModel,
        prompt: expect.stringContaining('test query')
      })
    );
  });

  it('should handle empty search results', async () => {
    const mockResult: SearchResponse = {
      success: true,
      data: []
    };

    await expect(processSerpResult({
      query: 'test query',
      result: mockResult
    })).rejects.toThrow('No valid content found in search results');
  });

  it('should respect numLearnings and numFollowUpQuestions limits', async () => {
    const mockResult: SearchResponse = {
      success: true,
      data: [
        {
          url: 'https://example.com/1',
          title: 'Test Result 1',
          markdown: 'Test content 1',
          actions: {} as FirecrawlDocument['actions']
        }
      ]
    };

    const mockProcessedResult = {
      learnings: ['learning 1', 'learning 2', 'learning 3', 'learning 4'],
      followUpQuestions: ['question 1', 'question 2', 'question 3', 'question 4']
    };

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: mockProcessedResult
    } as any);

    const result = await processSerpResult({
      query: 'test query',
      result: mockResult,
      numLearnings: 2,
      numFollowUpQuestions: 2
    });

    expect(result.learnings).toHaveLength(2);
    expect(result.followUpQuestions).toHaveLength(2);
    expect(result.learnings).toEqual(['learning 1', 'learning 2']);
    expect(result.followUpQuestions).toEqual(['question 1', 'question 2']);
  });

  it('should handle invalid markdown content gracefully', async () => {
    const mockResult: SearchResponse = {
      success: true,
      data: [
        {
          url: 'https://example.com/1',
          title: 'Test Result 1',
          markdown: '',
          actions: {} as FirecrawlDocument['actions']
        },
        {
          url: 'https://example.com/2',
          title: 'Test Result 2',
          markdown: undefined,
          actions: {} as FirecrawlDocument['actions']
        }
      ]
    };

    await expect(processSerpResult({
      query: 'test query',
      result: mockResult
    })).rejects.toThrow('No valid content found in search results');
  });
}); 