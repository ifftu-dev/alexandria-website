import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const p = await ctx.newPage();
  await p.goto('https://alexandria.ifftu.dev/institutions', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  
  // Check a specific h-4 w-4 SVG
  const info = await p.evaluate(() => {
    const svg = document.querySelector('svg.h-4');
    if (!svg) return 'no svg.h-4 found';
    const cs = window.getComputedStyle(svg);
    return {
      width: cs.width,
      height: cs.height,
      minWidth: cs.minWidth,
      maxWidth: cs.maxWidth,
      display: cs.display,
      overflow: cs.overflow,
      classList: svg.getAttribute('class'),
      hasWidthAttr: svg.hasAttribute('width'),
      hasHeightAttr: svg.hasAttribute('height'),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  
  // Also check if Tailwind classes are in the stylesheet
  const hasH4 = await p.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('.h-4')) {
            return { selector: rule.selectorText, cssText: rule.cssText.substring(0, 200) };
          }
        }
      } catch(e) {}
    }
    return 'not found';
  });
  console.log('h-4 rule:', JSON.stringify(hasH4, null, 2));
  
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
