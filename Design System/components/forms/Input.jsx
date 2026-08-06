import React from 'react';
import { Icon } from '../core/Icon';

/** Input — single-line text entry, with an optional leading icon. */
export function Input({ value, defaultValue, onChange, placeholder, type = 'text', icon, size = 'md', invalid, disabled, id, style }) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', opacity: disabled ? 'var(--state-disabled-opacity)' : 1, ...style }}>
      {icon ? (
        <span style={{ position: 'absolute', left: 14, color: 'var(--text-faint)', pointerEvents: 'none' }}>
          <Icon name={icon} size={18} strokeWidth={1.6} />
        </span>
      ) : null}
      <input
        id={id} type={type} value={value} defaultValue={defaultValue} onChange={onChange}
        placeholder={placeholder} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...{
        width: '100%', boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-primary)',
        background: 'var(--ink-000)',
        border: '1px solid ' + (invalid ? 'var(--status-danger)' : focus ? 'var(--coral-500)' : 'var(--ink-200)'),
        borderRadius: 'var(--radius-lg)',
        boxShadow: focus ? '0 0 0 3px var(--coral-100)' : 'none',
        outline: 'none', transition: 'var(--transition-color), box-shadow var(--duration-fast) var(--ease-standard)',
      }, height: h, padding: icon ? '0 16px 0 42px' : '0 16px' }}
      />
    </div>
  );
}
