import React from 'react';
import { Icon } from './Icon';

const TONES = {
  neutral: ['var(--ink-100)', 'var(--ink-800)', 'var(--ink-200)'],
  coral: ['var(--coral-100)', 'var(--coral-700)', 'var(--coral-200)'],
  violet: ['var(--violet-100)', 'var(--violet-700)', 'var(--violet-200)'],
  sky: ['var(--sky-100)', 'var(--sky-700)', 'var(--sky-200)'],
  moss: ['var(--moss-100)', 'var(--moss-700)', 'var(--moss-300)'],
  amber: ['var(--amber-100)', 'var(--amber-700)', 'var(--amber-300)'],
};

/** Tag — a small pill label for status, category or metadata. */
export function Tag({ children, tone = 'neutral', variant = 'soft', icon, size = 'md', style }) {
  const [bg, fg, bd] = TONES[tone] || TONES.neutral;
  const sm = size === 'sm';
  const outline = variant === 'outline';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sm ? 4 : 6,
      height: sm ? 22 : 28, padding: sm ? '0 9px' : '0 12px',
      fontFamily: 'var(--font-sans)', fontSize: sm ? 'var(--text-2xs)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)', letterSpacing: '0.02em',
      color: fg, background: outline ? 'transparent' : bg,
      border: '1px solid ' + (outline ? bd : 'transparent'),
      borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', ...style,
    }}>
      {icon ? <Icon name={icon} size={sm ? 12 : 14} strokeWidth={1.6} /> : null}
      {children}
    </span>
  );
}
