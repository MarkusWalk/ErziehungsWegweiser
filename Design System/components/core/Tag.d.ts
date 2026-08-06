import type { CSSProperties, ReactNode } from 'react';
import type { IconName } from './Icon';
/** A small pill label for status, category or metadata. */
export interface TagProps {
  children?: ReactNode;
  tone?: 'neutral' | 'coral' | 'violet' | 'sky' | 'moss' | 'amber';
  /** soft = tinted fill (default); outline = hairline only. */
  variant?: 'soft' | 'outline';
  icon?: IconName;
  size?: 'sm' | 'md';
  style?: CSSProperties;
}
