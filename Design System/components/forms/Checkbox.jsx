import React from 'react';
import { Icon } from '../core/Icon';

/** Checkbox — a square multi-select control with its label. */
export function Checkbox({ checked, defaultChecked, onChange, label, disabled, id, style }) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked === undefined ? inner : checked;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    if (onChange) onChange(!on);
  };
  return (
    <label htmlFor={id} onClick={toggle} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-primary)',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1, ...style,
    }}>
      <span style={{
        width: 20, height: 20, flexShrink: 0, borderRadius: 'var(--radius-xs)',
        border: '1.5px solid ' + (on ? 'var(--coral-500)' : 'var(--ink-300)'),
        background: on ? 'var(--coral-500)' : 'var(--ink-000)', color: 'var(--ink-000)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'var(--transition-color)',
      }}>
        {on ? <Icon name="check" size={14} strokeWidth={2.6} /> : null}
      </span>
      {label}
    </label>
  );
}
