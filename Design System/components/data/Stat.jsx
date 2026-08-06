import React from 'react';
import { Icon } from '../core/Icon';

/** Stat — one headline number with its label. The deck's "big numbers" slide, as UI. */
export function Stat({ value, label, hint, delta, tone = 'coral', align = 'left', size = 'md', style }) {
  const color = { coral: 'var(--coral-500)', violet: 'var(--violet-500)', moss: 'var(--moss-600)', sky: 'var(--sky-600)', ink: 'var(--ink-900)' }[tone] || 'var(--coral-500)';
  const fs = size === 'lg' ? 'var(--text-4xl)' : size === 'sm' ? 'var(--text-2xl)' : 'var(--text-3xl)';
  const up = typeof delta === 'number' ? delta >= 0 : null;
  return (
    <div style={{ fontFamily: 'var(--font-sans)', textAlign: align, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: fs, fontWeight: 'var(--weight-bold)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1, color }}>{value}</span>
        {up !== null ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: up ? 'var(--moss-600)' : 'var(--status-danger)' }}>
            <Icon name={up ? 'arrow-up' : 'arrow-down'} size={14} strokeWidth={2.2} />{Math.abs(delta)}%
          </span>
        ) : null}
      </div>
      <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</div>
      {hint ? <div style={{ marginTop: 4, fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>{hint}</div> : null}
    </div>
  );
}
