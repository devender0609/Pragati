// v0.77 §20 — the routed deliverables. Every capture asserts the route
// and state it claims, so a screenshot cannot silently be of the wrong
// screen.
import puppeteer from 'puppeteer';
import fs from 'fs';
const OUT = 'studio-v077';
fs.mkdirSync(OUT, { recursive: true });
const B = 'http://127.0.0.1:4173/concepts.html';
const shots = [
  ['home-first-1440', 1440, '?c=c', ['See fractions in different ways', 'Practice you can do now']],
  ['home-first-390', 390, '?c=c', ['See fractions in different ways']],
  ['home-first-360', 360, '?c=c', ['See fractions in different ways']],
  ['home-first-430', 430, '?c=c', ['See fractions in different ways']],
  ['home-returning-1440', 1440, '?c=c&state=returning', ['Continue practice', 'sets finished']],
  ['home-returning-390', 390, '?c=c&state=returning', ['Continue practice']],
  ['learn-1440', 1440, '?p=learn', ['Class 6 mathematics', 'The whole book, in order', 'Chapters coming later']],
  ['learn-390', 390, '?p=learn', ['Class 6 mathematics', 'Chapters coming later']],
  ['lesson-1-learn-1440', 1440, '?p=lesson&stage=0', ['Learn the idea']],
  ['lesson-1-learn-390', 390, '?p=lesson&stage=0', ['Learn the idea']],
  ['lesson-2-see-1440', 1440, '?p=lesson&stage=1', ['See it']],
  ['lesson-2-see-390', 390, '?p=lesson&stage=1', ['See it']],
  ['lesson-3-examples-1440', 1440, '?p=lesson&stage=2', ['Problem 1', 'Answer']],
  ['lesson-3-examples-390', 390, '?p=lesson&stage=2', ['Problem 1']],
  ['lesson-4-try-1440', 1440, '?p=lesson&stage=3', ['Question 1 of']],
  ['lesson-4-try-390', 390, '?p=lesson&stage=3', ['Question 1 of']],
  ['lesson-4-try-feedback-1440', 1440, '?p=lesson&stage=3&answer=0', ['Question 1 of']],
  ['lesson-5-think-1440', 1440, '?p=lesson&stage=4', ['Another student writes']],
  ['lesson-5-think-390', 390, '?p=lesson&stage=4', ['Another student writes']],
];
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
let bad = 0;
for (const [name, width, q, must] of shots) {
  const p = await b.newPage();
  await p.setViewport({ width, height: 900 });
  await p.goto(B + q, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1400));
  const text = await p.evaluate(() => document.body.innerText);
  const missing = must.filter((m) => !text.includes(m));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  const tiny = await p.evaluate(() => [...document.querySelectorAll('button')].filter((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.height < 44; }).length);
  const h = await p.evaluate(() => document.body.scrollHeight);
  if (missing.length) { bad += 1; console.log(`REFUSED ${name} :: missing ${missing.join(', ')}`); }
  else { await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true }); console.log(`OK ${name} h=${h} overflow=${overflow} tiny=${tiny}`); }
  await p.close();
}
await b.close();
console.log(`captured ${shots.length - bad}, refused ${bad}`);
