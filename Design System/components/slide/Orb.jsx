import React from 'react';

const TONES = {
  coral: ['var(--orb-coral)', 'var(--glow-coral)'],
  violet: ['var(--orb-violet)', 'var(--glow-violet)'],
  sky: ['var(--orb-sky)', 'var(--glow-sky)'],
  moss: ['var(--orb-moss)', 'var(--glow-moss)'],
};

/** Orb — the deck's signature decorative sphere, drawn in CSS so it scales
 *  to any size. Always carries a glow matched to its own hue. */
export function Orb({ size = 160, tone = 'coral', glow = true, style }) {
  const [fill, shadow] = TONES[tone] || TONES.coral;
  return (
    <span aria-hidden="true" style={{
      display: 'inline-block', width: size, height: size, borderRadius: 'var(--radius-circle)',
      background: fill, boxShadow: glow ? shadow : 'none', flexShrink: 0, ...style,
    }} />
  );
}

/** Ring — a hairline concentric accent. Quiet geometry behind numerals and orbs. */
export function Ring({ size = 160, tone = 'coral', width = 1.5, style }) {
  const color = { coral: 'var(--coral-300)', violet: 'var(--violet-300)', sky: 'var(--sky-300)', moss: 'var(--moss-300)', ink: 'var(--ink-200)' }[tone] || 'var(--coral-300)';
  return (
    <span aria-hidden="true" style={{
      display: 'inline-block', width: size, height: size, borderRadius: 'var(--radius-circle)',
      border: width + 'px solid ' + color, flexShrink: 0, ...style,
    }} />
  );
}
