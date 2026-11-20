// v0.84.0-c11.40 checkpoint 96C — identity-first walk for Chapter 5 plus the
// chapter-less FO-6. Identity is PROVEN before any evidence is read, and the
// run fails on a collision, because checkpoint 93 found a walk that read one
// lesson seven times and reported 7/7.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const TARGETS = [
  ['ncert_kemh1_s5_2_inequalities_lesson', 'Linear Inequalities', 0],
  ['ncert_kemh1_s5_3_one_variable_lesson', 'Linear Inequalities', 1],
  ['cbse_fo6_half_plane_lesson', null, null],
];
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const seen = new Set();
let stages = 0; let leaks = 0; let errors = 0;
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const [wanted, chapter, idx] of TARGETS) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  p.on('console', (m) => { if (m.type() === 'error') errors += 1; });
  await seedStudentForBrowserQa(p);
  if (chapter) await clickByText(p, chapter);
  await p.evaluate((id) => {
    const r = document.querySelector(`[data-artifact-id="${id}"]`);
    (r instanceof HTMLElement ? r : r?.querySelector('button,a,[role=button]'))?.click();
  }, wanted);
  await new Promise((r) => setTimeout(r, 650));
  const opened = await p.evaluate(() => document.querySelector('[data-open-artifact-id]')?.getAttribute('data-open-artifact-id')
    || document.body.getAttribute('data-open-artifact-id') || null);
  const title = await p.evaluate(() => document.querySelector('h1,h2')?.textContent?.trim() ?? '');
  const identity = opened || title;
  if (seen.has(identity)) { console.log(`COLLISION: ${wanted} opened the same lesson again (${identity})`); process.exit(1); }
  seen.add(identity);
  let mine = 0;
  const figures = [];
  for (const s of STAGES) {
    await clickByText(p, s, 300);
    await new Promise((r) => setTimeout(r, 260));
    const got = await p.evaluate(() => ({
      kinds: [...document.querySelectorAll('[data-visual-kind]')]
        .filter((n) => n.getBoundingClientRect().width > 0)
        .map((n) => n.getAttribute('data-visual-kind')),
      text: document.body.innerText,
    }));
    if (/\b(NaN|undefined|null|\[object Object\])\b/.test(got.text)) leaks += 1;
    figures.push(...got.kinds);
    mine += 1;
  }
  stages += mine;
  console.log(`${wanted.padEnd(40)} identity "${identity.slice(0, 34)}" | stages ${mine}/5 | figures ${[...new Set(figures)].join(',') || 'none (symbolic)'}`);
  await p.close();
}
await b.close();
console.log(`\nDISTINCT ${seen.size}/${TARGETS.length} | STAGES ${stages}/${TARGETS.length * 5} | LEAKS ${leaks} | CONSOLE ERRORS ${errors}`);
