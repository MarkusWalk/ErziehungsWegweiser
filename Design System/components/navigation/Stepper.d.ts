import type { CSSProperties } from 'react';
/** Progress through an ordered sequence — the deck's numbered-badge chain, as UI. */
export interface StepperProps {
  /** Plain labels, or {label, hint} objects. */
  steps?: Array<string | { label: string; hint?: string }>;
  /** Zero-based index of the current step; earlier steps render as complete. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  style?: CSSProperties;
}
