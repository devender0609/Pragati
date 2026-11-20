import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const RAW = /:\s*(?:true|false|null|undefined|NaN|Infinity)\b|\[object [A-Z]|\{"[a-z]+":|contentArtifactId|\d+e\+\d/;
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
await p.setViewport({ width: 1280, height: 900 });
await seedStudentForBrowserQa(p);
console.log('HEADER:', JSON.stringify(await p.evaluate(() => (document.body.innerText.match(/\d+ chapters from your textbook[^\n]*/) || [''])[0])));
const opened = await p.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((e) => /^Chapter 7(?!\d)/.test((e.textContent || '').trim()));
  btn?.click(); return Boolean(btn);
});
await new Promise((r) => setTimeout(r, 700));
const rows = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e) => e.getAttribute('data-artifact-id')));
console.log('CHAPTER 7 OPENED:', opened, '| rows', rows.length, JSON.stringify(rows.map((r) => r.replace('ncert_kemh1_', ''))));
await p.evaluate((a) => document.querySelector(`[data-artifact-id="${a}"]`)?.click(), rows[0]);
await new Promise((r) => setTimeout(r, 600));
let st = 0; const leaks = []; let proof = null, coeff = null, expansion = null;
for (const s of STAGES) {
  if (await clickByText(p, s, 300)) st += 1;
  const txt = await p.evaluate(() => document.body.innerText);
  const m = txt.match(RAW); if (m) leaks.push(`@${s}: ${JSON.stringify(m[0])}`);
  if (s === 'See it') {
    proof = await p.evaluate(() => {
      const el = document.querySelector('[data-visual-kind="proof_layout"]');
      const t = el ? el.textContent || '' : '';
      return { present: Boolean(el), parts: ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion'].filter((h) => t.includes(h)) };
    });
    coeff = await p.evaluate(() => {
      const el = document.querySelector('[data-visual-kind="coefficient_rows"]');
      if (!el) return { present: false };
      const rows = [...el.querySelectorAll('tr')].map((r) => [...r.querySelectorAll('td')].map((d) => d.textContent.trim()));
      return { present: true, rows: rows.length, row4: rows[4] || null, row5: rows[5] || null };
    });
  }
  if (s === 'Learn the idea' || s === 'Worked examples') {
    const found = txt.match(/a\^4 \+ 4a\^3b \+ 6a\^2b\^2 \+ 4ab\^3 \+ b\^4|a\^3 \+ 3a\^2b \+ 3ab\^2 \+ b\^3/g);
    if (found) expansion = found[0];
  }
}
const fin = await clickByText(p, 'Finish', 400);
const notation = await p.evaluate(() => { const t = document.body.innerText; return { nCr: /nCr|nC0|nC\d/.test(t), theorem: /positive integral index/i.test(t) }; });
console.log(`WALK: ${st}/5 stages | Finish ${fin}`);
console.log('PROOF:', JSON.stringify(proof));
console.log('COEFFICIENTS:', JSON.stringify(coeff));
console.log('EXPANSION in prose:', JSON.stringify(expansion));
console.log('NOTATION:', JSON.stringify(notation));
console.log('RAW LEAKS:', leaks.length, leaks.slice(0, 2).join(' ;; '));
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
await b.close();
