import React from 'react';

/** Switch — an immediate on/off toggle. Use for settings that apply at once. */
export function Switch({ checked, defaultChecked, onChange, label, disabled, style }) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked === undefined ? inner : checked;
  const toggle = () => { if (disabled) return; if (checked === undefined) setInner(!on); if (onChange) onChange(!on); };
  return (
    <label onClick={toggle} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-primary)',
      opacity: disabled ? 'var(--state-disabled-opacity)' : 1, ...style,
    }}>
      <span role="switch" aria-checked={on} style={{
        width: 44, height: 26, flexShrink: 0, borderRadius: 'var(--radius-pill)', padding: 3, boxSizing: 'border-box',
        background: on ? 'var(--coral-500)' : 'var(--ink-300)', display: 'inline-flex', alignItems: 'center',
        transition: 'background-color var(--duration-base) var(--ease-standard)',
      }}>
        <span style={{
          width: 20, height: 20, borderRadius: 'var(--radius-circle)', background: 'var(--ink-000)',
          boxShadow: 'var(--elevation-1)', transform: on ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform var(--duration-base) var(--ease-out)',
        }} />
      </span>
      {label}
    </label>
  );
}
