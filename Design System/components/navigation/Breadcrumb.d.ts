import type { CSSProperties } from 'react';
/** Shows where the current page sits in the hierarchy. */
export interface BreadcrumbProps {
  /** Plain labels, or {label, href}. The last item renders as the current page. */
  items?: Array<string | { label: string; href?: string }>;
  style?: CSSProperties;
}
