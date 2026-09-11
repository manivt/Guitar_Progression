import type { Performance } from '@shared/performance';
import { getThumbnailUrls } from '@lib/youtube';
import { formatDisplayDate } from '@lib/dates';

interface PerformanceCardProps {
  performance: Performance;
  onClick: () => void;
}

export function PerformanceCard({ performance, onClick }: PerformanceCardProps) {
  const thumbnails = getThumbnailUrls(performance.youtubeVideoId);
  const displayDate = formatDisplayDate(performance.performanceDate);
  const ageText = `Age ${performance.age.years} year${performance.age.years !== 1 ? 's' : ''}${performance.age.months > 0 ? `, ${performance.age.months} month${performance.age.months !== 1 ? 's' : ''}` : ''}`;

  return (
    <article className="card">
      <button
        type="button"
        className="card-button"
        onClick={onClick}
        aria-label={`View performance: ${performance.song} by ${performance.artist || 'Unknown Artist'} on ${displayDate}`}
      >
        <div className="thumbnail-wrapper">
          <img
            className="thumbnail"
            src={thumbnails.hq}
            srcSet={`${thumbnails.maxres} 1280w, ${thumbnails.hq} 480w, ${thumbnails.mq} 320w`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={`Thumbnail for ${performance.song} by ${performance.artist || 'Unknown Artist'}`}
            loading="lazy"
            onError={event => {
              const image = event.currentTarget;
              if (image.dataset.fallbackApplied === 'true') return;

              // Not every YouTube video has a max-resolution thumbnail. If
              // srcSet selected one that does not exist, retry with the HQ
              // thumbnail, which YouTube provides for processed videos.
              image.dataset.fallbackApplied = 'true';
              image.removeAttribute('srcset');
              image.src = thumbnails.hq;
            }}
          />
          <div className="play-indicator" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="card-content">
          <h2 className="song-title">{performance.song}</h2>
          {performance.artist && <p className="artist-name">{performance.artist}</p>}
          <div className="card-meta">
            <span className="metadata-item">
              <time dateTime={performance.performanceDate}>{displayDate}</time>
            </span>
            <span className="metadata-item">{ageText}</span>
          </div>
          {(performance.instrument || performance.performanceType) && (
            <div className="card-meta">
              {performance.performanceType && (
                <span className="badge">{performance.performanceType}</span>
              )}
              {performance.instrument && (
                <span className="badge">{performance.instrument}</span>
              )}
            </div>
          )}
        </div>
      </button>
    </article>
  );
}
