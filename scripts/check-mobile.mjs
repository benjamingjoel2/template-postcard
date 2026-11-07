// Builds nothing: run `npm run build` first. Loads dist/ at phone widths and fails if
// the page can scroll sideways. Needs Playwright with Chromium (`npm i -D playwright`).
import { serve } from './serve.mjs';

import { createRequire } from 'node:module';

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
  // Fall back to a globally installed copy (CommonJS resolution honours NODE_PATH).
  try { ({ chromium } = createRequire(import.meta.url)('playwright')); } catch {}
}
if (!chromium) {
  console.error('Playwright is not installed. Run `npm i -D playwright && npx playwright install chromium`.');
  process.exit(1);
}

const widths = [320, 360, 375, 390, 414, 430, 768];
const server = await serve(4174);
const browser = await chromium.launch();
let failed = false;
for (const width of widths) {
  for (const menu of [false, true]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, isMobile: width < 768, hasTouch: true });
    await page.goto('http://localhost:4174/', { waitUntil: 'load' });
    if (menu) {
      try { await page.click('.menu-btn', { timeout: 3000 }); } catch {
        console.log(`FAIL ${width}px: the menu button is not reachable on screen`);
        failed = true; await page.close(); continue;
      }
    }
    // Scroll through so every reveal animation has run.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)); } window.scrollTo(0, 0); });
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      window.scrollTo(9999, window.scrollY);
      const sx = window.scrollX;
      window.scrollTo(0, window.scrollY);
      return { vw, sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, sx };
    });
    const ok = r.sw <= r.vw && r.bw <= r.vw && r.sx === 0;
    if (!ok) failed = true;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${width}px${menu ? ' (menu open)' : ''}: viewport ${r.vw}, document ${r.sw}, sideways scroll ${r.sx}px`);
    await page.close();
  }
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
