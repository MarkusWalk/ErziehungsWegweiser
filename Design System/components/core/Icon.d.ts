import type { CSSProperties } from 'react';
/** Every icon name in the ITM 2627 set. */
export type IconName =
  | 'alert'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-up-right'
  | 'bar-chart'
  | 'bell'
  | 'book'
  | 'briefcase'
  | 'calendar'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'clipboard-check'
  | 'clock'
  | 'close'
  | 'cloud'
  | 'compass'
  | 'copy'
  | 'cpu'
  | 'database'
  | 'download'
  | 'external-link'
  | 'eye'
  | 'file-text'
  | 'filter'
  | 'flag'
  | 'folder'
  | 'globe'
  | 'graduation-cap'
  | 'grid'
  | 'help'
  | 'info'
  | 'key'
  | 'layers'
  | 'leaf'
  | 'lightbulb'
  | 'link'
  | 'lock'
  | 'mail'
  | 'menu'
  | 'message'
  | 'minus'
  | 'more'
  | 'network'
  | 'pencil'
  | 'pie-chart'
  | 'play'
  | 'plus'
  | 'presentation'
  | 'refresh'
  | 'rocket'
  | 'search'
  | 'settings'
  | 'share'
  | 'shield'
  | 'sparkle'
  | 'sprout'
  | 'star'
  | 'sun'
  | 'tag'
  | 'target'
  | 'trash'
  | 'trend-up'
  | 'upload'
  | 'user'
  | 'users'
  | 'x-circle'
  | 'zap';

export declare const ICON_PATHS: Record<IconName, string>;
export declare const ICON_NAMES: IconName[];

/** A single line icon from the ITM 2627 set — 24x24 grid, 1.75px stroke. */
export interface IconProps {
  /** Icon name from the set. */
  name: IconName;
  /** Rendered square size in px. Use 16, 20, 24, 32 or 48. */
  size?: number;
  /** Stroke color. Defaults to currentColor so it inherits text color. */
  color?: string;
  /** Stroke weight. 1.5 at 16px, 1.75 at 20-24px, 2 at 32px+. */
  strokeWidth?: number;
  /** Accessible label. Omit for decorative icons (renders aria-hidden). */
  title?: string;
  style?: CSSProperties;
}
