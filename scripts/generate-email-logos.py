#!/usr/bin/env python3
"""
Render the two marks the confirmation email uses.

    python3 scripts/generate-email-logos.py

Mail clients do not render inline SVG — Gmail strips it outright — so the marks
have to be raster, absolute-URL images. Both are drawn at 3x the size they are
displayed at, on transparent backgrounds, so they stay crisp on retina and sit on
whatever the surrounding table cell is coloured.

Sources, so neither is invented here:
  Alexandria  the hexagon from the site nav (layouts/landing.vue)
  IFFTU       the `//` mark ifftu.dev declares as its logo in Organization
              schema (its favicon.svg), in the same red
"""
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'email'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

SIZE = 96  # displayed at 32px, so 3x

ALEXANDRIA = """
<svg width="96" height="96" viewBox="0 0 32 32" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="#8B85FF" stroke-width="2" fill="none"/>
  <path d="M16 8v16M8 12l8 4 8-4" stroke="#8B85FF" stroke-width="2"/>
</svg>
"""

# Their own favicon draws `//` in monospace bold; keeping the glyph and the red,
# dropping the black plate so it sits on the email's own background.
IFFTU = """
<svg width="96" height="96" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <text x="2" y="24" font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-weight="bold" font-size="21" fill="#FF2200">//</text>
</svg>
"""


def render(name: str, svg: str, tmp: pathlib.Path) -> None:
    page = tmp / f'{name}.html'
    page.write_text(
        '<!doctype html><meta charset="utf-8">'
        '<style>html,body{margin:0;padding:0;width:%dpx;height:%dpx;background:transparent}</style>%s'
        % (SIZE, SIZE, svg)
    )
    dest = OUT / f'{name}.png'
    subprocess.run([
        CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
        '--default-background-color=00000000',  # keep the alpha channel
        '--force-device-scale-factor=1', f'--window-size={SIZE},{SIZE}',
        f'--screenshot={dest}', page.as_uri(),
    ], check=True, capture_output=True)
    print(f'  {dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB')


def main() -> int:
    if not pathlib.Path(CHROME).exists():
        print(f'Chrome not found at {CHROME}', file=sys.stderr)
        return 1

    tmp = ROOT / '.logo-tmp'
    tmp.mkdir(exist_ok=True)
    try:
        render('email-mark-alexandria', ALEXANDRIA, tmp)
        render('email-mark-ifftu', IFFTU, tmp)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return 0


if __name__ == '__main__':
    sys.exit(main())
