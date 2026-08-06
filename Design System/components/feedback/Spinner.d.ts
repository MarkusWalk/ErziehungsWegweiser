import type { CSSProperties } from 'react';
/** Indeterminate wait indicator. Only for waits under about ten seconds. */
export interface SpinnerProps {
  /** Diameter in px. */
  size?: number;
  color?: string;
  /** Optional text shown beside the spinner (also the accessible label). */
  label?: string;
  style?: CSSProperties;
}
