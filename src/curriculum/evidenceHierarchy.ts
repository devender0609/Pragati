// v0.55 §4 — Evidence hierarchy, by claim type.
//
// WHY A SINGLE RANKING WOULD BE WRONG
//
// Pragati draws on NCF-SE 2023, current textbooks, CBSE curricula,
// PARAKH, older NCERT Learning Outcomes, and mathematical inference.
// These conflict, and which one wins DEPENDS ON WHAT IS BEING CLAIMED:
//
//   - "Which chapter is this in?" -> the current textbook wins. The
//     framework does not enumerate chapters.
//   - "Is this a curricular goal?" -> the national framework wins. A
//     textbook is one publisher's realisation of it.
//   - "How should this be assessed?" -> the national assessment
//     framework wins. Curriculum documents are not assessment design.
//
// A universal ranking would get at least one of these wrong.

export type ClaimType =
  | 'curricular_structure'
  | 'chapter_placement'
  | 'assessment_design'
  | 'learning_outcome'
  // v0.56 §6 — "progression order" was one claim type, which let a
  // mathematical-necessity argument outrank curriculum on questions
  // that are actually pedagogical choices. These are four different
  // claims with four different strongest sources.
  | 'logical_prerequisite'
  | 'developmental_prerequisite'
  | 'instructional_sequence'
  | 'empirical_difficulty_progression';

export type SourceType =
  | 'national_framework'
  | 'national_assessment_framework'
  | 'current_textbook'
  | 'current_official_curriculum'
  | 'older_learning_outcomes'
  | 'official_derivative'
  | 'secondary_corroboration'
  | 'mathematical_inference'
  | 'expert_judgement';

/** Authority order per claim type, strongest first. */
export const CLAIM_TYPE_HIERARCHY: Record<ClaimType, SourceType[]> = {
  curricular_structure: [
    'national_framework',
    'current_official_curriculum',
    'official_derivative',
    'current_textbook',
    'older_learning_outcomes',
    'secondary_corroboration',
    'expert_judgement',
    'mathematical_inference',
  ],
  chapter_placement: [
    // The textbook IS the chapter list. Nothing outranks it here.
    'current_textbook',
    'current_official_curriculum',
    'national_framework',
    'official_derivative',
    'older_learning_outcomes',
    'secondary_corroboration',
    'expert_judgement',
    'mathematical_inference',
  ],
  assessment_design: [
    'national_assessment_framework',
    'national_framework',
    'current_official_curriculum',
    'official_derivative',
    'expert_judgement',
    'secondary_corroboration',
    'older_learning_outcomes',
    'mathematical_inference',
  ],
  learning_outcome: [
    'older_learning_outcomes',
    'national_framework',
    'current_official_curriculum',
    'official_derivative',
    'current_textbook',
    'secondary_corroboration',
    'expert_judgement',
    'mathematical_inference',
  ],
  // A is mathematically NECESSARY for B. Mathematics decides this;
  // no curriculum document can make it false.
  logical_prerequisite: [
    'mathematical_inference',
    'expert_judgement',
    'national_framework',
    'older_learning_outcomes',
    'current_textbook',
    'current_official_curriculum',
    'official_derivative',
    'secondary_corroboration',
  ],
  // Learning A tends to SUPPORT learning B. An empirical claim about
  // children, so expertise and data outrank pure mathematics.
  developmental_prerequisite: [
    'expert_judgement',
    'older_learning_outcomes',
    'national_framework',
    'current_official_curriculum',
    'mathematical_inference',
    'current_textbook',
    'official_derivative',
    'secondary_corroboration',
  ],
  // A curriculum CHOOSES to teach A before B. Policy decides this;
  // mathematics has no standing.
  instructional_sequence: [
    'current_official_curriculum',
    'current_textbook',
    'national_framework',
    'official_derivative',
    'older_learning_outcomes',
    'expert_judgement',
    'secondary_corroboration',
    'mathematical_inference',
  ],
  // A is empirically easier/earlier than B. Only data can say.
  empirical_difficulty_progression: [
    'expert_judgement',
    'older_learning_outcomes',
    'current_official_curriculum',
    'national_framework',
    'current_textbook',
    'official_derivative',
    'secondary_corroboration',
    'mathematical_inference',
  ],
};

export function claimTypeAuthority(t: ClaimType): SourceType[] {
  return CLAIM_TYPE_HIERARCHY[t];
}

export type FrameworkGeneration = 'NCF 2005' | 'NCF-SE 2023' | 'unknown';

export type SourceRecord = {
  sourceType: SourceType;
  frameworkGeneration: FrameworkGeneration;
  claim: string;
  directlyInspected: boolean;
};

export type ConflictResolution = {
  winner: SourceRecord;
  overruled: SourceRecord[];
  conflictStatus:
    | 'no_conflict'
    | 'resolved_by_hierarchy'
    // v0.56 §5 — sources from different framework generations disagree
    // on a claim type where the generation matters. Source-type ranking
    // is NOT sufficient: the older document may have been deliberately
    // superseded, or may still be current. A human must say which.
    | 'requires_generation_review'
    | 'unresolvable';
  /** Set when conflictStatus is 'requires_generation_review'. */
  generationReview?: {
    olderClaim: string;
    olderGeneration: FrameworkGeneration;
    currentClaim: string | null;
    currentGeneration: FrameworkGeneration | null;
    outcomeStatus: 'retained' | 'modified' | 'moved' | 'superseded' | 'unknown';
  };
  /** True when sources span framework generations — a resolution that
   *  may be comparing incompatible things. */
  generationMismatch: boolean;
  note: string;
};

export function resolveConflict(
  claimType: ClaimType,
  sources: SourceRecord[]
): ConflictResolution {
  const order = claimTypeAuthority(claimType);
  const ranked = [...sources].sort(
    (a, b) => order.indexOf(a.sourceType) - order.indexOf(b.sourceType)
  );
  const winner = ranked[0];
  const overruled = ranked.slice(1);

  const generations = new Set(
    sources.map((s) => s.frameworkGeneration).filter((g) => g !== 'unknown')
  );
  const generationMismatch = generations.size > 1;

  const notes: string[] = [];
  if (generationMismatch) {
    notes.push(
      `Sources span different framework generations (${[...generations].join(', ')}). A newer framework may have deliberately changed what an older document states, so this is not a simple disagreement.`
    );
  }
  if (!winner.directlyInspected) {
    notes.push(
      'The winning source was not directly inspected; the resolution is provisional.'
    );
  }

  // Claim types where a framework change materially alters the answer.
  const generationSensitive: ClaimType[] = [
    'curricular_structure',
    'chapter_placement',
    'learning_outcome',
    'instructional_sequence',
  ];

  if (
    sources.length > 1 &&
    generationMismatch &&
    generationSensitive.includes(claimType)
  ) {
    const older = ranked.find((s) => s.frameworkGeneration === 'NCF 2005');
    const current = ranked.find((s) => s.frameworkGeneration === 'NCF-SE 2023');
    return {
      winner,
      overruled,
      conflictStatus: 'requires_generation_review',
      generationMismatch: true,
      generationReview: {
        olderClaim: older?.claim ?? '',
        olderGeneration: older?.frameworkGeneration ?? 'unknown',
        currentClaim: current?.claim ?? null,
        currentGeneration: current?.frameworkGeneration ?? null,
        outcomeStatus: 'unknown',
      },
      note:
        notes.join(' ') +
        ' Source-type ranking alone cannot resolve this: the older document may have been deliberately superseded, or may still hold. A human must determine whether the older outcome is retained, modified, moved, or superseded.',
    };
  }

  return {
    winner,
    overruled,
    conflictStatus: sources.length <= 1 ? 'no_conflict' : 'resolved_by_hierarchy',
    generationMismatch,
    note: notes.join(' '),
  };
}
