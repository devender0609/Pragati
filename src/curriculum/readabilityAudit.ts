// v0.68 §7 — ADVISORY READABILITY AUDIT.
//
// WHAT THE EXISTING VALIDATOR COVERS, AND WHAT IT MISSES
//
// `readingLoadReport()` counts words in ordinary item stems against the
// Classes 6-8 limit of 25. It reports 85 within_standard, 0
// rewrite_required, and it stays exactly as it is.
//
// It says nothing about the prose a student actually reads MOST of:
// explanations, learning goals, worked-example reasoning steps,
// feedback and summaries. A 25-word rule cannot be applied there — an
// explanation paragraph is supposed to be longer than a question — so
// v0.67 measured none of it.
//
// WHAT THIS ADDS
//
// Structural signals a human can act on, per section:
//
//   - mean and maximum sentence length
//   - paragraphs that are unusually dense for the surrounding text
//   - worked-example steps that run long
//   - density of terms a Grade 6 reader is unlikely to hold
//
// THIS IS NOT A READABILITY GRADE, AND MUST NOT BE REPORTED AS ONE.
//
// Flesch-Kincaid, SMOG and the rest are validated on American English
// prose and rest on syllable counts. Pragati's content is Indian
// English aimed at multilingual Grade 6 readers, and the text is full
// of mathematical notation ("3/8", "2¾") that every syllable counter
// mis-parses. Producing "reading age 11.4" from that machinery would be
// a number with no evidence behind it, which is worse than no number.
//
// So every output here is a COUNT or a FLAG, and the flags mean "a
// person should look at this", never "this is too hard".

export type ProseKind =
  | 'learning_goal'
  | 'explanation'
  | 'worked_example_prompt'
  | 'worked_example_step'
  | 'feedback'
  | 'summary'
  | 'vocabulary';

export type ProseFlag =
  | 'long_sentence'
  | 'dense_paragraph'
  | 'long_worked_step'
  | 'jargon_dense';

export type ProseObservation = {
  officialSectionId: string;
  sectionNumber: string;
  kind: ProseKind;
  locator: string;
  words: number;
  sentences: number;
  longestSentenceWords: number;
  jargonTerms: string[];
  flags: ProseFlag[];
  excerpt: string;
};

export type SectionReadability = {
  officialSectionId: string;
  sectionNumber: string;
  totalProsePieces: number;
  totalWords: number;
  meanSentenceWords: number;
  longestSentenceWords: number;
  flagged: number;
  needsHumanReadabilityReview: boolean;
  observations: ProseObservation[];
};

/**
 * Thresholds, and why these numbers.
 *
 * They are ADVISORY TRIGGERS, chosen to surface outliers within this
 * corpus rather than to encode a reading level. A sentence of 26 words
 * is not "too hard"; it is longer than most of the chapter and worth a
 * second look. If the corpus changes, these should be re-derived, not
 * defended.
 */
export const READABILITY_THRESHOLDS = {
  longSentenceWords: 26,
  denseParagraphWords: 60,
  longWorkedStepWords: 30,
  jargonTermsPerHundredWords: 12,
  /**
   * Below this length the density ratio is noise, not signal.
   *
   * First run without it flagged a four-word reasoning step reading
   * "Same denominator." as jargon-dense at 25 terms per hundred words.
   * That is arithmetically true and pedagogically meaningless: the
   * whole point of a short reasoning line is to name the one idea. A
   * ratio needs a denominator big enough to mean something, which is
   * the same lesson this chapter teaches.
   */
  minWordsForJargonDensity: 15,
} as const;

/**
 * Mathematical and academic terms a Grade 6 reader meeting them for the
 * first time must be TAUGHT, not assumed.
 *
 * Listing them is not a claim that they should be removed — "numerator"
 * has to appear in a fractions chapter. It is a claim that a paragraph
 * carrying several at once is doing a lot at once.
 */
export const TRACKED_TERMS = [
  'numerator',
  'denominator',
  'equivalent',
  'improper',
  'mixed fraction',
  'fractional unit',
  'common denominator',
  'partition',
  'notation',
  'axiom',
  'proportional',
  'precisely',
  'subdivide',
];

export function splitSentences(text: string): string[] {
  return text
    // Split on terminal punctuation followed by a space. Decimal points
    // are not a concern here — this chapter contains no decimals.
    .split(/(?<=[.!?])\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function jargonIn(text: string): string[] {
  const lower = text.toLowerCase();
  return TRACKED_TERMS.filter((t) => lower.includes(t));
}

function observe(
  officialSectionId: string,
  sectionNumber: string,
  kind: ProseKind,
  locator: string,
  text: string
): ProseObservation {
  const sentences = splitSentences(text);
  const words = countWords(text);
  const longest = sentences.reduce((m, s) => Math.max(m, countWords(s)), 0);
  const jargon = jargonIn(text);
  const flags: ProseFlag[] = [];

  if (longest >= READABILITY_THRESHOLDS.longSentenceWords) flags.push('long_sentence');
  if (words >= READABILITY_THRESHOLDS.denseParagraphWords) flags.push('dense_paragraph');
  if (
    kind === 'worked_example_step' &&
    words >= READABILITY_THRESHOLDS.longWorkedStepWords
  ) {
    flags.push('long_worked_step');
  }
  if (
    words >= READABILITY_THRESHOLDS.minWordsForJargonDensity &&
    (jargon.length * 100) / words >= READABILITY_THRESHOLDS.jargonTermsPerHundredWords
  ) {
    flags.push('jargon_dense');
  }

  return {
    officialSectionId,
    sectionNumber,
    kind,
    locator,
    words,
    sentences: sentences.length,
    longestSentenceWords: longest,
    jargonTerms: jargon,
    flags,
    excerpt: text.length > 120 ? `${text.slice(0, 117)}...` : text,
  };
}

type SectionLike = {
  source: { officialSectionId: string; sectionNumber: string };
  learningGoal: string;
  explanation: string[];
  vocabulary: Array<{ term: string; meaning: string }>;
  workedExamples: Array<{
    id: string;
    prompt: string;
    steps: Array<{ text: string; reasoning: string }>;
  }>;
  guidedPractice: Array<{ id: string; rationale: string }>;
  independentPractice: Array<{ id: string; rationale: string }>;
  interactivePractice: Array<{
    itemId: string;
    correctFeedback: string;
    neutralIncorrectFeedback: string;
  }>;
  summary: string;
};

export function auditSectionReadability(s: SectionLike): SectionReadability {
  const id = s.source.officialSectionId;
  const num = s.source.sectionNumber;
  const obs: ProseObservation[] = [];

  obs.push(observe(id, num, 'learning_goal', 'learningGoal', s.learningGoal));
  s.explanation.forEach((p, i) =>
    obs.push(observe(id, num, 'explanation', `explanation[${i}]`, p))
  );
  s.vocabulary.forEach((v) =>
    obs.push(observe(id, num, 'vocabulary', `vocab:${v.term}`, v.meaning))
  );
  for (const w of s.workedExamples) {
    obs.push(observe(id, num, 'worked_example_prompt', `${w.id}.prompt`, w.prompt));
    w.steps.forEach((st, i) => {
      obs.push(
        observe(id, num, 'worked_example_step', `${w.id}.step${i + 1}`, st.text)
      );
      obs.push(
        observe(
          id,
          num,
          'worked_example_step',
          `${w.id}.step${i + 1}.reasoning`,
          st.reasoning
        )
      );
    });
  }
  for (const g of s.guidedPractice) {
    obs.push(observe(id, num, 'feedback', `${g.id}.rationale`, g.rationale));
  }
  for (const p of s.independentPractice) {
    obs.push(observe(id, num, 'feedback', `${p.id}.rationale`, p.rationale));
  }
  for (const i of s.interactivePractice) {
    obs.push(observe(id, num, 'feedback', `${i.itemId}.correct`, i.correctFeedback));
    obs.push(
      observe(id, num, 'feedback', `${i.itemId}.incorrect`, i.neutralIncorrectFeedback)
    );
  }
  obs.push(observe(id, num, 'summary', 'summary', s.summary));

  const allSentenceLengths = obs.flatMap((o) =>
    o.sentences > 0 ? [o.words / o.sentences] : []
  );
  const meanSentenceWords =
    allSentenceLengths.length === 0
      ? 0
      : Math.round(
          (allSentenceLengths.reduce((a, b) => a + b, 0) /
            allSentenceLengths.length) *
            10
        ) / 10;

  const flagged = obs.filter((o) => o.flags.length > 0).length;

  return {
    officialSectionId: id,
    sectionNumber: num,
    totalProsePieces: obs.length,
    totalWords: obs.reduce((n, o) => n + o.words, 0),
    meanSentenceWords,
    longestSentenceWords: obs.reduce(
      (m, o) => Math.max(m, o.longestSentenceWords),
      0
    ),
    flagged,
    // A section with any flag is worth a person's eyes. Nothing here
    // decides whether the prose is actually too hard.
    needsHumanReadabilityReview: flagged > 0,
    observations: obs,
  };
}

export type ChapterReadabilityReport = {
  sections: SectionReadability[];
  totalProsePieces: number;
  totalFlagged: number;
  sectionsNeedingReview: string[];
  byFlag: Record<ProseFlag, number>;
  /** Stated in the report itself so it cannot be quoted without it. */
  disclaimer: string;
};

export function chapterReadabilityReport(
  sections: SectionLike[]
): ChapterReadabilityReport {
  const rows = sections.map(auditSectionReadability);
  const byFlag: Record<ProseFlag, number> = {
    long_sentence: 0,
    dense_paragraph: 0,
    long_worked_step: 0,
    jargon_dense: 0,
  };
  for (const r of rows) {
    for (const o of r.observations) {
      for (const f of o.flags) byFlag[f] += 1;
    }
  }
  return {
    sections: rows,
    totalProsePieces: rows.reduce((n, r) => n + r.totalProsePieces, 0),
    totalFlagged: rows.reduce((n, r) => n + r.flagged, 0),
    sectionsNeedingReview: rows
      .filter((r) => r.needsHumanReadabilityReview)
      .map((r) => r.sectionNumber),
    byFlag,
    disclaimer:
      'Structural counts only. These are not a readability grade and no reading age is claimed. ' +
      'Established formulas assume American English prose and syllable counting, neither of which fits ' +
      'Indian-English mathematical text for multilingual Grade 6 readers. A flag means a person should look, ' +
      'not that the text is too hard.',
  };
}
