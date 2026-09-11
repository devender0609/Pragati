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
const FORBIDDEN = ['Assign assessments', 'assessment cards', 'Class-level growth', 'weak concepts', 'growth history'];
// NOT forbidden: "calibrated score". The teacher footer says Pragati
// does NOT produce one, which is the honest disclaimer §9 wants kept —
// banning the phrase would have deleted the safeguard rather than the
// claim. Classified A (correct Teacher language), not D.
for (const width of [360, 390, 430, 768, 1440]) {
  const p = await b.newPage();
  await p.setViewport({ width, height: 900 });
  await p.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => localStorage.clear());
  await p.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });
  await wait(800);
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Skip/i.test(x.textContent || '')); if (b) b.click(); });
  await wait(300);
  // v0.78 §18 — THE STEP THE PREVIOUS HARNESS MISSED.
  // The header toggle names the CURRENT mode, so clicking "Student mode"
  // switches the chrome but does NOT navigate. The teacher product is
  // reached by then pressing "Teacher dashboard". Without that second
  // click every capture stayed on the student landing, which is why the
  // last pass produced 0 of 30 and I could not review five of six
  // screens.
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Student mode|Teacher mode/i.test(x.textContent || '')); if (b) b.click(); });
  await wait(900);
  // On a fresh profile the landing offers "Switch to teacher mode →";
  // once inside, the header carries "Teacher dashboard". Try both, in
  // that order, and assert afterwards that we actually arrived.
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) =>
      /Switch to teacher mode/i.test(x.textContent || '')
    );
    if (b) b.click();
  });
  await wait(900);
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.textContent || '').trim() === 'Teacher dashboard'); if (b) b.click(); });
  await wait(900);
  for (const [id, label, must] of TABS) {
    // Return to the workspace first: once inside a sub-view the tab is
    // not on screen, and the header button is the reliable way back.
    await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.textContent || '').trim() === 'Teacher dashboard'); if (b) b.click(); });
    await wait(400);
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
