/**
 * v0.84.0-c11.61 checkpoint 105 — CLASS 11 HUMAN REVIEW, WAVE 1 PREPARATION.
 *
 * Selects a high-information sample, builds one reviewer packet per
 * artifact, and locks each packet to an artifact fingerprint. It prepares;
 * it does not review, and it does not send.
 *
 * SELECTION IS ARCHITECTURAL, NOT DIFFICULTY-RANKED. Wave 1 exists to test
 * whether the unit-to-lesson mapping itself holds up before Class 12
 * inherits it. Three structures earn a place regardless of mathematical
 * difficulty:
 *
 *   - artifacts carrying several canonical units, worst case §7.2 with four
 *   - units whose artifact count is not one, in EITHER direction
 *   - CBSE-only content, where source ownership was corrected twice already
 *
 * Every reviewer-facing judgement field is null. The packets carry what the
 * source says and what the lesson says; what they do not carry is any
 * opinion of mine about whether the two match, because that is the one
 * question this whole wave exists to answer.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { allAuthoredSections } from '../../src/curriculum/authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../../src/curriculum/authoredLearnAccess';
import { type CanonicalUnit, isClass11Artifact } from '../../src/curriculum/class11Coverage';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, '../../class11-source');
const OUT = path.join(HERE, '../../class11-review');
const read = <T,>(f: string): T => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as T;

/** Binds a review to the exact instructional content it was given. */
export function fingerprint(a: Record<string, unknown>): string {
  const instructional = JSON.stringify({
    learningGoal: a.learningGoal, explanation: a.explanation, vocabulary: a.vocabulary,
    workedExamples: a.workedExamples, guidedPractice: a.guidedPractice,
    independentPractice: a.independentPractice, reasoningApplication: a.reasoningApplication,
    summary: a.summary, visuals: a.visuals,
  });
  return crypto.createHash('sha256').update(instructional).digest('hex').slice(0, 32);
}

export function buildWave1(): Record<string, unknown> {
  __setAuthoredLearnPreviewForTests(true);
  try {
    const units = read<CanonicalUnit[]>('CLASS11_DECOMPOSITION.json');
    const byUnit = new Map(units.map((u) => [u.unitId, u]));
    const ledger = read<Record<string, never>>('CLASS11_REVIEW_READINESS_LEDGER.json');
    const rows = ledger.reviewLedger as unknown as Array<Record<string, never>>;
    const sharedKeys = ledger.sharedCoverageKeys as unknown as Array<{ key: string; unitIds: string[] }>;
    const artifacts = new Map(allAuthoredSections().filter(isClass11Artifact)
      .map((a) => [a.contentArtifactId, a as unknown as Record<string, unknown>]));

    // How many artifacts does each unit have? Not always one, either way.
    const artifactsPerUnit = new Map<string, string[]>();
    for (const r of rows) {
      for (const u of r.canonicalUnits as unknown as string[]) {
        artifactsPerUnit.set(u, [...(artifactsPerUnit.get(u) ?? []), r.contentArtifactId as unknown as string]);
      }
    }
    const sharedUnitSet = new Set(sharedKeys.flatMap((k) => k.unitIds));

    const selected = rows.map((r) => {
      const id = r.contentArtifactId as unknown as string;
      const covered = r.canonicalUnits as unknown as string[];
      const recs = covered.map((u) => byUnit.get(u)).filter(Boolean) as CanonicalUnit[];
      const reasons: string[] = [];
      let score = 0;

      if (covered.length >= 4) { reasons.push(`carries ${covered.length} canonical units — the hardest granularity case`); score += 100; }
      else if (covered.length === 3) { reasons.push('carries 3 canonical units'); score += 60; }
      else if (covered.length === 2) { reasons.push('carries 2 canonical units'); score += 30; }

      if (covered.some((u) => sharedUnitSet.has(u))) { reasons.push('covers a tracked shared source key'); score += 25; }

      // A unit taught by more than one artifact is the mirror-image question:
      // is the material duplicated, or split on purpose?
      const multiArtifact = covered.filter((u) => (artifactsPerUnit.get(u) ?? []).length > 1);
      if (multiArtifact.length) {
        reasons.push(`shares unit(s) with another lesson: ${multiArtifact.join(', ')}`);
        score += 40;
      }

      if (r.sourceKind === 'cbse_only') { reasons.push(`CBSE-only required content (${r.cbseEntryId})`); score += 35; }
      if ((r.placement as unknown as string).startsWith('chapter-less')) { reasons.push('chapter-less placement'); score += 10; }
      if (recs.some((u) => (u as { riskClass?: string }).riskClass === 'C')) { reasons.push('risk class C'); score += 15; }
      if (recs.some((u) => u.source.kind === 'SCOPE_FRAGMENT')) { reasons.push('scope-fragment source'); score += 20; }

      const kinds = [...new Set((((artifacts.get(id)?.visuals as unknown[]) ?? [])
        .map((v) => (v as { type?: string }).type)).filter(Boolean))] as string[];
      if (kinds.includes('special_sum') || kinds.includes('chain_rule')) {
        reasons.push(`new visual family: ${kinds.filter((k) => k === 'special_sum' || k === 'chain_rule').join(', ')}`);
        score += 30;
      }
      return { id, covered, reasons, score, row: r, recs, visualKinds: kinds };
    }).sort((a, b) => b.score - a.score);

    // Pure score ranking fills every slot with multi-unit NCERT lessons and
    // crowds out the CBSE-only content and whole chapters — which defeats
    // the point, since CBSE-only ownership is where two governance defects
    // already occurred. So the wave is built from quotas:
    //
    //   1. the worst granularity cases, by score
    //   2. EVERY CBSE-only artifact (there are only eight, and they are the
    //      category with the worst track record)
    //   3. one artifact per chapter not yet represented, highest score first
    //
    // Breadth is a selection requirement, not a tiebreak.
    const chapterOf = (r: { row: Record<string, never> }): string => {
      const m = /^chapter-(\d+)/.exec(r.row.placement as unknown as string);
      return m ? m[1] : 'chapter-less';
    };
    const wave: typeof selected = [];
    const take = (s: (typeof selected)[number]): void => {
      if (!wave.some((w) => w.id === s.id)) wave.push(s);
    };
    for (const s of selected.filter((x) => x.covered.length >= 2).slice(0, 8)) take(s);
    for (const s of selected.filter((x) => x.row.sourceKind === 'cbse_only')) take(s);
    const seen = new Set(wave.map(chapterOf));
    for (const s of selected) {
      const ch = chapterOf(s);
      if (!seen.has(ch)) { take(s); seen.add(ch); }
    }
    wave.sort((a, b) => b.score - a.score);

    const packets = wave.map((s, i) => {
      const a = artifacts.get(s.id)!;
      return {
        priority: i + 1,
        contentArtifactId: s.id,
        title: a.learningGoal,
        placement: s.row.placement,
        selectionReasons: s.reasons,
        artifactFingerprint: fingerprint(a),
        decompositionVersion: read<Record<string, never>>('CLASS11_COMPLETENESS_LEDGER.json').generatedBy,
        canonicalUnits: s.recs.map((u) => ({
          unitId: u.unitId, title: u.title,
          objective: (u as { objective?: string }).objective,
          assessmentStatus: u.assessmentStatus, instructionalStatus: u.instructionalStatus,
          progression: (u as { progression?: string }).progression,
          textbookBodyDemand: (u as { textbookBodyDemand?: string }).textbookBodyDemand,
          cbseProofExpectation: (u as { cbseProofExpectation?: string }).cbseProofExpectation ?? null,
          representationRequirement: (u as { representationRequirement?: string }).representationRequirement,
          riskClass: (u as { riskClass?: string }).riskClass,
          alsoTaughtBy: (artifactsPerUnit.get(u.unitId) ?? []).filter((x) => x !== s.id),
        })),
        sourceProvenance: {
          kind: s.row.sourceKind, officialChapterId: s.row.officialChapterId,
          officialSectionId: s.row.officialSectionId || null,
          sectionNumber: s.row.sectionNumber || null,
          cbseEntryId: s.row.cbseEntryId,
          startPage: s.row.startPage, sourceReference: s.row.sourceReference,
          note: s.row.sourceKind === 'cbse_only'
            ? 'CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data'
            : null,
        },
        structuralChecks: {
          note: 'Automated structural checks passed. These say the lesson is well-formed and truthfully mapped. They say nothing about whether it teaches the objectives.',
          representationContract: s.row.representationContract,
          provenance: s.row.provenanceStatus,
          rawValues: s.row.rawValueStatus,
          visualFamiliesUsed: s.visualKinds,
        },
        lessonContent: {
          learningGoal: a.learningGoal, vocabulary: a.vocabulary,
          explanation: a.explanation, workedExamples: a.workedExamples,
          guidedPractice: a.guidedPractice, independentPractice: a.independentPractice,
          reasoningApplication: a.reasoningApplication, summary: a.summary,
          visuals: ((a.visuals as unknown[]) ?? []).map((v) => {
            const vv = v as Record<string, unknown>;
            return { type: vv.type, caption: vv.caption ?? null, altText: vv.altText };
          }),
        },
        // Every judgement unset. The reviewer fills these.
        reviewerResponse: {
          reviewer: null, reviewDate: null, reviewedFingerprint: null,
          unitResults: s.recs.map((u) => ({
            unitId: u.unitId, materialAlignment: null, mathematicalCorrectness: null,
            scopeDiscipline: null, explanationQuality: null, comments: null,
          })),
          workedExamples: null, practiceFeedback: null, representationQuality: null,
          accessibilityEquivalence: null, lessonGranularity: null,
          overallRecommendation: null, issues: [],
        },
        lifecycle: {
          state: 'PREPARED', sentForHumanReview: false, sentDate: null,
          humanReviewed: false, adjudicated: false, published: false,
        },
      };
    });

    return {
      generatedBy: 'tools/class11/generateReviewWave1.ts',
      wave: 1,
      caveat: 'Preparation only. Nothing has been sent, reviewed, adjudicated or published. '
        + 'Every reviewer judgement field is null by design.',
      selectionBasis: 'architectural information value — unit-to-lesson granularity, shared source keys, '
        + 'CBSE-only ownership, scope fragments and new visual families — not mathematical difficulty',
      sharedCoverageKeys: sharedKeys,
      multiUnitArtifactCount: rows.filter((r) => (r.canonicalUnits as unknown as string[]).length > 1).length,
      unitsTaughtByMoreThanOneArtifact: [...artifactsPerUnit.entries()]
        .filter(([, v]) => v.length > 1).map(([u, v]) => ({ unitId: u, artifacts: v })),
      selected: packets.length,
      packets,
    };
  } finally {
    __setAuthoredLearnPreviewForTests(null);
  }
}

const RUN = process.argv[1] !== undefined
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (RUN) {
  fs.mkdirSync(OUT, { recursive: true });
  const w = buildWave1() as Record<string, never>;
  const packets = w.packets as unknown as Array<Record<string, never>>;
  fs.writeFileSync(path.join(OUT, 'WAVE1_LEDGER.json'), `${JSON.stringify({
    generatedBy: w.generatedBy, wave: w.wave, caveat: w.caveat, selectionBasis: w.selectionBasis,
    sharedCoverageKeys: w.sharedCoverageKeys, multiUnitArtifactCount: w.multiUnitArtifactCount,
    unitsTaughtByMoreThanOneArtifact: w.unitsTaughtByMoreThanOneArtifact,
    selected: w.selected,
    entries: packets.map((p) => ({
      priority: p.priority, contentArtifactId: p.contentArtifactId,
      canonicalUnits: (p.canonicalUnits as unknown as Array<{ unitId: string }>).map((u) => u.unitId),
      selectionReasons: p.selectionReasons, artifactFingerprint: p.artifactFingerprint,
      packetPath: `class11-review/packets/${p.contentArtifactId}.json`,
      reviewerAssignment: null, sentDate: null, reviewResult: null, lifecycle: p.lifecycle,
    })),
  }, null, 2)}\n`);
  fs.mkdirSync(path.join(OUT, 'packets'), { recursive: true });
  for (const p of packets) {
    fs.writeFileSync(path.join(OUT, 'packets', `${p.contentArtifactId}.json`), `${JSON.stringify(p, null, 2)}\n`);
  }
  console.log(`wave 1: ${packets.length} packets`);
  for (const p of packets.slice(0, 20)) {
    console.log(` ${String(p.priority).padStart(2)} ${String(p.contentArtifactId).slice(0, 46).padEnd(48)}`
      + `${(p.canonicalUnits as unknown as unknown[]).length}u  ${(p.selectionReasons as unknown as string[])[0]}`);
  }
}
