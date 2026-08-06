import type { CSSProperties, ChangeEventHandler } from 'react';
/** Multi-line text entry. Pair with Field for a label and hint. */
export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  style?: CSSProperties;
}
