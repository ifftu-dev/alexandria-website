import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const p = await ctx.newPage();
  await p.goto('https://alexandria.ifftu.dev/institutions', { waitUntil: 'networkidle' });
  
  // Search all stylesheets for any rule containing "h-" 
  const rules = await p.evaluate(() => {
    const found = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && /\.h-\d/.test(rule.selectorText)) {
            found.push(rule.selectorText);
          }
          if (rule.selectorText && /\.w-\d/.test(rule.selectorText)) {
            found.push(rule.selectorText);
          }
        }
      } catch(e) {}
    }
    return found.slice(0, 20);
  });
  console.log('h-/w- rules found:', JSON.stringify(rules, null, 2));
  
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
