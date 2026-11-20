/**
 * v0.84.0-c11.63 checkpoint 107 — FOUR-PACKET HUMAN REVIEW PILOT.
 *
 * The four were chosen to exercise both directions of the many-to-many
 * unit-to-lesson architecture, plus the two newest semantic models:
 *
 *   §7.2            four canonical units on ONE lesson
 *   s3_4_sum_diff   two units ALSO taught by a second lesson
 *   FO-11, FO-8     CBSE-only, new visual families, chapter-less
 *
 * Packet 2 is the one that needs extra work. A reviewer cannot judge
 * "is this duplication useful?" from one lesson alone, so the partner
 * lesson's instructional content travels with it as context. Without that
 * the overlap question is unanswerable and the reviewer would be guessing.
 *
 * Everything a human decides starts null. Pre-review observations are
 * recorded separately and labelled as observations, never as findings:
 * they are things a reader might notice, not conclusions reached.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(HERE, '../../class11-review');
const PILOT = path.join(REVIEW, 'pilot');

export const PILOT_SET = [
  'ncert_kemh1_s7_2_binomial_theorem_lesson',
  'ncert_kemh1_s3_4_sum_difference_lesson',
  'cbse_fo11_chain_rule_lesson',
  'cbse_fo8_special_sums_lesson',
] as const;

const WHY: Record<string, string> = {
  ncert_kemh1_s7_2_binomial_theorem_lesson:
    'Four canonical units on one lesson — the strongest test of whether several objectives can share a lesson without any of them being crowded into a mention.',
  ncert_kemh1_s3_4_sum_difference_lesson:
    'Both its units are also taught by a second lesson — the mirror question: is spreading an objective across lessons complementary, or redundant?',
  cbse_fo11_chain_rule_lesson:
    'CBSE-only, chapter-less, newest semantic model and visual family. Structural verification is strong here; whether it teaches the chain rule at the right depth is untested.',
  cbse_fo8_special_sums_lesson:
    'CBSE-only, chapter-less, new visual family, and three formulas in one lesson — is that one coherent lesson or too dense?',
};

export function buildPilot(): Record<string, unknown> {
  const wave = JSON.parse(fs.readFileSync(path.join(REVIEW, 'WAVE1_LEDGER.json'), 'utf8')) as
    Record<string, never>;
  const waveIds = new Set((wave.entries as unknown as Array<{ contentArtifactId: string }>)
    .map((e) => e.contentArtifactId));
  const overlapMap = new Map((wave.unitsTaughtByMoreThanOneArtifact as unknown as
    Array<{ unitId: string; artifacts: string[] }>).map((x) => [x.unitId, x.artifacts]));
  const full = new Map(fs.readdirSync(path.join(REVIEW, 'packets'))
    .map((f) => {
      const p = JSON.parse(fs.readFileSync(path.join(REVIEW, 'packets', f), 'utf8')) as
        Record<string, never>;
      return [p.contentArtifactId as unknown as string, p];
    }));

  const entries = PILOT_SET.map((id, i) => {
    const p = full.get(id)!;
    if (!waveIds.has(id)) throw new Error(`${id} is not in Wave 1`);
    const units = (p.canonicalUnits as unknown as Array<Record<string, never>>);
    const unitIds = units.map((u) => u.unitId as unknown as string);
    const prov = p.sourceProvenance as unknown as Record<string, never>;

    // Partner lessons that also teach one of these units.
    const partners = [...new Set(unitIds.flatMap((u) => (overlapMap.get(u) ?? []))
      .filter((a) => a !== id))];
    const overlapContext = partners.map((pid) => {
      const q = full.get(pid);
      const sharedUnits = unitIds.filter((u) => (overlapMap.get(u) ?? []).includes(pid));
      return {
        artifactId: pid,
        sharedUnits,
        inWave1: waveIds.has(pid),
        // Enough of the partner to answer the overlap question without
        // asking for a second full review.
        learningGoal: q ? q.lessonContent && (q.lessonContent as unknown as Record<string, never>).learningGoal : null,
        explanation: q ? (q.lessonContent as unknown as Record<string, never>).explanation : null,
        summary: q ? (q.lessonContent as unknown as Record<string, never>).summary : null,
        note: q ? 'full instructional content supplied as context; a separate review of this lesson is not required'
          : 'this partner lesson is not in Wave 1; its content is not bundled here',
      };
    });

    return {
      order: i + 1,
      artifactId: id,
      artifactFingerprint: p.artifactFingerprint,
      packetPath: `class11-review/packets/${id}.json`,
      whySelected: WHY[id],
      mappedUnits: unitIds,
      riskClasses: [...new Set(units.map((u) => u.riskClass as unknown as string))],
      sourceKind: prov.kind,
      cbseOnly: prov.kind === 'cbse_only',
      cbseEntryId: prov.cbseEntryId ?? null,
      sourceLabel: prov.kind === 'cbse_only'
        ? `CBSE-only, entry ${String(prov.cbseEntryId)} — no NCERT section or page exists for this content; `
          + 'its chapter adjacency is instructional placement, not bibliographic ownership'
        : `NCERT section ${String(prov.sectionNumber)}, page ${String(prov.startPage)}`,
      multiUnit: unitIds.length > 1,
      involvesMultiArtifactUnit: partners.length > 0,
      overlapContext,
      visualFamilies: [...new Set((p.lessonContent as unknown as
        { visuals: Array<{ type: string }> }).visuals.map((v) => v.type))],
      requiresUnitByUnitAnswers: true,
      // Real-world fields. Nothing here moves without an external event.
      reviewer: null, sentAt: null, responseReceived: false,
      reviewStatus: 'UNREVIEWED', responseFingerprint: null,
      adjudicationStatus: 'NOT_STARTED',
    };
  });

  return {
    generatedBy: 'tools/class11/generateReviewPilot.ts',
    pilot: 'Class 11 Human Review Wave 1 — four-packet pilot',
    caveat: 'Preparation only. sent 0, human-reviewed 0, adjudicated 0, published 0. '
      + 'Every reviewer judgement is null and no lesson was altered.',
    testsBothDirections: {
      manyUnitsOneLesson: 'ncert_kemh1_s7_2_binomial_theorem_lesson',
      oneUnitManyLessons: 'ncert_kemh1_s3_4_sum_difference_lesson',
    },
    deliveryOptions: [
      'one reviewer takes all four — most consistent granularity judgements',
      'two reviewers split them by mathematical area',
      'independent double review of §7.2 only — the highest-granularity case',
    ],
    assignmentNote: 'No reviewer is assigned. Assignment is the user\'s to make.',
    totals: { pilotPackets: entries.length, sent: 0, humanReviewed: 0, adjudicated: 0, published: 0 },
    entries,
  };
}

/** Empty response, shaped for the existing validator. Nothing pre-filled. */
export function responseTemplate(id: string, fingerprint: string, unitIds: string[]):
Record<string, unknown> {
  return {
    _instructions: 'Fill every field. Copy artifactId and reviewedFingerprint exactly as given. '
      + 'A response without a named reviewer cannot be accepted as a human review.',
    reviewer: null, reviewDate: null,
    artifactId: id, reviewedFingerprint: fingerprint,
    unitResults: unitIds.map((unitId) => ({
      unitId,
      materialAlignment: null, // ALIGNED | PARTIAL | MISALIGNED | CANNOT_DETERMINE
      mathematicalCorrectness: null, // CORRECT | MINOR_CORRECTION_NEEDED | MAJOR_CORRECTION_NEEDED
      scopeDiscipline: null, // WITHIN_SCOPE | INTRODUCES_LATER_CONTENT | OMITS_REQUIRED_MATERIAL | PRESENTS_ENRICHMENT_AS_REQUIRED
      explanationQuality: null, crowdedOut: null, comments: null,
    })),
    workedExamples: null, practiceFeedback: null, representationQuality: null,
    accessibilityEquivalence: null,
    lessonGranularity: null, // ONE_LESSON_APPROPRIATE | SHOULD_SPLIT | SHOULD_MERGE | DUPLICATIVE_ACROSS_ARTIFACTS | UNCERTAIN
    overallRecommendation: null, // ACCEPT | ACCEPT_WITH_MINOR_EDITS | REVISE | MAJOR_REWORK | ESCALATE_SCOPE_QUESTION
    issues: [],
  };
}

const RUN = process.argv[1] !== undefined
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (RUN) {
  fs.mkdirSync(path.join(PILOT, 'responses'), { recursive: true });
  const p = buildPilot() as Record<string, never>;
  fs.writeFileSync(path.join(PILOT, 'PILOT_LEDGER.json'), `${JSON.stringify(p, null, 2)}\n`);
  for (const e of p.entries as unknown as Array<Record<string, never>>) {
    fs.writeFileSync(path.join(PILOT, 'responses', `${e.artifactId}.response.json`),
      `${JSON.stringify(responseTemplate(e.artifactId as unknown as string,
        e.artifactFingerprint as unknown as string,
        e.mappedUnits as unknown as string[]), null, 2)}\n`);
  }
  console.log(`pilot: ${(p.entries as unknown as unknown[]).length} packets`);
  for (const e of p.entries as unknown as Array<Record<string, never>>) {
    console.log(`  ${e.order} ${String(e.artifactId).slice(0, 44).padEnd(46)}`
      + `${(e.mappedUnits as unknown as unknown[]).length}u  ${e.sourceKind}  `
      + `overlap:${(e.overlapContext as unknown as unknown[]).length}  `
      + `visuals:${(e.visualFamilies as unknown as string[]).join(',') || 'none'}`);
  }
}
