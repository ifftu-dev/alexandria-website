#!/usr/bin/env python3
"""
Regenerate the confirmation email's hero banner.

    python3 scripts/generate-email-hero.py

The banner arrived as a flat JPEG reading "Early access is coming", which is the
one place the waitlist framing could not be applied by editing copy — the words
are pixels. This rebuilds it from the same ingredients (indigo-to-teal wash, a
scatter of stars, the wordmark and two lines of type) so the text is editable
again, and writes public/email/email-hero.jpg at the size the template expects.

Star positions are a fixed list rather than random, so regenerating after a copy
change produces the same sky rather than a gratuitous diff.
"""
import base64
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'email' / 'email-hero.jpg'
FONT = ROOT / 'node_modules' / '@fontsource-variable' / 'inter' / 'files' / 'inter-latin-wght-normal.woff2'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

WIDTH, HEIGHT = 1200, 440

EYEBROW = 'ALEXANDRIA'
TITLE = "You're on the list."
SUBTITLE = 'Waitlist for early access.'

# x%, y%, diameter px, opacity — eyeballed from the original scatter.
STARS = [
    (4, 12, 2, 0.5), (9, 62, 2, 0.35), (14, 8, 2, 0.4), (17, 88, 3, 0.5),
    (23, 30, 2, 0.3), (28, 74, 2, 0.45), (31, 15, 3, 0.55), (36, 92, 2, 0.3),
    (41, 44, 2, 0.35), (46, 20, 2, 0.5), (52, 68, 3, 0.4), (57, 10, 2, 0.45),
    (61, 84, 2, 0.35), (64, 36, 2, 0.5), (69, 58, 3, 0.45), (73, 18, 2, 0.4),
    (77, 78, 2, 0.5), (81, 40, 2, 0.35), (85, 66, 3, 0.5), (88, 22, 2, 0.4),
    (91, 88, 2, 0.45), (94, 48, 2, 0.35), (97, 14, 3, 0.5), (99, 70, 2, 0.4),
    (12, 40, 2, 0.3), (33, 56, 2, 0.35), (55, 90, 2, 0.3), (79, 6, 2, 0.35),
]


def stars_css() -> str:
    return '\n'.join(
        f'<i style="left:{x}%;top:{y}%;width:{d}px;height:{d}px;opacity:{o}"></i>'
        for x, y, d, o in STARS
    )


def html(font_b64: str) -> str:
    return f"""<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {{
    font-family: 'Inter';
    src: url(data:font/woff2;base64,{font_b64}) format('woff2-variations');
    font-weight: 100 900;
  }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: {WIDTH}px; height: {HEIGHT}px; }}
  body {{
    position: relative;
    overflow: hidden;
    background: #0d1330;
    font-family: 'Inter', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }}
  /* Indigo core bleeding into teal on the right, the way the original reads. */
  .wash {{
    position: absolute; inset: 0;
    background:
      /* vignette first, so it sits over the color and restores the original's
         dark corners — without it the wash reads flat and washed out */
      radial-gradient(115% 130% at 45% 45%, rgba(4,7,20,0) 38%, rgba(4,7,20,0.55) 78%, rgba(4,7,20,0.85) 100%),
      radial-gradient(85% 120% at 30% 34%, rgba(104,72,240,0.9) 0%, rgba(104,72,240,0.3) 44%, rgba(104,72,240,0) 70%),
      radial-gradient(80% 115% at 92% 55%, rgba(20,150,180,0.75) 0%, rgba(20,150,180,0.2) 46%, rgba(20,150,180,0) 74%),
      radial-gradient(55% 90% at 4% 92%, rgba(190,120,80,0.32) 0%, rgba(190,120,80,0) 62%),
      linear-gradient(102deg, #080c22 0%, #1b1444 32%, #0f2f52 70%, #091f38 100%);
  }}
  .stars i {{ position: absolute; border-radius: 50%; background: #fff; }}
  .copy {{ position: absolute; inset: 0; padding: 0 70px; display: flex; flex-direction: column; justify-content: center; }}
  .eyebrow {{
    display: flex; align-items: center; gap: 13px;
    font-size: 17px; font-weight: 700; letter-spacing: 0.34em;
    color: #b9c2f5; margin-bottom: 26px;
  }}
  /* The nav's hexagon, drawn rather than linked — this becomes a flat JPEG, so
     the mark has to be part of the artwork. */
  .eyebrow svg {{ width: 30px; height: 30px; flex: none; }}
  h1 {{ font-size: 62px; font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; }}
  .sub {{ margin-top: 18px; font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.72); }}
</style>
<div class="wash"></div>
<div class="stars">{stars_css()}</div>
<div class="copy">
  <div class="eyebrow">
    <svg viewBox="0 0 32 32" fill="none" stroke="#b9c2f5" stroke-width="2">
      <path d="M16 2L4 8v16l12 6 12-6V8L16 2z"/><path d="M16 8v16M8 12l8 4 8-4"/>
    </svg>
    <span>{EYEBROW}</span>
  </div>
  <h1>{TITLE}</h1>
  <div class="sub">{SUBTITLE}</div>
</div>
"""


def main() -> int:
    if not pathlib.Path(CHROME).exists():
        print(f'Chrome not found at {CHROME}', file=sys.stderr)
        return 1
    if not FONT.exists():
        print(f'Inter woff2 missing at {FONT} — run npm install first', file=sys.stderr)
        return 1

    tmp = ROOT / '.hero-tmp'
    tmp.mkdir(exist_ok=True)
    try:
        page = tmp / 'hero.html'
        page.write_text(html(base64.b64encode(FONT.read_bytes()).decode()))
        png = tmp / 'hero.png'
        subprocess.run([
            CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
            '--force-device-scale-factor=1', f'--window-size={WIDTH},{HEIGHT}',
            f'--screenshot={png}', page.as_uri(),
        ], check=True, capture_output=True)
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '88',
                        str(png), '--out', str(OUT)], check=True, capture_output=True)
        print(f'  {OUT.relative_to(ROOT)}  {OUT.stat().st_size // 1024} KB')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return 0


if __name__ == '__main__':
    sys.exit(main())
