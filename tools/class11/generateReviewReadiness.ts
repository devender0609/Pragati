/**
 * v0.84.0-c11.60 checkpoint 104 — CLASS 11 REVIEW-READINESS AUDIT.
 *
 * Produces four durable ledgers from source: review readiness (one row per
 * authored artifact), source alignment (one row per canonical unit),
 * provenance, and the final status matrix.
 *
 * WHAT A STATIC AUDIT CAN AND CANNOT SETTLE — the central honesty of this
 * file. It can prove STRUCTURE: that an artifact exists, maps to units,
 * owns its source truthfully, satisfies its representation contract, leaks
 * no raw values, and sits in a valid prerequisite graph. It CANNOT settle
 * whether a lesson materially teaches its unit's intent — that is reading
 * mathematics against a syllabus, and it is exactly what a human reviewer
 * is for.
 *
 * So alignment here is reported as STRUCTURALLY_ALIGNED at best, never
 * ALIGNED. A keyword match is not material coverage; the brief says so and
 * it is right. Claiming 93 aligned units from a script would be the single
 * most misleading thing this audit could do.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allAuthoredSections } from '../../src/curriculum/authoredSections';
import { authoredLearnCatalogueForGrade } from '../../src/curriculum/authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../../src/curriculum/authoredLearnAccess';
import { contractProblems, declaredFamilies } from '../../src/curriculum/representationContract';
import { validateVisual } from '../../src/curriculum/visualSpecification';
import {
  type CanonicalUnit, isClass11Artifact, reconcileCoverage,
} from '../../src/curriculum/class11Coverage';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, '../../class11-source');
const read = <T,>(f: string): T => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as T;

/**
 * Raw model state that must never reach a student — narrow, matching the
 * repository's own guard. "undefined" and "null" are ordinary mathematical
 * English ("the function is undefined at x = 2"); a LEAK shows up attached
 * to a colon or as a token no sentence would contain. My first pass flagged
 * five lessons for using the word correctly.
 */
const RAW = /:\s*(null|undefined|NaN|true|false)\b|\[object Object\]|\bNaN\b/;

const prose = (a: Record<string, never>): string => {
  const parts: unknown[] = [a.learningGoal, a.summary, a.nextStep, ...(a.explanation as never[] ?? [])];
  for (const w of (a.workedExamples as never[] ?? [])) parts.push((w as Record<string, never>).prompt);
  for (const g of (a.guidedPractice as never[] ?? [])) parts.push((g as Record<string, never>).prompt);
  for (const i of (a.independentPractice as never[] ?? [])) parts.push((i as Record<string, never>).prompt);
  return parts.filter((p) => typeof p === 'string').join(' ');
};

export function buildAudit(): Record<string, unknown> {
  __setAuthoredLearnPreviewForTests(true);
  try {
    const units = read<CanonicalUnit[]>('CLASS11_DECOMPOSITION.json');
    const artifacts = allAuthoredSections().filter(isClass11Artifact);
    const cov = reconcileCoverage(units, artifacts);
    const cat = authoredLearnCatalogueForGrade('class11');
    const byUnit = new Map(units.map((u) => [u.unitId, u]));

    // artifact id -> the canonical units it covers
    const unitsOf = new Map<string, string[]>();
    for (const [unitId, ids] of cov.byUnit) {
      for (const id of ids) unitsOf.set(id, [...(unitsOf.get(id) ?? []), unitId]);
    }

    const placement = (id: string): string => {
      for (const ch of cat.chapters) {
        if (ch.lessons.some((l) => l.contentArtifactId === id)) return `chapter-${ch.number}`;
      }
      if (cat.prerequisiteLessons.some((l) => l.contentArtifactId === id)) return 'chapter-less prerequisite';
      if (cat.requiredCoreLessons.some((l) => l.contentArtifactId === id)) return 'chapter-less required';
      return 'UNPLACED';
    };

    const reviewRows = artifacts.map((raw) => {
      const a = raw as unknown as Record<string, never>;
      const src = a.source as unknown as Record<string, never>;
      const covered = unitsOf.get(a.contentArtifactId as unknown as string) ?? [];
      const unitRecords = covered.map((u) => byUnit.get(u)!).filter(Boolean);
      const blockers: string[] = [];

      // --- ownership truth -------------------------------------------------
      const owner = src.officialChapterId as unknown as string;
      const isCbseOnly = (src as { sourceKind?: string }).sourceKind === 'cbse_only';
      const place = placement(a.contentArtifactId as unknown as string);
      if (isCbseOnly && /ncert_kemh1_ch\d/.test(owner)) {
        blockers.push('CBSE-only artifact claims an NCERT chapter owner');
      }
      // "chapter-less required" also begins with "chapter-"; match a
      // NUMBERED chapter. The prefix test flagged all eight correctly
      // placed CBSE-only lessons on my first pass.
      const inNumberedChapter = /^chapter-\d/.test(place);
      if (isCbseOnly && inNumberedChapter) {
        blockers.push(`CBSE-only artifact sits inside ${place}`);
      }
      if (!isCbseOnly && !inNumberedChapter) {
        blockers.push(`chapter-owned artifact is placed at ${place}`);
      }

      // --- provenance ------------------------------------------------------
      // page 0 and an empty section are legitimate ABSENCE sentinels for
      // CBSE-only content; they are only a defect if they imply a fake
      // NCERT location.
      let provenance: string;
      if (isCbseOnly) {
        const truthful = src.officialSectionId === '' && src.sectionNumber === ''
          && (src.startPage as unknown as number) === 0 && Boolean((src as { cbseEntryId?: string }).cbseEntryId);
        provenance = truthful ? 'PROVENANCE_COMPLETE'
          : 'PROVENANCE_INCONSISTENT';
        if (!truthful) blockers.push('CBSE-only provenance fields are not truthful absence sentinels');
      } else {
        const have = Boolean(src.officialSectionId && src.sectionNumber && src.exactTitle
          && src.textbook && src.sourceReference && src.inspectionDate);
        const paged = (src.startPage as unknown as number) > 0;
        provenance = have && paged ? 'PROVENANCE_COMPLETE' : have ? 'PROVENANCE_PARTIAL' : 'PROVENANCE_INCONSISTENT';
        if (provenance === 'PROVENANCE_INCONSISTENT') blockers.push('NCERT provenance fields incomplete');
      }

      // --- representation --------------------------------------------------
      const families = declaredFamilies(raw);
      const problems = contractProblems(raw);
      if (problems.length) blockers.push(`representation contract: ${problems.length} unmet`);
      const visualIssues = ((a.visuals as never[]) ?? [])
        .flatMap((v) => validateVisual(v as never));
      if (visualIssues.length) blockers.push(`visual validation: ${visualIssues.length} problems`);

      // --- raw values -------------------------------------------------------
      const leaks = RAW.test(prose(a));
      if (leaks) blockers.push('raw model value reaches lesson prose');

      // --- unit mapping -----------------------------------------------------
      if (!covered.length) blockers.push('artifact maps to no canonical unit');

      return {
        contentArtifactId: a.contentArtifactId,
        learningGoal: a.learningGoal,
        sourceKind: (src as { sourceKind?: string }).sourceKind ?? 'ncert',
        officialChapterId: owner,
        officialSectionId: src.officialSectionId ?? '',
        sectionNumber: src.sectionNumber ?? '',
        cbseEntryId: (src as { cbseEntryId?: string }).cbseEntryId ?? null,
        startPage: src.startPage, sourceReference: src.sourceReference,
        inspectionDate: src.inspectionDate,
        placement: place,
        canonicalUnits: covered,
        assessmentStatuses: [...new Set(unitRecords.map((u) => u.assessmentStatus))],
        instructionalStatuses: [...new Set(unitRecords.map((u) => u.instructionalStatus))],
        riskClasses: [...new Set(unitRecords.map((u) => (u as { riskClass?: string }).riskClass))],
        prerequisiteUnits: [...new Set(unitRecords.flatMap((u) => u.prerequisites))],
        representationRequirements: [...new Set(unitRecords
          .map((u) => (u as { representationRequirement?: string }).representationRequirement)
          .filter(Boolean))],
        declaredFamilies: families,
        consumedVisualKinds: [...new Set(((a.visuals as never[]) ?? [])
          .map((v) => (v as { type?: string }).type).filter(Boolean))],
        representationContract: problems.length ? 'UNMET' : 'SATISFIED',
        provenanceStatus: provenance,
        rawValueStatus: leaks ? 'LEAK' : 'CLEAN',
        // Structure is all a script can settle. Material teaching is the
        // reviewer's question, by design.
        sourceAlignmentStatus: blockers.length ? 'NEEDS_SOURCE_ALIGNMENT_FIX' : 'STRUCTURALLY_ALIGNED',
        materialAlignment: 'NEEDS_HUMAN_CHECK',
        technicalStatus: blockers.length ? 'NEEDS_TECHNICAL_FIX' : 'TECHNICALLY_VERIFIED',
        reviewReadiness: blockers.length ? 'NEEDS_TECHNICAL_FIX' : 'READY_FOR_HUMAN_REVIEW',
        blockingIssues: blockers,
        // Lifecycle states a script may never assert.
        sentForHumanReview: false, humanReviewed: false, adjudicated: false, published: false,
      };
    });

    const alignmentRows = units.map((u) => {
      const ids = cov.byUnit.get(u.unitId) ?? [];
      const shared = cov.sharedKeys.find((k) => k.unitIds.includes(u.unitId));
      return {
        unitId: u.unitId, title: u.title, objective: (u as { objective?: string }).objective,
        sourceKind: u.source.kind, chapter: (u as { chapter?: number }).chapter,
        assessmentStatus: u.assessmentStatus, instructionalStatus: u.instructionalStatus,
        riskClass: (u as { riskClass?: string }).riskClass,
        representationRequirement: (u as { representationRequirement?: string }).representationRequirement,
        prerequisites: u.prerequisites,
        artifacts: ids,
        covered: ids.length > 0,
        sharesArtifactWith: shared ? shared.unitIds.filter((x) => x !== u.unitId) : [],
        sharedCoverageKey: shared?.key ?? null,
        structuralCoverage: ids.length ? 'COVERED' : 'UNCOVERED',
        // The audit's honest verdict: a script cannot read a lesson and
        // judge whether it teaches this objective.
        materialAlignment: 'NEEDS_HUMAN_CHECK',
        materialAlignmentReason: ids.length
          ? 'structural coverage proven; material teaching of the objective requires a human reviewer'
          : 'no authored coverage',
      };
    });

    const ready = reviewRows.filter((r) => r.reviewReadiness === 'READY_FOR_HUMAN_REVIEW');
    return {
      generatedBy: 'tools/class11/generateReviewReadiness.ts',
      scope: 'current canonical 93-unit Class 11 scope',
      statusMatrix: {
        sourceDecompositionUnits: units.length,
        requiredUnits: units.filter((u) => u.instructionalStatus.startsWith('REQUIRED')).length,
        authoredArtifacts: new Set(artifacts.map((a) => a.contentArtifactId)).size,
        requiredCoverage: `${cov.covered} / ${units.length}`,
        uncovered: cov.uncovered, orphans: cov.orphans,
        structurallyReadyForHumanReview: ready.length,
        needingFix: reviewRows.length - ready.length,
        materialAlignmentSettled: 0,
        materialAlignmentNeedingHumanCheck: units.length,
        sentForHumanReview: 0, humanReviewed: 0, adjudicated: 0, published: 0,
      },
      caveat: 'READY_FOR_HUMAN_REVIEW means structurally safe to send to a reviewer. '
        + 'It is not material alignment, not human review, and not publishable.',
      sharedCoverageKeys: cov.sharedKeys,
      reviewLedger: reviewRows,
      alignmentLedger: alignmentRows,
    };
  } finally {
    __setAuthoredLearnPreviewForTests(null);
  }
}

const RUN = process.argv[1] !== undefined
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (RUN) {
  const a = buildAudit() as Record<string, never>;
  const m = a.statusMatrix as unknown as Record<string, unknown>;
  fs.writeFileSync(path.join(DIR, 'CLASS11_REVIEW_READINESS_LEDGER.json'),
    `${JSON.stringify({ generatedBy: a.generatedBy, scope: a.scope, caveat: a.caveat,
      statusMatrix: m, sharedCoverageKeys: a.sharedCoverageKeys, reviewLedger: a.reviewLedger }, null, 2)}\n`);
  fs.writeFileSync(path.join(DIR, 'CLASS11_SOURCE_ALIGNMENT_LEDGER.json'),
    `${JSON.stringify({ generatedBy: a.generatedBy, scope: a.scope,
      caveat: 'structural coverage is proven; material alignment is a human judgement',
      alignmentLedger: a.alignmentLedger }, null, 2)}\n`);
  fs.writeFileSync(path.join(DIR, 'CLASS11_FINAL_STATUS_MATRIX.json'),
    `${JSON.stringify({ generatedBy: a.generatedBy, scope: a.scope, caveat: a.caveat, ...m }, null, 2)}\n`);
  console.log(JSON.stringify(m, null, 1));
}
