import React from 'react';

const TONES = {
  coral: 'var(--fill-coral-bar)', violet: 'var(--violet-500)', moss: 'var(--moss-500)',
  sky: 'var(--sky-500)', spectrum: 'var(--fill-spectrum-bar)',
};

/** ProgressBar — completion of a known-length task, 0-100. */
export function ProgressBar({ value = 0, tone = 'coral', size = 'md', label, showValue, style }) {
  const pct = Math.max(0, Math.min(100, value));
  const h = size === 'sm' ? 6 : size === 'lg' ? 16 : 10;
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }}>
      {(label || showValue) ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
          {showValue ? <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{Math.round(pct)}%</span> : null}
        </div>
      ) : null}
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
        style={{ height: h, borderRadius: 'var(--radius-pill)', background: 'var(--ink-100)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 'var(--radius-pill)',
          background: TONES[tone] || TONES.coral, transition: 'width var(--duration-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}
