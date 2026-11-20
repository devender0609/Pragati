// ===========================================================================
// v0.84.0-c10.12 checkpoint 66 — SECTORS ARE NOT NEW IN CLASS 10.
//
// The source model records Chapter 11 as PROCEDURAL_EXTENSION: Class 9
// Chapter 6 derived arc length (s6_4) and sector area (s6_10_sector). So
// those are re-derived here, not introduced. The segment IS new, and a
// lesson must be able to say so.
//
// Same shape as the checkpoint-64 and 65 audits, with its own concept list.
// ===========================================================================

export type NoveltyFinding = { where: string; text: string; reason: string };

/** Established in Class 9 Chapter 6. A novelty claim about these is false. */
export const CIRCLE_WORK_IN_CLASS_9 = [
  'arc length', 'arc', 'sector', 'sector area', 'circumference', 'area of a circle', 'disc',
];

/** Genuinely added in Class 10. A novelty claim about these is true. */
const GENUINELY_NEW = [
  /\bsegment\b/i,
  /\bchord\b/i,
  /\bcombined figure/i,
  /\bsubtract(?:ing)? the triangle\b/i,
];

const CLAIMS_NOVELTY = [
  /\bfor the first time\b/i,
  /\byou have never\b/i,
  /\byou(?:'| ha)ve not (?:seen|met|used)\b/i,
  /\bfirst encounter\b/i,
  /\bnew\b[^.]{0,25}\b(?:to|in) Class 10\b/i,
  /\b(?:is|are) introduced here\b/i,
  /\bbegin(?:s)? in Class 10\b/i,
  /\byour first\b/i,
  /\bClass 10 introduces\b/i,
];

const HONEST_FRAMING = [
  /\bre-?deriv|\bformalis|\bsystematic/i,
  /\balready (?:met|saw|know|have|used|derived)\b/i,
  /\bClass IX\b|\bClass 9\b/i,
  /\bdeepen|\bextend|\bbuilds? on\b/i,
];

export function auditCircleNovelty(blocks: Array<[string, string]>): NoveltyFinding[] {
  const out: NoveltyFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (HONEST_FRAMING.some((r) => r.test(s))) continue;
      if (GENUINELY_NEW.some((r) => r.test(s))) continue;
      if (/\ba student\b|\bwould be wrong\b|\bwrong to (?:say|think)\b|\brather than\b|\binstead of\b/i.test(s)) continue;
      if (CLAIMS_NOVELTY.some((r) => r.test(s))) {
        if (CIRCLE_WORK_IN_CLASS_9.some((c) => s.toLowerCase().includes(c.toLowerCase()))) {
          out.push({
            where, text: s.trim().slice(0, 160),
            reason: 'claims novelty for circle work the frozen Class 9 record already derives',
          });
        }
      }
    }
  }
  return out;
}
