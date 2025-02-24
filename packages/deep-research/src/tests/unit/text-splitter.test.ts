import { describe, it, expect, beforeEach } from 'vitest';
import { RecursiveCharacterTextSplitter } from '../../ai/text-splitter';

describe('RecursiveCharacterTextSplitter', () => {
  let splitter: RecursiveCharacterTextSplitter;

  beforeEach(() => {
    splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 50,
      chunkOverlap: 10,
    });
  });

  it('should correctly split text by separators', () => {
    const text = 'Hello world, this is a test of the recursive text splitter.';

    // Test with initial chunkSize
    expect(splitter.splitText(text)).toEqual([
      'Hello world',
      'this is a test of the recursive text splitter'
    ]);

    // Test with updated chunkSize
    splitter.chunkSize = 100;
    expect(
      splitter.splitText(
        'Hello world, this is a test of the recursive text splitter. If I have a period, it should split along the period.'
      )
    ).toEqual([
      'Hello world, this is a test of the recursive text splitter',
      'If I have a period, it should split along the period.'
    ]);

    // Test with another updated chunkSize
    splitter.chunkSize = 110;
    expect(
      splitter.splitText(
        'Hello world, this is a test of the recursive text splitter. If I have a period, it should split along the period.\nOr, if there is a new line, it should prioritize splitting on new lines instead.'
      )
    ).toEqual([
      'Hello world, this is a test of the recursive text splitter',
      'If I have a period, it should split along the period.',
      'Or, if there is a new line, it should prioritize splitting on new lines instead.'
    ]);
  });

  it('should handle empty string', () => {
    expect(splitter.splitText('')).toEqual([]);
  });

  it('should handle special characters and large texts', () => {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 0,
      separators: [' ']
    });

    // Create a text of 1000 'A' characters with spaces every 10 characters
    const largeText = Array(100).fill('AAAAAAAAAA').join(' ');
    const chunks = splitter.splitText(largeText);

    // Verify that all chunks except possibly the last one are at most chunkSize
    for (let i = 0; i < chunks.length; i++) {
      expect(chunks[i]!.length).toBeLessThanOrEqual(200);
      // Verify each chunk only contains 'A' and space characters
      expect(chunks[i]!.match(/^[A ]+$/)).toBeTruthy();
    }

    // Verify we have a reasonable number of chunks
    // With a 200 character chunk size and ~1100 character input,
    // we expect at least 5 chunks
    expect(chunks.length).toBeGreaterThanOrEqual(5);

    // Test handling of special characters
    const specialCharText = 'Hello!@# world$%^ &*( this) is+ a-test';
    const specialChunks = splitter.splitText(specialCharText);
    expect(specialChunks.length).toBeGreaterThan(0);
    expect(specialChunks.join(' ')).toBe(specialCharText);
  });

  it('should handle chunkSize equal to chunkOverlap', () => {
    splitter.chunkSize = 50;
    splitter.chunkOverlap = 50;
    expect(() => splitter.splitText('Invalid configuration')).toThrow(
      'Cannot have chunkOverlap >= chunkSize'
    );
  });
}); 