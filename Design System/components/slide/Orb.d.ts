import type { CSSProperties } from 'react';
export type OrbTone = 'coral' | 'violet' | 'sky' | 'moss';
/** The deck's signature decorative sphere, drawn in CSS so it scales to any size. */
export interface OrbProps {
  /** Diameter in px. On a 1920x1080 slide, 120-420 reads best. */
  size?: number;
  tone?: OrbTone;
  /** The hue-matched glow. Leave on unless the orb sits on a busy background. */
  glow?: boolean;
  style?: CSSProperties;
}
/** A hairline concentric ring — quiet geometry behind numerals and orbs. */
export interface RingProps {
  size?: number;
  tone?: OrbTone | 'ink';
  /** Stroke width in px. */
  width?: number;
  style?: CSSProperties;
}
