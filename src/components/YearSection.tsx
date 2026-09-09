import type { Performance } from '@shared/performance';
import { PerformanceGrid } from './PerformanceGrid';

interface YearSectionProps {
  year: number;
  performances: Performance[];
  onCardClick: (performance: Performance) => void;
}

export function YearSection({ year, performances, onCardClick }: YearSectionProps) {
  return (
    <section className="year-section" aria-labelledby={`year-${year}`}>
      <h2 id={`year-${year}`} className="year-heading">
        {year}
      </h2>
      <PerformanceGrid performances={performances} onCardClick={onCardClick} />
    </section>
  );
}