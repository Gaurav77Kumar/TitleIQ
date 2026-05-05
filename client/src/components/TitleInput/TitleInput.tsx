import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import './TitleInput.css';

interface TitleInputProps {
  onSubmit: (title: string, niche: string) => void;
  isLoading: boolean;
}

const NICHE_OPTIONS = [
  'Technology', 'Gaming', 'Finance', 'Health & Fitness', 'Cooking',
  'Travel', 'Education', 'Entertainment', 'Business', 'Lifestyle', 'Other',
];

export function TitleInput({ onSubmit, isLoading }: TitleInputProps) {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 200;
  const IDEAL_MIN = 40;
  const IDEAL_MAX = 60;

  const handleTitleChange = (val: string) => {
    if (val.length > MAX_CHARS) return;
    setTitle(val);
    setCharCount(val.length);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed, niche);
  };

  const getLengthIndicator = () => {
    if (charCount === 0) return { label: '', color: 'neutral' };
    if (charCount < 20) return { label: 'Too short', color: 'error' };
    if (charCount < IDEAL_MIN) return { label: 'A bit short', color: 'warning' };
    if (charCount <= IDEAL_MAX) return { label: 'Ideal length ✓', color: 'success' };
    if (charCount <= 70) return { label: 'A bit long', color: 'warning' };
    return { label: 'Too long', color: 'error' };
  };

  const indicator = getLengthIndicator();
  const canSubmit = title.trim().length > 0 && !isLoading;

  return (
    <form className="title-input-form" onSubmit={handleSubmit} noValidate>
      {/* Main textarea */}
      <div className="title-input-wrapper">
        <label className="title-input-label" htmlFor="title-textarea">
          Your YouTube title
        </label>
        <div className={`title-input-field ${isLoading ? 'disabled' : ''}`}>
          <textarea
            id="title-textarea"
            ref={textareaRef}
            className="title-textarea"
            placeholder="e.g. I Spent 30 Days Living on $1 a Day — Here's What Happened"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
            autoFocus
            aria-label="YouTube video title"
            aria-describedby="title-char-count title-length-hint"
          />
        </div>

        {/* Character count + length indicator */}
        <div className="title-input-meta">
          <span
            id="title-length-hint"
            className={`length-indicator ${indicator.color}`}
          >
            {indicator.label}
          </span>
          <span
            id="title-char-count"
            className={`char-count ${charCount > 70 ? 'over' : ''}`}
          >
            {charCount} / {MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Niche selector */}
      <div className="niche-selector-wrapper">
        <label className="title-input-label" htmlFor="niche-select">
          Niche <span className="optional-tag">optional</span>
        </label>
        <select
          id="niche-select"
          className="niche-select"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          disabled={isLoading}
          aria-label="Video niche"
        >
          <option value="">Select niche…</option>
          {NICHE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        id="analyze-button"
        type="submit"
        className={`btn btn-primary analyze-btn ${isLoading ? 'loading' : ''}`}
        disabled={!canSubmit}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Analyzing title…
          </>
        ) : (
          <>
            <span className="btn-icon" aria-hidden="true">⚡</span>
            Analyze Title
          </>
        )}
      </button>

      <p className="submit-hint">
        Press <kbd>Enter</kbd> to analyze · <kbd>Shift+Enter</kbd> for newline
      </p>
    </form>
  );
}
