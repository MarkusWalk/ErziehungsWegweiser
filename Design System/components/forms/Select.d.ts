import type { CSSProperties, ChangeEventHandler } from 'react';
/** Native single-choice dropdown with the system chevron. */
export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  /** Plain strings, or {value,label} pairs. */
  options?: Array<string | { value: string; label: string }>;
  /** Empty first option shown when nothing is selected. */
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  style?: CSSProperties;
}
