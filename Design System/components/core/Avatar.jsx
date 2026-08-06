import React from 'react';

const TONES = {
  coral: ['var(--coral-100)', 'var(--coral-700)'],
  violet: ['var(--violet-100)', 'var(--violet-700)'],
  sky: ['var(--sky-100)', 'var(--sky-700)'],
  moss: ['var(--moss-100)', 'var(--moss-700)'],
  neutral: ['var(--ink-100)', 'var(--ink-700)'],
};

function initials(name) {
  return String(name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

/** Avatar — a circular person marker: photo when available, initials otherwise. */
export function Avatar({ name, src, size = 40, tone = 'coral', style }) {
  const [bg, fg] = TONES[tone] || TONES.coral;
  return (
    <span
      title={name}
      style={{
        width: size, height: size, borderRadius: 'var(--radius-circle)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: bg, color: fg, overflow: 'hidden', flexShrink: 0,
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)',
        fontSize: Math.round(size * 0.38), letterSpacing: '0.02em', ...style,
      }}
    >
      {src ? <img src={src} alt={name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(name)}
    </span>
  );
}

/** AvatarGroup — overlapping avatars with an optional "+N" overflow chip. */
export function AvatarGroup({ people = [], size = 40, max = 4 }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <Avatar key={i} name={p.name} src={p.src} size={size} tone={p.tone}
          style={{ marginLeft: i ? -size * 0.28 : 0, boxShadow: '0 0 0 2px var(--ink-000)' }} />
      ))}
      {rest > 0 ? (
        <span style={{
          width: size, height: size, marginLeft: -size * 0.28, borderRadius: 'var(--radius-circle)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--ink-100)', color: 'var(--ink-700)', boxShadow: '0 0 0 2px var(--ink-000)',
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: Math.round(size * 0.32),
        }}>+{rest}</span>
      ) : null}
    </span>
  );
}
