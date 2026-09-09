import { extractYouTubeVideoId, isValidYouTubeVideoId } from '../utils/youtube.js';
import { parseDateOnly } from '../utils/age.js';
import { PERFORMANCE_TYPES, type PerformanceInput, type PerformanceType } from '../types/performance.js';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: PerformanceInput;
}

export interface UpdateValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: Partial<PerformanceInput>;
}

interface NormalizedFields {
  performanceDate?: string;
  song?: string;
  artist?: string | null;
  youtubeVideoId?: string;
  instrument?: string | null;
  performanceType?: string | null;
  location?: string | null;
  notes?: string | null;
}

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

function isValidDateOnly(dateString: string): boolean {
  return parseDateOnly(dateString) !== null;
}

function requiredString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

type OptionalStringResult =
  | { valid: true; value: string | null }
  | { valid: false };

function optionalString(value: unknown): OptionalStringResult {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }
  if (typeof value !== 'string') {
    return { valid: false };
  }
  const trimmed = value.trim();
  return { valid: true, value: trimmed === '' ? null : trimmed };
}

function validateCommonFields(
  obj: Record<string, unknown>,
  partial: boolean
): { errors: ValidationError[]; data: NormalizedFields } {
  const errors: ValidationError[] = [];
  const data: NormalizedFields = {};

  if (partial && obj.performanceDate === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const performanceDate = requiredString(obj.performanceDate);
    if (performanceDate === null) {
      errors.push({ field: 'performanceDate', message: 'Performance date is required.' });
    } else if (!isValidDateOnly(performanceDate)) {
      errors.push({ field: 'performanceDate', message: 'Invalid date. Use a valid YYYY-MM-DD calendar date.' });
    } else {
      data.performanceDate = performanceDate;
    }
  }

  if (partial && obj.song === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const song = requiredString(obj.song);
    if (song === null) {
      errors.push({ field: 'song', message: 'Song title is required.' });
    } else if (song.length > 200) {
      errors.push({ field: 'song', message: 'Song title must be 200 characters or less.' });
    } else {
      data.song = song;
    }
  }

  if (partial && obj.artist === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const result = optionalString(obj.artist);
    if (!result.valid) {
      errors.push({ field: 'artist', message: 'Artist must be a string or null.' });
    } else if (result.value !== null && result.value.length > 200) {
      errors.push({ field: 'artist', message: 'Artist must be 200 characters or less.' });
    } else {
      data.artist = result.value;
    }
  }

  if (partial && obj.youtubeUrl === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const youtubeUrl = requiredString(obj.youtubeUrl);
    if (youtubeUrl === null) {
      errors.push({ field: 'youtubeUrl', message: 'YouTube URL is required.' });
    } else {
      const youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
      if (!youtubeVideoId || !isValidYouTubeVideoId(youtubeVideoId)) {
        errors.push({ field: 'youtubeUrl', message: 'Invalid YouTube URL.' });
      } else {
        data.youtubeVideoId = youtubeVideoId;
      }
    }
  }

  if (partial && obj.instrument === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const result = optionalString(obj.instrument);
    if (!result.valid) {
      errors.push({ field: 'instrument', message: 'Instrument must be a string or null.' });
    } else if (result.value !== null && result.value.length > 100) {
      errors.push({ field: 'instrument', message: 'Instrument must be 100 characters or less.' });
    } else {
      data.instrument = result.value;
    }
  }

  if (partial && obj.performanceType === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const result = optionalString(obj.performanceType);
    if (!result.valid) {
      errors.push({ field: 'performanceType', message: 'Performance type must be a string or null.' });
    } else if (result.value !== null && !PERFORMANCE_TYPES.includes(result.value as PerformanceType)) {
      errors.push({ field: 'performanceType', message: 'Invalid performance type.' });
    } else {
      data.performanceType = result.value;
    }
  }

  if (partial && obj.location === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const result = optionalString(obj.location);
    if (!result.valid) {
      errors.push({ field: 'location', message: 'Location must be a string or null.' });
    } else if (result.value !== null && result.value.length > 200) {
      errors.push({ field: 'location', message: 'Location must be 200 characters or less.' });
    } else {
      data.location = result.value;
    }
  }

  if (partial && obj.notes === undefined) {
    // Field omitted from a partial update; leave unchanged.
  } else {
    const result = optionalString(obj.notes);
    if (!result.valid) {
      errors.push({ field: 'notes', message: 'Notes must be a string or null.' });
    } else if (result.value !== null && result.value.length > 5000) {
      errors.push({ field: 'notes', message: 'Notes must be 5000 characters or less.' });
    } else {
      data.notes = result.value;
    }
  }

  return { errors, data };
}

export function validatePerformanceInput(input: unknown): ValidationResult {
  if (!isObject(input)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Invalid input. Expected a JSON object.' }]
    };
  }

  const { errors, data } = validateCommonFields(input, false);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: data as PerformanceInput
  };
}

export function validatePerformanceUpdateInput(input: unknown): UpdateValidationResult {
  if (!isObject(input)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Invalid input. Expected a JSON object.' }]
    };
  }

  const { errors, data } = validateCommonFields(input, true);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data
  };
}
