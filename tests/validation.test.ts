import { describe, it, expect } from 'vitest';
import { validatePerformanceInput, validatePerformanceUpdateInput } from '../worker/validation/performance.js';

describe('Performance validation', () => {
  const validInput = {
    performanceDate: '2026-09-04',
    song: 'Hotel California',
    artist: 'Eagles',
    youtubeUrl: 'https://www.youtube.com/watch?v=abc123XYZ01',
    instrument: 'Electric Guitar',
    performanceType: 'Practice',
    location: 'Home',
    notes: 'Great practice session'
  };

  it('validates correct input successfully', () => {
    const result = validatePerformanceInput(validInput);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBeDefined();
    expect(result.data?.song).toBe('Hotel California');
    expect(result.data?.youtubeVideoId).toBe('abc123XYZ01');
  });

  it('rejects missing performance date', () => {
    const input = { ...validInput, performanceDate: undefined };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'performanceDate')).toBe(true);
  });

  it('rejects empty performance date', () => {
    const input = { ...validInput, performanceDate: '' };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'performanceDate')).toBe(true);
  });

  it('rejects invalid date format', () => {
    const input = { ...validInput, performanceDate: '09/04/2026' };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'performanceDate')).toBe(true);
  });

  it('rejects non-existent calendar dates', () => {
    const invalidDates = ['2026-02-30', '2026-13-01', '2026-00-10', '2025-04-31'];

    for (const performanceDate of invalidDates) {
      const input = { ...validInput, performanceDate };
      const result = validatePerformanceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'performanceDate')).toBe(true);
    }
  });

  it('accepts valid leap-year calendar dates', () => {
    const input = { ...validInput, performanceDate: '2024-02-29' };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(true);
    expect(result.data?.performanceDate).toBe('2024-02-29');
  });

  it('rejects missing song title', () => {
    const input = { ...validInput, song: undefined };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'song')).toBe(true);
  });

  it('rejects whitespace-only song title', () => {
    const input = { ...validInput, song: '   ' };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'song')).toBe(true);
  });

  it('rejects song title too long', () => {
    const input = { ...validInput, song: 'a'.repeat(201) };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'song')).toBe(true);
  });

  it('accepts song title at max length', () => {
    const input = { ...validInput, song: 'a'.repeat(200) };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid YouTube URL', () => {
    const input = { ...validInput, youtubeUrl: 'https://example.com/video' };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'youtubeUrl')).toBe(true);
  });

  it('rejects missing YouTube URL', () => {
    const input = { ...validInput, youtubeUrl: undefined };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'youtubeUrl')).toBe(true);
  });

  it('accepts valid YouTube URL formats', () => {
    const urls = [
      'https://www.youtube.com/watch?v=abc123XYZ01',
      'https://youtube.com/watch?v=abc123XYZ01',
      'https://youtu.be/abc123XYZ01',
      'https://www.youtube.com/shorts/abc123XYZ01',
      'https://www.youtube.com/watch?v=abc123XYZ01&t=30s'
    ];

    for (const url of urls) {
      const input = { ...validInput, youtubeUrl: url };
      const result = validatePerformanceInput(input);
      expect(result.valid).toBe(true);
      expect(result.data?.youtubeVideoId).toBe('abc123XYZ01');
    }
  });

  it('rejects artist too long', () => {
    const input = { ...validInput, artist: 'a'.repeat(201) };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'artist')).toBe(true);
  });

  it('accepts optional artist', () => {
    const input = { ...validInput, artist: undefined };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(true);
    expect(result.data?.artist).toBeNull();
  });

  it('rejects instrument too long', () => {
    const input = { ...validInput, instrument: 'a'.repeat(101) };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'instrument')).toBe(true);
  });

  it('rejects invalid performance type', () => {
    const input = { ...validInput, performanceType: 'Invalid Type' };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'performanceType')).toBe(true);
  });

  it('accepts valid performance types', () => {
    const types = ['Practice', 'Lesson', 'Recital', 'Concert', 'School Performance', 'Recording', 'Other'];
    
    for (const type of types) {
      const input = { ...validInput, performanceType: type };
      const result = validatePerformanceInput(input);
      expect(result.valid).toBe(true);
    }
  });

  it('accepts optional performance type', () => {
    const input = { ...validInput, performanceType: undefined };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(true);
    expect(result.data?.performanceType).toBeNull();
  });

  it('rejects location too long', () => {
    const input = { ...validInput, location: 'a'.repeat(201) };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'location')).toBe(true);
  });

  it('rejects notes too long', () => {
    const input = { ...validInput, notes: 'a'.repeat(5001) };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'notes')).toBe(true);
  });

  it('trims whitespace from string fields', () => {
    const input = {
      ...validInput,
      song: '  Hotel California  ',
      artist: '  Eagles  ',
      instrument: '  Electric Guitar  '
    };
    const result = validatePerformanceInput(input);
    expect(result.valid).toBe(true);
    expect(result.data?.song).toBe('Hotel California');
    expect(result.data?.artist).toBe('Eagles');
    expect(result.data?.instrument).toBe('Electric Guitar');
  });
});

describe('Partial update validation', () => {
  it('accepts a single-field partial update', () => {
    const result = validatePerformanceUpdateInput({ song: 'Updated Song' });
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({ song: 'Updated Song' });
  });

  it('accepts an empty partial update', () => {
    const result = validatePerformanceUpdateInput({});
    expect(result.valid).toBe(true);
    expect(result.data).toEqual({});
  });

  it('omits absent optional fields rather than nulling them', () => {
    const result = validatePerformanceUpdateInput({ song: 'Updated Song' });
    expect(result.valid).toBe(true);
    expect(result.data).not.toHaveProperty('artist');
    expect(result.data).not.toHaveProperty('instrument');
    expect(result.data).not.toHaveProperty('youtubeVideoId');
  });

  it('validates provided fields in a partial update', () => {
    const result = validatePerformanceUpdateInput({ song: 'a'.repeat(201) });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'song')).toBe(true);
  });

  it('rejects an invalid date in a partial update', () => {
    const result = validatePerformanceUpdateInput({ performanceDate: '2026-02-30' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'performanceDate')).toBe(true);
  });

  it('extracts the YouTube video ID when the URL is provided', () => {
    const result = validatePerformanceUpdateInput({ youtubeUrl: 'https://youtu.be/abc123XYZ01' });
    expect(result.valid).toBe(true);
    expect(result.data?.youtubeVideoId).toBe('abc123XYZ01');
  });

  it('rejects a non-object body', () => {
    const result = validatePerformanceUpdateInput(null);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'body')).toBe(true);
  });
});