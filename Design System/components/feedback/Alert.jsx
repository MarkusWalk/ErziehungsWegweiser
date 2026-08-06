import React from 'react';
import { Icon } from '../core/Icon';

const TONES = {
  info: ['var(--status-info-soft)', 'var(--sky-700)', 'var(--sky-200)', 'info'],
  success: ['var(--status-success-soft)', 'var(--moss-700)', 'var(--moss-300)', 'check-circle'],
  warning: ['var(--status-warning-soft)', 'var(--amber-700)', 'var(--amber-300)', 'alert'],
  danger: ['var(--status-danger-soft)', '#A4302A', '#F3C4C0', 'x-circle'],
};

/** Alert — an inline message block. One per view; never stack them. */
export function Alert({ tone = 'info', title, children, icon, onDismiss, style }) {
  const [bg, fg, bd, defaultIcon] = TONES[tone] || TONES.info;
  return (
    <div role="status" style={{
      display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
      background: bg, border: '1px solid ' + bd, borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', ...style,
    }}>
      <span style={{ color: fg, marginTop: 1 }}><Icon name={icon || defaultIcon} size={20} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: fg, marginBottom: children ? 4 : 0 }}>{title}</div> : null}
        {children ? <div style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)', color: 'var(--text-secondary)' }}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" style={{ background: 'none', border: 0, padding: 2, cursor: 'pointer', color: fg, display: 'flex' }}>
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}
