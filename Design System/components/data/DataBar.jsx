import React from 'react';

const SERIES = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];

/** DataBar — a labelled horizontal bar chart. The system's default simple comparison. */
export function DataBar({ data = [], max, showValue = true, unit = '', barHeight = 14, style }) {
  const top = max || Math.max(1, ...data.map(d => d.value || 0));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontFamily: 'var(--font-sans)', ...style }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{d.label}</span>
            {showValue ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{d.value}{unit}</span> : null}
          </div>
          <div style={{ height: barHeight, borderRadius: 'var(--radius-pill)', background: 'var(--ink-100)', overflow: 'hidden' }}>
            <div style={{ width: Math.max(0, Math.min(100, (d.value / top) * 100)) + '%', height: '100%',
              borderRadius: 'var(--radius-pill)', background: d.color || SERIES[i % SERIES.length],
              transition: 'width var(--duration-slow) var(--ease-out)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Legend — the colour key for a chart. Matches DataBar's series order. */
export function Legend({ items = [], style }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', ...style }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-circle)', background: (typeof it === 'string' ? SERIES[i % SERIES.length] : it.color || SERIES[i % SERIES.length]) }} />
          {typeof it === 'string' ? it : it.label}
        </span>
      ))}
    </div>
  );
}
