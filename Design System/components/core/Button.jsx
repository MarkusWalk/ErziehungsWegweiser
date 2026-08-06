import React from 'react';
import { Icon } from './Icon';

const SIZES = {
  sm: { h: 'var(--control-sm)', px: 14, fs: 'var(--text-sm)', gap: 6, icon: 16 },
  md: { h: 'var(--control-md)', px: 20, fs: 'var(--text-base)', gap: 8, icon: 18 },
  lg: { h: 'var(--control-lg)', px: 28, fs: 'var(--text-md)', gap: 10, icon: 20 },
};

const VARIANTS = {
  primary: { bg: 'var(--coral-500)', bgHover: 'var(--coral-600)', fg: 'var(--ink-000)', bd: 'transparent' },
  secondary: { bg: 'var(--ink-000)', bgHover: 'var(--ink-050)', fg: 'var(--ink-900)', bd: 'var(--ink-200)' },
  soft: { bg: 'var(--coral-100)', bgHover: 'var(--coral-200)', fg: 'var(--coral-700)', bd: 'transparent' },
  ghost: { bg: 'transparent', bgHover: 'var(--state-hover-tint)', fg: 'var(--ink-800)', bd: 'transparent' },
};

/** Button — pill-shaped action. Primary coral is the single call to action per view. */
export function Button({ children, variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth, disabled, onClick, type = 'button', style }) {
  const [h, setH] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.h, padding: '0 ' + s.px + 'px', fontSize: s.fs,
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)',
        letterSpacing: '0.005em', lineHeight: 1,
        color: v.fg, background: h && !disabled ? v.bgHover : v.bg,
        border: '1px solid ' + v.bd, borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--state-disabled-opacity)' : 1,
        boxShadow: variant === 'secondary' ? 'var(--elevation-1)' : 'none',
        transition: 'var(--transition-color)', whiteSpace: 'nowrap', ...style,
      }}
    >
      {iconLeft ? <Icon name={iconLeft} size={s.icon} strokeWidth={1.75} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.icon} strokeWidth={1.75} /> : null}
    </button>
  );
}
