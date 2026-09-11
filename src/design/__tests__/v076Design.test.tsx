/**
 * v0.76 — DESIGN INVARIANTS.
 *
 * These lock the decisions the redesign is actually made of, so a later
 * session cannot quietly restyle its way back to a grey page of white
 * cards. Each one is a claim about composition that a screenshot would
 * show and a DOM test can hold.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { Class6ChapterList } from '../../features/student/Class6Learn';
import { ChapterArtwork } from '../ChapterArtwork';
import { Frac, spokenFraction } from '../Composition';

const root = path.resolve(__dirname, '../../..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');

describe('§11 the display typeface is actually loaded', () => {
  it('ships a <link> for every family the Tailwind font stack names first', () => {
    // The defect this defends against is precise and shipped for six
    // releases: tailwind.config declared Bricolage Grotesque as the
    // `display` family and index.html never loaded it, so every heading
    // in the product silently rendered in Inter. A font stack whose
    // first entry is not loaded is not a typographic decision, and no
    // amount of screenshot review finds it — the fallback looks fine.
    const html = read('index.html');
    const cfg = read('tailwind.config.js');
    const first = (family: string) => {
      const m = cfg.match(new RegExp(`${family}: \\[([^\\]]*)\\]`));
      return m ? m[1].split(',')[0].trim().replace(/['"]/g, '') : null;
    };
    for (const family of ['sans', 'display', 'deva']) {
      const name = first(family);
      expect(name, `no first entry for font-${family}`).toBeTruthy();
      expect(
        html.includes(name!.replace(/ /g, '+')),
        `font-${family} names "${name}" first but index.html never loads it`
      ).toBe(true);
    }
  });
});

describe('§4 the page ground is paper, not dashboard slate', () => {
  it('does not paint the app root slate-50', () => {
    expect(read('src/App.tsx')).not.toContain('min-h-full bg-slate-50');
  });
});

describe('§6 the curriculum is a field and a grid, not a column of rows', () => {
  it('gives every chapter its own artwork, drawn rather than iconified', () => {
    const { container } = render(<Class6ChapterList onOpenChapter={() => {}} />);
    // One drawing per chapter — nine plates plus the featured field.
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(10);
  });

  it('makes an upcoming chapter a drawing, never a disabled control', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    for (const b of screen.getAllByRole('button')) {
      expect(b.hasAttribute('disabled')).toBe(false);
    }
  });
});

describe('§5 chapter artwork is decorative and drawn at scale', () => {
  it('is hidden from assistive technology, because the title is next to it', () => {
    const { container } = render(
      <ChapterArtwork motif="fractions" accent="#7c3aed" />
    );
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    // Composed at 240x180, not a 24px icon grid scaled up.
    expect(svg.getAttribute('viewBox')).toBe('0 0 240 180');
  });

  it('draws a real figure for every chapter of the book', () => {
    // The first draft of the constructions drawing rendered as a plain
    // circle with a cross, because both compass arcs were struck between
    // the same pair of points and a circle is what that draws. Caught by
    // looking at the render, not the path data. This holds the line: no
    // chapter may fall through to the generic placeholder.
    const motifs = [
      'patterns', 'lines_angles', 'number_play', 'data_handling',
      'prime_time', 'perimeter_area', 'fractions', 'constructions',
      'symmetry', 'integers',
    ] as const;
    const generic = render(
      <ChapterArtwork motif="generic" accent="#7c3aed" lattice={false} />
    ).container.innerHTML;
    for (const m of motifs) {
      const html = render(
        <ChapterArtwork motif={m} accent="#7c3aed" lattice={false} />
      ).container.innerHTML;
      expect(html, `${m} fell through to the generic placeholder`).not.toBe(
        generic
      );
    }
  });
});

describe('§11 a fraction is set as a fraction', () => {
  it('speaks the way the textbook says it, not as a division', () => {
    expect(spokenFraction(3, 5)).toBe('3 fifths');
    expect(spokenFraction(1, 2)).toBe('1 half');
    expect(spokenFraction(7, 13)).toBe('7 over 13');
  });

  it('gives a screen reader one name, not two loose digits', () => {
    render(<Frac n={3} d={5} />);
    const el = screen.getByRole('math');
    expect(el.getAttribute('aria-label')).toBe('3 fifths');
    expect(el.textContent).toBe('35');
  });
});
