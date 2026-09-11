// v0.68 §15/§16 — PREPARING FOR §7.4 FEEDBACK, AND THE DRAFT INSTRUMENT.
//
// THE TRAP THIS AVOIDS
//
// §7.4 is the only section under external review. When that feedback
// arrives it will be tempting to apply every comment across all nine
// drafts at once — the drafts do follow one template, after all.
//
// That would be wrong in both directions. A comment about the §7.4
// number-line diagram does not apply to §7.9. A comment about the
// worded style of misconception feedback applies to all nine, and
// applying it to one would leave the chapter inconsistent.
//
// So: every comment gets CLASSIFIED before anything is changed, and
// nothing propagates automatically. The classification is a human
// judgement this file gives a vocabulary to, not a rule it applies.

export type FeedbackScope =
  /** Applies to §7.4 alone — its content, its diagram, its wording. */
  | 'section_specific'
  /** Applies to the authoring template every section follows. */
  | 'template_wide'
  /** About how visuals are specified or rendered. */
  | 'visual_system'
  /** About an interaction format or how responses are judged. */
  | 'interaction_system'
  /** About misconception wording, or when a diagnosis may be made. */
  | 'misconception_feedback'
  /** About sentence length, vocabulary or cognitive load. */
  | 'reading_load'
  /** About teacher notes, model language or classroom guidance. */
  | 'teacher_resource';

export const FEEDBACK_SCOPE_GUIDANCE: Record<
  FeedbackScope,
  { meaning: string; propagation: string }
> = {
  section_specific: {
    meaning: 'The comment is about §7.4 content and nothing else.',
    propagation: 'Change §7.4 only. Do not touch the other eight.',
  },
  template_wide: {
    meaning:
      'The comment is about the shape every authored section shares — the order of parts, the presence of a prior-knowledge check, the worked-example structure.',
    propagation:
      'Adjudicate once, then apply deliberately to all nine, re-reading each. Nine sections are not nine copies.',
  },
  visual_system: {
    meaning: 'About how a diagram is specified, labelled or rendered.',
    propagation:
      'Apply to the visual specification, then re-check every visual of that type. A caption fix in one strip does not fix the other six.',
  },
  interaction_system: {
    meaning: 'About an interaction format or the judging of a response.',
    propagation:
      'Apply to the format, then re-run the distractor audit — changing what a format can evidence can invalidate a diagnosis built on it.',
  },
  misconception_feedback: {
    meaning:
      'About the wording a student sees after a wrong answer, or about whether a diagnosis is safe to make at all.',
    propagation:
      'CAUTION: the §7.4 four live inside the frozen fingerprint. Changing that wording requires a new artifact version and re-review, not an edit. Registry entries can be edited in place.',
  },
  reading_load: {
    meaning: 'About sentence length, vocabulary, or how much a student must hold.',
    propagation:
      'Re-run the advisory readability audit after changing anything, and record the new counts. Do not treat the audit as evidence the problem is fixed.',
  },
  teacher_resource: {
    meaning: 'About teacher notes, model language, quick checks or support.',
    propagation:
      'Never student-facing. Can be applied more freely, but still section by section.',
  },
};

export type ClassifiedFeedback = {
  commentId: string;
  scope: FeedbackScope;
  summary: string;
  /** Sections the reviewer's comment was judged to touch. Empty until a
   *  human decides — never inferred. */
  appliesToSectionIds: string[];
  adjudicated: boolean;
};

/**
 * Real reviewer comments, once any exist.
 *
 * Empty, and it must stay empty until an actual educator responds. A
 * worked example of a classification is deliberately NOT seeded here:
 * a plausible-looking sample comment in this array is exactly how
 * invented review evidence gets into a system.
 */
export const SECTION_7_4_CLASSIFIED_FEEDBACK: ClassifiedFeedback[] = [];

export function feedbackHasArrived(): boolean {
  return SECTION_7_4_CLASSIFIED_FEEDBACK.length > 0;
}

// ---------------------------------------------------------------------------
// §16 — the short per-section instrument. DRAFT ONLY.
// ---------------------------------------------------------------------------

export type ReviewInstrumentStatus =
  | 'draft_not_activated'
  | 'active'
  | 'superseded';

export type ReviewQuestion = {
  id: string;
  area: string;
  question: string;
  responseType: 'yes_no_with_note' | 'free_text' | 'severity';
  /** Why this question is worth a reviewer's time. */
  purpose: string;
};

/**
 * v0.67 recommended Option A — every section reviewed, with a SHORT
 * instrument rather than the 37-question §7.4 packet. 37 × 9 = 333
 * questions is not a request any teacher should receive.
 *
 * Ten questions. Each maps to a defect class this chapter has actually
 * produced, not to a category that sounded thorough.
 *
 * STATUS: DRAFT. Not to be issued until the §7.4 Package B review is
 * adjudicated, because that review tests the template all nine sections
 * follow. Issuing eight more questionnaires now would collect the same
 * objection eight times.
 */
export const PER_SECTION_REVIEW_INSTRUMENT_DRAFT: {
  instrumentId: string;
  version: number;
  status: ReviewInstrumentStatus;
  activationCondition: string;
  estimatedMinutesPerSection: number;
  questions: ReviewQuestion[];
} = {
  instrumentId: 'fractions_per_section_short_v1',
  version: 1,
  status: 'draft_not_activated',
  activationCondition:
    'Activate only after the §7.4 Package B review (S74-v1-A1A3FF) has been received and adjudicated. Template-wide objections must be resolved before eight more sections are sent out.',
  estimatedMinutesPerSection: 20,
  questions: [
    {
      id: 'Q1',
      area: 'Mathematical accuracy',
      question:
        'Is every statement, worked example and answer in this section mathematically correct? If not, name each error.',
      responseType: 'free_text',
      purpose:
        'The hand audits found nine errors across two iterations. This is the question that matters most.',
    },
    {
      id: 'Q2',
      area: 'Textbook fidelity',
      question:
        'Does this section teach what the corresponding part of Ganita Prakash teaches, using compatible language and contexts?',
      responseType: 'yes_no_with_note',
      purpose:
        'Pragati verified the section title and page automatically. Whether the CONTENT matches is a judgement only a reader of the book can make.',
    },
    {
      id: 'Q3',
      area: 'Sequence',
      question:
        'Does anything here require an idea the chapter has not yet taught? Does it repeat something already settled?',
      responseType: 'free_text',
      purpose:
        'Two boundary violations survived a keyword validator because the offence was in what the item required, not what it said.',
    },
    {
      id: 'Q4',
      area: 'Explanation quality',
      question:
        'Would a Grade 6 student who did not already understand this learn it from the explanation alone?',
      responseType: 'yes_no_with_note',
      purpose:
        'Structural validators check that an explanation EXISTS. Nothing checks whether it teaches.',
    },
    {
      id: 'Q5',
      area: 'Visual correctness',
      question:
        'Is each diagram mathematically correct, correctly captioned, and actually helpful for the point being made?',
      responseType: 'free_text',
      purpose:
        'Tests assert a strip claiming equivalence is arithmetically equivalent. They cannot tell whether the picture helps.',
    },
    {
      id: 'Q6',
      area: 'Practice quality',
      question:
        'Are the practice items unambiguous, correctly answered, and free of accidental second correct answers?',
      responseType: 'free_text',
      purpose: 'Ambiguity is invisible to every automated check in the system.',
    },
    {
      id: 'Q7',
      area: 'Misconception and feedback quality',
      question:
        'Where the section tells a student WHY their answer was wrong, is that diagnosis safe? Could a student give that answer for a different reason?',
      responseType: 'free_text',
      purpose:
        'This is the single question v0.67 got wrong twice. A wrong diagnosis is worse than none.',
    },
    {
      id: 'Q8',
      area: 'Age and readability',
      question:
        'Is the language right for Grade 6 readers, including those for whom English is a second or third language?',
      responseType: 'yes_no_with_note',
      purpose:
        'Pragati measures sentence length. It cannot measure comprehensibility, and does not claim to.',
    },
    {
      id: 'Q9',
      area: 'Teacher usefulness',
      question:
        'Would the teacher notes actually help you teach this section, or are they restating the student content?',
      responseType: 'yes_no_with_note',
      purpose: 'Teacher material has had no review of any kind.',
    },
    {
      id: 'Q10',
      area: 'Overall',
      question:
        'How much revision does this section need before it should be shown to a student: none, minor, substantial, or start again?',
      responseType: 'severity',
      purpose:
        'One comparable judgement per section, so nine reviews can be read together.',
    },
  ],
};

/** Nothing may be issued while the instrument is a draft. */
export function instrumentMayBeIssued(): boolean {
  return (
    PER_SECTION_REVIEW_INSTRUMENT_DRAFT.status === 'active' &&
    feedbackHasArrived()
  );
}
