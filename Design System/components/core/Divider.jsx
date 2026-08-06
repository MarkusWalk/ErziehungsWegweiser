import React from 'react';

/** Divider — a hairline rule, optionally interrupted by a small centred label. */
export function Divider({ label, orientation = 'horizontal', tone = 'subtle', style }) {
  const color = tone === 'strong' ? 'var(--border-strong)' : tone === 'warm' ? 'var(--border-warm)' : 'var(--border-subtle)';
  if (orientation === 'vertical') {
    return <span style={{ display: 'inline-block', width: 1, alignSelf: 'stretch', background: color, ...style }} />;
  }
  if (!label) return <hr style={{ border: 0, borderTop: '1px solid ' + color, margin: 0, ...style }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', ...style }}>
      <span style={{ flex: 1, height: 1, background: color }} />
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
        letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-faint)',
      }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: color }} />
    </div>
  );
}
