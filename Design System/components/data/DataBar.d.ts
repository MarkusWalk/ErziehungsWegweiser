import type { CSSProperties } from 'react';
/** A labelled horizontal bar chart — the system's default simple comparison. */
export interface DataBarProps {
  data?: Array<{ label: string; value: number; color?: string }>;
  /** Scale ceiling. Defaults to the largest value in the data. */
  max?: number;
  showValue?: boolean;
  /** Suffix printed after each value, e.g. "%". */
  unit?: string;
  barHeight?: number;
  style?: CSSProperties;
}
export interface LegendProps {
  /** Plain labels (auto-coloured in chart order) or {label, color}. */
  items?: Array<string | { label: string; color?: string }>;
  style?: CSSProperties;
}
