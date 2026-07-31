#!/usr/bin/env python3
"""
Subset the web fonts to the characters this site actually sets.

Fonts were 175 KB of a 383 KB page — 46% of the weight — because @fontsource
ships the whole Latin range (U+0000–00FF plus assorted marks) and the variable
faces carry every weight on their axis. The site is English and uses two weights.

Two reductions, in order:

  1. Instance the variable axis to the single weight each face is used at, which
     drops the interpolation deltas.
  2. Subset to the union of (a) every character in the built HTML and JS and
     (b) a fixed safety set, so copy added later does not silently render tofu.

Run after `npm run generate` so dist/ exists to scan:

    python3 scripts/subset-fonts.py

Writes to assets/fonts/, which main.css references — Vite fingerprints them, so
they cache for a year without a stale-asset risk.
"""
from __future__ import annotations

import io
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
OUT = ROOT / 'assets' / 'fonts'
MODULES = ROOT / 'node_modules'

# Everything the design might reasonably reach for, whether or not it is on the
# site today. Cheap to carry; expensive to be missing.
SAFETY = (
    ' !"#$%&\'()*+,-./0123456789:;<=>?@'
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`'
    'abcdefghijklmnopqrstuvwxyz{|}~'
    ' '          # nbsp — the hero headline depends on it
    '‘’“”'            # curly quotes
    '–—'              # en and em dash
    '·•…'             # middot, bullet, ellipsis
    '‹›«»'            # chevrons, used in "read more ›"
    '✓✔✕✗×−'          # ticks and crosses in the works/does-not lists
    '←→↑↓'
    '©®™°'
    '£€$¢¥₹'
    'áàâäéèêëíìîïóòôöúùûüñçßæœÁÉÍÓÚÑÇ'  # names and loanwords
)

FACES = [
    # (source, output stem, axis pin or None)
    # 300 for headings, 400 for the audience-card titles — pin to that span
    # rather than a point, or .aud-card h3 silently renders a weight lighter.
    ('@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2',
     'newsreader-normal', {'wght': (300, 400)}),
    ('@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2',
     'newsreader-italic', {'wght': 300}),
    ('@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2',
     'public-sans', None),  # body copy runs 400–700; keep the axis
    ('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
     'plex-mono-400', None),
    ('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
     'plex-mono-500', None),
]


def characters_in_build() -> set[str]:
    """Every character the built site can render, from markup and script alike."""
    if not DIST.exists():
        print('dist/ not found — run `npm run generate` first', file=sys.stderr)
        raise SystemExit(1)

    chars: set[str] = set()
    for path in list(DIST.rglob('*.html')) + list(DIST.rglob('*.js')):
        text = path.read_text('utf8', errors='ignore')
        if path.suffix == '.html':
            text = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', text, flags=re.S)
            text = re.sub(r'<[^>]+>', ' ', text)
        chars.update(text)
    return {c for c in chars if c.isprintable() or c == ' '}


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    wanted = characters_in_build() | set(SAFETY)
    print(f'{len(wanted)} distinct characters across the built site\n')

    total_before = total_after = 0
    for rel, stem, pin in FACES:
        src = MODULES / rel
        if not src.exists():
            print(f'  {stem:20} SOURCE MISSING — {rel}', file=sys.stderr)
            return 1

        font = TTFont(src)
        if pin and 'fvar' in font:
            font = instancer.instantiateVariableFont(font, pin, inplace=False)
            # Pinning to a *range* leaves a partial variable font whose gvar is
            # still lazily loaded, and the subsetter trips over the missing
            # .notdef entry. A round trip through memory materialises it.
            buf = io.BytesIO()
            font.save(buf)
            buf.seek(0)
            font = TTFont(buf)

        opts = subset.Options()
        opts.flavor = 'woff2'
        opts.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk']
        opts.desubroutinize = True
        opts.name_IDs = ['*']
        opts.notdef_outline = True

        subsetter = subset.Subsetter(options=opts)
        subsetter.populate(text=''.join(sorted(wanted)))
        subsetter.subset(font)

        dest = OUT / f'{stem}.woff2'
        font.save(dest)
        font.close()

        before, after = src.stat().st_size, dest.stat().st_size
        total_before += before
        total_after += after
        print(f'  {stem:20} {before // 1024:4} KB -> {after // 1024:3} KB'
              f'   ({100 - after * 100 // before}% smaller)'
              f'{"   pinned " + str(pin) if pin else ""}')

    print(f'\n  {"total":20} {total_before // 1024:4} KB -> {total_after // 1024:3} KB'
          f'   saves {(total_before - total_after) // 1024} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
