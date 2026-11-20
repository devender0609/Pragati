// v0.84.0-c11.41 checkpoint 96D — catalogue shell, keyboard and clearance.
// Bottom clearance uses the corrected detector: active stage only, visible
// controls, document scrolled to the end, focus confirmed.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const [w, h] of [[1280, 900], [834, 1112], [360, 740]]) {
  const p = await b.newPage();
  let errs = 0; p.on('console', (m) => { if (m.type() === 'error') errs += 1; });
  await p.setViewport({ width: w, height: h });
  await seedStudentForBrowserQa(p);
  const shell = await p.evaluate(() => {
    const t = document.body.innerText;
    const hdr = (t.match(/\d+ chapters from your textbook[^\n]*/) || [''])[0];
    const grp = [...document.querySelectorAll('h3')].map((n) => n.textContent.trim());
    const fo6 = document.querySelector('[data-artifact-id="cbse_fo6_half_plane_lesson"]');
    const underAlso = (() => {
      const sec = fo6?.closest('section');
      return sec?.querySelector('h3')?.textContent?.trim() ?? null;
    })();
    return {
      header: hdr, groups: grp, fo6Present: !!fo6, fo6Group: underAlso,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      leaksGovernance: /CBSE_ONLY|FORMATIVE_ONLY|REQUIRED_CORE|chapterlessRole|prerequisite lesson outside the textbook · 2/.test(t),
      fo6CalledPrerequisite: (() => {
        const sec = fo6?.closest('section');
        return /prerequisite/i.test(sec?.textContent ?? '');
      })(),
    };
  });
  console.log(`\n=== ${w}px ===`);
  console.log('  header:', JSON.stringify(shell.header));
  console.log('  groups:', JSON.stringify(shell.groups), '| FO-6 in:', JSON.stringify(shell.fo6Group));
  console.log('  overflow', shell.overflow, '| governance label leak', shell.leaksGovernance, '| FO-6 called prerequisite', shell.fo6CalledPrerequisite);
  // keyboard: tab to the FO-6 row and open with Enter
  await p.evaluate(() => document.querySelector('[data-artifact-id="cbse_fo6_half_plane_lesson"]')?.focus());
  const focused = await p.evaluate(() => document.activeElement?.getAttribute('data-artifact-id'));
  await p.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 600));
  const opened = await p.evaluate(() => document.body.innerText.slice(0, 60).replace(/\n/g, ' '));
  console.log('  keyboard: focused', JSON.stringify(focused), '| Enter opened', JSON.stringify(opened.slice(0, 44)));
  // stage controls reachable, then clearance on the last stage
  await clickByText(p, 'Think deeper', 400);
  await new Promise((r) => setTimeout(r, 350));
  const nav = await p.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 260));
    const vis = (n) => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const inScroller = (n) => { let s = n.parentElement; while (s) { if (s.scrollWidth > s.clientWidth + 1) return true; s = s.parentElement; } return false; };
    const ctrls = [...document.querySelectorAll('button,a[href],[role=button]')].filter((n) => vis(n) && !inScroller(n));
    const bar = [...document.querySelectorAll('nav,[class*=fixed],[class*=sticky]')]
      .map((n) => n.getBoundingClientRect()).filter((r) => r.height > 0 && r.bottom >= window.innerHeight - 4)
      .sort((a, z) => a.top - z.top)[0];
    const last = ctrls.map((n) => n.getBoundingClientRect()).sort((a, z) => z.bottom - a.bottom)[0];
    const tabbable = ctrls.filter((n) => n.tabIndex >= 0).length;
    return {
      controls: ctrls.length, tabbable,
      gap: bar && last ? Math.round(bar.top - last.bottom) : 'no fixed bar',
      stageChips: [...document.querySelectorAll('button')].filter((n) => /Learn the idea|See it|Worked|Try it|Think deeper/.test(n.textContent)).length,
      finish: ctrls.some((n) => /finish/i.test(n.textContent)),
      back: ctrls.some((n) => /back/i.test(n.textContent)),
    };
  });
  console.log('  controls', nav.controls, '| tabbable', nav.tabbable, '| stage chips', nav.stageChips, '| Finish', nav.finish, '| Back', nav.back, '| bottom clearance', nav.gap, '| console', errs);
  await p.close();
}
await b.close();
