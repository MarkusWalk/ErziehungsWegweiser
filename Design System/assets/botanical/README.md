# assets/botanical/

Transparent-background PNG cutouts of period naturalist artwork. Drop files here, then
register the filenames in `SPECIMENS` in `components/slide/Specimen.jsx`.

## Naming

`<family>-<nn>.png` — zero-padded, sequential:

| Family | Contains | Suggested count |
|---|---|---|
| `bloom-01…` | single flowers, face-on or three-quarter | 6–8 |
| `leaf-01…` | single leaves, foliage, large blades | 6–8 |
| `sprig-01…` | buds, seed heads, small branches | 4–6 |
| `wing-01…` | butterflies and moths | 6–10 |

## Requirements

- True alpha channel. No white box, no paper texture baked in, no drop shadow.
- ~1000px on the long edge; larger is fine, smaller shows on a 1920×1080 slide.
- One specimen per file, cropped tight to the artwork.
- Colour untouched — the faded, aged cast is the design.

Roughly 24 pieces across the four families is enough for the whole system: a glyph pulls
12–16 and repeats are invisible once rotated and rescaled.
