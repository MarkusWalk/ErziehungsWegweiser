import React from 'react';

/** RadioGroup — one choice from a short list. Use Select above ~6 options. */
export function RadioGroup({ value, defaultValue, onChange, options = [], name, direction = 'vertical', disabled, style }) {
  const [inner, setInner] = React.useState(defaultValue);
  const sel = value === undefined ? inner : value;
  const pick = v => { if (disabled) return; if (value === undefined) setInner(v); if (onChange) onChange(v); };
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: direction === 'horizontal' ? 'row' : 'column', gap: direction === 'horizontal' ? 'var(--space-5)' : 'var(--space-3)', opacity: disabled ? 'var(--state-disabled-opacity)' : 1, ...style }}>
      {options.map(o => {
        const val = typeof o === 'string' ? o : o.value;
        const lab = typeof o === 'string' ? o : o.label;
        const on = sel === val;
        return (
          <label key={val} onClick={() => pick(val)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-primary)',
          }}>
            <span style={{
              width: 20, height: 20, flexShrink: 0, borderRadius: 'var(--radius-circle)',
              border: '1.5px solid ' + (on ? 'var(--coral-500)' : 'var(--ink-300)'),
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition-color)',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-circle)', background: on ? 'var(--coral-500)' : 'transparent', transition: 'var(--transition-color)' }} />
            </span>
            {lab}
            <input type="radio" name={name} value={val} checked={on} readOnly style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
          </label>
        );
      })}
    </div>
  );
}
