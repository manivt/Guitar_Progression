import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh', 
      textAlign: 'center',
      padding: 'var(--space-6) var(--space-4)'
    }}>
      <h1 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: 'clamp(2rem, 5vw, 4rem)', 
        marginBottom: 'var(--space-3)',
        color: 'var(--color-text-muted)'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', 
        marginBottom: 'var(--space-4)',
        color: 'var(--color-text-primary)'
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        color: 'var(--color-text-secondary)', 
        marginBottom: 'var(--space-5)',
        maxWidth: '400px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Archive
      </Link>
    </div>
  );
}