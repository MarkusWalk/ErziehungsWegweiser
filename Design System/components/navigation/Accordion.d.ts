import type { CSSProperties, ReactNode } from 'react';
/** Collapsible sections for reference content — never for a primary flow. */
export interface AccordionProps {
  items?: Array<{ title: string; content?: ReactNode }>;
  /** Index open on mount, or null for all closed. */
  defaultOpen?: number | null;
  /** Allow several panels open at once. */
  allowMultiple?: boolean;
  style?: CSSProperties;
}
