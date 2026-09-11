import { describe, it, expect } from 'vitest';
import { extractYouTubeVideoId, isValidYouTubeVideoId, getThumbnailUrl, getEmbedUrl, getWatchUrl } from '../src/lib/youtube.js';

describe('YouTube URL parsing', () => {
  describe('extractYouTubeVideoId', () => {
    it('extracts video ID from standard youtube.com/watch?v= URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=abc123XYZ01')).toBe('abc123XYZ01');
    });

    it('extracts video ID from youtube.com/watch?v= URL without www', () => {
      expect(extractYouTubeVideoId('https://youtube.com/watch?v=abc123XYZ01')).toBe('abc123XYZ01');
    });

    it('extracts video ID from youtu.be URL', () => {
      expect(extractYouTubeVideoId('https://youtu.be/abc123XYZ01')).toBe('abc123XYZ01');
    });

    it('extracts video ID from youtube.com/shorts/ URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/shorts/abc123XYZ01')).toBe('abc123XYZ01');
    });

    it('extracts video ID from youtube.com/embed/ URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/abc123XYZ01')).toBe('abc123XYZ01');
    });

    it('extracts video ID from URL with extra query parameters', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=abc123XYZ01&t=30s&list=PLxxx')).toBe('abc123XYZ01');
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?feature=shared&v=abc123XYZ01')).toBe('abc123XYZ01');
    });

    it('returns null for blank input', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId('   ')).toBeNull();
    });

    it('returns null for malformed URL', () => {
      expect(extractYouTubeVideoId('not a url')).toBeNull();
    });

    it('returns null for random website', () => {
      expect(extractYouTubeVideoId('https://example.com/video')).toBeNull();
    });

    it('returns null for malformed video ID', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=short')).toBeNull();
    });
  });

  describe('isValidYouTubeVideoId', () => {
    it('returns true for valid 11-character ID', () => {
      expect(isValidYouTubeVideoId('abc123XYZ01')).toBe(true);
    });

    it('returns true for ID with hyphens and underscores', () => {
      expect(isValidYouTubeVideoId('abc-123_XYZ')).toBe(true);
    });

    it('returns false for ID shorter than 11 characters', () => {
      expect(isValidYouTubeVideoId('abc123')).toBe(false);
    });

    it('returns false for ID longer than 11 characters', () => {
      expect(isValidYouTubeVideoId('abc123XYZ012')).toBe(false);
    });

    it('returns false for ID with invalid characters', () => {
      expect(isValidYouTubeVideoId('abc@123XYZ!')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidYouTubeVideoId('')).toBe(false);
    });
  });

  describe('getThumbnailUrl', () => {
    it('returns maxres thumbnail URL', () => {
      expect(getThumbnailUrl('abc123XYZ01', 'maxres')).toBe('https://img.youtube.com/vi/abc123XYZ01/maxresdefault.jpg');
    });

    it('returns hq thumbnail URL by default', () => {
      expect(getThumbnailUrl('abc123XYZ01')).toBe('https://img.youtube.com/vi/abc123XYZ01/hqdefault.jpg');
    });

    it('returns mq thumbnail URL', () => {
      expect(getThumbnailUrl('abc123XYZ01', 'mq')).toBe('https://img.youtube.com/vi/abc123XYZ01/mqdefault.jpg');
    });

    it('returns default thumbnail URL', () => {
      expect(getThumbnailUrl('abc123XYZ01', 'default')).toBe('https://img.youtube.com/vi/abc123XYZ01/default.jpg');
    });

    it('adds an encoded cache key when provided', () => {
      expect(getThumbnailUrl('abc123XYZ01', 'hq', 'page load 1'))
        .toBe('https://img.youtube.com/vi/abc123XYZ01/hqdefault.jpg?refresh=page%20load%201');
    });
  });

  describe('getEmbedUrl', () => {
    it('returns correct embed URL', () => {
      expect(getEmbedUrl('abc123XYZ01')).toBe('https://www.youtube.com/embed/abc123XYZ01');
      expect(getEmbedUrl('abc123XYZ01', 'https://guitar.example.com'))
        .toBe('https://www.youtube.com/embed/abc123XYZ01?origin=https%3A%2F%2Fguitar.example.com');
    });
  });

  describe('getWatchUrl', () => {
    it('returns correct watch URL', () => {
      expect(getWatchUrl('abc123XYZ01')).toBe('https://www.youtube.com/watch?v=abc123XYZ01');
    });
  });
});
