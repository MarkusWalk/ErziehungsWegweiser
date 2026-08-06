import React from 'react';

/**
 * SectionLabel — small uppercase eyebrow label ("TREND 1", "00 - Intro")
 * used above a section headline.
 */
export function SectionLabel({ children, tone = 'coral', style }) {
  const color = tone === 'violet' ? 'var(--accent-secondary)' : 'var(--accent-primary)';
  return (
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-small)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
