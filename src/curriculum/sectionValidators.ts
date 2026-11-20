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
import { validateDataSet, validateDataDisplay } from './dataDisplaySpecification';
import { officialSectionById } from './officialSections';
import { SOURCE_SEGMENTS, unitsForClass } from './instructionalUnits';
import { artifactSourceKind, artifactSourceId } from './authoredSection';
import { FRACTIONS_MISCONCEPTIONS } from './fractionsMisconceptions';
import { NUMBER_PLAY_MISCONCEPTIONS } from './numberPlayMisconceptions';

export function validateAuthoredSection(s: AuthoredSection): string[] {
  const e: string[] = [];
  const id = artifactSourceId(s.source);
  const kind = artifactSourceKind(s.source);

  // --- identity and source ------------------------------------------
  if (!s.contentArtifactId) e.push(`${id}: missing contentArtifactId`);
  if (s.contentArtifactVersion < 1) e.push(`${id}: artifact version must be >= 1`);
  if (!s.source.sourceReference) e.push(`${id}: missing source reference`);

  if (kind === 'source_segment') {
    // v0.84.0 checkpoint 41 — a chapter with no numbered sections.
    //
    // The segment path is checked at least as hard as the section path: the
    // segments must exist, belong to this chapter, carry verified page
    // extent and intent, and be dispositioned for Learn authoring. And no
    // official section id may ride along, because a lesson that names both
    // is claiming a section the book does not print.
    const segments = s.source.sourceSegmentIds ?? [];
    if (segments.length === 0) e.push(`${id}: a segment-backed lesson must name its source segments`);
    if (s.source.officialSectionId !== '') {
      e.push(`${id}: segment-backed lesson also names official section '${s.source.officialSectionId}'`);
    }
    if ((s.source.sectionNumber ?? '') !== '') {
      e.push(`${id}: segment-backed lesson carries section number '${s.source.sectionNumber}', which the book does not print`);
    }
    if ((s.source.additionalOfficialSectionIds ?? []).length > 0) {
      e.push(`${id}: segment-backed lesson lists additional official sections`);
    }
    if (!s.source.sourceLabel?.trim()) {
      e.push(`${id}: a segment-backed lesson must say where in the chapter it comes from`);
    }
    for (const segId of segments) {
      const seg = SOURCE_SEGMENTS.find((x) => x.sourceSegmentId === segId);
      if (!seg) {
        e.push(`${id}: '${segId}' is not a verified source segment`);
        continue;
      }
      if (seg.officialRecordId !== s.source.officialChapterId) {
        e.push(`${id}: segment '${segId}' belongs to ${seg.officialRecordId}, not this chapter`);
      }
      // A segment the decomposition set aside as practice must not become a
      // Learn lesson by being quietly named here.
      if (seg.role !== 'CORE_MATHEMATICS') {
        e.push(`${id}: segment '${segId}' is dispositioned ${seg.role} and cannot back a Learn lesson`);
      }
      const ev = seg.sourceEvidence;
      if (!ev || typeof ev.pdfPageStart !== 'number' || typeof ev.pdfPageEnd !== 'number') {
        e.push(`${id}: segment '${segId}' has no verified page extent`);
      }
      if (!seg.mathematicalIntent?.trim()) {
        e.push(`${id}: segment '${segId}' has no verified mathematical intent`);
      }
    }
    // The chapter itself must still be a real one.
    const chapterUnits = unitsForClass(9).filter((u) => u.officialChapterId === s.source.officialChapterId);
    if (s.source.officialChapterId.startsWith('ncert_') && chapterUnits.length === 0) {
      e.push(`${id}: no decomposed units for chapter ${s.source.officialChapterId}`);
    }
  } else {
    if (!officialSectionById(s.source.officialSectionId)) {
      e.push(`${id}: not a verified official section`);
    } else {
      const official = officialSectionById(s.source.officialSectionId)!;
      if (official.exactTitle !== s.source.exactTitle) {
        e.push(
          `${id}: title '${s.source.exactTitle}' does not match the official record '${official.exactTitle}'`
        );
      }
      if (official.startPage !== s.source.startPage) {
        e.push(`${id}: start page does not match the official record`);
      }
    }

    // A merged lesson must name every official section it covers, or the
    // extra sections disappear from provenance.
    for (const extra of s.source.additionalOfficialSectionIds ?? []) {
      if (!officialSectionById(extra)) {
        e.push(`${id}: additional section '${extra}' is not a verified official section`);
      }
      if (extra === id) e.push(`${id}: lists itself as an additional section`);
    }
  }

  // v0.84.0 checkpoint 37 — a lesson's data displays must read datasets it
  // actually carries, and those datasets must be internally consistent.
  for (const [key, data] of Object.entries(s.dataSets ?? {})) {
    for (const err of validateDataSet(data)) e.push(`${id}: dataset ${key} — ${err}`);
    if (data.id !== key) e.push(`${id}: dataset ${key} carries a different id, ${data.id}`);
  }
  for (const d of s.dataDisplays ?? []) {
    for (const err of validateDataDisplay(d, s.dataSets ?? {})) e.push(`${id}: ${err}`);
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
  // v0.79 §2 — the validator knew one chapter's registry by name, so a
  // second chapter's authored draft could not reference its own
  // misconceptions without being reported as unknown. Chapters register
  // here; the check itself is unchanged and still rejects an id that
  // exists nowhere.
  const known = new Set<string>([
    ...FRACTIONS_MISCONCEPTIONS.map((m) => m.id as string),
    ...NUMBER_PLAY_MISCONCEPTIONS.map((m) => m.id as string),
  ]);
  for (const m of s.misconceptionIds) {
    // §7.4 uses the older per-section misconception objects; those IDs
    // are legitimately outside the chapter registry.
    if (!known.has(m) && !m.startsWith('M')) {
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

  // v0.84.0 checkpoint 35 — PRE_EXISTING_CLASS_6_SEQUENCE_LEAK_REPAIR.
  //
  // The probe used to reduce "Fractions on the number line" to the bare
  // phrase "number line", so §3.3 — a section whose own official title is
  // "Patterns of Numbers on the Number Line" — was reported as leaking the
  // subject it is about. The authored lesson was correct; the rule was not.
  //
  // Two repairs, both general. A probe now keeps the distinctive words of
  // the concept rather than the shared ones, and a probe that occurs in the
  // section's own official title is never evidence of a leak: a section
  // cannot leak its own subject into itself.
  const officialSubject = `${s.source.sectionNumber} ${s.source.exactTitle}`.toLowerCase();

  const leaks: string[] = [];
  for (const rule of s.sequence.mustNotIntroduce) {
    const key = rule.concept.toLowerCase();
    const probe =
      key.includes('fraction') && key.includes('number line') ? 'fraction on the number line'
        : key.includes('number line') ? 'number line'
          : key.includes('mixed') ? 'mixed fraction'
            : key.includes('equivalent') ? 'equivalent fraction'
              : key.includes('comparing') ? 'common denominator'
                : key.includes('adding') ? ' + '
                  : null;
    if (!probe) continue;
    if (officialSubject.includes(probe)) continue;
    if (studentText.includes(probe)) {
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
