import type { CSSProperties } from 'react';
/** One choice from a short list. Above ~6 options use Select instead. */
export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options?: Array<string | { value: string; label: string }>;
  /** Shared form name for the underlying inputs. */
  name?: string;
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
  style?: CSSProperties;
}
