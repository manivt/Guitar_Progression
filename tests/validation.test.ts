import { describe, it, expect } from 'vitest';
import { validatePerformanceInput } from '../worker/validation/performance.js';

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