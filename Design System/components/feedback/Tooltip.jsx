import React from 'react';

/** Tooltip — a short hover hint. Never put essential information in one. */
export function Tooltip({ content, placement = 'top', children, style }) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  }[placement];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      <span role="tooltip" style={{
        position: 'absolute', zIndex: 'var(--z-overlay)', ...pos,
        opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden',
        transition: 'opacity var(--duration-fast) var(--ease-standard)',
        background: 'var(--ink-900)', color: 'var(--ink-000)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', lineHeight: 1.4,
        padding: '7px 10px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap',
        boxShadow: 'var(--elevation-3)', pointerEvents: 'none',
      }}>{content}</span>
    </span>
  );
}
