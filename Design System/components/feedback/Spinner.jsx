import React from 'react';

/** Spinner — indeterminate wait. Only for waits under ~10 seconds. */
export function Spinner({ size = 24, color = 'var(--coral-500)', label, style }) {
  const r = size / 2 - 2;
  return (
    <span role="status" aria-label={label || 'Loading'} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', ...style }}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} fill="none">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--ink-200)" strokeWidth="2.5" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * 0.72}>
          <animateTransform attributeName="transform" type="rotate" from={'0 ' + size / 2 + ' ' + size / 2}
            to={'360 ' + size / 2 + ' ' + size / 2} dur="0.9s" repeatCount="indefinite" />
        </circle>
      </svg>
      {label}
    </span>
  );
}
