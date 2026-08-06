/**
 * A flat white card with soft neutral elevation — the deck's default content container.

 */
export interface CardProps {
  children?: React.ReactNode;
  /** Inner padding in px. */
  padding?: number;
  /** Use the slightly stronger hover elevation. */
  hover?: boolean;
  style?: React.CSSProperties;
}
