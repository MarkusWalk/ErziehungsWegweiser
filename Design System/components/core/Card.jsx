import React from 'react';

/**
 * Card — a flat white content container with soft neutral elevation.
 * No border, no colored left-accent — the deck's cards are plain and calm.
 */
export function Card({ children, padding = 24, hover = false, style }) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        padding,
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        transition: 'box-shadow var(--duration-base) var(--ease-standard)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
