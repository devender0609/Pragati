// v0.64 §16 — WHICH REVIEW GATE CONTROLS WHAT.
//
// Two packages are outstanding and they answer different questions:
//
//   A — is this the right curriculum mapping?
//   B — is §7.4 good instruction?
//
// Two failure modes to avoid, in opposite directions:
//
//   1. Package B approval silently settling a curriculum alignment that
//      only Package A can decide. A teacher saying "this lesson teaches
//      the number line well" is not saying "FR.02 belongs to §7.2".
//
//   2. Blocking a narrowly reviewable §7.4 change behind unrelated
//      Package A items. Whether `ratio_proportion` belongs at Grade 8
//      has no bearing on whether §7.4's worked examples are correct.
//
// So dependencies are declared per gate rather than per package.

export type PackageId = 'A_curriculum' | 'B_demonstration';

export type ReviewGate = {
  gate: string;
  description: string;
  ownedBy: PackageId;
  /** Packages that must NOT be treated as settling this gate. */
  cannotBeSettledBy: PackageId[];
  /** Does progress here genuinely require Package A first? */
  blockedByPackageA: boolean;
  rationale: string;
};

export const PACKAGE_DEPENDENCIES: ReviewGate[] = [
  {
    gate: 'section_alignment_confirmed',
    description:
      'Whether a Pragati skill genuinely belongs to a named official section.',
    ownedBy: 'A_curriculum',
    cannotBeSettledBy: ['B_demonstration'],
    blockedByPackageA: true,
    rationale:
      'This is a curriculum-mapping judgement. A reviewer judging §7.4 instruction is not being asked it and their approval must not imply it.',
  },
  {
    gate: 'instructional_quality_7_4',
    description:
      'Whether §7.4 explanation, examples, visuals and practice are correct and age-appropriate.',
    ownedBy: 'B_demonstration',
    cannotBeSettledBy: ['A_curriculum'],
    // Deliberately independent: §7.4's own competency mapping is
    // already the least interpretive in the chapter (C-1.4 names the
    // number line explicitly), so instructional review can proceed.
    blockedByPackageA: false,
    rationale:
      'Blocking §7.4 instructional review on unrelated Package A items would stall the pilot for no evidential gain.',
  },
  {
    gate: 'legacy_module_disposition',
    description:
      'Where decimals / ratio_proportion / algebra belong, and how they are presented meanwhile.',
    ownedBy: 'A_curriculum',
    cannotBeSettledBy: ['B_demonstration'],
    blockedByPackageA: true,
    rationale:
      'Grade placement is a curriculum decision with no instructional-quality component.',
  },
  {
    gate: 'section_7_4_publication',
    description: 'Whether §7.4 may be shown to students.',
    ownedBy: 'B_demonstration',
    cannotBeSettledBy: [],
    // Publication DOES need both: good instruction AND a confirmed
    // place in the curriculum.
    blockedByPackageA: true,
    rationale:
      'Publishing asserts both that the content is sound and that it belongs where it claims. Only the pair of reviews supports that.',
  },
];
