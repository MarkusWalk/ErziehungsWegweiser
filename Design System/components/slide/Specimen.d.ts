import type { CSSProperties, ReactNode } from 'react';

export type SpecimenFamily = 'bloom' | 'leaf' | 'sprig' | 'wing';
export type PaperTone = 'cream' | 'sage' | 'tan';

/** Registered cutout filenames per family, read from assets/botanical/. */
export declare const SPECIMENS: Record<SpecimenFamily, string[]>;
/** Polyline skeletons on a 100x100 grid: digits 0-9 plus I, T, M. */
export declare const GLYPHS: Record<string, number[][][]>;
/** Sampled node positions for a glyph at a given piece count. */
export declare function glyphNodes(glyph: string, count: number): [number, number][];

/** One period cutout. Aged artwork is never recoloured or masked. */
export interface SpecimenProps {
  /** Filename in assets/botanical/. Omit to take the family's first entry. */
  name?: string;
  family?: SpecimenFamily;
  /** Long-edge size in px. On a 1920x1080 slide, 90-420. */
  size?: number;
  /** Degrees. Keep within ±18 for accents, ±34 inside a glyph. */
  rotate?: number;
  flip?: boolean;
  opacity?: number;
  /** Path prefix to assets/botanical/ from the consuming page. */
  base?: string;
  /** Set only when the specimen carries meaning; decoration stays aria-hidden. */
  alt?: string;
  style?: CSSProperties;
}

/** A numeral or letter strung out of specimens — the title-slide device.
 *  One per deck. Digits 0-9 and I, T, M. */
export interface SpecimenGlyphProps {
  glyph?: string;
  /** Height in px; width is 0.8x. */
  size?: number;
  /** Pieces along the stroke. 10-16 reads as a letterform; above 22 it turns to soup. */
  count?: number;
  families?: SpecimenFamily[];
  /** Base piece size in px. Defaults to 26% of size. */
  piece?: number;
  /** 0 = pieces sit exactly on the skeleton, 1 = house default, 2 = loose. */
  jitter?: number;
  /** Changes the arrangement without changing the glyph. */
  seed?: number;
  base?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Low-opacity specimens drifting behind a text block. Absolutely
 *  positioned — give the parent position:relative. */
export interface SpecimenScatterProps {
  count?: number;
  size?: number;
  families?: SpecimenFamily[];
  opacity?: number | string;
  seed?: number;
  base?: string;
  style?: CSSProperties;
}

/** Aged-paper ground with procedural grain. The only surface a specimen
 *  may sit on — never white, never a coloured wash. */
export interface PaperProps {
  tone?: PaperTone;
  grain?: boolean;
  radius?: number | string;
  children?: ReactNode;
  style?: CSSProperties;
}
