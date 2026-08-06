import React from 'react';
import { Icon } from '../core/Icon';

/** Select — native single-choice dropdown with the system chevron. */
export function Select({ value, defaultValue, onChange, options = [], placeholder, invalid, disabled, id, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', opacity: disabled ? 'var(--state-disabled-opacity)' : 1, ...style }}>
      <select
        id={id} value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...{
        width: '100%', boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-primary)',
        background: 'var(--ink-000)',
        border: '1px solid ' + (invalid ? 'var(--status-danger)' : focus ? 'var(--coral-500)' : 'var(--ink-200)'),
        borderRadius: 'var(--radius-lg)',
        boxShadow: focus ? '0 0 0 3px var(--coral-100)' : 'none',
        outline: 'none', transition: 'var(--transition-color), box-shadow var(--duration-fast) var(--ease-standard)',
      }, height: 'var(--control-md)', padding: '0 42px 0 16px', appearance: 'none', cursor: 'pointer' }}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lab = typeof o === 'string' ? o : o.label;
          return <option key={val} value={val}>{lab}</option>;
        })}
      </select>
      <span style={{ position: 'absolute', right: 15, color: 'var(--text-muted)', pointerEvents: 'none' }}>
        <Icon name="chevron-down" size={18} strokeWidth={1.6} />
      </span>
    </div>
  );
}
