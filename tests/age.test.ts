import { describe, it, expect } from 'vitest';
import { calculateAge, formatAge } from '../worker/utils/age';

describe('Age calculation', () => {
  describe('calculateAge', () => {
    it('calculates age correctly when birthday has passed this year', () => {
      const result = calculateAge('2015-01-01', '2026-06-15');
      expect(result).toEqual({ years: 11, months: 5 });
    });

    it('calculates age correctly when birthday has not happened yet this year', () => {
      const result = calculateAge('2015-06-15', '2026-01-01');
      expect(result).toEqual({ years: 10, months: 6 });
    });

    it('calculates age correctly on exact birthday', () => {
      const result = calculateAge('2015-06-15', '2026-06-15');
      expect(result).toEqual({ years: 11, months: 0 });
    });

    it('calculates age correctly day before birthday', () => {
      const result = calculateAge('2015-06-15', '2026-06-14');
      expect(result).toEqual({ years: 10, months: 11 });
    });

    it('calculates age correctly day after birthday', () => {
      const result = calculateAge('2015-06-15', '2026-06-16');
      expect(result).toEqual({ years: 11, months: 0 });
    });

    it('handles month rollover correctly', () => {
      const result = calculateAge('2015-12-01', '2026-01-15');
      expect(result).toEqual({ years: 10, months: 1 });
    });

    it('handles year rollover correctly', () => {
      const result = calculateAge('2015-12-31', '2026-01-01');
      expect(result).toEqual({ years: 10, months: 0 });
    });

    it('handles leap year birthdays (Feb 29)', () => {
      const result = calculateAge('2016-02-29', '2026-02-28');
      expect(result).toEqual({ years: 9, months: 11 });
    });

    it('handles leap year birthdays on Feb 29 in leap year', () => {
      const result = calculateAge('2016-02-29', '2024-02-29');
      expect(result).toEqual({ years: 8, months: 0 });
    });

    it('handles leap year birthdays on Mar 1 in non-leap year', () => {
      const result = calculateAge('2016-02-29', '2025-03-01');
      expect(result).toEqual({ years: 9, months: 0 });
    });

    it('returns 0 years 0 months for invalid birth date', () => {
      const result = calculateAge('invalid', '2026-01-01');
      expect(result).toEqual({ years: 0, months: 0 });
    });

    it('returns 0 years 0 months for invalid performance date', () => {
      const result = calculateAge('2015-01-01', 'invalid');
      expect(result).toEqual({ years: 0, months: 0 });
    });

    it('handles same month different days correctly', () => {
      const result = calculateAge('2015-06-10', '2026-06-05');
      expect(result).toEqual({ years: 10, months: 11 });
    });

    it('handles same month different days correctly (after birthday)', () => {
      const result = calculateAge('2015-06-10', '2026-06-15');
      expect(result).toEqual({ years: 11, months: 0 });
    });
  });

  describe('formatAge', () => {
    it('formats years and months', () => {
      expect(formatAge({ years: 12, months: 2 })).toBe('12 years, 2 months');
    });

    it('formats singular year', () => {
      expect(formatAge({ years: 1, months: 0 })).toBe('1 year');
    });

    it('formats singular month', () => {
      expect(formatAge({ years: 0, months: 1 })).toBe('1 month');
    });

    it('formats only months when years is 0', () => {
      expect(formatAge({ years: 0, months: 6 })).toBe('6 months');
    });

    it('formats only years when months is 0', () => {
      expect(formatAge({ years: 5, months: 0 })).toBe('5 years');
    });

    it('handles 0 years 0 months', () => {
      expect(formatAge({ years: 0, months: 0 })).toBe('0 months');
    });
  });
});