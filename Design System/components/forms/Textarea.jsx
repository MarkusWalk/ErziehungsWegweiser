import React from 'react';

/** Textarea — multi-line text entry. */
export function Textarea({ value, defaultValue, onChange, placeholder, rows = 4, invalid, disabled, id, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      id={id} rows={rows} value={value} defaultValue={defaultValue} onChange={onChange}
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
      }, padding: '12px 16px', lineHeight: 'var(--leading-normal)', resize: 'vertical',
        opacity: disabled ? 'var(--state-disabled-opacity)' : 1, ...style }}
    />
  );
}
