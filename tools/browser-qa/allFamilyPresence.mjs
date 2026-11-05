// v0.84.0-c11.18 checkpoint 86B — the permanent shared-renderer gate.
// Checkpoint 84C found VennSpec semantically valid but invisible since 79.
// A renderer was touched here, so every family is re-asserted, oldest first.
import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';

const BATCHES = [
  [['venn', 'Sets', 7], ['real_function_graph', 'Relations', 3], ['circular_graph', 'Trigonometric', 4]],
  [['argand_plane', 'Complex', 4], ['coordinate_line_graph', 'Straight Lines', 0], ['cone_section', 'Conic Sections', 0]],
  [['conic_graph', 'Conic Sections', 6], ['secant_graph', 'Limits and Derivatives', 0],
   ['limit_table', 'Limits and Derivatives', 1], ['limit_table (hole)', 'Limits and Derivatives', 2]],
];
let missing = 0;
for (const batch of BATCHES) {
  const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  for (const [family, chapter, idx] of batch) {
    await seedStudentForBrowserQa(p); await clickByText(p, chapter);
    await p.evaluate((n) => { const r = [...document.querySelectorAll('[data-artifact-id]')][n]; (r?.querySelector('button,a,[role=button]') || r)?.click(); }, idx);
    await new Promise((r) => setTimeout(r, 550));
    await clickByText(p, 'See it', 300);
    const g = await p.evaluate(() => {
      // A mathematical figure, not a decorative icon: a real accessible
      // description AND actually drawn primitives. Tables count by their
      // own accessible grouping rather than by SVG primitives.
      const svgs = [...document.querySelectorAll('svg')]
        .filter((x) => (x.getAttribute('aria-label') || '').length > 80)
        .filter((x) => x.querySelectorAll('polyline,polygon,circle,ellipse,line,path,rect').length >= 3);
      const tables = [...document.querySelectorAll('figure[aria-label], [role=group][aria-label]')]
        .filter((x) => (x.getAttribute('aria-label') || '').length > 80 && x.querySelector('table'));
      return {
        figures: svgs.length + tables.length,
        primitives: svgs.map((x) => x.querySelectorAll('polyline,polygon,circle,ellipse,line,path,rect').length),
        tableCells: tables.map((t) => t.querySelectorAll('td').length),
        described: [...svgs, ...tables].every((x) => (x.getAttribute('aria-label') || '').length > 80),
        colour: [...svgs, ...tables].some((x) => /\b(red|blue|green|colour|color)\b/i.test(x.getAttribute('aria-label') || '')),
        decorativeExcluded: document.querySelectorAll('svg').length - svgs.length,
      };
    });
    if (!g.figures) missing += 1;
    console.log(`  ${family.padEnd(22)} figures ${g.figures} | primitives ${JSON.stringify(g.primitives)} | table cells ${JSON.stringify(g.tableCells)} | described ${g.described} | colour ${g.colour} | decorative excluded ${g.decorativeExcluded}`);
  }
  await b.close();
}
console.log('FAMILIES WITH NO FIGURE:', missing);
