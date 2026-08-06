import type { CSSProperties } from 'react';
export type AvatarTone = 'coral' | 'violet' | 'sky' | 'moss' | 'neutral';
/** A circular person marker — photo when available, initials otherwise. */
export interface AvatarProps {
  /** Full name; the first two initials are derived from it. */
  name?: string;
  /** Photo URL. Falls back to initials when omitted. */
  src?: string;
  /** Diameter in px. */
  size?: number;
  tone?: AvatarTone;
  style?: CSSProperties;
}
export interface AvatarGroupProps {
  people?: Array<{ name?: string; src?: string; tone?: AvatarTone }>;
  size?: number;
  /** How many to show before collapsing into "+N". */
  max?: number;
}
