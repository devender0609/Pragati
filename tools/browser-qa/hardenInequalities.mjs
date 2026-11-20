// v0.84.0-c11.41 checkpoint 96D — delivery hardening for Chapter 5 and FO-6.
// Reads visual SEMANTICS, not prose: endpoint fill, ray direction, boundary
// dash, shaded area. Off-screen descendants are reported apart from real
// clipping, which is the correction Statistics established at 93G.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const LESSONS = [
  ['ncert_kemh1_s5_2_inequalities_lesson', 'Linear Inequalities'],
  ['ncert_kemh1_s5_3_one_variable_lesson', 'Linear Inequalities'],
  ['cbse_fo6_half_plane_lesson', null],
];
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const [w, h] of [[1280, 900], [834, 1112], [360, 740]]) {
  console.log(`\n=== ${w}px ===`);
  for (const [id, chapter] of LESSONS) {
    const p = await b.newPage();
    let errs = 0;
    p.on('console', (m) => { if (m.type() === 'error') errs += 1; });
    await p.setViewport({ width: w, height: h });
    await seedStudentForBrowserQa(p);
    if (chapter) await clickByText(p, chapter);
    await p.evaluate((a) => {
      const r = document.querySelector(`[data-artifact-id="${a}"]`);
      (r instanceof HTMLElement ? r : r?.querySelector('button,a,[role=button]'))?.click();
    }, id);
    await new Promise((r) => setTimeout(r, 600));
    let overflow = 0; let offScreen = 0; let realClip = 0;
    const figs = [];
    for (const s of STAGES) {
      await clickByText(p, s, 300);
      await new Promise((r) => setTimeout(r, 300));
      const got = await p.evaluate(() => {
        const over = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
        let off = 0; let clip = 0;
        for (const n of document.querySelectorAll('[data-visual-kind] *')) {
          const r = n.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > window.innerWidth + 1 || r.left < -1) {
            off += 1;
            // A descendant inside a working horizontal scroller is reachable,
            // not clipped. Only an unreachable one is a real defect.
            let sc = n.parentElement; let scrollable = false;
            while (sc) { if (sc.scrollWidth > sc.clientWidth + 1) { scrollable = true; break; } sc = sc.parentElement; }
            if (!scrollable) clip += 1;
          }
        }
        const read = [];
        for (const f of document.querySelectorAll('[data-visual-kind]')) {
          const kind = f.getAttribute('data-visual-kind');
          const box = f.getBoundingClientRect();
          if (box.width === 0) continue;
          if (kind === 'number_line_region') {
            const c = f.querySelector('circle');
            const seg = [...f.querySelectorAll('line')].sort((a, z) => +z.getAttribute('stroke-width') - +a.getAttribute('stroke-width'))[0];
            read.push({
              kind,
              endpoint: c && c.getAttribute('fill') !== 'white' ? 'closed' : 'open',
              ray: seg ? (+seg.getAttribute('x2') > +seg.getAttribute('x1') ? 'right' : 'left') : '?',
              ticks: f.querySelectorAll('text').length,
              alt: (f.getAttribute('aria-label') || '').length,
              wPx: Math.round(box.width),
            });
          } else if (kind === 'half_plane_region') {
            const lines = [...f.querySelectorAll('line')].filter((l) => +l.getAttribute('stroke-width') >= 2);
            read.push({
              kind,
              boundaries: lines.length,
              dashed: lines.filter((l) => l.getAttribute('stroke-dasharray')).length,
              solid: lines.filter((l) => !l.getAttribute('stroke-dasharray')).length,
              shadedCells: f.querySelectorAll('rect').length,
              notes: f.querySelectorAll('li').length,
              alt: (f.getAttribute('aria-label') || '').length,
              wPx: Math.round(box.width),
            });
          }
        }
        return { over, off, clip, read };
      });
      overflow = Math.max(overflow, got.over);
      offScreen += got.off; realClip += got.clip;
      figs.push(...got.read);
    }
    const uniq = [...new Map(figs.map((f) => [JSON.stringify(f), f])).values()];
    console.log(`  ${id.slice(0, 36).padEnd(38)} overflow ${overflow}px | offScreen ${offScreen} | realClip ${realClip} | console ${errs}`);
    for (const f of uniq) console.log(`      ${JSON.stringify(f)}`);
    await p.close();
  }
}
await b.close();
