import { useState, useEffect, useCallback } from 'react';
import { PERFORMANCE_TYPES } from '../../types/performance';
import { extractYouTubeVideoId, isValidYouTubeVideoId, getThumbnailUrls } from '../../lib/youtube';
import { createPerformance, updatePerformance } from '../../lib/api';
import { Performance, PerformanceInput } from '../../types/performance';
import { useToast } from './Toast';

interface PerformanceFormProps {
  initialData?: Performance;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PerformanceForm({ initialData, onSuccess, onCancel }: PerformanceFormProps) {
  const { success, error } = useToast();
  const isEditing = !!initialData;
  const [saving, setSaving] = useState(false);
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PerformanceInput & { youtubeUrl: string }>({
    performanceDate: '',
    song: '',
    artist: '',
    youtubeUrl: '',
    instrument: '',
    performanceType: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        performanceDate: initialData.performanceDate,
        song: initialData.song,
        artist: initialData.artist || '',
        youtubeUrl: `https://www.youtube.com/watch?v=${initialData.youtubeVideoId}`,
        instrument: initialData.instrument || '',
        performanceType: initialData.performanceType || '',
        location: initialData.location || '',
        notes: initialData.notes || ''
      });
      setYoutubePreview(initialData.youtubeVideoId);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, performanceDate: today }));
    }
  }, [initialData]);

  const validateYouTubeUrl = useCallback((url: string) => {
    if (!url.trim()) {
      setYoutubePreview(null);
      setYoutubeError(null);
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (videoId && isValidYouTubeVideoId(videoId)) {
      setYoutubePreview(videoId);
      setYoutubeError(null);
    } else {
      setYoutubePreview(null);
      setYoutubeError('Invalid YouTube URL');
    }
  }, []);

  useEffect(() => {
    validateYouTubeUrl(formData.youtubeUrl);
  }, [formData.youtubeUrl, validateYouTubeUrl]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.performanceDate.trim()) {
      newErrors.performanceDate = 'Performance date is required';
    }

    if (!formData.song.trim()) {
      newErrors.song = 'Song title is required';
    } else if (formData.song.length > 200) {
      newErrors.song = 'Song title must be 200 characters or less';
    }

    if (formData.artist && formData.artist.length > 200) {
      newErrors.artist = 'Artist must be 200 characters or less';
    }

    const videoId = extractYouTubeVideoId(formData.youtubeUrl);
    if (!formData.youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'YouTube URL is required';
    } else if (!videoId || !isValidYouTubeVideoId(videoId)) {
      newErrors.youtubeUrl = 'Invalid YouTube URL';
    }

    if (formData.instrument && formData.instrument.length > 100) {
      newErrors.instrument = 'Instrument must be 100 characters or less';
    }

    if (formData.performanceType && !PERFORMANCE_TYPES.includes(formData.performanceType as any)) {
      newErrors.performanceType = 'Invalid performance type';
    }

    if (formData.location && formData.location.length > 200) {
      newErrors.location = 'Location must be 200 characters or less';
    }

    if (formData.notes && formData.notes.length > 5000) {
      newErrors.notes = 'Notes must be 5000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const videoId = extractYouTubeVideoId(formData.youtubeUrl)!;
      const payload: PerformanceInput & { youtubeUrl: string } = {
        performanceDate: formData.performanceDate,
        song: formData.song.trim(),
        artist: formData.artist.trim() || undefined,
        youtubeUrl: formData.youtubeUrl,
        instrument: formData.instrument.trim() || undefined,
        performanceType: formData.performanceType || undefined,
        location: formData.location.trim() || undefined,
        notes: formData.notes.trim() || undefined
      };

      if (isEditing && initialData) {
        await updatePerformance(initialData.id, payload);
        success('Performance updated successfully');
      } else {
        await createPerformance(payload);
        success('Performance added successfully');
      }

      onSuccess();
    } catch (err) {
      error(err instanceof Error ? err.message : 'Unable to save performance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-header">
        <h2 className="admin-form-title">{isEditing ? 'Edit Performance' : 'Add Performance'}</h2>
        <p className="admin-form-subtitle">
          {isEditing ? 'Update the performance details below' : 'Enter the details for a new guitar performance'}
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="performanceDate" className="form-label">Performance Date *</label>
        <input
          type="date"
          id="performanceDate"
          className={`form-input ${errors.performanceDate ? 'error' : ''}`}
          value={formData.performanceDate}
          onChange={e => handleChange('performanceDate', e.target.value)}
          required
          disabled={saving}
        />
        {errors.performanceDate && <p className="error-message">{errors.performanceDate}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="song" className="form-label">Song Title *</label>
        <input
          type="text"
          id="song"
          className={`form-input ${errors.song ? 'error' : ''}`}
          value={formData.song}
          onChange={e => handleChange('song', e.target.value)}
          placeholder="e.g., Hotel California"
          maxLength={200}
          required
          disabled={saving}
        />
        {errors.song && <p className="error-message">{errors.song}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="artist" className="form-label">Artist</label>
        <input
          type="text"
          id="artist"
          className={`form-input ${errors.artist ? 'error' : ''}`}
          value={formData.artist}
          onChange={e => handleChange('artist', e.target.value)}
          placeholder="e.g., Eagles"
          maxLength={200}
          disabled={saving}
        />
        {errors.artist && <p className="error-message">{errors.artist}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="youtubeUrl" className="form-label">YouTube URL *</label>
        <input
          type="url"
          id="youtubeUrl"
          className={`form-input ${errors.youtubeUrl ? 'error' : ''}`}
          value={formData.youtubeUrl}
          onChange={e => handleChange('youtubeUrl', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          disabled={saving}
        />
        {errors.youtubeUrl && <p className="error-message">{errors.youtubeUrl}</p>}
        {youtubeError && <p className="error-message">{youtubeError}</p>}

        {youtubePreview && (
          <div className="youtube-preview-container">
            <span className="youtube-preview-label">Thumbnail Preview</span>
            <div className="youtube-preview-thumbnail">
              <img
                src={getThumbnailUrls(youtubePreview).hq}
                alt="YouTube thumbnail preview"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-row two-col">
        <div className="form-group">
          <label htmlFor="instrument" className="form-label">Instrument</label>
          <input
            type="text"
            id="instrument"
            className={`form-input ${errors.instrument ? 'error' : ''}`}
            value={formData.instrument}
            onChange={e => handleChange('instrument', e.target.value)}
            placeholder="e.g., Electric Guitar"
            maxLength={100}
            disabled={saving}
          />
          {errors.instrument && <p className="error-message">{errors.instrument}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="performanceType" className="form-label">Performance Type</label>
          <select
            id="performanceType"
            className={`form-select ${errors.performanceType ? 'error' : ''}`}
            value={formData.performanceType}
            onChange={e => handleChange('performanceType', e.target.value)}
            disabled={saving}
          >
            <option value="">Select type (optional)</option>
            {PERFORMANCE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.performanceType && <p className="error-message">{errors.performanceType}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label">Location</label>
        <input
          type="text"
          id="location"
          className={`form-input ${errors.location ? 'error' : ''}`}
          value={formData.location}
          onChange={e => handleChange('location', e.target.value)}
          placeholder="e.g., Home, School Auditorium"
          maxLength={200}
          disabled={saving}
        />
        {errors.location && <p className="error-message">{errors.location}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea
          id="notes"
          className={`form-textarea ${errors.notes ? 'error' : ''}`}
          value={formData.notes}
          onChange={e => handleChange('notes', e.target.value)}
          placeholder="Optional notes about this performance..."
          maxLength={5000}
          rows={4}
          disabled={saving}
        />
        {errors.notes && <p className="error-message">{errors.notes}</p>}
      </div>

      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Performance')}
        </button>
      </div>
    </form>
  );
}