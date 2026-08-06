import React from 'react';

/** Field — label + control + hint/error wrapper. Every input belongs in one. */
export function Field({ label, hint, error, required, htmlFor, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)', ...style }}>
      {label ? (
        <label htmlFor={htmlFor} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
          {label}{required ? <span style={{ color: 'var(--coral-600)', marginLeft: 3 }}>*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger)' }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </div>
  );
}
