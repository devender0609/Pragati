// v0.84.0-c11.43 checkpoint 97C — identity-first walk for Chapter 11.
// Figure properties are read from `figure[data-visual-kind]`, NOT the bare
// attribute: LearnSectionView also puts data-visual-kind on a
// `display: contents` wrapper, which carries no accessible description.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const TARGETS = [
  ['ncert_kemh1_s11_2_axes_planes_lesson', 0],
  ['ncert_kemh1_s11_3_coordinates_lesson', 1],
  ['ncert_kemh1_s11_4_distance_lesson', 2],
];
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const seen = new Set();
let stages = 0; let leaks = 0; let errors = 0;
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const [wanted] of TARGETS) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  p.on('console', (m) => { if (m.type() === 'error') errors += 1; });
  await seedStudentForBrowserQa(p);
  await clickByText(p, 'Introduction to Three Dimensional Geometry');
  await p.evaluate((id) => {
    const r = document.querySelector(`[data-artifact-id="${id}"]`);
    (r instanceof HTMLElement ? r : r?.querySelector('button,a,[role=button]'))?.click();
  }, wanted);
  await new Promise((r) => setTimeout(r, 650));
  const identity = await p.evaluate(() => document.querySelector('h1,h2')?.textContent?.trim() ?? '');
  if (seen.has(identity)) { console.log(`COLLISION on ${wanted}`); process.exit(1); }
  seen.add(identity);
  let mine = 0; const found = [];
  for (const s of STAGES) {
    await clickByText(p, s, 300);
    await new Promise((r) => setTimeout(r, 280));
    const got = await p.evaluate(() => {
      const figs = [...document.querySelectorAll('figure[data-visual-kind]')]
        .filter((f) => f.getBoundingClientRect().width > 0);
      return {
        text: document.body.innerText,
        figs: figs.map((f) => ({
          kind: f.getAttribute('data-visual-kind'),
          alt: (f.getAttribute('aria-label') || '').length,
          axes: [...f.querySelectorAll('text')].map((t) => t.textContent).filter((t) => /^[xyz]$/.test(t)).join(''),
          points: f.querySelectorAll('circle').length,
          triples: (f.textContent.match(/\(-?\d+, -?\d+, -?\d+\)/g) || []).slice(0, 3),
          exact: (f.textContent.match(/√\d+|is exactly [^.]+/g) || []).slice(0, 2),
          octant: (f.textContent.match(/signs \([+-], [+-], [+-]\)|no octant|z-axis/g) || []).slice(0, 2),
        })),
      };
    });
    if (/\b(NaN|undefined|null|\[object Object\])\b/.test(got.text)) leaks += 1;
    found.push(...got.figs);
    mine += 1;
  }
  stages += mine;
  const uniq = [...new Map(found.map((f) => [JSON.stringify(f), f])).values()];
  console.log(`${wanted.slice(0, 36).padEnd(38)} "${identity.slice(0, 30)}" | stages ${mine}/5`);
  for (const f of uniq) console.log(`    ${JSON.stringify(f)}`);
  await p.close();
}
await b.close();
console.log(`\nDISTINCT ${seen.size}/3 | STAGES ${stages}/15 | LEAKS ${leaks} | CONSOLE ${errors}`);
