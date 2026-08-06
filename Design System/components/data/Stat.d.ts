import type { CSSProperties, ReactNode } from 'react';
/** One headline number with its label — the deck's "big numbers" slide, as UI. */
export interface StatProps {
  /** The number itself, pre-formatted (e.g. "12", "48%", "1.2M"). */
  value?: ReactNode;
  /** Short uppercase caption under the number. */
  label?: string;
  /** Optional smaller note under the label. */
  hint?: string;
  /** Percentage change; positive renders moss with an up arrow, negative red. */
  delta?: number;
  tone?: 'coral' | 'violet' | 'moss' | 'sky' | 'ink';
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}
