import React from 'react';
import { Icon } from '../core/Icon';

/** Stepper — progress through an ordered sequence. The deck's numbered-badge chain, as UI. */
export function Stepper({ steps = [], current = 0, orientation = 'horizontal', style }) {
  const vertical = orientation === 'vertical';
  return (
    <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: vertical ? 'flex-start' : 'flex-start', gap: 0, fontFamily: 'var(--font-sans)', ...style }}>
      {steps.map((s, i) => {
        const label = typeof s === 'string' ? s : s.label;
        const hint = typeof s === 'string' ? null : s.hint;
        const done = i < current, now = i === current;
        const fill = done ? 'var(--coral-500)' : now ? 'var(--ink-000)' : 'var(--ink-000)';
        const bd = done ? 'var(--coral-500)' : now ? 'var(--coral-500)' : 'var(--ink-200)';
        const fg = done ? 'var(--ink-000)' : now ? 'var(--coral-600)' : 'var(--text-faint)';
        return (
          <div key={i} style={{ display: 'flex', flexDirection: vertical ? 'row' : 'column', gap: vertical ? 'var(--space-4)' : 'var(--space-3)', flex: vertical ? 'none' : 1, alignItems: vertical ? 'flex-start' : 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: 0, minWidth: vertical ? 40 : undefined, alignSelf: vertical ? 'stretch' : undefined }}>
              <span style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 'var(--radius-circle)',
                background: fill, border: '1.5px solid ' + bd, color: fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)',
                boxShadow: now ? 'var(--glow-coral)' : 'none', transition: 'var(--transition-color)',
              }}>{done ? <Icon name="check" size={18} strokeWidth={2.4} /> : i + 1}</span>
              {i < steps.length - 1 ? (
                <span style={{ flex: 1, minHeight: vertical ? 28 : 0, minWidth: vertical ? 0 : 8,
                  height: vertical ? undefined : 1.5, width: vertical ? 1.5 : undefined,
                  background: done ? 'var(--coral-300)' : 'var(--border-subtle)', margin: vertical ? '6px 0' : '0 12px 0 8px' }} />
              ) : null}
            </div>
            <div style={{ paddingBottom: vertical ? 'var(--space-5)' : 0, paddingRight: vertical ? 0 : 'var(--space-5)' }}>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: now ? 'var(--weight-semibold)' : 'var(--weight-medium)', color: now || done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</div>
              {hint ? <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{hint}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
