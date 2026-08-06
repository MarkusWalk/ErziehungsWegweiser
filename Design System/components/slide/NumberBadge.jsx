import React from 'react';

/**
 * NumberBadge — a filled circular badge carrying a single number or short
 * label, used to mark sequence (trend numbers, session numbers, step
 * numbers). Pairs with a hue-matched "harmonic" glow shadow by default,
 * matching the source deck's outerShdw treatment.
 */
export function NumberBadge({ number, tone = 'coral', size = 56, glow = true, style }) {
  const bg = tone === 'violet' ? 'var(--accent-secondary)'
    : tone === 'navy' ? 'var(--surface-dark)'
    : 'var(--accent-primary)';
  const shadow = glow
    ? (tone === 'violet' ? 'var(--glow-violet)' : tone === 'navy' ? 'none' : 'var(--glow-coral)')
    : 'none';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        boxShadow: shadow,
        color: 'var(--text-on-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
        ...style,
      }}
    >
      {number}
    </div>
  );
}
