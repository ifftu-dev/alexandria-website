#!/usr/bin/env python3
"""
Generate the Open Graph / Twitter card images.

    python3 scripts/generate-og.py

Renders one card per route with headless Chrome and writes JPEGs to `public/og/`.
JPEG rather than PNG on purpose: these are flat gradients, which PNG stores
badly — the original hand-made card was a 200 KB PNG, and WhatsApp declines to
fetch previews much beyond 300 KB.

A DARK AND A LIGHT SET ARE PRODUCED, and it is worth being exact about what that
does and does not buy, because it is easy to assume more:

  * Open Graph has no mechanism for color scheme. Slack, LinkedIn, X, iMessage
    and every other unfurler fetches ONE image on the server, with no browser and
    no `prefers-color-scheme` to consult. `og:image` therefore points at the dark
    card, which matches the site's hero.
  * The light set exists for the places a theme-aware asset genuinely works —
    embedding in a light-background deck, a README, documentation — and so the
    pair stays in step whenever the copy changes.

Assets that DO follow the reader's setting are the favicon and `theme-color`;
see `public/icon.svg`, which carries its own media query.

The cards reuse the site's own values rather than approximating them: BASE and
the blob palettes come from MeshGradient.vue, the positions are its SEEDS, the
mark is the nav's SVG, and the type is the same self-hosted Newsreader and Public
Sans. A card that looks close but not right is worse than an obvious card.
"""
import base64
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'og'
MODULES = ROOT / 'node_modules'
DISPLAY_FONT = MODULES / '@fontsource-variable' / 'newsreader' / 'files' / 'newsreader-latin-wght-normal.woff2'
BODY_FONT = MODULES / '@fontsource-variable' / 'public-sans' / 'files' / 'public-sans-latin-wght-normal.woff2'
MONO_FONT = MODULES / '@fontsource' / 'ibm-plex-mono' / 'files' / 'ibm-plex-mono-latin-500-normal.woff2'

CHROME_CANDIDATES = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

# From MeshGradient.vue: the color painted under the blobs, per theme.
BASE = {'dark': '#131a38', 'light': '#f2f4fb'}

SEEDS = [(0.22, 0.28, 0.78), (0.78, 0.22, 0.66), (0.68, 0.82, 0.60),
         (0.30, 0.74, 0.54), (0.52, 0.46, 0.62)]

INDIGO = ['79,70,229', '99,102,241', '34,211,238', '129,140,248', '79,70,229']
GREEN = ['14,159,110', '34,211,238', '16,185,129', '45,212,191', '59,130,246']
BLUE = ['37,99,235', '129,140,248', '96,165,250', '34,211,238', '79,70,229']
WARM = ['251,191,36', '244,114,182', '79,70,229', '34,211,238', '16,185,129']

# (route stem, blob palette, eyebrow, title, subtitle)
# Titles are the pages' own h1s, trimmed only where 72px over 18ch would not fit.
CARDS = [
    ('home', INDIGO, 'Alpha · waiting list open',
     'Education, and its recognition — free, forever.',
     'Learning became free. Recognition did not. A credential you own outright, that anyone can verify.'),
    ('why-recognition', INDIGO, 'The evidence',
     'Free learning already exists. It was never enough.',
     'The research behind the recognition gap — and the two claims we cannot yet evidence.'),
    ('technology', INDIGO, 'Technology',
     'Every claim on this site is a thing you can check.',
     'Identity, sync, integrity and assessment, named precisely enough to argue with.'),
    ('learners', INDIGO, 'For learners',
     'Learn free. Keep the proof.',
     'Study offline, earn credentials signed under your own key, and prove them to anyone.'),
    ('employers', GREEN, 'For recruiters & employers',
     'Hire verified talent, not resumes.',
     'A signed record of an assessment you can open, inspect and verify yourself.'),
    ('institutions', BLUE, 'For institutions',
     'Your LMS. Their credentials.',
     'Open source, self-hostable, mapped to a public skill graph. No vendor lock-in.'),
    ('verify', INDIGO, 'Verify',
     'Check a credential yourself.',
     'The signature is verified in your browser, against the issuer’s own key. Nothing is uploaded.'),
    ('pilots', BLUE, 'Pilots',
     'Small, real, and measured.',
     'One program or one role family, with success measures agreed before we start.'),
    ('partners', WARM, 'Partners',
     'Where access is hardest.',
     'Offline-first learning, multilingual delivery, and credentials that outlast the program.'),
    ('trust', INDIGO, 'Trust',
     'What we can claim today.',
     'Dated statuses instead of adjectives. Where something is not reviewed or built, this says so.'),
    ('privacy', INDIGO, 'Privacy',
     'Very little to write here.',
     'Mostly a description of data we never receive, because the app runs on your device.'),
]

# Per theme: page ink, secondary ink, scrim over the blobs, chip border.
THEME = {
    'dark': {
        'ink': '#ffffff',
        'ink2': 'rgba(255,255,255,0.86)',
        'ink3': 'rgba(255,255,255,0.72)',
        'chip': 'rgba(255,255,255,0.28)',
        'scrim': ('linear-gradient(160deg, rgba(6,10,28,0.52) 0%, '
                  'rgba(6,10,28,0.20) 46%, rgba(6,10,28,0.46) 100%)'),
        'alpha': (0.62, 0.28),
    },
    'light': {
        'ink': '#0f1428',
        'ink2': 'rgba(20,26,54,0.80)',
        'ink3': 'rgba(20,26,54,0.62)',
        'chip': 'rgba(20,26,54,0.22)',
        # Lifts the field rather than darkening it, so the ink stays the darkest
        # thing on the card.
        'scrim': ('linear-gradient(160deg, rgba(247,248,251,0.60) 0%, '
                  'rgba(247,248,251,0.32) 46%, rgba(247,248,251,0.64) 100%)'),
        'alpha': (0.40, 0.18),
    },
}


def gradients(blobs, theme: str) -> str:
    """Radial gradients at the component's own seed positions."""
    a1, a2 = THEME[theme]['alpha']
    return ', '.join(
        f'radial-gradient(circle at {x * 100:.0f}% {y * 100:.0f}%, '
        f'rgba({rgb},{a1}) 0%, rgba({rgb},{a2}) 38%, rgba({rgb},0) 68%)'
        for rgb, (x, y, _r) in zip(blobs, SEEDS)
    )


def html(card, theme: str, fonts: dict) -> str:
    _stem, blobs, eyebrow, title, sub = card
    t = THEME[theme]
    return f"""<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {{ font-family: 'Newsreader'; src: url(data:font/woff2;base64,{fonts['display']}) format('woff2-variations'); font-weight: 200 800; }}
  @font-face {{ font-family: 'Public Sans'; src: url(data:font/woff2;base64,{fonts['body']}) format('woff2-variations'); font-weight: 100 900; }}
  @font-face {{ font-family: 'Plex Mono'; src: url(data:font/woff2;base64,{fonts['mono']}) format('woff2'); font-weight: 500; }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 1200px; height: 630px; }}
  body {{
    font-family: 'Public Sans', system-ui, sans-serif;
    background: {BASE[theme]};
    position: relative; overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }}
  .blobs {{ position: absolute; inset: 0; background-image: {gradients(blobs, theme)}; }}
  .scrim {{ position: absolute; inset: 0; background: {t['scrim']}; }}
  .card {{ position: relative; height: 100%; padding: 66px 76px; display: flex; flex-direction: column; }}
  .brand {{ display: flex; align-items: center; gap: 13px; color: {t['ink']}; }}
  .brand span {{ font-size: 27px; font-weight: 700; letter-spacing: -0.02em; }}
  .body {{ margin-top: auto; }}
  .eyebrow {{
    display: inline-block;
    font-family: 'Plex Mono', ui-monospace, monospace;
    font-size: 14px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
    color: {t['ink2']}; border: 1px solid {t['chip']};
    border-radius: 999px; padding: 8px 17px; margin-bottom: 26px;
  }}
  h1 {{
    font-family: 'Newsreader', Georgia, serif;
    font-size: 72px; font-weight: 300; line-height: 1.04; letter-spacing: -0.018em;
    color: {t['ink']}; max-width: 18ch;
  }}
  p {{ margin-top: 22px; font-size: 24px; line-height: 1.45; color: {t['ink2']}; max-width: 36ch; }}
  .foot {{
    margin-top: 38px; display: flex; align-items: center; justify-content: space-between;
    font-size: 18px; color: {t['ink3']};
  }}
  .foot b {{ color: {t['ink']}; font-weight: 600; }}
</style>
<div class="blobs"></div><div class="scrim"></div>
<div class="card">
  <div class="brand">
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="{t['ink']}" stroke-width="2" fill="none"/>
      <path d="M16 8v16M8 12l8 4 8-4" stroke="{t['ink']}" stroke-width="2"/>
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


def find_chrome() -> str | None:
    for path in CHROME_CANDIDATES:
        if pathlib.Path(path).exists():
            return path
    # Playwright's browser is already a dev dependency and does the job.
    try:
        out = subprocess.run(
            ['node', '-e', "const{chromium}=require('playwright');console.log(chromium.executablePath())"],
            cwd=ROOT, capture_output=True, text=True, check=True)
        candidate = out.stdout.strip()
        if candidate and pathlib.Path(candidate).exists():
            return candidate
    except Exception:
        pass
    return None


def main() -> int:
    chrome = find_chrome()
    if not chrome:
        print('No Chrome or Chromium found. Install Chrome, or `npx playwright install chromium`.',
              file=sys.stderr)
        return 1
    for font in (DISPLAY_FONT, BODY_FONT, MONO_FONT):
        if not font.exists():
            print(f'{font} not found — run npm install first', file=sys.stderr)
            return 1

    fonts = {
        'display': base64.b64encode(DISPLAY_FONT.read_bytes()).decode(),
        'body': base64.b64encode(BODY_FONT.read_bytes()).decode(),
        'mono': base64.b64encode(MONO_FONT.read_bytes()).decode(),
    }
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = ROOT / '.og-tmp'
    tmp.mkdir(exist_ok=True)

    try:
        for theme in ('dark', 'light'):
            for card in CARDS:
                stem = card[0]
                # Dark is the shipped card, so it keeps the bare name.
                name = stem if theme == 'dark' else f'{stem}-light'
                page = tmp / f'{name}.html'
                page.write_text(html(card, theme, fonts))
                png = tmp / f'{name}.png'
                subprocess.run([
                    chrome, '--headless', '--disable-gpu', '--hide-scrollbars',
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
