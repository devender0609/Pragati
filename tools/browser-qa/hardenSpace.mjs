// v0.84.0-c11.44 checkpoint 97D — delivery hardening for Chapter 11.
// Figures are read from `figure[data-visual-kind]`: the display:contents
// wrapper carries the same attribute without the accessible description.
// Off-screen descendants are reported apart from real clipping.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const LESSONS = [
  'ncert_kemh1_s11_2_axes_planes_lesson',
  'ncert_kemh1_s11_3_coordinates_lesson',
  'ncert_kemh1_s11_4_distance_lesson',
];
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (const [w, h] of [[1280, 900], [834, 1112], [360, 740]]) {
  console.log(`\n=== ${w}px ===`);
  for (const id of LESSONS) {
    const p = await b.newPage();
    let errs = 0;
    p.on('console', (m) => { if (m.type() === 'error') errs += 1; });
    await p.setViewport({ width: w, height: h });
    await seedStudentForBrowserQa(p);
    await clickByText(p, 'Introduction to Three Dimensional Geometry');
    await p.evaluate((a) => {
      const r = document.querySelector(`[data-artifact-id="${a}"]`);
      (r instanceof HTMLElement ? r : r?.querySelector('button,a,[role=button]'))?.click();
    }, id);
    await new Promise((r) => setTimeout(r, 620));
    let overflow = 0; let off = 0; let clip = 0; let collisions = 0;
    const figs = [];
    for (const s of STAGES) {
      await clickByText(p, s, 300);
      await new Promise((r) => setTimeout(r, 290));
      const got = await p.evaluate(() => {
        const over = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
        let o = 0; let c = 0;
        for (const n of document.querySelectorAll('figure[data-visual-kind] *')) {
          const r = n.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > window.innerWidth + 1 || r.left < -1) {
            o += 1;
            let sc = n.parentElement; let scrollable = false;
            while (sc) { if (sc.scrollWidth > sc.clientWidth + 1) { scrollable = true; break; } sc = sc.parentElement; }
            if (!scrollable) c += 1;
          }
        }
        const read = []; let coll = 0;
        for (const f of document.querySelectorAll('figure[data-visual-kind="coordinate_3d"]')) {
          const box = f.getBoundingClientRect();
          if (box.width === 0) continue;
          // Label collision: SVG text boxes that overlap materially.
          const texts = [...f.querySelectorAll('svg text')].map((t) => t.getBoundingClientRect());
          for (let i = 0; i < texts.length; i += 1) {
            for (let j = i + 1; j < texts.length; j += 1) {
              const a = texts[i]; const z = texts[j];
              const ox = Math.min(a.right, z.right) - Math.max(a.left, z.left);
              const oy = Math.min(a.bottom, z.bottom) - Math.max(a.top, z.top);
              if (ox > 4 && oy > 4) coll += 1;
            }
          }
          const svg = f.querySelector('svg')?.getBoundingClientRect();
          read.push({
            alt: (f.getAttribute('aria-label') || '').length,
            axes: [...f.querySelectorAll('svg text')].map((t) => t.textContent).filter((t) => /^[xyz]$/.test(t)).join(''),
            svgW: svg ? Math.round(svg.width) : 0,
            minFont: Math.min(...[...f.querySelectorAll('svg text')].map((t) => parseFloat(getComputedStyle(t).fontSize) || 99)),
            triples: (f.textContent.match(/\(-?\d+, -?\d+, -?\d+\)/g) || []).length,
            noOctant: /no octant/.test(f.textContent),
            onAxis: /z-axis|x-axis|y-axis/.test(f.textContent),
            exact: (f.textContent.match(/exactly (√\d+|\d+)/g) || []),
          });
        }
        return { over, o, c, coll, read };
      });
      overflow = Math.max(overflow, got.over);
      off += got.o; clip += got.c; collisions += got.coll;
      figs.push(...got.read);
    }
    const uniq = [...new Map(figs.map((f) => [JSON.stringify(f), f])).values()];
    console.log(`  ${id.slice(0, 34).padEnd(36)} overflow ${overflow}px | offScreen ${off} | realClip ${clip} | labelCollisions ${collisions} | console ${errs}`);
    for (const f of uniq) console.log(`      ${JSON.stringify(f)}`);
    await p.close();
  }
}
await b.close();
