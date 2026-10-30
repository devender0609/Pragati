// v0.77 §18 — PRODUCTION routes, not concept routes. Every capture
// asserts a required marker and a forbidden stale marker before it is
// saved; a screenshot that cannot prove which screen it is does not
// count as evidence.
import puppeteer from 'puppeteer';
import fs from 'fs';
const OUT = 'production-v0772';
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:4173/';
const S = [{ id: 'stu_demo_1', name: 'Asha', grade: 'Class 6', gradeId: 'class6', curriculumId: 'cbse', createdAt: Date.now() - 8.64e7 }];
const wait = (m) => new Promise((r) => setTimeout(r, m));
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const res = [];
async function shot(p, name, width, must, forbidden = []) {
  // v0.77.2 — scroll to the top before capturing. A fullPage screenshot
  // renders `position: sticky` elements at their CURRENT viewport offset,
  // so a page captured after clicking a stage button drew the masthead
  // partway down the image, sitting on top of the lesson band. I spent a
  // round "fixing" spacing that was never wrong: the layout was fine and
  // the evidence was lying. Capture from the top, or the picture is of
  // the harness rather than of the product.
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 250));
  const t = await p.evaluate(() => document.body.innerText);
  const miss = must.filter((m) => !t.includes(m));
  const stale = forbidden.filter((m) => t.includes(m));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  const h = await p.evaluate(() => document.body.scrollHeight);
  if (miss.length || stale.length) { res.push({ name, width, status: 'REFUSED', miss, stale }); return; }
  await p.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
  res.push({ name, width, status: 'OK', h, overflow });
}
async function tab(p, label) {
  await p.evaluate((l) => { const b = [...document.querySelectorAll('[role="tab"]')].find((x) => (x.textContent || '').trim() === l); if (b) b.click(); }, label);
  await wait(700);
}
async function clickText(p, t) {
  await p.evaluate((t) => { const b = [...document.querySelectorAll('button')].find((x) => (x.textContent || '').includes(t)); if (b) { b.scrollIntoView({ block: 'center' }); b.click(); } }, t);
  await wait(800);
}
for (const width of [360, 390, 430, 768, 1440]) {
  const p = await b.newPage();
  await p.setViewport({ width, height: 900 });
  await p.goto(BASE, { waitUntil: 'domcontentloaded' });
  await p.evaluate((s) => { localStorage.clear(); localStorage.setItem('pragati.students.v1', JSON.stringify(s)); }, S);
  await p.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(900);
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Skip/i.test(x.textContent || '')); if (b) b.click(); });
  await wait(400);
  // §19 — the v0.76 Home copy must be gone, not merely unused.
  await shot(p, 'home-first-run', width, ['Hi, Asha', 'Practice you can do now'], ['Pragati follows your textbook, chapter by chapter', 'Ready to learn']);
  await tab(p, 'Learn');
  await shot(p, 'learn', width, ['Class 6 mathematics', 'The whole book, in order'], ['Ready to learn']);
  await clickText(p, 'Open this chapter');
  await shot(p, 'fractions-chapter', width, ['Fractions'], []);
  await tab(p, 'Home');
  await clickText(p, 'Fractions as parts of a whole');
  const FORBIDDEN = ['FR.02', 'Reteach', 'Mixed assessment', 'Notes for a teacher or parent', 'prototype draft', 'diff.', 'WHY STUDENTS DO THIS', 'Why students do this', 'How to fix it', 'Looks like:', 'Start a practice set'];
  const stages = [['lesson-learn', 'Learn the idea'], ['lesson-see', 'See it'], ['lesson-examples', 'Worked examples'], ['lesson-try', 'Try it'], ['lesson-think', 'Think deeper']];
  for (const [name, label] of stages) {
    await clickText(p, label);
    await shot(p, name, width, [label], FORBIDDEN);
  }
  // Try-it feedback: commit an answer, then capture the response state.
  await clickText(p, 'Try it');
  await p.evaluate(() => { const b = document.querySelector('button.border-2'); if (b) b.click(); });
  await wait(500);
  await shot(p, 'lesson-try-feedback', width, ['Question 1 of'], FORBIDDEN);
  await p.close();
}
await b.close();
fs.writeFileSync(`${OUT}/verification.json`, JSON.stringify(res, null, 2));
const bad = res.filter((r) => r.status !== 'OK');
for (const r of res) console.log(r.status === 'OK' ? `OK ${r.name}@${r.width} h=${r.h} overflow=${r.overflow}` : `REFUSED ${r.name}@${r.width} miss=${r.miss} stale=${r.stale}`);
console.log(`captured ${res.length - bad.length}, refused ${bad.length}`);
