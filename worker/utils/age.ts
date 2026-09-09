export interface Age {
  years: number;
  months: number;
}

export function calculateAge(birthDateString: string, performanceDateString: string): Age {
  const birthDate = parseDateOnly(birthDateString);
  const performanceDate = parseDateOnly(performanceDateString);

  if (!birthDate || !performanceDate) {
    return { years: 0, months: 0 };
  }

  let years = performanceDate.getFullYear() - birthDate.getFullYear();
  let months = performanceDate.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (performanceDate.getDate() < birthDate.getDate()) {
    months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  }

  return { years: Math.max(0, years), months: Math.max(0, months) };
}

export function formatAge(age: Age): string {
  const parts: string[] = [];
  if (age.years > 0) {
    parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`);
  }
  if (age.months > 0 || age.years === 0) {
    parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`);
  }
  if (parts.length === 0) {
    return '0 months';
  }
  return parts.join(', ');
}

export function parseDateOnly(dateString: string): Date | null {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = parseInt(match[1]!, 10);
  const month = parseInt(match[2]!, 10) - 1;
  const day = parseInt(match[3]!, 10);

  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}