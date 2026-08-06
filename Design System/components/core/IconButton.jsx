import React from 'react';
import { Icon } from './Icon';

const S = { sm: 32, md: 40, lg: 48 };

/** IconButton — a square-footprint circular button holding a single icon. */
export function IconButton({ icon, label, variant = 'ghost', size = 'md', disabled, onClick, style }) {
  const [h, setH] = React.useState(false);
  const d = S[size] || S.md;
  const solid = variant === 'primary';
  const bordered = variant === 'secondary';
  return (
    <button
      type="button" aria-label={label} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: d, height: d, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-circle)',
        border: '1px solid ' + (bordered ? 'var(--ink-200)' : 'transparent'),
        background: solid ? (h ? 'var(--coral-600)' : 'var(--coral-500)') : (h ? 'var(--state-hover-tint)' : bordered ? 'var(--ink-000)' : 'transparent'),
        color: solid ? 'var(--ink-000)' : 'var(--ink-800)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
        transition: 'var(--transition-color)', ...style,
      }}
    >
      <Icon name={icon} size={d <= 32 ? 16 : d <= 40 ? 20 : 22} />
    </button>
  );
}
