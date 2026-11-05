// v0.84.0-c11.21 checkpoint 87D — hardening for the chapter-less prerequisite.
// A fresh browser per phase: a session survives only a handful of
// seed-and-navigate cycles, which is harness plumbing, not a product finding.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
import { measureBottomClearance, MIN_GAP } from './bottomClearance.mjs';

const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const width = Number(process.argv[2] || 1280);
const errs = [], warns = [];

const launch = async () => {
  const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  p.on('console', (m) => { const t = m.text().slice(0, 80); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
  p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 80)));
  await p.setViewport({ width, height: width === 360 ? 740 : 900 });
  return { b, p };
};

/** Layout facts that matter, measured on visible elements only. */
const layout = (p) => p.evaluate(() => {
  const de = document.documentElement, vw = de.clientWidth, vh = de.clientHeight;
  const vis = (e) => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.display !== 'none'
      && cs.visibility !== 'hidden' && e.offsetParent !== null;
  };
  const nav = document.querySelector('nav.fixed');
  const ctrls = [...document.querySelectorAll('button')].filter((e) => {
    if (!vis(e)) return false;
    const r = e.getBoundingClientRect();
    return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  });
  let ol = 0;
  for (let a = 0; a < ctrls.length; a += 1) for (let c = a + 1; c < ctrls.length; c += 1) {
    if (ctrls[a].contains(ctrls[c]) || ctrls[c].contains(ctrls[a])) continue;
    if (nav && (nav.contains(ctrls[a]) || nav.contains(ctrls[c]))) continue;
    const A = ctrls[a].getBoundingClientRect(), B = ctrls[c].getBoundingClientRect();
    if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) ol += 1;
  }
  return {
    ov: de.scrollWidth - de.clientWidth,
    wide: [...document.querySelectorAll('svg,table,pre,code')].filter((e) => e.getBoundingClientRect().width > vw + 1).length,
    clipped: [...document.querySelectorAll('h1,h2,h3,h4,p,li,td,th,figcaption,span')]
      .filter((e) => vis(e) && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden').length,
    overlaps: ol,
  };
});

// ---- phase 1: the catalogue, where the prerequisite group lives ----------
{
  const { b, p } = await launch();
  await seedStudentForBrowserQa(p);
  const g = await p.evaluate(() => {
    const row = document.querySelector('[data-artifact-id="cbse_fo4_induction_lesson"]');
    const heading = [...document.querySelectorAll('h1,h2,h3,h4')].find((h) => /before you continue/i.test(h.textContent || ''));
    // The chapter label and title run together as "Chapter 1Sets", so a word
    // boundary after the digit never matches. Match the label element.
    const firstChapter = [...document.querySelectorAll('button')]
      .find((e) => /^Chapter 1(?!\d)/.test((e.textContent || '').trim()));
    const r = row?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    return {
      rowPresent: Boolean(row),
      semanticHeading: heading ? heading.tagName : null,
      groupLabelled: Boolean(document.querySelector('[aria-labelledby="learn-prerequisites"]')),
      rowWithinViewport: r ? r.right <= vw + 1 && r.left >= -1 : false,
      // A tap target should be comfortably large on a phone.
      rowHeight: r ? Math.round(r.height) : 0,
      rowBeforeChapters: row && firstChapter
        ? (row.compareDocumentPosition(firstChapter) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 : false,
      rowText: (row?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70),
      headerLine: (document.body.innerText.match(/\d+ chapters from your textbook[^\n]*/) || [''])[0],
      eighthChapterStyling: /Chapter 8/.test(document.body.innerText),
      // Keyboard reachability, not a separate accessibility route.
      focusable: row ? (row.tabIndex >= 0 && row.tagName === 'BUTTON') : false,
    };
  });
  const l = await layout(p);
  console.log(`CATALOGUE @${width}px: row ${g.rowPresent} | heading ${g.semanticHeading} | labelled ${g.groupLabelled} | before chapters ${g.rowBeforeChapters} | within viewport ${g.rowWithinViewport} | tap height ${g.rowHeight}px | focusable ${g.focusable}`);
  console.log(`  overflow ${l.ov}px | wider-than-viewport ${l.wide} | clipped ${l.clipped} | control overlaps ${l.overlaps} | eighth-chapter styling ${g.eighthChapterStyling}`);
  console.log(`  header ${JSON.stringify(g.headerLine)}`);
  console.log(`  row text ${JSON.stringify(g.rowText)}`);
  await b.close();
}

// ---- phase 2: the lesson, stage by stage --------------------------------
{
  const { b, p } = await launch();
  await seedStudentForBrowserQa(p);
  await p.evaluate(() => document.querySelector('[data-artifact-id="cbse_fo4_induction_lesson"]')?.click());
  await new Promise((r) => setTimeout(r, 650));
  let worst = { ov: 0, wide: 0, clipped: 0, overlaps: 0 }, headings = [], stages = 0;
  for (const s of STAGES) {
    if (await clickByText(p, s, 300)) stages += 1;
    const l = await layout(p);
    worst = {
      ov: Math.max(worst.ov, l.ov), wide: worst.wide + l.wide,
      clipped: worst.clipped + l.clipped, overlaps: worst.overlaps + l.overlaps,
    };
    if (s === 'See it') {
      headings = await p.evaluate(() => {
        const fig = document.querySelector('figure[aria-label], [role=group][aria-label]');
        const t = fig ? fig.textContent || '' : '';
        return ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion'].filter((h) => t.includes(h));
      });
    }
  }
  const clear = await measureBottomClearance(p);
  console.log(`LESSON @${width}px: ${stages}/5 stages | overflow ${worst.ov}px | wider-than-viewport ${worst.wide} | clipped ${worst.clipped} | control overlaps ${worst.overlaps}`);
  console.log(`  proof headings ${JSON.stringify(headings)}`);
  console.log(`  bottom clearance ${clear.navShown ? `${clear.gap}px (min ${MIN_GAP}) pass ${clear.pass}` : 'nav hidden at this width'}`);
  await b.close();
}
console.log(`CONSOLE errors=${errs.length} warnings=${warns.length}`);
if (errs.length) console.log('   ', JSON.stringify(errs.slice(0, 3)));
