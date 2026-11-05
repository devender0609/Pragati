// v0.77 §14 — capture each Home concept at the two widths that decide it.
import puppeteer from 'puppeteer';
import fs from 'fs';
const BASE = 'http://127.0.0.1:4173/concepts.html';
const OUT = 'concepts-v077';
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const c of ['a', 'b', 'c']) {
  for (const width of [1440, 390]) {
    const p = await b.newPage();
    await p.setViewport({ width, height: 900 });
    await p.goto(`${BASE}?c=${c}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2200));
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    await p.screenshot({ path: `${OUT}/direction-${c}-${width}.png`, fullPage: true });
    console.log(`direction-${c}@${width} overflow=${overflow}`);
    await p.close();
  }
}
await b.close();
