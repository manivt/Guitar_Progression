import { Link } from 'react-router-dom';

interface HeaderProps {
  siteTitle: string;
  siteSubtitle: string;
}

export function Header({ siteTitle, siteSubtitle }: HeaderProps) {
  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="site-header-content">
          <h1 className="site-title">{siteTitle}</h1>
          <p className="site-subtitle">{siteSubtitle}</p>
        </div>
        <nav className="site-header-actions" aria-label="Main navigation">
          <Link to="/admin" className="btn btn-ghost">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}