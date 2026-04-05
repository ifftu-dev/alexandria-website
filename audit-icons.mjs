import { chromium } from 'playwright';

const SITE = 'https://alexandria.ifftu.dev';

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const p = await ctx.newPage();
  await p.goto(`${SITE}/institutions`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  
  // Scroll to trigger reveals
  await p.evaluate(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await delay(50);
    }
  });
  await p.waitForTimeout(500);
  
  // Check SVG sizes
  const svgInfo = await p.evaluate(() => {
    const svgs = document.querySelectorAll('svg');
    const big = [];
    svgs.forEach((svg, i) => {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 100 || rect.height > 100) {
        big.push({
          index: i,
          width: rect.width,
          height: rect.height,
          classes: svg.className?.baseVal || svg.getAttribute('class') || '',
          parent: svg.parentElement?.className || '',
          viewBox: svg.getAttribute('viewBox'),
        });
      }
    });
    return big;
  });
  
  console.log('Large SVGs found:', JSON.stringify(svgInfo, null, 2));
  
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
