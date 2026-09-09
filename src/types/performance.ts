export interface Performance {
  id: number;
  performanceDate: string;
  song: string;
  artist: string | null;
  youtubeVideoId: string;
  instrument: string | null;
  performanceType: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  age: {
    years: number;
    months: number;
  };
}

export interface PerformanceInput {
  performanceDate: string;
  song: string;
  artist?: string;
  youtubeVideoId: string;
  instrument?: string;
  performanceType?: string;
  location?: string;
  notes?: string;
}

export type PerformanceType =
  | 'Practice'
  | 'Lesson'
  | 'Recital'
  | 'Concert'
  | 'School Performance'
  | 'Recording'
  | 'Other';

export const PERFORMANCE_TYPES: PerformanceType[] = [
  'Practice',
  'Lesson',
  'Recital',
  'Concert',
  'School Performance',
  'Recording',
  'Other'
];