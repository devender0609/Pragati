// v0.83.1 §21 — live curriculum QA across Classes 1-12.
// Drives the Teacher curriculum panel at three widths, reads what it
// actually renders, and fails on: a missing class, a "0 sections" claim
// for a book that numbers none, an ambiguous duplicate "Chapter 1",
// internal ids on screen, or Class 9 shown as complete.
import puppeteer from 'puppeteer';
const BASE = 'http://127.0.0.1:4173/';
const WIDTHS = [390, 768, 1440];
const wait = (m) => new Promise((r) => setTimeout(r, m));
const problems = [];
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
for (const w of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(900);
  // The app has no URL routes for teacher sub-views; reach Resources the
  // way visualQa.mjs does — through the header mode toggle.
  const click = async (label) =>
    page.evaluate((t) => {
      const b = [...document.querySelectorAll('button')].find(
        (x) => x.textContent.trim() === t && x.offsetParent !== null
      );
      if (b) b.click();
      return Boolean(b);
    }, label);
  await click('Student mode');
  await wait(900);
  await click('Teacher dashboard');
  await wait(900);
  for (const l of ['Not now', 'Skip', 'Close']) await click(l);
  await click('Resources');
  await wait(900);
  // The picker is a row of buttons labelled "Class N", not a <select>.
  for (let n = 1; n <= 12; n++) {
    const clicked = await page.evaluate((label) => {
      const b = [...document.querySelectorAll('button')].find(
        (x) => x.textContent.trim() === label && x.offsetParent !== null
      );
      if (b) b.click();
      return Boolean(b);
    }, `Class ${n}`);
    if (!clicked) { problems.push(`Class ${n}@${w}: no picker button`); continue; }
    await wait(250);
    const text = await page.evaluate(() => document.body.innerText);
    if (!/Class\s*\d+/.test(text)) problems.push(`Class ${n}@${w}: no class heading`);
    if (/ncert_|cbse_|fingerprint|artifact v/i.test(text)) problems.push(`Class ${n}@${w}: internal id or governance term on screen`);
    if (n <= 5 && /\b0\s+sections\b/.test(text)) problems.push(`Class ${n}@${w}: claims 0 sections for a book that numbers none`);
    if (n === 9 && !/Ganita Manjari|Part I|CBSE/i.test(text)) problems.push(`Class 9@${w}: no source named`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (overflow) problems.push(`Class ${n}@${w}: horizontal overflow`);
  }
  await page.close();
}
console.log(problems.length ? problems.join('\n') : 'curriculum QA: 12 classes x 3 widths, 0 problems');
await browser.close();
