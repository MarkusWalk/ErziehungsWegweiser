import type { CSSProperties } from 'react';
/** An immediate on/off toggle — for settings that apply the moment they change. */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: CSSProperties;
}
