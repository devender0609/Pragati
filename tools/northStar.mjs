// v0.76 §1/§14 — NORTH-STAR CAPTURE.
//
// The three flagship surfaces, at the two widths §1 names, plus the
// chapter landing that sits between them. Same contract discipline as
// visualQa.mjs: a capture that cannot prove which screen it is does not
// get saved.
import puppeteer from 'puppeteer';
import fs from 'fs';
import { ROUTE_CONTRACTS, checkContract } from './routeContracts.mjs';

const BASE = process.env.PRAGATI_URL ?? 'http://127.0.0.1:4173/';
const OUT = process.env.PRAGATI_SHOTS ?? 'shots-v076';
const WIDTHS = (process.env.PRAGATI_WIDTHS ?? '390,1440').split(',').map(Number);
fs.mkdirSync(OUT, { recursive: true });
const wait = (m) => new Promise((r) => setTimeout(r, m));
const results = [];
const RETURNING = [{ id: 'stu_demo_1', name: 'Asha', grade: 'Class 6', gradeId: 'class6', curriculumId: 'cbse', createdAt: Date.now() - 8.64e7 }];

async function capture(p, id, width) {
  const c = ROUTE_CONTRACTS[id];
  const text = await p.evaluate(() => document.body.innerText);
  const fail = c ? checkContract(c, text) : [];
  if (fail.length) { results.push({ route: id, width, status: 'FAILED', failures: fail }); return false; }
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  const tiny = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('button,a[href],select,input,textarea,[role="radio"]')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.height < 44) out.push(`${el.tagName}:${(el.textContent||'').trim().slice(0,20)}:${Math.round(r.height)}`);
    }
    return out;
  });
  await p.screenshot({ path: `${OUT}/${id}-${width}.png`, fullPage: true });
  results.push({ route: id, width, status: 'OK', overflow, tiny: tiny.slice(0, 4) });
  return true;
}
async function clickText(p, t) {
  await p.evaluate((t) => {
    const b = [...document.querySelectorAll('button,a')].find((x) => (x.textContent || '').includes(t));
    if (b) { b.scrollIntoView({ block: 'center' }); b.click(); }
  }, t);
  await wait(650);
}
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const width of WIDTHS) {
  const p = await browser.newPage();
  await p.setViewport({ width, height: 900 });
  await p.goto(BASE, { waitUntil: 'domcontentloaded' });
  await p.evaluate((s) => { localStorage.clear(); localStorage.setItem('pragati.students.v1', JSON.stringify(s)); }, RETURNING);
  await p.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(900);
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /Skip|Close|Maybe later|Not now|Dismiss/i.test(x.textContent || ''));
    if (b) b.click();
  });
  await wait(400);
  await capture(p, 'student_home_returning', width);
  // The logo button's accessible text is "Pragati / Learn and practise
  // maths", so a substring match on "Learn" hits the masthead and lands
  // on the landing page. Tabs are selected by role.
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('[role="tab"]')].find((x) => (x.textContent || '').trim() === 'Learn');
    if (b) b.click();
  });
  await wait(700);
  await capture(p, 'student_learn', width);
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /Open this chapter|Chapter 7/.test(x.textContent || ''));
    if (b) { b.scrollIntoView({ block: 'center' }); b.click(); }
  });
  await wait(700);
  await capture(p, 'student_fractions', width);
  await clickText(p, 'Fractions as parts of a whole');
  await capture(p, 'student_lesson', width);
  await p.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/verification.json`, JSON.stringify(results, null, 2));
for (const r of results) console.log(`${r.status} ${r.route}@${r.width}` + (r.status === 'OK' ? ` overflow=${r.overflow} tiny=${r.tiny.join('|')}` : ` :: ${r.failures.join('; ')}`));
