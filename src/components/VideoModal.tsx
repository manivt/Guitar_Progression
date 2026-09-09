import { useEffect, useRef } from 'react';
import type { Performance } from '@shared/performance';
import { getEmbedUrl, getWatchUrl } from '@lib/youtube';
import { formatDisplayDate } from '@lib/dates';

interface VideoModalProps {
  performance: Performance | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ performance, isOpen, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (firstElement && lastElement) {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !performance) {
    return null;
  }

  const displayDate = formatDisplayDate(performance.performanceDate);
  const ageText = `Age ${performance.age.years} year${performance.age.years !== 1 ? 's' : ''}${performance.age.months > 0 ? `, ${performance.age.months} month${performance.age.months !== 1 ? 's' : ''}` : ''}`;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" ref={modalRef} tabIndex={-1}>
        <header className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">{performance.song}</h2>
            <p className="modal-meta">
              {performance.artist && <span>{performance.artist} — </span>}
              <time dateTime={performance.performanceDate}>{displayDate}</time>
              <span> • </span>
              <span>{ageText}</span>
            </p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close video player"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <div className="modal-body">
          <iframe
            className="modal-video"
            src={`${getEmbedUrl(performance.youtubeVideoId)}?rel=0&modestbranding=1`}
            title={`${performance.song} by ${performance.artist || 'Unknown Artist'}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
        <footer className="modal-footer">
          {performance.notes && (
            <p className="notes-text">{performance.notes}</p>
          )}
          <div className="modal-actions">
            <a
              href={getWatchUrl(performance.youtubeVideoId)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Open on YouTube
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}