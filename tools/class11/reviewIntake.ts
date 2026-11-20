/**
 * v0.84.0-c11.62 checkpoint 106 — WAVE 1 REVIEW INTAKE.
 *
 * Builds the intake ledger and validates reviewer responses. It accepts or
 * rejects responses on STRUCTURE only.
 *
 * The line that matters: this validator must never reject a human
 * judgement for disagreeing with the automated audit. Every Wave 1 artifact
 * passed structural checks and was called READY_FOR_HUMAN_REVIEW — if a
 * reviewer reads one and returns MISALIGNED, that is the entire point of
 * the wave working, not an error to be filtered out. Structural readiness
 * was only ever a claim about well-formedness.
 *
 * So: a response is rejected for a missing reviewer, a stale fingerprint, a
 * unit that was never mapped, a missing unit result, a bad enum. It is
 * never rejected for what it concludes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REVIEW = path.join(HERE, '../../class11-review');

export const MATERIAL_ALIGNMENT = ['ALIGNED', 'PARTIAL', 'MISALIGNED', 'CANNOT_DETERMINE'] as const;
export const CORRECTNESS = ['CORRECT', 'MINOR_CORRECTION_NEEDED', 'MAJOR_CORRECTION_NEEDED'] as const;
export const SCOPE = ['WITHIN_SCOPE', 'INTRODUCES_LATER_CONTENT', 'OMITS_REQUIRED_MATERIAL',
  'PRESENTS_ENRICHMENT_AS_REQUIRED'] as const;
export const GRANULARITY = ['ONE_LESSON_APPROPRIATE', 'SHOULD_SPLIT', 'SHOULD_MERGE',
  'DUPLICATIVE_ACROSS_ARTIFACTS', 'UNCERTAIN'] as const;
export const RECOMMENDATION = ['ACCEPT', 'ACCEPT_WITH_MINOR_EDITS', 'REVISE', 'MAJOR_REWORK',
  'ESCALATE_SCOPE_QUESTION'] as const;
export const SEVERITY = ['CRITICAL', 'MAJOR', 'MODERATE', 'MINOR'] as const;

export type Packet = {
  contentArtifactId: string; artifactFingerprint: string;
  canonicalUnits: Array<{ unitId: string }>;
};
export type ValidationResult = {
  valid: boolean; status: 'VALID' | 'STALE_REVIEW_RESPONSE' | 'REJECTED';
  errors: string[];
};

export const loadPackets = (): Map<string, Packet> => {
  const dir = path.join(REVIEW, 'packets');
  return new Map(fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => {
    const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Packet;
    return [p.contentArtifactId, p];
  }));
};

/** Structure only. Never judgement. */
export function validateResponse(
  response: Record<string, unknown>, packets: Map<string, Packet>
): ValidationResult {
  const errors: string[] = [];
  const id = response.artifactId as string | undefined;
  const packet = id ? packets.get(id) : undefined;

  if (!id) errors.push('artifactId is missing');
  else if (!packet) errors.push(`artifactId "${id}" is not in Wave 1`);

  if (!response.reviewer || typeof response.reviewer !== 'string' || !response.reviewer.trim()) {
    // Without this a response is anonymous, and an anonymous response is
    // not a human review — it is a file.
    errors.push('reviewer identity is missing; a response without a named reviewer is not a human review');
  }
  if (!response.reviewDate) errors.push('reviewDate is missing');

  const fp = response.reviewedFingerprint as string | undefined;
  if (!fp) errors.push('reviewedFingerprint is missing');
  else if (packet && fp !== packet.artifactFingerprint) {
    // The lesson moved under the reviewer's feet. Their reading was honest;
    // it just is not about the current content.
    return {
      valid: false, status: 'STALE_REVIEW_RESPONSE',
      errors: [`fingerprint ${fp.slice(0, 12)}… does not match the current packet `
        + `(${packet.artifactFingerprint.slice(0, 12)}…); the lesson changed after review, `
        + 'so this response cannot be applied — the new version needs re-review'],
    };
  }

  const results = response.unitResults as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(results) || !results.length) errors.push('unitResults is missing or empty');
  else if (packet) {
    const mapped = new Set(packet.canonicalUnits.map((u) => u.unitId));
    const seen = new Set<string>();
    for (const r of results) {
      const uid = r.unitId as string;
      if (!mapped.has(uid)) errors.push(`unit "${uid}" is not mapped to this artifact`);
      if (seen.has(uid)) errors.push(`duplicate result for unit "${uid}"`);
      seen.add(uid);
      for (const [field, allowed] of [['materialAlignment', MATERIAL_ALIGNMENT],
        ['mathematicalCorrectness', CORRECTNESS], ['scopeDiscipline', SCOPE]] as const) {
        const v = r[field];
        if (v === undefined || v === null) errors.push(`unit "${uid}": ${field} is required`);
        else if (!(allowed as readonly string[]).includes(v as string)) {
          errors.push(`unit "${uid}": ${field} "${String(v)}" is not an allowed value`);
        }
      }
    }
    for (const u of mapped) {
      if (!seen.has(u)) {
        errors.push(`unit "${u}" is mapped to this artifact but has no result; `
          + 'each mapped objective must be judged separately');
      }
    }
  }

  const rec = response.overallRecommendation;
  if (!rec) errors.push('overallRecommendation is missing');
  else if (!(RECOMMENDATION as readonly string[]).includes(rec as string)) {
    errors.push(`overallRecommendation "${String(rec)}" is not an allowed value`);
  }
  const gran = response.lessonGranularity;
  if (gran !== undefined && gran !== null && !(GRANULARITY as readonly string[]).includes(gran as string)) {
    errors.push(`lessonGranularity "${String(gran)}" is not an allowed value`);
  }

  for (const [i, issue] of ((response.issues as Array<Record<string, unknown>>) ?? []).entries()) {
    const units = issue.unitIds as string[] | undefined;
    if (!Array.isArray(units) || !units.length) errors.push(`issue ${i}: unitIds is required`);
    else if (packet) {
      const mapped = new Set(packet.canonicalUnits.map((u) => u.unitId));
      for (const u of units) if (!mapped.has(u)) errors.push(`issue ${i}: unit "${u}" is not mapped`);
    }
    if (!issue.stage) errors.push(`issue ${i}: stage is required`);
    if (!issue.category) errors.push(`issue ${i}: category is required`);
    if (!issue.severity || !(SEVERITY as readonly string[]).includes(issue.severity as string)) {
      errors.push(`issue ${i}: severity must be one of ${SEVERITY.join(', ')}`);
    }
    if (!issue.explanation || typeof issue.explanation !== 'string' || !issue.explanation.trim()) {
      errors.push(`issue ${i}: explanation is required`);
    }
  }

  return { valid: errors.length === 0, status: errors.length ? 'REJECTED' : 'VALID', errors };
}

export function buildIntakeLedger(): Record<string, unknown> {
  const packets = loadPackets();
  const wave = JSON.parse(fs.readFileSync(path.join(REVIEW, 'WAVE1_LEDGER.json'), 'utf8')) as
    Record<string, never>;
  const entries = (wave.entries as unknown as Array<Record<string, never>>).map((e) => {
    const p = packets.get(e.contentArtifactId as unknown as string)!;
    return {
      artifactId: p.contentArtifactId,
      artifactFingerprint: p.artifactFingerprint,
      packetPath: `class11-review/packets/${p.contentArtifactId}.json`,
      mappedUnits: p.canonicalUnits.map((u) => u.unitId),
      priority: e.priority,
      lifecycleState: 'READY_TO_SEND',
      sent: false, sentDate: null, reviewer: null,
      responseReceived: false, responseFingerprint: null, responseValid: null,
      validationErrors: [], unitResults: null, overallRecommendation: null,
      lessonGranularity: null, adjudicationStatus: 'NOT_APPLICABLE_NO_RESPONSE',
      blockers: [],
    };
  });
  return {
    generatedBy: 'tools/class11/reviewIntake.ts',
    wave: 1,
    caveat: 'Intake infrastructure only. Every review field is null because no human has reviewed '
      + 'anything. Mock responses in the test suite are fixtures, never lifecycle events.',
    lifecycleOrder: ['READY_TO_SEND', 'SENT_FOR_HUMAN_REVIEW', 'HUMAN_REVIEWED', 'ADJUDICATED', 'PUBLISHED'],
    totals: {
      prepared: entries.length, sent: 0, humanReviewed: 0, adjudicated: 0, published: 0,
    },
    class12Gate: {
      state: 'AWAITING_HUMAN_REVIEW',
      note: 'No CLEAR / MANAGEABLE / BLOCKING judgement can exist before real responses arrive.',
      systemicMetricsComputed: false,
    },
    entries,
  };
}

const RUN = process.argv[1] !== undefined
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (RUN) {
  const l = buildIntakeLedger() as Record<string, never>;
  fs.writeFileSync(path.join(REVIEW, 'WAVE1_REVIEW_INTAKE.json'), `${JSON.stringify(l, null, 2)}\n`);
  console.log(`intake ledger: ${(l.entries as unknown as unknown[]).length} entries, `
    + `totals ${JSON.stringify(l.totals)}, gate ${(l.class12Gate as unknown as { state: string }).state}`);
}
