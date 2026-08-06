import type { CSSProperties, ReactNode } from 'react';
import type { IconName } from '../core/Icon';
/** An inline message block. Show one at a time; never stack alerts. */
export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children?: ReactNode;
  /** Override the tone's default icon. */
  icon?: IconName;
  /** Renders a dismiss button when provided. */
  onDismiss?: () => void;
  style?: CSSProperties;
}
