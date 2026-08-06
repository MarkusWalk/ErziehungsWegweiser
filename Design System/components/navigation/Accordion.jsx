import React from 'react';
import { Icon } from '../core/Icon';

/** Accordion — collapsible sections for reference content, never for a primary flow. */
export function Accordion({ items = [], defaultOpen = 0, allowMultiple = false, style }) {
  const [open, setOpen] = React.useState(defaultOpen === null ? [] : [defaultOpen]);
  const toggle = i => setOpen(o => o.includes(i) ? o.filter(x => x !== i) : allowMultiple ? o.concat(i) : [i]);
  return (
    <div style={{ fontFamily: 'var(--font-sans)', borderTop: '1px solid var(--border-subtle)', ...style }}>
      {items.map((it, i) => {
        const on = open.includes(i);
        return (
          <div key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={() => toggle(i)} aria-expanded={on} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
              background: 'none', border: 0, cursor: 'pointer', padding: '18px 0', textAlign: 'left',
              fontFamily: 'inherit', fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)',
            }}>
              {it.title}
              <span style={{ color: 'var(--coral-500)', transform: on ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-standard)', display: 'flex' }}>
                <Icon name="chevron-down" size={20} />
              </span>
            </button>
            <div style={{ display: on ? 'block' : 'none', paddingBottom: 'var(--space-5)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', color: 'var(--text-secondary)', maxWidth: 'var(--measure)' }}>
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
