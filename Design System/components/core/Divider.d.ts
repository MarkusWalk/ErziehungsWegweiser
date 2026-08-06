import type { CSSProperties } from 'react';
/** A hairline rule, optionally interrupted by a small centred uppercase label. */
export interface DividerProps {
  /** Optional centred label (rendered uppercase). Horizontal only. */
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  tone?: 'subtle' | 'strong' | 'warm';
  style?: CSSProperties;
}
