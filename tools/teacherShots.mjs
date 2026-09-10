// v0.78 §12/§30 — the six Teacher destinations, route-asserted.
import puppeteer from 'puppeteer';
import fs from 'fs';
const OUT = 'teacher-v078';
fs.mkdirSync(OUT, { recursive: true });
const wait = (m) => new Promise((r) => setTimeout(r, m));
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const res = [];
const TABS = [
  ['overview', 'Overview', ['What you can assign today']],
  ['classes', 'Classes', ['Students']],
  ['assign', 'Assign', ['Assign learning', 'Official lesson']],
  ['assess', 'Assess', ['Two different things', 'Instructional check', 'Pragati Growth']],
  ['insights', 'Insights', ['Insights']],
  ['resources', 'Resources', ['Curriculum']],
];
const FORBIDDEN = ['Assign assessments', 'assessment cards', 'Class-level growth', 'weak concepts', 'Teacher dashboard'];
for (const width of [360, 390, 430, 768, 1440]) {
  const p = await b.newPage();
  await p.setViewport({ width, height: 900 });
  await p.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => localStorage.clear());
  await p.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });
  await wait(800);
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Skip/i.test(x.textContent || '')); if (b) b.click(); });
  await wait(300);
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Student mode|Teacher mode/i.test(x.textContent || '')); if (b) b.click(); });
  await wait(900);
  for (const [id, label, must] of TABS) {
    const clicked = await p.evaluate((label) => {
      const els = [...document.querySelectorAll('button,[role="tab"]')];
      const b = els.find((x) => (x.textContent || '').trim() === label);
      if (b) { b.scrollIntoView({ block: 'center' }); b.click(); return true; }
      return false;
    }, label);
    await wait(800);
    await p.evaluate(() => window.scrollTo(0, 0));
    await wait(200);
    const text = await p.evaluate(() => document.body.innerText);
    const miss = must.filter((m) => !text.includes(m));
    const stale = FORBIDDEN.filter((m) => text.includes(m));
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    if (!clicked || miss.length || stale.length) {
      res.push({ id, width, status: 'FAIL', clicked, miss, stale });
    } else {
      await p.screenshot({ path: `${OUT}/${id}-${width}.png`, fullPage: true });
      res.push({ id, width, status: 'OK', overflow });
    }
  }
  await p.close();
}
await b.close();
fs.writeFileSync(`${OUT}/verification.json`, JSON.stringify(res, null, 2));
for (const r of res) console.log(r.status === 'OK' ? `OK ${r.id}@${r.width} overflow=${r.overflow}` : `FAIL ${r.id}@${r.width} clicked=${r.clicked} miss=${r.miss} stale=${r.stale}`);
console.log(`captured ${res.filter((r) => r.status === 'OK').length}, failed ${res.filter((r) => r.status !== 'OK').length}`);
