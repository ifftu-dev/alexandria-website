import { chromium } from 'playwright';

const SITE = 'https://alexandria.ifftu.dev';
const pages = ['/', '/recruiter', '/institutions'];
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function run() {
  const browser = await chromium.launch();
  
  for (const page of pages) {
    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const p = await ctx.newPage();
      await p.goto(`${SITE}${page}`, { waitUntil: 'networkidle' });
      // Wait for animations to settle
      await p.waitForTimeout(1500);
      
      const slug = page === '/' ? 'home' : page.replace(/\//g, '-').slice(1);
      
      // Full page screenshot
      await p.screenshot({ 
        path: `/tmp/alexandria-screenshots/${slug}-${vp.name}.png`,
        fullPage: true 
      });
      
      // Above the fold only
      await p.screenshot({ 
        path: `/tmp/alexandria-screenshots/${slug}-${vp.name}-fold.png`,
        fullPage: false 
      });
      
      await ctx.close();
    }
  }
  
  // Dark mode captures on mobile
  for (const page of pages) {
    const ctx = await browser.newContext({ 
      viewport: { width: 375, height: 812 },
      colorScheme: 'dark'
    });
    const p = await ctx.newPage();
    await p.goto(`${SITE}${page}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    
    const slug = page === '/' ? 'home' : page.replace(/\//g, '-').slice(1);
    await p.screenshot({ 
      path: `/tmp/alexandria-screenshots/${slug}-mobile-dark.png`,
      fullPage: true 
    });
    await p.screenshot({ 
      path: `/tmp/alexandria-screenshots/${slug}-mobile-dark-fold.png`,
      fullPage: false 
    });
    await ctx.close();
  }
  
  await browser.close();
  console.log('Done');
}

run().catch(e => { console.error(e); process.exit(1); });
