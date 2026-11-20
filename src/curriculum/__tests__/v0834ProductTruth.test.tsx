// v0.83.4 — WHAT THE PRODUCT SAYS ABOUT ITSELF, AND WHAT THE SENDER IS
// TOLD TODAY.
//
// Two failures this release fixed, and these tests keep fixed:
//
//   1. The first sentence of Student onboarding called Pragati "a CBSE /
//      NCERT-informed adaptive assessment prototype for Class 6 Math".
//      Growth is frozen and was never calibrated, and Pragati covers
//      twelve classes, so both halves were untrue.
//   2. REVIEW_HANDOFF/SEND_THIS.md — the file a sender follows TODAY —
//      still told them §7.4's package "is frozen by design and is NOT
//      regenerated", which stopped being true when the package was
//      regenerated around the corrected page 159.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingFlow } from '../../components/OnboardingFlow';
import {
  computeContentFingerprint,
  section74ProvenanceFingerprint,
  SECTION_7_4_ARTIFACT_VERSION,
} from '../contentArtifact';
import { SOURCE_PROVENANCE_VERSION } from '../sectionReviewPackages';

// Paths are resolved from the repo root rather than as file URLs:
// readdirSync on a URL misbehaves under the jsdom environment.
const root = (f: string) => join(process.cwd(), f);
const read = (f: string) => readFileSync(root(f), 'utf8');

// Claims the product may not make about itself while Growth is frozen
// and Learn content is a fraction of Classes 1-12.
// Source with every comment removed — line, block and JSX — so a
// sentence quoted in a comment that explains its own removal does not
// read as a live string.
const withoutComments = (src: string) =>
  src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

const FORBIDDEN: Array<[RegExp, string]> = [
  [/adaptive assessment/i, 'calls itself an adaptive assessment'],
  [/prototype adaptive growth assessment/i, 'calls itself an adaptive growth assessment'],
  [/adapted to how they answer/i, 'claims calibrated adaptivity'],
  [/assign an assessment/i, 'presents the retired assessment workflow'],
  [/ability estimat/i, 'claims ability estimation'],
  [/nationally normed/i, 'claims national norms'],
  [/Growth Assessment Prototype/i, 'uses the retired product name'],
  [/validated adaptive|scientifically validated/i, 'claims validation'],
  [/\bRIT\b|RIT-equivalent/i, 'claims RIT equivalence'],
  [/\bnormed\b/i, 'claims norms'],
  [/growth score/i, 'claims a growth score'],
  [/all lessons available|complete Classes 1.12 content/i, 'claims complete content'],
];

// ---------------------------------------------------------------------------
// v0.83.5 §3 — v0.83.4's version rendered the flow once and read only
// what Step 1 painted, so Step 2's "Assign an assessment" and "10 short
// items adapted to how they answer" sailed through. The flow is walked
// step by step now, and the static metadata is read as well.
async function walkOnboarding(): Promise<string[]> {
  const texts: string[] = [];
  render(<OnboardingFlow open onClose={() => {}} onOpenSignUp={() => {}} />);
  for (let step = 1; step <= 4; step += 1) {
    texts.push(document.body.textContent || '');
    const next = screen.queryAllByRole('button').find((b) => /next|continue/i.test(b.textContent || ''));
    if (!next) break;
    fireEvent.click(next);
  }
  return texts;
}

describe('§3 every onboarding step, and the page metadata, tell the truth', () => {
  it('has no forbidden claim on ANY step', async () => {
    const texts = await walkOnboarding();
    expect(texts.length).toBeGreaterThan(1);
    for (const [i, text] of texts.entries()) {
      for (const [re, why] of FORBIDDEN) {
        expect(re.test(text), `step ${i + 1} ${why}`).toBe(false);
      }
    }
  });

  it('describes the current teacher loop on the How it works step', async () => {
    const texts = await walkOnboarding();
    const all = texts.join(' ');
    expect(/Assign learning or practice/i.test(all)).toBe(true);
    expect(/Students learn and practise/i.test(all)).toBe(true);
    expect(/decide what is next/i.test(all)).toBe(true);
  });

  it('keeps the retired assessment loop out of the source, not just off screen', () => {
    const src = read('src/components/OnboardingFlow.tsx');
    const rendered = withoutComments(src);
    expect(/adapted to how they answer/i.test(rendered)).toBe(false);
    expect(/title="Assign an assessment"/i.test(rendered)).toBe(false);
  });

  it('has truthful HTML title and meta description', () => {
    const html = read('index.html');
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
    const desc = /<meta[^>]*name="description"[^>]*content="([^"]*)"/s.exec(html)?.[1]
      ?? /content="([^"]*)"\s*\/>/s.exec(html.slice(html.indexOf('name="description"')))?.[1]
      ?? '';
    expect(title.length).toBeGreaterThan(5);
    expect(desc.length).toBeGreaterThan(20);
    for (const [re, why] of FORBIDDEN) {
      expect(re.test(title), `<title> ${why}`).toBe(false);
      expect(re.test(desc), `meta description ${why}`).toBe(false);
    }
    expect(/Class 6 Math/i.test(desc), 'meta description still scopes the product to Class 6').toBe(false);
    expect(/CBSE\/NCERT|CBSE \/ NCERT/i.test(desc)).toBe(true);
  });

  it('keeps ordinary Student and Teacher navigation free of retired claims', () => {
    for (const f of [
      'src/features/student/StudentShell.tsx',
      'src/features/student/Class6Learn.tsx',
      'src/features/teacher/TeacherShell.tsx',
      'src/features/teacher/TeacherResourcesBody.tsx',
    ]) {
      const rendered = withoutComments(read(f));
      expect(/adaptive assessment|adapted to how they answer|Growth Assessment Prototype/i.test(rendered), f).toBe(false);
    }
  });
});

describe('§1/§3 Student onboarding tells the truth', () => {
  it('renders without any forbidden product claim', () => {
    render(
      <OnboardingFlow open onClose={() => {}} onOpenSignUp={() => {}} />
    );
    const text = document.body.textContent || '';
    expect(text.length).toBeGreaterThan(50);
    for (const [re, why] of FORBIDDEN) {
      expect(re.test(text), `${why}: ${text.slice(0, 300)}`).toBe(false);
    }
  });

  it('says what Pragati actually does instead', () => {
    render(
      <OnboardingFlow open onClose={() => {}} onOpenSignUp={() => {}} />
    );
    expect(screen.getByText(/learn and practise mathematics/i)).toBeTruthy();
    expect(screen.getByText(/CBSE \/ NCERT course/i)).toBeTruthy();
  });

  it('still warns that the content is incomplete', () => {
    render(
      <OnboardingFlow open onClose={() => {}} onOpenSignUp={() => {}} />
    );
    const text = document.body.textContent || '';
    expect(/still being built/i.test(text)).toBe(true);
    expect(/not ready yet/i.test(text)).toBe(true);
    // And makes no scoring or endorsement claim.
    expect(/official CBSE product/i.test(text)).toBe(true);
  });

  it('keeps the obsolete sentence out of the source, not merely off the screen', () => {
    const src = read('src/components/OnboardingFlow.tsx');
    // The sentence may be quoted in the comment that explains its
    // removal; it may not be inside a rendered string.
    const rendered = withoutComments(src);
    expect(/adaptive assessment prototype/i.test(rendered)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe('§4/§5/§13 current handoff documents carry no superseded truth', () => {
  const CURRENT_DOCS = [
    'REVIEW_HANDOFF/SEND_THIS.md',
    'REVIEW_HANDOFF/SEND_THIS_CHAPTER_3.md',
    'REVIEW_HANDOFF/CURRENT_REVIEW_IDENTITY.md',
  ];
  const CURRENT_DIRS = [
    'PRAGATI_SECTION_7_4_REVIEW_CURRENT',
    'PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT',
    'PRAGATI_CHAPTER_3_REVIEW_PACKAGES_CURRENT',
    'PRAGATI_CHAPTER_7_REVIEW_PACKAGES_CURRENT',
  ];
  const currentFiles = [
    ...CURRENT_DOCS,
    ...CURRENT_DIRS.flatMap((d) => readdirSync(root(d)).map((f) => `${d}/${f}`)),
  ];

  for (const f of currentFiles) {
    it(`${f} is safe to hand to a sender`, () => {
      const t = read(f);
      // A "frozen / not regenerated" claim must not stand as current.
      const frozen = /is frozen by design|NOT regenerated|not regenerated/i.exec(t);
      if (frozen) {
        const line = t.slice(Math.max(0, frozen.index - 200), frozen.index + 200);
        expect(/Until v0\.83\.1|HISTORICAL|historical/i.test(line), f).toBe(true);
      }
      // A stale release-state line that changes operational meaning.
      expect(/Current state \(v0\.8[012]/.test(t), f).toBe(false);
      // Superseded identities, except where IDENTITY.md names one to
      // tell the sender not to use it.
      if (!f.endsWith('IDENTITY.md')) {
        expect(/S74-v1-A1A3FF|S74-v1-7BFD8C/.test(t), f).toBe(false);
      }
      // The superseded page may appear only where the text is telling
      // the reader it IS superseded.
      for (const m of t.matchAll(/\b160\b/g)) {
        const around = t.slice(Math.max(0, (m.index ?? 0) - 220), (m.index ?? 0) + 220);
        expect(
          /corrected|superseded|historical|earlier|old/i.test(around),
          `${f}: bare 160 at ${m.index}`
        ).toBe(true);
      }
      // No current instruction may point at a historical folder.
      expect(/PROVENANCE_V2|PROVENANCE_ADDENDUM/.test(t), f).toBe(false);
    });
  }

  it('states one identity, and it is the one the code produces', () => {
    const identity = read('PRAGATI_SECTION_7_4_REVIEW_CURRENT/IDENTITY.md');
    expect(identity).toContain(computeContentFingerprint());
    expect(identity).toContain(section74ProvenanceFingerprint());
    expect(identity).toContain('S74-v1-DFC56A');
    expect(SECTION_7_4_ARTIFACT_VERSION).toBe(1);
    expect(SOURCE_PROVENANCE_VERSION).toBe(2);

    const send = read('REVIEW_HANDOFF/SEND_THIS.md');
    expect(send).toContain('S74-v1-DFC56A');
    expect(send).toContain(computeContentFingerprint());
    expect(send).toContain(section74ProvenanceFingerprint());
  });

  it('no longer claims a current package holds only one lesson', () => {
    for (const f of [
      'PRAGATI_SECTION_7_4_REVIEW_CURRENT/README.md',
      'PRAGATI_SECTION_7_4_REVIEW_CURRENT/PACKAGE_B_FOR_REVIEWER.md',
      'PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/README.md',
    ]) {
      expect(/we have (built|written) one lesson/i.test(read(f)), f).toBe(false);
    }
  });

  it('keeps every historical folder marked and unreferenced by current instructions', () => {
    for (const d of [
      'PRAGATI_SECTION_7_4_REVIEW_FINAL',
      'PRAGATI_SECTION_7_4_CURRICULUM_REVIEW',
      'PRAGATI_CHAPTER_3_REVIEW_PACKAGES',
      'PRAGATI_CHAPTER_7_REVIEW_PACKAGES',
    ]) {
      expect(read(`${d}/DO_NOT_SEND.md`), d).toContain('DO NOT SEND');
      for (const f of CURRENT_DOCS) {
        // A current document may name a historical folder only to say
        // it is historical, never as a path to send.
        const t = read(f);
        // Match the historical folder name only where it is NOT the
        // current one: the names are prefixes of the `_CURRENT` paths.
        const re = new RegExp(`${d}(?!_CURRENT)(?![A-Z_])`);
        const idx = t.search(re);
        if (idx >= 0) {
          const around = t.slice(Math.max(0, idx - 300), idx + 300);
          expect(/historical|DO NOT SEND|not send/i.test(around), `${f} → ${d}`).toBe(true);
        }
      }
    }
  });
});
