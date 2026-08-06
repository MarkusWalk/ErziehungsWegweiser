import type { CSSProperties, MouseEventHandler } from 'react';
import type { IconName } from './Icon';
/** A circular button holding one icon. Always give it a label for screen readers. */
export interface IconButtonProps {
  icon: IconName;
  /** Accessible label — required, the icon alone carries no text. */
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}
