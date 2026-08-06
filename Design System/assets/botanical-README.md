# assets/botanical/ — nicht im Repo

Die 48 Original-PNGs (zusammen 47 MB, je rund 1000 px auf der langen Kante)
liegen **nicht** in diesem Repository. Sie sind Quellmaterial, kein Bestandteil
der ausgelieferten Seite.

**Wo sie sind:** im Claude-Design-Projekt unter `assets/botanical/`.

**Was ausgeliefert wird:** `site/assets/botanical/*.webp` — dieselben 48 Motive,
auf das sichtbare Motiv zugeschnitten, auf 640 px verkleinert, als WebP.
Zusammen 3,0 MB statt 47 MB.

## Ableitung wiederholen

Wenn die Originale wieder verfügbar sind (Export aus dem Design-Projekt nach
`Design System/assets/botanical/`):

```bash
python3 - <<'PY'
from PIL import Image
import os, glob
src, dst = "Design System/assets/botanical", "site/assets/botanical"
os.makedirs(dst, exist_ok=True)
for p in sorted(glob.glob(os.path.join(src, "*.png"))):
    im = Image.open(p).convert("RGBA")
    bbox = im.getbbox()          # transparente Ränder abschneiden
    if bbox: im = im.crop(bbox)
    im.thumbnail((640, 640), Image.LANCZOS)
    im.save(os.path.join(dst, os.path.basename(p)[:-4] + ".webp"),
            "WEBP", quality=80, method=6)
PY
```

Der Generator liest den Zielordner beim Build ein: Motive hinzufügen oder
löschen genügt, es gibt keine Liste im Code, die nachgepflegt werden müsste.
