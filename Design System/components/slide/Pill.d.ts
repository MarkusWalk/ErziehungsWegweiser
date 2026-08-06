/**
 * A gradient capsule bar, optionally with a floating orb marker riding on top.

 */
export interface PillProps {
  /** Which gradient bar asset to use. */
  fill?: 'coral' | 'rainbow';
  /** Bar thickness in px. */
  height?: number;
  /** Horizontal position (CSS length, e.g. '20%') of an optional orb marker riding on the bar. Omit for no marker. */
  marker?: string;
  style?: React.CSSProperties;
}
