import type { CSSProperties, ReactNode, MouseEventHandler } from 'react';
import type { IconName } from './Icon';
/** A pill-shaped action button. One primary per view. */
export interface ButtonProps {
  children?: ReactNode;
  /** primary = the single call to action; secondary = bordered; soft = tinted; ghost = bare. */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Icon name rendered before the label. */
  iconLeft?: IconName;
  /** Icon name rendered after the label. */
  iconRight?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}
