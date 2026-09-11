// v0.77 §19 — revised Direction C, both widths, plus one interaction state.
import puppeteer from 'puppeteer';
import fs from 'fs';
const OUT = 'concepts-v077';
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const shots = [
  ['c2-1440', 1440, '?c=c'],
  ['c2-390', 390, '?c=c'],
  ['c2-interaction-1440', 1440, '?c=c&s=1'],
];
for (const [name, width, q] of shots) {
  const p = await b.newPage();
  await p.setViewport({ width, height: 900 });
  await p.goto(`http://127.0.0.1:4173/concepts.html${q}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1600));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  const tiny = await p.evaluate(() => [...document.querySelectorAll('button')].filter((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.height < 44; }).length);
  const h = await p.evaluate(() => document.body.scrollHeight);
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`${name} overflow=${overflow} tinyTargets=${tiny} pageHeight=${h}`);
  await p.close();
}
await b.close();
