import React from 'react';
import { Icon } from '../core/Icon';

/** Breadcrumb — where the current page sits in the hierarchy. */
export function Breadcrumb({ items = [], style }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', ...style }}>
      {items.map((it, i) => {
        const label = typeof it === 'string' ? it : it.label;
        const href = typeof it === 'string' ? null : it.href;
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {i ? <span style={{ color: 'var(--ink-300)', display: 'flex' }}><Icon name="chevron-right" size={14} strokeWidth={1.6} /></span> : null}
            {last || !href
              ? <span aria-current={last ? 'page' : undefined} style={{ color: last ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: last ? 'var(--weight-semibold)' : 'var(--weight-regular)' }}>{label}</span>
              : <a href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{label}</a>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
