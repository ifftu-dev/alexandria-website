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
      await p.waitForTimeout(500);
      
      // Scroll through the entire page to trigger IntersectionObservers
      await p.evaluate(async () => {
        const delay = ms => new Promise(r => setTimeout(r, ms));
        const height = document.body.scrollHeight;
        const step = window.innerHeight / 2;
        for (let y = 0; y <= height; y += step) {
          window.scrollTo(0, y);
          await delay(100);
        }
        // Scroll back to top
        window.scrollTo(0, 0);
        await delay(200);
      });
      
      await p.waitForTimeout(500);
      
      const slug = page === '/' ? 'home' : page.replace(/\//g, '-').slice(1);
      await p.screenshot({ 
        path: `/tmp/alexandria-screenshots/${slug}-${vp.name}-scrolled.png`,
        fullPage: true 
      });
      
      await ctx.close();
    }
  }
  
  // Dark mode mobile
  for (const page of pages) {
    const ctx = await browser.newContext({ 
      viewport: { width: 375, height: 812 },
      colorScheme: 'dark'
    });
    const p = await ctx.newPage();
    await p.goto(`${SITE}${page}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    
    await p.evaluate(async () => {
      const delay = ms => new Promise(r => setTimeout(r, ms));
      const height = document.body.scrollHeight;
      const step = window.innerHeight / 2;
      for (let y = 0; y <= height; y += step) {
        window.scrollTo(0, y);
        await delay(100);
      }
      window.scrollTo(0, 0);
      await delay(200);
    });
    
    await p.waitForTimeout(500);
    
    const slug = page === '/' ? 'home' : page.replace(/\//g, '-').slice(1);
    await p.screenshot({ 
      path: `/tmp/alexandria-screenshots/${slug}-mobile-dark-scrolled.png`,
      fullPage: true 
    });
    await ctx.close();
  }
  
  await browser.close();
  console.log('Done');
}

run().catch(e => { console.error(e); process.exit(1); });
