import type { CSSProperties, ReactNode } from 'react';
/** Label + control + hint/error wrapper. Every form control belongs inside one. */
export interface FieldProps {
  label?: string;
  /** Helper text under the control. Hidden while an error is showing. */
  hint?: string;
  /** Error message — replaces the hint and turns the control's border red. */
  error?: string;
  required?: boolean;
  /** id of the control, for the label's htmlFor. */
  htmlFor?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
