import React from 'react';

/**
 * Connector — the thin coral down-arrow used to link stacked cards into a
 * vertical sequence (as in the "Was werden wir tun?" slide).
 */
export function Connector({ length = 40, style }) {
  return (
    <svg width="16" height={length} viewBox={`0 0 16 ${length}`} style={{ display: 'block', margin: '0 auto', ...style }}>
      <line x1="8" y1="0" x2="8" y2={length - 8} stroke="var(--accent-primary)" strokeWidth="2" />
      <polygon
        points={`8,${length} 3,${length - 9} 13,${length - 9}`}
        fill="var(--accent-primary)"
      />
    </svg>
  );
}
