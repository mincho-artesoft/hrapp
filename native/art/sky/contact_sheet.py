"""
Assemble sky previews into a labelled contact sheet, with post-process bloom.

    python3 contact_sheet.py build/scenes/out.png build/scenes/1_*.png ...

Bloom is done here rather than in Blender's compositor: Blender 5.2 replaced
`scene.node_tree` with a `compositing_node_group`, and a plain Group Input did
not receive the render result (black frames). Doing it in post is also cheaper
than a per-sample Cycles glare pass, and easier to tune without re-rendering.
"""
import sys
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

LABELS = {
    "1_clear_noon": "clear · sun 34°",
    "2_partly_day": "partlyCloudy · sun 33°",
    "3_mostly_day": "mostlyCloudy · sun 26°",
    "4_golden_hour": "partlyCloudy · sun 4° (golden)",
    "5_thunder": "thunderstorms · sun 20°",
    "6_foggy": "foggy · sun 16°",
    "7_heavy_snow": "heavySnow · sun 18°",
    "8_moon_gibbous": "clear night · moon 64% gibbous",
    "9_moon_clouds": "partlyCloudy night · moon 24% crescent",
}


def bloom(img, threshold=0.72, radius=14, strength=0.62):
    """Bleed light out of the brightest regions — sun disc, silver linings."""
    a = np.asarray(img).astype(np.float32) / 255.0
    lum = a.mean(2, keepdims=True)
    hi = np.clip((lum - threshold) / max(1e-6, 1.0 - threshold), 0, 1) * a
    hi_img = Image.fromarray((np.clip(hi, 0, 1) * 255).astype(np.uint8))
    blurred = np.asarray(hi_img.filter(ImageFilter.GaussianBlur(radius))).astype(np.float32) / 255.0
    out = 1.0 - (1.0 - a) * (1.0 - np.clip(blurred * strength, 0, 1))   # screen blend
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def load_font(size):
    for p in ("/System/Library/Fonts/Supplemental/Helvetica.ttc",
              "/System/Library/Fonts/Helvetica.ttc",
              "/System/Library/Fonts/SFNS.ttf"):
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    return ImageFont.load_default()


def main():
    out_path, paths = sys.argv[1], sys.argv[2:]
    paths = [p for p in paths if os.path.exists(p)]
    if not paths:
        raise SystemExit("no input images")

    font = load_font(19)
    tiles = []
    for p in sorted(paths):
        im = bloom(Image.open(p).convert("RGB"))
        d = ImageDraw.Draw(im)
        key = os.path.splitext(os.path.basename(p))[0]
        text = LABELS.get(key, key)
        # Shadowed text stays readable over both bright sky and dark night.
        for dx, dy in ((1, 1), (2, 2)):
            d.text((14 + dx, im.height - 30 + dy), text, font=font, fill=(0, 0, 0))
        d.text((14, im.height - 30), text, font=font, fill=(255, 255, 255))
        tiles.append(im)

    cols = 3
    rows = (len(tiles) + cols - 1) // cols
    w, h, pad = tiles[0].width, tiles[0].height, 8
    sheet = Image.new("RGB", (cols * w + (cols + 1) * pad, rows * h + (rows + 1) * pad),
                      (16, 16, 18))
    for i, t in enumerate(tiles):
        r, c = divmod(i, cols)
        sheet.paste(t, (pad + c * (w + pad), pad + r * (h + pad)))
    sheet.save(out_path)
    print("wrote", out_path, sheet.size)


if __name__ == "__main__":
    main()
