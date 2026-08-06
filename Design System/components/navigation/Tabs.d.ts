import type { CSSProperties } from 'react';
import type { IconName } from '../core/Icon';
export interface TabItem { value: string; label?: string; icon?: IconName; count?: number }
/** Switch between sibling views. The coral underline marks the active tab. */
export interface TabsProps {
  items?: Array<TabItem | string>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}
