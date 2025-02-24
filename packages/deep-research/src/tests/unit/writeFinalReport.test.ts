import { describe, it, expect, vi } from 'vitest';
import { generateObject } from 'ai';
import { writeFinalReport } from '../../deep-research';
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
  trimPrompt: vi.fn((text) => text)
}));

describe('writeFinalReport', () => {
  it('should generate a final report with learnings and sources', async () => {
    const mockReport = {
      reportMarkdown: '# Research Report\n\nFindings...'
    };

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: mockReport
    } as any);

    const result = await writeFinalReport({
      prompt: 'test topic',
      learnings: ['learning 1', 'learning 2'],
      visitedUrls: ['https://example.com/1', 'https://example.com/2']
    });

    expect(result).toContain(mockReport.reportMarkdown);
    expect(result).toContain('## Sources');
    expect(result).toContain('https://example.com/1');
    expect(result).toContain('https://example.com/2');
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: o3MiniModel,
        prompt: expect.stringContaining('test topic')
      })
    );
  });

  it('should handle empty learnings and URLs gracefully', async () => {
    const mockReport = {
      reportMarkdown: '# Empty Report'
    };

    vi.mocked(generateObject).mockResolvedValueOnce({
      object: mockReport
    } as any);

    const result = await writeFinalReport({
      prompt: 'test topic',
      learnings: [],
      visitedUrls: []
    });

    expect(result).toContain(mockReport.reportMarkdown);
    expect(result).toContain('## Sources');
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: o3MiniModel,
        prompt: expect.stringContaining('test topic')
      })
    );
  });
}); 