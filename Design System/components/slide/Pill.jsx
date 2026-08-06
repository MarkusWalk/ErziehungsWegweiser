import React from 'react';

/**
 * Pill — a gradient capsule bar, optionally carrying an orb marker riding on
 * top of it (as seen in the icebreaker slide). Purely decorative / progress UI.
 */
export function Pill({ fill = 'coral', height = 28, marker, style }) {
  const bg = fill === 'rainbow'
    ? "url('../assets/bars/bar-rainbow-spectrum.png')"
    : "url('../assets/bars/bar-coral.png')";
  return (
    <div style={{ position: 'relative', height: height + (marker ? 20 : 0), display: 'flex', alignItems: 'center', ...style }}>
      <div
        style={{
          width: '100%',
          height,
          borderRadius: 'var(--radius-pill)',
          backgroundImage: bg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {marker && (
        <div
          style={{
            position: 'absolute',
            left: marker,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: height * 1.6,
            height: height * 1.6,
            borderRadius: '50%',
            background: 'var(--accent-secondary)',
            boxShadow: 'var(--glow-violet)',
          }}
        />
      )}
    </div>
  );
}
