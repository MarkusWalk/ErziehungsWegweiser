import type { CSSProperties } from 'react';
/** Square multi-select control with its own label. */
export interface CheckboxProps {
  /** Controlled state. Omit to let the component manage itself. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  style?: CSSProperties;
}
