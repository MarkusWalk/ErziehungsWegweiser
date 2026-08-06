/**
 * A filled circular badge carrying a number or short label — the deck's
 * only sequencing glyph (no icon font in the source).

 */
export interface NumberBadgeProps {
  /** Content shown inside the badge (usually 1-2 digits). */
  number: React.ReactNode;
  /** Fill color family. */
  tone?: 'coral' | 'violet' | 'navy';
  /** Diameter in px. */
  size?: number;
  /** Whether to render the hue-matched drop-shadow glow. */
  glow?: boolean;
  style?: React.CSSProperties;
}
