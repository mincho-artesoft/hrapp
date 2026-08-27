"""
Turn the App Store screenshot set into web media.

The source is 310 PNGs — 31 locales, two devices, five shots each — at App
Store dimensions and about 3 MB apiece. Two gigabytes of that has no business
in a git repository or a page, so this writes the same pictures at the sizes a
browser will actually paint them, in the two formats worth serving, and lays
them out under media/ so they can live in their own bucket behind the same
CloudFront distribution as the site.

Layout matches the BrassPawn media bucket:

    media/panel/<locale>/<device>/<shot>-<width>.<avif|webp>

Widths differ by device on purpose. A phone screenshot is twice as tall as it
is wide, so 340 CSS pixels is already a generous card and 680 covers a 2x
screen. The iPad shots are close to 3:4, so the same widths would render them
postage-stamp small; they get 480 and 960 instead.
"""

import pathlib
import sys
from concurrent.futures import ProcessPoolExecutor

from PIL import Image
import pillow_avif  # noqa: F401  — registers the AVIF plugin with Pillow

SRC = pathlib.Path(sys.argv[1]).expanduser()
OUT = pathlib.Path(sys.argv[2]).expanduser()

WIDTHS = {"iPhone": (340, 680), "iPad": (480, 960)}
AVIF_QUALITY = 55
WEBP_QUALITY = 80


def jobs():
    for src in sorted(SRC.rglob("*.png")):
        device = src.parent.name
        locale = src.parent.parent.name
        if device not in WIDTHS:
            continue
        for width in WIDTHS[device]:
            yield src, locale, device, src.stem, width


def one(job):
    src, locale, device, stem, width = job
    target = OUT / "panel" / locale / device
    target.mkdir(parents=True, exist_ok=True)

    image = Image.open(src).convert("RGB")
    height = round(image.height * width / image.width)
    resized = image.resize((width, height), Image.LANCZOS)

    written = 0
    for suffix, params in (
        (".avif", {"quality": AVIF_QUALITY}),
        (".webp", {"quality": WEBP_QUALITY, "method": 6}),
    ):
        path = target / f"{stem}-{width}{suffix}"
        resized.save(path, **params)
        written += path.stat().st_size
    return written


if __name__ == "__main__":
    work = list(jobs())
    print(f"  {len(work)} renditions from {len(set(j[0] for j in work))} sources")
    total = 0
    with ProcessPoolExecutor() as pool:
        for i, size in enumerate(pool.map(one, work, chunksize=4), 1):
            total += size
            if i % 100 == 0:
                print(f"  {i}/{len(work)}…", flush=True)
    files = sum(1 for _ in OUT.rglob("*") if _.is_file())
    print(f"  done: {files} files, {total / 1024 / 1024:.1f} MB")
