import type { D1Database } from '@cloudflare/workers-types';
import type { Performance, PerformanceInput } from '../types/performance.js';
import { calculateAge } from '../utils/age.js';

export interface PerformanceRow {
  id: number;
  performance_date: string;
  song: string;
  artist: string | null;
  youtube_video_id: string;
  instrument: string | null;
  performance_type: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function rowToPerformance(row: PerformanceRow, birthDate: string): Performance {
  const age = calculateAge(birthDate, row.performance_date);
  return {
    id: row.id,
    performanceDate: row.performance_date,
    song: row.song,
    artist: row.artist,
    youtubeVideoId: row.youtube_video_id,
    instrument: row.instrument,
    performanceType: row.performance_type,
    location: row.location,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    age
  };
}

export async function getAllPerformances(db: D1Database, birthDate: string): Promise<Performance[]> {
  const { results } = await db.prepare(
    'SELECT * FROM performances ORDER BY performance_date DESC'
  ).all<PerformanceRow>();

  return (results || []).map(row => rowToPerformance(row, birthDate));
}

export async function getPerformanceById(db: D1Database, id: number, birthDate: string): Promise<Performance | null> {
  const row = await db.prepare(
    'SELECT * FROM performances WHERE id = ?'
  ).bind(id).first<PerformanceRow>();

  if (!row) {
    return null;
  }

  return rowToPerformance(row, birthDate);
}

export async function createPerformance(
  db: D1Database,
  input: PerformanceInput,
  birthDate: string
): Promise<Performance> {
  const now = new Date().toISOString();
  const { results } = await db.prepare(
    `INSERT INTO performances (performance_date, song, artist, youtube_video_id, instrument, performance_type, location, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(
    input.performanceDate,
    input.song,
    input.artist ?? null,
    input.youtubeVideoId,
    input.instrument ?? null,
    input.performanceType ?? null,
    input.location ?? null,
    input.notes ?? null,
    now,
    now
  ).all<PerformanceRow>();

  const row = results?.[0];
  if (!row) {
    throw new Error('Failed to create performance');
  }

  return rowToPerformance(row, birthDate);
}

export async function updatePerformance(
  db: D1Database,
  id: number,
  input: Partial<PerformanceInput>,
  birthDate: string
): Promise<Performance | null> {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.performanceDate !== undefined) {
    fields.push('performance_date = ?');
    values.push(input.performanceDate);
  }
  if (input.song !== undefined) {
    fields.push('song = ?');
    values.push(input.song);
  }
  if (input.artist !== undefined) {
    fields.push('artist = ?');
    values.push(input.artist);
  }
  if (input.youtubeVideoId !== undefined) {
    fields.push('youtube_video_id = ?');
    values.push(input.youtubeVideoId);
  }
  if (input.instrument !== undefined) {
    fields.push('instrument = ?');
    values.push(input.instrument);
  }
  if (input.performanceType !== undefined) {
    fields.push('performance_type = ?');
    values.push(input.performanceType);
  }
  if (input.location !== undefined) {
    fields.push('location = ?');
    values.push(input.location);
  }
  if (input.notes !== undefined) {
    fields.push('notes = ?');
    values.push(input.notes);
  }

  if (fields.length === 0) {
    return getPerformanceById(db, id, birthDate);
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  const { results } = await db.prepare(
    `UPDATE performances SET ${fields.join(', ')} WHERE id = ? RETURNING *`
  ).bind(...values).all<PerformanceRow>();

  const row = results?.[0];
  if (!row) {
    return null;
  }

  return rowToPerformance(row, birthDate);
}

export async function deletePerformance(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare(
    'DELETE FROM performances WHERE id = ?'
  ).bind(id).run();

  return (result.meta.changes ?? 0) > 0;
}