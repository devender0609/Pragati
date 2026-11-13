// ===========================================================================
// v0.84.0-c10.11 checkpoint 65 — PROBABILITY IS NOT NEW IN CLASS 10.
//
// The canonical source model records Chapter 14 as FORMALISATION, with the
// evidence that Class 9 Chapter 7 already established the theoretical
// approach, the sample space and equally likely outcomes. The frozen Class 9
// lessons confirm it: six of them, covering randomness, the 0-to-1 scale,
// experimental probability, theoretical probability with the equal-likelihood
// justification, sample space and events as subsets, and two-stage
// enumeration by tree diagram.
//
// This reuses the checkpoint-64 novelty-audit shape against that list. It
// does not ban the word "new" — a lesson must be able to say what Class 10
// genuinely adds.
// ===========================================================================

export type NoveltyFinding = { where: string; text: string; reason: string };

/** What the frozen Class 9 record shows students already have. */
export const PROBABILITY_IN_CLASS_9 = [
  'probability', 'sample space', 'event', 'outcome',
  'theoretical probability', 'experimental probability', 'equally likely',
  'random', 'tree diagram',
];

export const CLASS_9_PROBABILITY_PRIOR = {
  source: 'src/curriculum/probabilitySections.ts (Class 9 Chapter 7, frozen, 6 lessons)',
  alreadyCovered: [
    'randomness, and the 0-to-1 probability scale with both its ends',
    'experimental probability from trials, and what such an estimate does and does not tell you',
    'theoretical probability from equally likely outcomes, with the assumption justified rather than assumed',
    'the sample space of an experiment, and an event as a subset of it',
    'two-stage enumeration with tree diagrams',
    'why earlier outcomes do not force a balancing later one',
  ],
  genuinelyNewInClass10: [
    'the classical definition stated systematically as favourable over total',
    'impossible and sure events named, and the 0-to-1 range derived rather than described',
    'complementary events, with P(not E) = 1 \u2212 P(E) argued from the partition',
    'careful outcome listing across coins, dice, cards and marbles',
  ],
};

const CLAIMS_NOVELTY = [
  /\bfor the first time\b/i,
  /\byou have never\b/i,
  /\byou(?:'| ha)ve not (?:seen|met|used)\b/i,
  /\bfirst encounter\b/i,
  /\bnew\b[^.]{0,25}\b(?:to|in) Class 10\b/i,
  /\b(?:is|are) introduced here\b/i,
  /\bbegin(?:s)? in Class 10\b/i,
  /\byour first\b/i,
  /\btoday you meet\b/i,
];

/**
 * Topics Class 10 genuinely adds. A novelty claim about one of these is
 * TRUE, so it must pass — even though "complementary events" contains the
 * word "event", which Class 9 did cover. Matching bare concept words
 * without this would flag a lesson for telling the truth.
 */
const GENUINELY_NEW = [
  /\bcomplement/i,
  /\bimpossible event/i,
  /\bsure event/i,
  /\bclassical definition/i,
  /\bfavourable over total|favourable outcomes over\b/i,
];

const HONEST_FRAMING = [
  /\bformalis|\bsystematic|\bconsolidat/i,
  /\balready (?:met|saw|know|have|used|wrote)\b/i,
  /\bClass IX\b|\bClass 9\b/i,
  /\bdeepen|\bextend|\bbuilds? on\b/i,
];

export function auditProbabilityNovelty(blocks: Array<[string, string]>): NoveltyFinding[] {
  const out: NoveltyFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (HONEST_FRAMING.some((r) => r.test(s))) continue;
      if (GENUINELY_NEW.some((r) => r.test(s))) continue;
      if (/\ba student\b|\bwould be wrong\b|\bwrong to (?:say|think)\b|\brather than\b|\binstead of\b/i.test(s)) continue;
      if (CLAIMS_NOVELTY.some((r) => r.test(s))) {
        if (PROBABILITY_IN_CLASS_9.some((c) => s.toLowerCase().includes(c.toLowerCase()))) {
          out.push({
            where, text: s.trim().slice(0, 160),
            reason: 'claims novelty for something the frozen Class 9 probability record already covers',
          });
        }
      }
    }
  }
  return out;
}
