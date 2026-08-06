import type { CSSProperties, ReactNode } from 'react';
/** A full-bleed gradient panel for section breaks and hero cards. */
export interface WashProps {
  /** cream and violet-sky are the default light section washes; spectrum is
   *  a saturated accent band; dark is the one high-contrast panel. */
  variant?: 'cream' | 'violet-sky' | 'cool-pale' | 'spectrum' | 'dark';
  /** Corner radius in px. 0 for full-bleed slide backgrounds. */
  radius?: number;
  children?: ReactNode;
  style?: CSSProperties;
}
