import type { CSSProperties, ReactNode } from 'react';
/** A short hover hint. Never put essential information in a tooltip. */
export interface TooltipProps {
  /** The hint text — keep it to one short line. */
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** The trigger element. */
  children?: ReactNode;
  style?: CSSProperties;
}
