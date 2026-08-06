import React from 'react';

const WASHES = {
  cream: 'var(--wash-cream)',
  'violet-sky': 'var(--wash-violet-sky)',
  'cool-pale': 'var(--wash-cool-pale)',
  spectrum: 'var(--wash-spectrum)',
  dark: 'var(--wash-dark)',
};

/** Wash — a full-bleed gradient panel for section-break slides and hero
 *  cards. Replaces the rasterised gradient PNGs from the source deck. */
export function Wash({ variant = 'cream', radius = 0, children, style }) {
  return (
    <div style={{
      position: 'relative', background: WASHES[variant] || WASHES.cream,
      borderRadius: radius, overflow: 'hidden', width: '100%', height: '100%', ...style,
    }}>{children}</div>
  );
}
