import { Performance } from '../../types/performance';
import { PerformanceGrid } from './PerformanceGrid';
import { getYear } from '../../lib/dates';

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