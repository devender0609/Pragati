// v0.83.5 §11 — the onboarding flow, in a real browser, all four steps,
// at three widths. jsdom proves the words; this proves they fit on a
// phone and that the buttons move you through.
import puppeteer from 'puppeteer';
import fs from 'fs';
const BASE = 'http://127.0.0.1:4173/';
const WIDTHS = [390, 768, 1440];
const FORBIDDEN = [
  /adaptive assessment/i, /prototype adaptive growth assessment/i,
  /adapted to how they answer/i, /assign an assessment/i,
  /Growth Assessment Prototype/i, /validated adaptive/i, /\bRIT\b/i,
  /nationally normed/i, /growth score/i,
];
const wait = (m) => new Promise((r) => setTimeout(r, m));
const rows = [];
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
for (const w of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await wait(900);
  for (let step = 1; step <= 4; step += 1) {
    const notes = [];
    const text = await page.evaluate(() => document.body.innerText);
    for (const re of FORBIDDEN) if (re.test(text)) notes.push(`forbidden claim: ${re}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    );
    if (overflow) notes.push('horizontal overflow');
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll('h2, p, li, button')].some((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > window.innerWidth + 2 || r.left < -2);
      })
    );
    if (clipped) notes.push('content clipped outside the viewport');
    if (step === 1 && !/learn and practise mathematics/i.test(text)) notes.push('step 1 truthful copy missing');
    if (step === 2 && !/Assign learning or practice/i.test(text)) notes.push('step 2 truthful copy missing');
    rows.push({ viewport: w, step, overflow, clipped, notes, result: notes.length ? 'FAIL' : 'PASS' });
    console.log(`${notes.length ? '!' : ' '} onboarding step ${step} @${w} ${notes.length ? 'FAIL ' + notes.join('; ') : 'PASS'}`);
    if (step === 4) break;
    const moved = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')]
        .filter((x) => x.offsetParent !== null)
        .find((x) => /^(next|continue)/i.test((x.textContent || '').trim()));
      if (b) b.click();
      return Boolean(b);
    });
    if (!moved) {
      rows.push({ viewport: w, step, notes: ['no next/continue button'], result: 'FAIL' });
      console.log(`! onboarding @${w} step ${step}: no way forward`);
      break;
    }
    await wait(400);
  }
  await page.close();
}
await browser.close();
fs.mkdirSync('qa-results', { recursive: true });
fs.writeFileSync('qa-results/v0835-onboarding-qa.json', JSON.stringify({ rows }, null, 2));
const bad = rows.filter((r) => r.result !== 'PASS');
console.log(`\nonboarding rows ${rows.length} pass ${rows.length - bad.length} fail ${bad.length}`);
process.exit(bad.length ? 1 : 0);
