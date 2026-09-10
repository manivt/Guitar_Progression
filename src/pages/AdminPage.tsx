import { useState, useEffect } from 'react';
import type { Performance } from '@shared/performance';
import { getPerformances, deletePerformance } from '@lib/api';
import { formatDisplayDate } from '@lib/dates';
import { PerformanceForm } from '@components/PerformanceForm';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { useToast } from '@components/Toast';
import { Header } from '@components/Header';

export function AdminPage() {
  const { success, error } = useToast();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadPerformances = async () => {
    try {
      setLoading(true);
      const data = await getPerformances();
      setPerformances(data);
    } catch {
      error('Unable to load performances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformances();
  }, []);

  const handleAddSuccess = () => {
    setEditingId(null);
    loadPerformances();
  };

  const handleEdit = (performance: Performance) => {
    setEditingId(performance.id);
  };

  const handleDelete = (performance: Performance) => {
    setDeletingId(performance.id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    setDeleteConfirmOpen(false);
    
    try {
      await deletePerformance(deletingId);
      success('Performance deleted');
      loadPerformances();
    } catch {
      error('Unable to delete performance');
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const handleAccessLogout = async () => {
    setLoggingOut(true);

    try {
      await fetch('/cdn-cgi/access/logout', {
        credentials: 'include',
        redirect: 'manual',
        cache: 'no-store'
      });
      window.location.replace('/');
    } catch {
      // Preserve logout reliability if a browser cannot perform the manual
      // redirect request. Cloudflare will handle the full-page navigation.
      window.location.assign('/cdn-cgi/access/logout');
    }
  };

  const currentPerformance = performances.find(p => p.id === editingId) ?? undefined;

  return (
    <div className="admin-page">
      <Header
        siteTitle="The Journey"
        siteSubtitle="Admin — Manage Performances"
        action="archive"
      />

      <main>
        <div className="container">
          <div className="admin-toolbar">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              aria-label="Log out of administrator access"
              onClick={() => void handleAccessLogout()}
              disabled={loggingOut}
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
          <div className="admin-container">
            <section className="admin-form-section" aria-labelledby="form-heading">
              <PerformanceForm
                {...(currentPerformance ? { initialData: currentPerformance } : {})}
                onSuccess={handleAddSuccess}
                onCancel={() => setEditingId(null)}
              />
            </section>

            <section className="admin-list-section" aria-labelledby="list-heading">
              <header className="admin-list-header">
                <h2 id="list-heading" className="admin-list-title">Existing Performances</h2>
              </header>

              {loading ? (
                <p className="loading-text">Loading performances…</p>
              ) : performances.length === 0 ? (
                <p className="empty-state">No performances yet. Add the first one above.</p>
              ) : (
                <div className="admin-list" role="list" aria-label="Performance list">
                  {performances.map(performance => (
                    <div key={performance.id} className="admin-list-item" role="listitem">
                      <div className="admin-list-info">
                        <span className="admin-list-date">
                          {formatDisplayDate(performance.performanceDate)}
                        </span>
                        <span className="admin-list-song">{performance.song}</span>
                        {performance.artist && (
                          <span className="admin-list-artist">{performance.artist}</span>
                        )}
                      </div>
                      <div className="admin-list-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(performance)}
                          disabled={loading}
                          aria-label={`Edit ${performance.song}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(performance)}
                          disabled={loading}
                          aria-label={`Delete ${performance.song}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Performance"
        message={`Are you sure you want to delete "${performances.find(p => p.id === deletingId)?.song}"? This action cannot be undone.`}
        confirmText="Delete Performance"
        variant="danger"
        loading={!!deletingId}
      />
    </div>
  );
}
