// ===========================================================================
// v0.84.0-c10.14 checkpoint 68 — COORDINATE GEOMETRY IS NOT NEW IN CLASS 10.
//
// The source model records Chapter 7 as PROCEDURAL_EXTENSION, with the note
// that Class 9 Chapter 1 derived the distance formula and the midpoint —
// "distance is REVISION, not introduction". The frozen Class 9 record has
// five coordinate lessons and confirms it, collinearity included.
//
// The section formula IS new; the decomposition marks 7.3a
// NEW_NAMED_OBJECT. A lesson must be able to say so.
// ===========================================================================

export type NoveltyFinding = { where: string; text: string; reason: string };

/** Established in Class 9 Chapter 1. A novelty claim about these is false. */
export const COORDINATE_WORK_IN_CLASS_9 = [
  'coordinate plane', 'coordinates', 'ordered pair', 'quadrant', 'abscissa', 'ordinate',
  'distance formula', 'distance between two points', 'midpoint', 'collinear',
];

/** Genuinely added in Class 10. A novelty claim about these is true. */
const GENUINELY_NEW = [
  /\bsection formula\b/i,
  /\binternal division\b/i,
  /\bdividing a segment\b/i,
  /\bratio in which\b/i,
  /\bclassify(?:ing)? a quadrilateral\b/i,
  /\bequidistan/i,
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
  /\bnow you learn\b/i,
  /\bClass 10 introduces\b/i,
];

const HONEST_FRAMING = [
  /\bre-?deriv|\brevision|\bformalis|\bsystematic/i,
  /\balready (?:met|saw|know|have|used|derived)\b/i,
  /\bClass IX\b|\bClass 9\b/i,
  /\bdeepen|\bextend|\bbuilds? on\b/i,
];

export function auditCoordinateNovelty(blocks: Array<[string, string]>): NoveltyFinding[] {
  const out: NoveltyFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (HONEST_FRAMING.some((r) => r.test(s))) continue;
      if (GENUINELY_NEW.some((r) => r.test(s))) continue;
      if (/\ba student\b|\bwould be wrong\b|\bwrong to (?:say|think)\b|\brather than\b|\binstead of\b/i.test(s)) continue;
      if (CLAIMS_NOVELTY.some((r) => r.test(s))) {
        if (COORDINATE_WORK_IN_CLASS_9.some((c) => s.toLowerCase().includes(c.toLowerCase()))) {
          out.push({
            where, text: s.trim().slice(0, 160),
            reason: 'claims novelty for coordinate work the frozen Class 9 record already derives',
          });
        }
      }
    }
  }
  return out;
}
