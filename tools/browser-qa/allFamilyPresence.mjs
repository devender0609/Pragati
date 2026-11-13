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
  // v0.84.0-c11.23 checkpoint 88E — the three newest families. The rule is
  // all families, oldest included; these are the ones most recently added
  // and so the ones least proven in the product.
  [['proof_layout', 'Before you continue', 0],
   ['stage_tree', 'Permutations and Combinations', 0],
   ['arrangement', 'Permutations and Combinations', 3]],
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
    const g = await p.evaluate((kind) => {
      // v0.84.0-c11.23 checkpoint 88E — find the family by WHAT IT IS, then
      // check content that fits it. The old matcher required an
      // `svg[role=img]`, which made two families that are semantic HTML on
      // purpose look absent: a proof is real headings, an arrangement is a
      // list. A mathematical visual is not synonymous with SVG.
      const roots = [...document.querySelectorAll(`[data-visual-kind="${kind}"]`)];
      const drawn = (x) => x.querySelectorAll('polyline,polygon,circle,ellipse,line,path,rect').length;
      const described = (x) => {
        const svg = x.querySelector('svg[aria-label]');
        const grp = x.querySelector('figure[aria-label], [role=group][aria-label]');
        const label = svg?.getAttribute('aria-label') || grp?.getAttribute('aria-label') || '';
        // Headings are accessibility structure in their own right; semantic
        // HTML is not made to impersonate an image to satisfy a test.
        const headings = x.querySelectorAll('h1,h2,h3,h4,h5').length;
        return { label, ok: label.length > 80 || headings >= 3, headings };
      };
      const meaningful = roots.map((x) => {
        const d = described(x);
        return {
          primitives: drawn(x),
          cells: x.querySelectorAll('td').length,
          entries: x.querySelectorAll('li').length,
          headings: d.headings,
          altLen: d.label.length,
          colour: /\b(red|blue|green|colour|color)\b/i.test(d.label),
          // Empty container is not presence: a root must carry real content.
          hasContent: drawn(x) >= 3 || x.querySelectorAll('td').length > 0
            || x.querySelectorAll('li').length > 0 || d.headings >= 3,
          describedOk: d.ok,
        };
      });
      const present = meaningful.filter((m) => m.hasContent);
      // Decorative icons carry no visual-kind root, so they never count.
      const iconsOnPage = [...document.querySelectorAll('svg')]
        .filter((x) => !x.closest('[data-visual-kind]')).length;
      return {
        roots: roots.length,
        figures: present.length,
        primitives: present.map((m) => m.primitives).filter((n) => n > 0),
        cells: present.map((m) => m.cells).filter((n) => n > 0),
        entries: present.map((m) => m.entries).filter((n) => n > 0),
        headings: present.map((m) => m.headings).filter((n) => n > 0),
        described: present.length > 0 && present.every((m) => m.describedOk),
        colour: present.some((m) => m.colour),
        decorativeExcluded: iconsOnPage,
      };
    }, family.split(' ')[0]);
    if (!g.figures) missing += 1;
    const content = [
      g.primitives.length ? `primitives ${JSON.stringify(g.primitives)}` : '',
      g.cells.length ? `cells ${JSON.stringify(g.cells)}` : '',
      g.entries.length ? `entries ${JSON.stringify(g.entries)}` : '',
      g.headings.length ? `headings ${JSON.stringify(g.headings)}` : '',
    ].filter(Boolean).join(' | ');
    console.log(`  ${family.padEnd(22)} roots ${g.roots} | present ${g.figures} | ${content} | described ${g.described} | colour ${g.colour} | icons excluded ${g.decorativeExcluded}`);
  }
  await b.close();
}
console.log('FAMILIES WITH NO FIGURE:', missing);
