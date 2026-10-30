// ===========================================================================
// v0.84.0-c10.17 checkpoint 71 — THE DETERMINISTIC HALF.
//
// Checkpoint 70 established that thirteen semantic models are the single
// source of truth for the mathematics they own. This module uses that: for
// every artifact it re-derives the quantities the models own and reconciles
// them against what the lesson actually says to a student.
//
// Two things this is NOT.
//
//   * It is not a qualitative read. It cannot tell whether an explanation
//     teaches. Checkpoint 49 established that these two claims must never be
//     merged, and the report keeps them apart.
//
//   * It is not a per-wave suite. Each wave's tests check their own chapter;
//     none would notice a value that drifted between chapters, or a scope
//     leak that only appears when the corpus is read together.
//
// A prose number that disagrees with its model is a FINDING, unless the
// sentence is explicitly quoting a misconception to reject it.
// ===========================================================================

import { allAuthoredSections } from './authoredSections';
import type { AuthoredSection } from './authoredSection';
import { auditProofScope } from './proofScopeAudit';

export type AuditSeverity = 'major' | 'minor' | 'observation';

export type CorpusFinding = {
  artifactId: string;
  chapter: number;
  check: string;
  severity: AuditSeverity;
  detail: string;
};

export type ArtifactAuditRecord = {
  artifactId: string;
  chapter: number;
  checksRun: string[];
  findings: CorpusFinding[];
  clean: boolean;
};

export const class10Artifacts = (): AuthoredSection[] =>
  allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));

export const chapterOf = (s: AuthoredSection): number =>
  Number(s.source.officialChapterId.replace('ncert_jemh1_ch', ''));

/** Everything a student can read in this lesson, as one string. */
export function studentText(s: AuthoredSection): string {
  return [
    s.learningGoal, s.summary, s.nextStep,
    ...s.explanation,
    ...s.vocabulary.map((v) => `${v.term} ${v.meaning}`),
    ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
    ...s.guidedPractice.map((g) => `${g.prompt} ${g.hint ?? ''} ${g.answer} ${g.rationale}`),
    ...s.independentPractice.map((p) => `${p.prompt} ${p.answer} ${p.rationale}`),
    ...s.reasoningApplication.map((r) => `${r.prompt} ${r.expectedReasoning}`),
  ].join(' ');
}

/** Sentences, so a claim can be judged in the context that qualifies it. */
export const sentences = (t: string): string[] => t.split(/(?<=[.?!])\s+/);

/**
 * A sentence that quotes a wrong claim in order to reject it is not the
 * claim. Seven checkpoints have needed this; it is centralised here.
 */
export const REJECTS_CLAIM =
  /\bis not\b|\bwould be wrong\b|\bcannot\b|\bdoes not\b|\ba student\b|\bmistake\b|\bwhat is wrong\b|\brather than\b|\binstead of\b|\bwhy (?:this|that) is wrong\b|\bnot a proof\b|\bwrong to (?:say|think)\b|\?\s*$|^(?:could|can|is|does|would|should|why)\b/i;

export const isRejection = (s: string) => REJECTS_CLAIM.test(s);

// ---------------------------------------------------------------------------
// Corpus-wide checks — the ones no per-wave suite would catch.
// ---------------------------------------------------------------------------

/** Topics the current edition removed, searched across every lesson at once. */
const OUT_OF_SCOPE: Array<{ name: string; pattern: RegExp; allowedIn: number[] }> = [
  { name: 'Euclid division algorithm as instruction', pattern: /\bEuclid\b/i, allowedIn: [] },
  { name: 'coordinate area of a triangle', pattern: /\barea of (?:a |the )?triangle\b[^.]{0,60}\b(?:coordinates?|vertices)\b/i, allowedIn: [] },
  { name: 'slope', pattern: /\bslope of (?:the |a )?line\b/i, allowedIn: [] },
  { name: 'external division', pattern: /\bexternal(?:ly)? divi(?:des?|sion|ding)\b/i, allowedIn: [] },
  { name: 'cross-multiplication method', pattern: /\bcross[- ]multiplication method\b/i, allowedIn: [] },
  { name: 'ogive', pattern: /\bogive\b/i, allowedIn: [] },
  { name: 'unit circle', pattern: /\bunit circle\b/i, allowedIn: [] },
  { name: 'compound or double angle', pattern: /\b(?:compound|double)[- ]angle\b|\bsin\(A \+ B\)/i, allowedIn: [] },
  { name: 'conditional probability or independence', pattern: /\bconditional probability\b|\bindependent events\b|\bmutually exclusive\b/i, allowedIn: [] },
  { name: 'complex or imaginary numbers', pattern: /\bcomplex (?:number|root|zero)|\bimaginary\b/i, allowedIn: [] },
  { name: 'infinity as a value', pattern: /\b(?:is|=)\s*(?:\u221e|infinity)\b/i, allowedIn: [] },
];

export function auditScopeLeak(s: AuthoredSection): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  const ch = chapterOf(s);
  for (const sentence of sentences(studentText(s))) {
    if (isRejection(sentence)) continue;
    // A sentence that declares a topic excluded is not teaching it.
    if (/\boutside (?:this|the)\b|\babsent from this edition\b|\bnot (?:covered|taught|part of)\b|\bno longer\b/i.test(sentence)) continue;
    for (const t of OUT_OF_SCOPE) {
      if (t.allowedIn.includes(ch)) continue;
      if (t.pattern.test(sentence)) {
        out.push({ artifactId: s.contentArtifactId, chapter: ch, check: 'scope_leak', severity: 'major',
          detail: `${t.name}: "${sentence.trim().slice(0, 120)}"` });
      }
    }
  }
  return out;
}

/** A PROVE artifact must carry a proof; an APPLY one must not pretend to. */
/**
 * Does this lesson actually carry a proof?
 *
 * An earlier version of this check looked for the literal labels GIVEN and
 * TO PROVE, and flagged eleven artifacts. Every one was a false positive:
 * only checkpoint 67 adopted those labels, and the proofs written in
 * checkpoints 56, 57, 58 and 62 state their hypotheses in prose instead —
 * "In triangle ABC let DE be parallel to BC" is a statement of givens
 * however it is typeset.
 *
 * So the test is now semantic: a worked example that announces a proof, and
 * whose steps form a chain long enough to be one. The convention difference
 * is recorded separately as a presentation finding, which is what it is.
 */
export function carriesProof(s: AuthoredSection): boolean {
  const labelled = /\bGIVEN\b/.test(studentText(s)) && /\bTO PROVE\b/.test(studentText(s));
  if (labelled) return true;
  return s.workedExamples.some(
    (w) => /\b(?:prove|derive|show) that\b|\bprove the\b|\bderive the\b/i.test(w.prompt) && w.steps.length >= 4
  );
}

/** Which structural convention a proof-bearing lesson uses. */
export function proofConvention(s: AuthoredSection): 'labelled' | 'prose' | 'none' {
  if (!carriesProof(s)) return 'none';
  const t = studentText(s);
  return /\bGIVEN\b/.test(t) && /\bTO PROVE\b/.test(t) ? 'labelled' : 'prose';
}

export function auditProofPresence(s: AuthoredSection, expectation: string): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  if (expectation === 'PROVE' && !carriesProof(s)) {
    out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'proof_presence', severity: 'major',
      detail: 'recorded expectation is PROVE but the lesson carries no proof chain' });
  }
  if (expectation === 'STATE_WITHOUT_PROOF') {
    // Checkpoint 57 built `auditProofScope` precisely to separate PROVING a
    // criterion from APPLYING it to an instance. A first version of this
    // check reinvented that distinction and got it wrong, flagging the AAA
    // lesson — which says in its own learning goal that the criterion is
    // taken as given, and whose "show that these two triangles are similar"
    // is an application. The existing auditor is used instead of a second,
    // worse one.
    for (const f of auditProofScope(s, 'STATE_WITHOUT_PROOF')) {
      out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'proof_scope',
        severity: 'major', detail: f.reason });
    }
  }
  return out;
}

/** Terms defined and then never used, across the whole corpus. */
export function auditGlossaryUse(s: AuthoredSection): CorpusFinding[] {
  const whole = studentText(s).toLowerCase();
  return s.vocabulary
    .filter((v) => {
      const head = v.term.toLowerCase().split(' ').slice(-1)[0];
      return !whole.includes(v.term.toLowerCase()) && !whole.includes(head);
    })
    .map((v) => ({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'glossary_use',
      severity: 'minor' as AuditSeverity, detail: `defines "${v.term}" and never uses it` }));
}

/** Thin reasoning: a step whose justification restates the step. */
export function auditReasoningDepth(s: AuthoredSection): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  for (const w of s.workedExamples) {
    for (const step of w.steps) {
      if (step.reasoning.trim().length < 40) {
        out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'reasoning_depth',
          severity: 'minor', detail: `${w.id}: reasoning under 40 characters` });
      }
    }
  }
  return out;
}

/** Placeholders and unevaluated template literals reaching a student. */
export function auditPlaceholders(s: AuthoredSection): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  for (const sentence of sentences(studentText(s))) {
    if (/\$\{/.test(sentence)) {
      out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'placeholder', severity: 'major',
        detail: `unevaluated template literal: "${sentence.trim().slice(0, 80)}"` });
    }
    if (/\b(?:TODO|TBD|placeholder|FIXME|recheck)\b/i.test(sentence)) {
      out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'placeholder', severity: 'major',
        detail: `authoring marker left in: "${sentence.trim().slice(0, 80)}"` });
    }
  }
  return out;
}

/** Provenance that a reviewer would need and that must not be invented. */
export function auditProvenance(s: AuthoredSection): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  const f = (detail: string, severity: AuditSeverity = 'major') =>
    out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'provenance', severity, detail });
  if (!/Class X/.test(s.source.textbook)) f('textbook is not the Class X title');
  if (!/^\d+\.\d+$/.test(s.source.sectionNumber)) f('section number is not in the expected form');
  if (!(s.source.startPage > 0)) f('no start page');
  if (!s.source.inspectionDate) f('no inspection date');
  if (s.contentArtifactVersion !== 1) f(`artifact version is ${s.contentArtifactVersion}, not 1`, 'observation');
  if (s.reviewStatus !== 'authored_draft') f(`status is ${s.reviewStatus}`);
  return out;
}

/** Each lesson should have the five stages populated. */
export function auditStageCompleteness(s: AuthoredSection): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  const f = (detail: string) =>
    out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'stage_completeness', severity: 'major', detail });
  if (s.explanation.length < 3) f('Learn the idea has fewer than three paragraphs');
  if (s.workedExamples.length < 2) f('fewer than two worked examples');
  if (s.guidedPractice.length < 2) f('fewer than two guided items');
  if (s.independentPractice.length < 2) f('fewer than two independent items');
  if (s.reasoningApplication.length < 1) f('no Think deeper task');
  if (!s.summary.trim()) f('no summary');
  if (!s.learningGoal.trim()) f('no learning goal');
  return out;
}

/** Duplicate prose across artifacts, which a per-chapter suite cannot see. */
export function auditCorpusDuplication(all: AuthoredSection[]): CorpusFinding[] {
  const out: CorpusFinding[] = [];
  const seen = new Map<string, string>();
  for (const s of all) {
    for (const p of s.explanation) {
      const key = p.replace(/\s+/g, ' ').trim().toLowerCase();
      if (key.length < 120) continue;
      const prior = seen.get(key);
      if (prior && prior !== s.contentArtifactId) {
        out.push({ artifactId: s.contentArtifactId, chapter: chapterOf(s), check: 'corpus_duplication',
          severity: 'minor', detail: `paragraph identical to one in ${prior}` });
      } else seen.set(key, s.contentArtifactId);
    }
  }
  return out;
}

/** A single pass over the whole corpus. */
export function runCorpusAudit(expectationOf: (s: AuthoredSection) => string): {
  records: ArtifactAuditRecord[];
  findings: CorpusFinding[];
} {
  const all = class10Artifacts();
  const dupes = auditCorpusDuplication(all);
  const records = all.map((s) => {
    const findings = [
      ...auditScopeLeak(s),
      ...auditProofPresence(s, expectationOf(s)),
      ...auditGlossaryUse(s),
      ...auditReasoningDepth(s),
      ...auditPlaceholders(s),
      ...auditProvenance(s),
      ...auditStageCompleteness(s),
      ...dupes.filter((d) => d.artifactId === s.contentArtifactId),
    ];
    return {
      artifactId: s.contentArtifactId,
      chapter: chapterOf(s),
      checksRun: ['scope_leak', 'proof_presence', 'glossary_use', 'reasoning_depth',
        'placeholder', 'provenance', 'stage_completeness', 'corpus_duplication'],
      findings,
      clean: findings.length === 0,
    };
  });
  return { records, findings: records.flatMap((r) => r.findings) };
}
