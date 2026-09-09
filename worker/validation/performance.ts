import { extractYouTubeVideoId, isValidYouTubeVideoId } from '../utils/youtube.js';
import { PERFORMANCE_TYPES, type PerformanceInput, type PerformanceType } from '../types/performance.js';

function isValidDateOnly(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: PerformanceInput;
}

export function validatePerformanceInput(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Invalid input. Expected a JSON object.' }]
    };
  }

  const obj = input as Record<string, unknown>;
  const errors: ValidationError[] = [];

  const performanceDate = validateRequiredString(obj.performanceDate, 'Performance date');
  if (!performanceDate) {
    errors.push({ field: 'performanceDate', message: 'Performance date is required.' });
  } else if (!isValidDateOnly(performanceDate)) {
    errors.push({ field: 'performanceDate', message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  const song = validateRequiredString(obj.song, 'Song title');
  if (!song) {
    errors.push({ field: 'song', message: 'Song title is required.' });
  } else if (song.length > 200) {
    errors.push({ field: 'song', message: 'Song title must be 200 characters or less.' });
  }

  const artist = validateOptionalString(obj.artist, 'Artist');
  if (artist && artist.length > 200) {
    errors.push({ field: 'artist', message: 'Artist must be 200 characters or less.' });
  }

  const youtubeUrl = validateRequiredString(obj.youtubeUrl, 'YouTube URL');
  let youtubeVideoId: string | null = null;
  if (!youtubeUrl) {
    errors.push({ field: 'youtubeUrl', message: 'YouTube URL is required.' });
  } else {
    youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
    if (!youtubeVideoId || !isValidYouTubeVideoId(youtubeVideoId)) {
      errors.push({ field: 'youtubeUrl', message: 'Invalid YouTube URL.' });
    }
  }

  const instrument = validateOptionalString(obj.instrument, 'Instrument');
  if (instrument && instrument.length > 100) {
    errors.push({ field: 'instrument', message: 'Instrument must be 100 characters or less.' });
  }

  const performanceType = validateOptionalString(obj.performanceType, 'Performance type');
  if (performanceType && !PERFORMANCE_TYPES.includes(performanceType as PerformanceType)) {
    errors.push({ field: 'performanceType', message: 'Invalid performance type.' });
  }

  const location = validateOptionalString(obj.location, 'Location');
  if (location && location.length > 200) {
    errors.push({ field: 'location', message: 'Location must be 200 characters or less.' });
  }

  const notes = validateOptionalString(obj.notes, 'Notes');
  if (notes && notes.length > 5000) {
    errors.push({ field: 'notes', message: 'Notes must be 5000 characters or less.' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      performanceDate: performanceDate!,
      song: song!,
      artist: artist ?? null,
      youtubeVideoId: youtubeVideoId!,
      instrument: instrument ?? null,
      performanceType: performanceType ?? null,
      location: location ?? null,
      notes: notes ?? null
    }
  };
}

function validateRequiredString(value: unknown, _fieldName: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function validateOptionalString(value: unknown, _fieldName: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}