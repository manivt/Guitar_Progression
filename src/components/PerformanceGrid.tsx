import type { Performance } from '@shared/performance';
import { PerformanceCard } from './PerformanceCard';

interface PerformanceGridProps {
  performances: Performance[];
  onCardClick: (performance: Performance) => void;
}

export function PerformanceGrid({ performances, onCardClick }: PerformanceGridProps) {
  if (performances.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p>No performances have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="performance-grid" role="list" aria-label="Guitar performances">
      {performances.map((performance) => (
        <PerformanceCard
          key={performance.id}
          performance={performance}
          onClick={() => onCardClick(performance)}
        />
      ))}
    </div>
  );
}