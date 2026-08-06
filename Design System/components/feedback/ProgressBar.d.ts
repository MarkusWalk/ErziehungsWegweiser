import type { CSSProperties } from 'react';
/** Completion of a known-length task. */
export interface ProgressBarProps {
  /** 0-100. Values outside the range are clamped. */
  value?: number;
  tone?: 'coral' | 'violet' | 'moss' | 'sky' | 'spectrum';
  size?: 'sm' | 'md' | 'lg';
  /** Caption above the track. */
  label?: string;
  /** Show the percentage on the right of the caption row. */
  showValue?: boolean;
  style?: CSSProperties;
}
