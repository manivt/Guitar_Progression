import { useState, useEffect } from 'react';
import type { Performance } from '@shared/performance';
import { getPerformances } from '@lib/api';
import { Header } from '@components/Header';
import { YearSection } from '@components/YearSection';
import { VideoModal } from '@components/VideoModal';
import { getYear } from '@lib/dates';

export function HomePage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerformances = async () => {
      try {
        setLoading(true);
        const data = await getPerformances();
        setPerformances(data);
      } catch {
        setError('Unable to load performances. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPerformances();
  }, []);

  const performancesByYear = performances.reduce((acc, performance) => {
    const year = getYear(performance.performanceDate);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(performance);
    return acc;
  }, {} as Record<number, Performance[]>);

  const sortedYears = Object.keys(performancesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      <Header
        siteTitle="Guitar Journey"
        siteSubtitle="A chronological archive of musical performances"
      />

      <main>
        <div className="container">
          <section className="hero" aria-labelledby="hero-title">
            <h2 id="hero-title" className="hero-title site-title">Guitar Journey</h2>
            <p className="hero-subtitle site-subtitle">
              A chronological collection of performances, practice sessions, recitals, and musical milestones.
            </p>
          </section>

          <div className="archive" role="main" aria-label="Performance archive">
            {loading ? (
              <p className="loading-text">Loading performances…</p>
            ) : error ? (
              <p className="empty-state empty-state-error">{error}</p>
            ) : performances.length === 0 ? (
              <p className="empty-state">No performances have been added yet.</p>
            ) : (
              sortedYears.map(year => {
                const yearPerformances = performancesByYear[year] ?? [];
                return (
                  <YearSection
                    key={year}
                    year={year}
                    performances={yearPerformances}
                    onCardClick={setSelectedPerformance}
                  />
                );
              })
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Guitar Journey — A family music archive</p>
        </div>
      </footer>

      <VideoModal
        performance={selectedPerformance}
        isOpen={!!selectedPerformance}
        onClose={() => setSelectedPerformance(null)}
      />
    </div>
  );
}