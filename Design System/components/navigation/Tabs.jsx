import React from 'react';
import { Icon } from '../core/Icon';

/** Tabs — switch between sibling views. Coral underline marks the active tab. */
export function Tabs({ items = [], value, defaultValue, onChange, style }) {
  const [inner, setInner] = React.useState(defaultValue || (items[0] && (items[0].value || items[0])));
  const active = value === undefined ? inner : value;
  const pick = v => { if (value === undefined) setInner(v); if (onChange) onChange(v); };
  return (
    <div role="tablist" style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-sans)', ...style }}>
      {items.map(it => {
        const v = it.value || it;
        const on = active === v;
        return (
          <button key={v} role="tab" aria-selected={on} onClick={() => pick(v)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'none', border: 0, cursor: 'pointer', padding: '0 0 12px',
            fontFamily: 'inherit', fontSize: 'var(--text-base)',
            fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
            color: on ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: on ? 'inset 0 -2.5px 0 var(--coral-500)' : 'none',
            transition: 'var(--transition-color)',
          }}>
            {it.icon ? <Icon name={it.icon} size={17} strokeWidth={1.7} /> : null}
            {it.label || v}
            {it.count !== undefined ? (
              <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>{it.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
