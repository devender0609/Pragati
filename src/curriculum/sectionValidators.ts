// v0.67 §19 — STRUCTURAL VALIDATORS FOR AUTHORED SECTIONS.
//
// These catch incomplete drafts: a worked example with no rationale, a
// visual whose semantics do not validate, a section claiming an
// alignment nothing supports.
//
// THEY DO NOT PROVE PEDAGOGICAL QUALITY. A section can pass every check
// here and still teach badly, or be mathematically wrong in a way no
// structural rule can see. Human review remains required, and nothing
// in this file should be cited as evidence that content is good.

import type { AuthoredSection } from './authoredSection';
import { validateVisual } from './visualSpecification';
import { classifyReadingLoad, type ReadingLoadClass } from './instructionalInteraction';
import { officialSectionById } from './officialSections';
import { FRACTIONS_MISCONCEPTIONS } from './fractionsMisconceptions';

export function validateAuthoredSection(s: AuthoredSection): string[] {
  const e: string[] = [];
  const id = s.source.officialSectionId;

  // --- identity and source ------------------------------------------
  if (!s.contentArtifactId) e.push(`${id}: missing contentArtifactId`);
  if (s.contentArtifactVersion < 1) e.push(`${id}: artifact version must be >= 1`);
  if (!s.source.sourceReference) e.push(`${id}: missing source reference`);
  if (!officialSectionById(id)) {
    e.push(`${id}: not a verified official section`);
  } else {
    const official = officialSectionById(id)!;
    if (official.exactTitle !== s.source.exactTitle) {
      e.push(
        `${id}: title '${s.source.exactTitle}' does not match the official record '${official.exactTitle}'`
      );
    }
    if (official.startPage !== s.source.startPage) {
      e.push(`${id}: start page does not match the official record`);
    }
  }

  // --- student content ----------------------------------------------
  if (!s.learningGoal.trim()) e.push(`${id}: missing learning goal`);
  if (s.explanation.length === 0) e.push(`${id}: no explanation`);

  for (const w of s.workedExamples) {
    if (w.steps.length === 0) e.push(`${id}/${w.id}: worked example has no steps`);
    if (!w.answer.trim()) e.push(`${id}/${w.id}: worked example has no answer`);
    for (const [i, st] of w.steps.entries()) {
      // A step without reasoning shows WHAT to do and never WHY.
      if (!st.reasoning.trim()) {
        e.push(`${id}/${w.id}: step ${i + 1} has no reasoning`);
      }
    }
    if (w.visualRef && !s.visualsById[w.visualRef]) {
      e.push(`${id}/${w.id}: references unknown visual '${w.visualRef}'`);
    }
  }

  for (const g of s.guidedPractice) {
    // Guided practice without a hint is independent practice under
    // another heading — the duplication §9 forbids.
    if (!g.hint.trim()) e.push(`${id}/${g.id}: guided item has no hint`);
    if (!g.rationale.trim()) e.push(`${id}/${g.id}: guided item has no rationale`);
  }
  for (const p of s.independentPractice) {
    if (!p.rationale.trim()) e.push(`${id}/${p.id}: item has no rationale`);
  }

  // --- visuals -------------------------------------------------------
  for (const [i, v] of s.visuals.entries()) {
    const errs = validateVisual(v);
    for (const err of errs) e.push(`${id}: visual ${i} — ${err}`);
    if (!v.altText.trim()) e.push(`${id}: visual ${i} has no alt text`);
  }

  // --- misconceptions -------------------------------------------------
  const known = new Set(FRACTIONS_MISCONCEPTIONS.map((m) => m.id));
  for (const m of s.misconceptionIds) {
    // §7.4 uses the older per-section misconception objects; those IDs
    // are legitimately outside the chapter registry.
    if (!known.has(m as never) && !m.startsWith('M')) {
      e.push(`${id}: unknown misconception '${m}'`);
    }
  }

  // --- interactive practice alignment ---------------------------------
  for (const item of s.interactivePractice) {
    if (item.officialSectionId !== id) {
      e.push(
        `${id}/${item.itemId}: aligned to '${item.officialSectionId}', not this section`
      );
    }
    if (item.use !== 'instructional_practice') {
      e.push(`${id}/${item.itemId}: item use must be instructional_practice`);
    }
  }

  return e;
}

/**
 * v0.67 §3 — SEQUENCE LEAK CHECK.
 *
 * Does this section teach something the textbook introduces later?
 * Searched over student-facing prose only; teacher notes legitimately
 * reference later sections to warn against previewing them.
 */
export function sequenceLeaks(s: AuthoredSection): string[] {
  const studentText = [
    s.learningGoal,
    ...s.explanation,
    ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => x.text)]),
    ...s.guidedPractice.map((g) => g.prompt),
    ...s.independentPractice.map((p) => p.prompt),
    s.summary,
  ]
    .join(' ')
    .toLowerCase();

  const leaks: string[] = [];
  for (const rule of s.sequence.mustNotIntroduce) {
    // Match on a distinctive phrase from the concept name.
    const key = rule.concept.toLowerCase();
    const probe =
      key.includes('number line') ? 'number line'
        : key.includes('mixed') ? 'mixed fraction'
          : key.includes('equivalent') ? 'equivalent fraction'
            : key.includes('comparing') ? 'common denominator'
              : key.includes('adding') ? ' + '
                : null;
    if (probe && studentText.includes(probe)) {
      leaks.push(
        `${s.source.sectionNumber}: mentions '${probe}', which belongs to ${rule.belongsToSection}`
      );
    }
  }
  return leaks;
}

export type ReadingLoadReport = {
  within_standard: number;
  justified_exception: number;
  rewrite_required: number;
  overThreshold: Array<{ itemId: string; words: number; prompt: string }>;
};

/**
 * v0.67 §11 — reading load over ordinary item stems.
 *
 * Reasoning/application tasks are excluded from the count: they
 * genuinely require more words, and truncating them would damage the
 * task to satisfy a metric.
 */
export function readingLoadReport(
  sections: AuthoredSection[]
): ReadingLoadReport {
  const report: ReadingLoadReport = {
    within_standard: 0,
    justified_exception: 0,
    rewrite_required: 0,
    overThreshold: [],
  };

  const bump = (c: ReadingLoadClass) => {
    report[c] += 1;
  };

  for (const s of sections) {
    const ordinary: Array<{ id: string; prompt: string }> = [
      ...s.guidedPractice.map((g) => ({ id: g.id, prompt: g.prompt })),
      ...s.independentPractice.map((p) => ({ id: p.id, prompt: p.prompt })),
      ...s.interactivePractice.map((i) => ({ id: i.itemId, prompt: i.prompt })),
    ];
    for (const item of ordinary) {
      const r = classifyReadingLoad(item.prompt);
      bump(r.classification);
      if (r.classification !== 'within_standard') {
        report.overThreshold.push({
          itemId: item.id,
          words: r.wordCount,
          prompt: item.prompt,
        });
      }
    }
  }
  return report;
}
