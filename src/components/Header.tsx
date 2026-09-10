import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  siteTitle: string;
  siteSubtitle: string;
  action?: 'settings' | 'archive';
}

export function Header({ siteTitle, siteSubtitle, action = 'settings' }: HeaderProps) {
  const actionHref = action === 'settings' ? '/admin' : '/';
  const actionLabel = action === 'settings' ? 'Open settings' : 'View archive';

  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="site-header-content">
          <h1 className="site-title">{siteTitle}</h1>
          <p className="site-subtitle">{siteSubtitle}</p>
        </div>
        <nav className="site-header-actions" aria-label="Main navigation">
          <ThemeToggle />
          <a
            href={actionHref}
            className="btn btn-ghost btn-icon"
            aria-label={actionLabel}
            title={action === 'settings' ? 'Settings' : 'View Archive'}
          >
            {action === 'settings' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09a1.65 1.65 0 0 0-1.08-1.5 1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3h4v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.12.61.66 1.04 1.28 1.04H21v4h-.32c-.62 0-1.16.43-1.28 1Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5.5 10.5V20h13v-9.5" />
                <path d="M9.5 20v-6h5v6" />
              </svg>
            )}
          </a>
        </nav>
      </div>
    </header>
  );
}
