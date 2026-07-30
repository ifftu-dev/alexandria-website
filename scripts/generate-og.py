#!/usr/bin/env python3
"""
Generate the Open Graph / Twitter card images.

Run this whenever the headline copy or the palette changes:

    python3 scripts/generate-og.py

Renders one card per page with headless Chrome and writes JPEGs to
`public/og/`. JPEG rather than PNG on purpose: these are flat gradients, which
PNG stores badly — the previous hand-made card was a 200 KB PNG, and WhatsApp
declines to fetch previews much beyond 300 KB.

The cards deliberately reuse the site's own values rather than approximating
them: BASE and the BLOBS palettes below are copied from MeshGradient.vue and the
per-page *_BLOBS constants, the mark is the same SVG as the nav, and the type is
the same self-hosted Inter. A card that looks close but not right is worse than
one that is obviously a card.
"""
import base64
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'og'
FONT = ROOT / 'node_modules' / '@fontsource-variable' / 'inter' / 'files' / 'inter-latin-wght-normal.woff2'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# From MeshGradient.vue: the colour painted under the blobs.
BASE = '#131a38'

# Blob palettes, matching each page's own MeshGradient. Positions come from the
# component's SEEDS, so a card reads as a still frame of the page's hero.
BLOBS = {
    'home': ['79,70,229', '34,211,238', '244,114,182', '251,191,36', '16,185,129'],
    'recruiter': ['14,159,110', '34,211,238', '16,185,129', '45,212,191', '59,130,246'],
    'institutions': ['37,99,235', '129,140,248', '96,165,250', '34,211,238', '79,70,229'],
    'privacy': ['79,70,229', '99,102,241', '34,211,238', '129,140,248', '79,70,229'],
}

SEEDS = [(0.22, 0.28, 0.78), (0.78, 0.22, 0.66), (0.68, 0.82, 0.60),
         (0.30, 0.74, 0.54), (0.52, 0.46, 0.62)]

CARDS = {
    'home': ('Alpha · early access', 'Knowledge belongs to everyone.',
             'A free, open-source learning app. Study offline and own the credentials you earn.'),
    'recruiter': ('For recruiters', 'Hire verified talent, not resumes.',
                  'Credentials you can check yourself, and a transparent record of how someone learned.'),
    'institutions': ('For institutions', 'Your LMS, their credentials.',
                     'Open source, mapped to real skills, and no vendor lock-in.'),
    'privacy': ('Data policy', 'We don’t track you.',
                'One email address, and only if you ask for early access.'),
}


def gradients(name: str) -> str:
    """Radial gradients at the component's own seed positions."""
    parts = []
    for rgb, (x, y, r) in zip(BLOBS[name], SEEDS):
        parts.append(
            f'radial-gradient(circle at {x * 100:.0f}% {y * 100:.0f}%, '
            f'rgba({rgb},0.62) 0%, rgba({rgb},0.28) 38%, rgba({rgb},0) 68%)'
        )
    return ', '.join(parts)


def html(name: str, font_b64: str) -> str:
    eyebrow, title, sub = CARDS[name]
    return f"""<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {{
    font-family: 'Inter';
    src: url(data:font/woff2;base64,{font_b64}) format('woff2-variations');
    font-weight: 100 900;
  }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 1200px; height: 630px; }}
  body {{
    font-family: 'Inter', system-ui, sans-serif;
    background: {BASE};
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }}
  .blobs {{ position: absolute; inset: 0; background-image: {gradients(name)}; }}
  /* Same scrim the hero uses, so the type keeps its contrast over any blob. */
  .scrim {{
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(6,10,28,0.52) 0%, rgba(6,10,28,0.14) 46%, rgba(6,10,28,0.46) 100%);
  }}
  .card {{ position: relative; height: 100%; padding: 68px 76px; display: flex; flex-direction: column; }}
  .brand {{ display: flex; align-items: center; gap: 13px; color: #fff; }}
  .brand span {{ font-size: 27px; font-weight: 700; letter-spacing: -0.02em; }}
  .body {{ margin-top: auto; }}
  .eyebrow {{
    display: inline-block;
    font-size: 15px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.28);
    border-radius: 999px; padding: 7px 16px; margin-bottom: 26px;
  }}
  h1 {{
    font-size: 74px; font-weight: 700; line-height: 1.03; letter-spacing: -0.038em;
    color: #fff; max-width: 17ch;
  }}
  p {{
    margin-top: 22px; font-size: 25px; line-height: 1.45;
    color: rgba(255,255,255,0.86); max-width: 34ch; font-weight: 400;
  }}
  .foot {{
    margin-top: 40px; display: flex; align-items: center; justify-content: space-between;
    font-size: 19px; color: rgba(255,255,255,0.72);
  }}
  .foot b {{ color: #fff; font-weight: 600; }}
</style>
<div class="blobs"></div><div class="scrim"></div>
<div class="card">
  <div class="brand">
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="#fff" stroke-width="2" fill="none"/>
      <path d="M16 8v16M8 12l8 4 8-4" stroke="#fff" stroke-width="2"/>
    </svg>
    <span>Alexandria</span>
  </div>
  <div class="body">
    <div class="eyebrow">{eyebrow}</div>
    <h1>{title}</h1>
    <p>{sub}</p>
    <div class="foot"><span>alexandria.ifftu.dev</span><span><b>Free</b> and open source</span></div>
  </div>
</div>
"""


def main() -> int:
    if not pathlib.Path(CHROME).exists():
        print(f'Chrome not found at {CHROME}', file=sys.stderr)
        return 1
    if not FONT.exists():
        print(f'Inter woff2 not found at {FONT} — run npm install first', file=sys.stderr)
        return 1

    font_b64 = base64.b64encode(FONT.read_bytes()).decode()
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = ROOT / '.og-tmp'
    tmp.mkdir(exist_ok=True)

    try:
        for name in CARDS:
            page = tmp / f'{name}.html'
            page.write_text(html(name, font_b64))
            png = tmp / f'{name}.png'
            subprocess.run([
                CHROME, '--headless', '--disable-gpu', '--hide-scrollbars',
                '--force-device-scale-factor=1', '--window-size=1200,630',
                f'--screenshot={png}', page.as_uri(),
            ], check=True, capture_output=True)

            jpg = OUT / f'{name}.jpg'
            subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82',
                            str(png), '--out', str(jpg)], check=True, capture_output=True)
            print(f'  {jpg.relative_to(ROOT)}  {jpg.stat().st_size // 1024} KB')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    return 0


if __name__ == '__main__':
    sys.exit(main())
