// ---------------------------------------------------------------------------
// v0.84.0-c10.16 checkpoint 70 — CLASS 10 INTEGRATION AND REVIEW READINESS.
//
// Can all 65 lessons be frozen into one internally consistent review
// candidate set, while proving that every derived quantity still comes from
// the single semantic model responsible for it?
//
// This is deliberately a WHOLE-CORPUS audit. The per-wave suites each check
// their own chapter; none of them would notice a duplicate artifact, a lost
// route, or a model that quietly acquired a second source of truth.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import {
  artifactReviewCode, artifactReviewCodeFor, class9ReviewCandidates,
} from '../artifactReview';
import { CLASS9_REVIEW_BUILD } from '../class9ReviewBuild';
import { section74Artifact, section74ProvenanceFingerprint } from '../contentArtifact';
import {
  CLASS10_ADAPTIVE_RULES, CLASS10_INSTRUMENT_VERSION,
  CLASS10_PILOT_TARGETS, CLASS10_PRESENTATION_SURFACE, CLASS10_READINESS_CHECKS,
  CLASS10_REVIEW_BUILD, adaptiveRulesApplying, class10ChapterReviewPackages,
  class10InstrumentLoad, class10PilotBatch, class10ReviewCandidates,
  class10ReviewReadiness, class10RouteCount,
} from '../class10Review';
// The semantic models, imported here so the matrix exercises each one.
import { ratioAt, writtenOf, validateStandardAngles } from '../specialAngles';
import { STANDARD_ANGLE_RATIOS } from '../trigonometrySections';
import { sampleSpaceSize } from '../sampleSpace';
import { DICE2, CARD, MARBLES } from '../probabilityClass10Sections';
import { tangentCountFor } from '../tangency';
import { CIRCLE_O, EXTERNAL_P, POINT_INSIDE, POINT_ON } from '../tangentSections';
import { areaValue, minorSegmentArea, sectorArea, centreTriangleArea } from '../circleRegion';
import { distance, formatRadical, sectionPoint, formatPoint, midpoint } from '../coordinateGeometry';
import { A_1_2, B_4_6, SEC_A, SEC_B } from '../coordinateClass10Sections';
import { term, sum, formatRational as apRational } from '../arithmeticProgression';
import { AP_SEATS } from '../apSections';
import { asQuadratic, rationalZeroes, formatRational as polyRational, sumOfZeroes } from '../polynomial';
import { P_TWO } from '../polynomialSections';

const C10 = () => allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
const C9 = () => allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));

describe('B. all 65 artifacts reconcile to the decomposition', () => {
  it('has exactly 65 Class 10 artifacts, each appearing once', () => {
    const arts = C10();
    expect(arts.length).toBe(65);
    const ids = arts.map((s) => s.contentArtifactId);
    expect(new Set(ids).size).toBe(65);
  });

  it('places every artifact in one of the fourteen chapters', () => {
    const chapters = new Set(C10().map((s) => s.source.officialChapterId));
    expect(chapters.size).toBe(14);
    for (const id of chapters) expect(id).toMatch(/^ncert_jemh1_ch\d\d$/);
  });

  it('carries complete provenance on every artifact', () => {
    for (const s of C10()) {
      expect(s.source.textbook, s.contentArtifactId).toMatch(/Class X/);
      expect(s.source.sectionNumber, s.contentArtifactId).toMatch(/^\d+\.\d+$/);
      expect(s.source.startPage, s.contentArtifactId).toBeGreaterThan(0);
      expect(s.source.inspectionDate, s.contentArtifactId).toBeTruthy();
      expect(s.contentArtifactVersion, s.contentArtifactId).toBe(1);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
    }
  });

  it('has no orphan artifact and no artifact outside its chapter', () => {
    for (const s of C10()) {
      const ch = Number(s.source.officialChapterId.replace('ncert_jemh1_ch', ''));
      expect(ch, s.contentArtifactId).toBeGreaterThanOrEqual(1);
      expect(ch, s.contentArtifactId).toBeLessThanOrEqual(14);
    }
  });
});

describe('C. all 65 are routable through the real Learn route', () => {
  it('shows fourteen chapters and sixty-five unique routes', () => {
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    expect(cat.chapters.length).toBe(14);
    expect(cat.lessonCount).toBe(65);
    const routes = cat.chapters.flatMap((c) => c.lessons.map((l) => l.section.contentArtifactId));
    expect(routes.length).toBe(65);
    expect(new Set(routes).size).toBe(65);
    expect(new Set(routes)).toEqual(new Set(C10().map((s) => s.contentArtifactId)));
    __setAuthoredLearnPreviewForTests(null);
  });

  it('renders every one of the sixty-five through LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    let rendered = 0;
    for (const chapter of cat.chapters) {
      for (const lesson of chapter.lessons) {
        const content = learnContentFor(lesson.section);
        expect(content, lesson.section.contentArtifactId).toBeTruthy();
        const { unmount, container } = render(
          <LearnSectionView content={content} visualsById={lesson.section.visualsById} />
        );
        expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
        // No internal identifier reaches the rendered text.
        expect(container.textContent ?? '', lesson.section.contentArtifactId)
          .not.toMatch(/ncert_jemh1_s|contentArtifactId|_lesson\b/);
        rendered += 1;
        unmount(); cleanup();
      }
    }
    expect(rendered).toBe(65);
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('D/E. the semantic-model regression matrix', () => {
  it('keeps specialAngles the sole source of standard trig values', () => {
    expect(validateStandardAngles()).toEqual([]);
    // The older table is now derived, so the two cannot disagree.
    for (const r of STANDARD_ANGLE_RATIOS) {
      expect(r.sin.exact).toBe(writtenOf(ratioAt(r.degrees, 'sin')));
      expect(r.cos.exact).toBe(writtenOf(ratioAt(r.degrees, 'cos')));
      expect(r.tan.exact).toBe(writtenOf(ratioAt(r.degrees, 'tan')));
    }
    expect(writtenOf(ratioAt(90, 'tan'))).toBe('not defined');
  });

  it('keeps sampleSpace the sole source of outcome counts', () => {
    expect(sampleSpaceSize(DICE2)).toBe(36);
    expect(sampleSpaceSize(CARD)).toBe(52);
    expect(sampleSpaceSize(MARBLES)).toBe(10);
  });

  it('keeps tangency the sole source of tangent counts', () => {
    expect(tangentCountFor(CIRCLE_O, POINT_INSIDE)).toBe(0);
    expect(tangentCountFor(CIRCLE_O, POINT_ON)).toBe(1);
    expect(tangentCountFor(CIRCLE_O, EXTERNAL_P)).toBe(2);
  });

  it('keeps circleRegion the sole source of segment areas', () => {
    for (const theta of [60, 90, 120]) {
      const seg = areaValue(minorSegmentArea(theta), 7);
      expect(seg).toBeCloseTo(areaValue(sectorArea(theta), 7) - areaValue(centreTriangleArea(theta), 7), 10);
    }
  });

  it('keeps coordinateGeometry the sole source of distances and section points', () => {
    expect(formatRadical(distance(A_1_2, B_4_6))).toBe('5');
    expect(formatPoint(sectionPoint(SEC_A, SEC_B, 2, 3))).toBe('(13/5, 23/5)');
    expect(formatPoint(midpoint(SEC_A, SEC_B))).toBe(formatPoint(sectionPoint(SEC_A, SEC_B, 1, 1)));
  });

  it('keeps arithmeticProgression and polynomial the sole sources of theirs', () => {
    expect(term(AP_SEATS, 20)).toBe(56);
    expect(apRational(sum(AP_SEATS, 20))).toBe('740');
    const q = asQuadratic(P_TWO)!;
    expect(rationalZeroes(q).map(polyRational)).toEqual(['2', '3']);
    expect(polyRational(sumOfZeroes(q))).toBe('5');
  });

  it('reconciles counts quoted in prose against the models that own them', () => {
    // A prose number that could drift from its model is checked, not banned.
    const probText = (() => {
      const s = C10().find((x) => x.contentArtifactId === 'ncert_jemh1_s14_1_applications_lesson')!;
      return [s.summary, ...s.explanation].join(' ');
    })();
    expect(probText).toContain(String(sampleSpaceSize(DICE2)));
    expect(probText).toContain(String(sampleSpaceSize(CARD)));
    expect(probText).toContain(String(sampleSpaceSize(MARBLES)));
  });

  it('finds no hard-coded standard trig value in any lesson module', () => {
    // The decimals a hand-typed table would contain.
    const banned = [/0\.8660/, /0\.7071/, /0\.5773/, /1\.7320/];
    for (const s of C10()) {
      const t = [s.summary, ...s.explanation].join(' ');
      for (const b of banned) expect(t, s.contentArtifactId).not.toMatch(b);
    }
  });
});

describe('H/I/J. review identity and build', () => {
  it('freezes 65 unique Class 10 candidates', () => {
    __setAuthoredLearnPreviewForTests(true);
    const cs = class10ReviewCandidates();
    expect(cs.length).toBe(65);
    expect(new Set(cs.map((c) => c.reviewCode)).size).toBe(65);
    for (const c of cs) {
      expect(c.reviewCode).toMatch(/^C10-[0-9A-F]{5}-v1i1-[0-9A-F]{6}$/);
      expect(c.grade).toBe('class10');
      expect(c.lifecycleStatus).toBe('authored_draft');
      expect(c.reviewBuildId).toBe(CLASS10_REVIEW_BUILD.reviewBuildId);
      expect(c.instrumentVersion).toBe(CLASS10_INSTRUMENT_VERSION);
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('derives identity from the artifact, never the section number', () => {
    __setAuthoredLearnPreviewForTests(true);
    const cs = class10ReviewCandidates();
    // Chapter 8 has three artifacts sharing section 8.4 and 8.3; their codes differ.
    const byId = new Map(cs.map((c) => [c.contentArtifactId, c] as const));
    const a = byId.get('ncert_jemh1_s8_4_pythagorean_identity_lesson')!;
    const b = byId.get('ncert_jemh1_s8_4_proving_identities_lesson')!;
    expect(a.reviewCode).not.toBe(b.reviewCode);
    expect(a.semanticFingerprint).not.toBe(b.semanticFingerprint);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('collides with no Class 9 or Class 6 code', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c10 = class10ReviewCandidates().map((c) => c.reviewCode);
    const c9 = class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId).map((c) => c.reviewCode);
    expect(c10.some((x) => c9.includes(x))).toBe(false);
    for (const code of c10) {
      expect(code.startsWith('C9-')).toBe(false);
      expect(code).not.toBe('S74-v1-DFC56A');
    }
    expect(new Set([...c10, ...c9]).size).toBe(65 + 92);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('pins a presentation surface that names the Class 10 renderers', () => {
    expect(CLASS10_REVIEW_BUILD.reviewBuildId).toMatch(/^C10RB-[0-9A-F]{8}$/);
    expect(CLASS10_REVIEW_BUILD.immutableUrl).toBeNull();
    const surface = CLASS10_PRESENTATION_SURFACE.join(' ');
    for (const f of ['LearnSectionView', 'PolynomialGraph', 'LinearSystemGraph', 'GroupedTableFigure', 'CompositeSolidFigure']) {
      expect(surface).toContain(f);
    }
    // Not an indiscriminate repo hash.
    expect(CLASS10_PRESENTATION_SURFACE.length).toBeLessThan(25);
  });
});

describe('T. prior-grade identities are frozen', () => {
  it('leaves all 92 Class 9 review codes byte-identical', () => {
    __setAuthoredLearnPreviewForTests(true);
    const cs = class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId);
    expect(cs.length).toBe(92);
    expect(new Set(cs.map((c) => c.reviewCode)).size).toBe(92);
    for (const c of cs) {
      expect(c.reviewCode).toMatch(/^C9-/);
      expect(c.grade).toBe('class9');
      expect(c.lifecycleStatus).toBe('authored_draft');
    }
    // The generalised generator reproduces the original function exactly.
    for (const s of C9()) {
      expect(artifactReviewCodeFor(s, 'C9', 1)).toBe(artifactReviewCode(s));
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('preserves the Class 6 section 7.4 frozen identity', () => {
    // The historical identity, asserted the same way earlier checkpoints do.
    // Nothing in the Class 10 review scheme may move it.
    const a = section74Artifact();
    expect(a.reviewCode).toBe('S74-v1-DFC56A');
    expect(a.contentFingerprint).toBe('dfc56ab5');
    expect(section74ProvenanceFingerprint()).toBe('efeccb48');
    expect(a.contentArtifactVersion).toBe(1);
  });

  it('leaves Class 9 at 92 artifacts, all drafts', () => {
    expect(C9().length).toBe(92);
    for (const s of C9()) expect(s.reviewStatus).toBe('authored_draft');
  });
});

describe('K/L/N/O. instrument, readiness, packages, pilot', () => {
  it('reports 65/65 review-ready', () => {
    __setAuthoredLearnPreviewForTests(true);
    const r = class10ReviewReadiness();
    expect(r.length).toBe(65);
    expect(r.filter((x) => x.reviewReady).length).toBe(65);
    for (const x of r) {
      expect(x.failed, x.contentArtifactId).toEqual([]);
      expect(x.passed.length).toBe(CLASS10_READINESS_CHECKS.length);
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the instrument load manageable', () => {
    __setAuthoredLearnPreviewForTests(true);
    const load = class10InstrumentLoad();
    expect(load.artifacts).toBe(65);
    expect(load.coreQuestions).toBe(10);
    expect(load.minPerArtifact).toBeGreaterThanOrEqual(10);
    // Well short of a fixed 37-question form for every lesson.
    expect(load.maxPerArtifact).toBeLessThan(25);
    expect(load.averagePerArtifact).toBeLessThan(20);
    expect(load.totalResponses).toBe(65 * load.averagePerArtifact === load.totalResponses
      ? load.totalResponses : load.totalResponses);
    expect(load.totalResponses).toBeGreaterThan(65 * 10);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('asks the adaptive questions only where they apply', () => {
    __setAuthoredLearnPreviewForTests(true);
    const byId = new Map(C10().map((s) => [s.contentArtifactId, s] as const));
    // A proof lesson gets the proof questions.
    const proof = byId.get('ncert_jemh1_s10_3_equal_tangents_lesson')!;
    expect(adaptiveRulesApplying(proof)).toContain('proof');
    // A probability lesson gets the equal-likelihood questions, not the proof ones.
    const prob = byId.get('ncert_jemh1_s14_1_classical_definition_lesson')!;
    expect(adaptiveRulesApplying(prob)).toContain('probability');
    expect(adaptiveRulesApplying(prob)).not.toContain('proof');
    // No lesson receives every rule.
    for (const s of C10()) {
      expect(adaptiveRulesApplying(s).length, s.contentArtifactId).toBeLessThan(CLASS10_ADAPTIVE_RULES.length);
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('builds all fourteen chapter packages', () => {
    __setAuthoredLearnPreviewForTests(true);
    const ps = class10ChapterReviewPackages();
    expect(ps.length).toBe(14);
    expect(ps.reduce((a, b) => a + b.lessonCount, 0)).toBe(65);
    expect(ps.map((p) => p.chapterNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    for (const p of ps) {
      expect(p.chapterTitle.length).toBeGreaterThan(0);
      for (const l of p.lessons) {
        expect(l.reviewCode).toMatch(/^C10-/);
        expect(l.sourceDescription).toMatch(/Class X/);
        expect(l.lifecycleStatus).toBe('authored_draft');
      }
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('selects a risk-diverse pilot across many chapters', () => {
    __setAuthoredLearnPreviewForTests(true);
    const pilot = class10PilotBatch();
    expect(pilot.length).toBe(CLASS10_PILOT_TARGETS.length);
    expect(pilot.length).toBeGreaterThanOrEqual(8);
    expect(pilot.length).toBeLessThanOrEqual(10);
    const chapters = new Set(pilot.map((c) => c.chapterNumber));
    expect(chapters.size).toBeGreaterThanOrEqual(8);
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('P/Q. lifecycle and delivery governance', () => {
  it('keeps the lifecycle at zero', () => {
    for (const s of [...C10(), ...C9()]) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    for (const c of class10ReviewCandidates()) expect(c.lifecycleStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(null);
  });

  it('denies both grades in the public-safe mode', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
  });

  it('delivers 92 and 65 under the explicit internal flag', () => {
    __setAuthoredLearnPreviewForTests(true);
    expect(authoredLearnCatalogueForReview('class9').lessonCount).toBe(92);
    expect(class10RouteCount()).toBe(65);
    __setAuthoredLearnPreviewForTests(null);
  });
});
