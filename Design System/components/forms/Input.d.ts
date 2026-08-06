import type { CSSProperties, ChangeEventHandler } from 'react';
import type { IconName } from '../core/Icon';
/** Single-line text entry. Pair with Field for a label and hint. */
export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';
  /** Optional leading icon inside the field. */
  icon?: IconName;
  size?: 'sm' | 'md' | 'lg';
  /** Draws the error border. Put the message on the surrounding Field. */
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  style?: CSSProperties;
}
