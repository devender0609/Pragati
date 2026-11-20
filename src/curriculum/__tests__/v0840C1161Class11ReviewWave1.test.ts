/**
 * v0.84.0-c11.61 checkpoint 105 — Wave 1 packets must stay honest.
 *
 * Two failure modes are worth testing against. One: a packet that quietly
 * carries an AI judgement in a field a human was meant to fill, so the
 * reviewer reads a conclusion instead of forming one. Two: a packet that
 * drifts from the lesson it describes, so a review returns against content
 * nobody read.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { allAuthoredSections } from '../authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { type CanonicalUnit, isClass11Artifact } from '../class11Coverage';
import { fingerprint } from '../../../tools/class11/generateReviewWave1';

const root = path.join(__dirname, '../../..');
const rev = (f: string): Record<string, never> =>
  JSON.parse(fs.readFileSync(path.join(root, 'class11-review', f), 'utf8'));
const UNITS = JSON.parse(fs.readFileSync(
  path.join(root, 'class11-source/CLASS11_DECOMPOSITION.json'), 'utf8')) as CanonicalUnit[];
const LEDGER = rev('WAVE1_LEDGER.json');
type Entry = { contentArtifactId: string; canonicalUnits: string[]; artifactFingerprint: string; packetPath: string };
const entries = LEDGER.entries as unknown as Entry[];
const packet = (id: string): Record<string, never> => rev(`packets/${id}.json`);

const live = () => {
  __setAuthoredLearnPreviewForTests(true);
  try { return new Map(allAuthoredSections().filter(isClass11Artifact).map((a) => [a.contentArtifactId, a])); }
  finally { __setAuthoredLearnPreviewForTests(null); }
};

describe('the Wave 1 selection is well-formed', () => {
  it('names only artifacts that exist, each once', () => {
    const existing = live();
    const ids = entries.map((e) => e.contentArtifactId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(existing.has(id), id).toBe(true);
  });

  it('gives every selected artifact at least one canonical unit', () => {
    for (const e of entries) expect(e.canonicalUnits.length, e.contentArtifactId).toBeGreaterThan(0);
  });

  it('reconciles the ledger with the packet files on disk', () => {
    for (const e of entries) {
      expect(fs.existsSync(path.join(root, e.packetPath)), e.packetPath).toBe(true);
      const p = packet(e.contentArtifactId);
      expect(p.contentArtifactId).toBe(e.contentArtifactId);
      expect(p.artifactFingerprint).toBe(e.artifactFingerprint);
    }
  });
});

describe('packets match canonical source, not a paraphrase of it', () => {
  it('copies each unit objective from the decomposition verbatim', () => {
    const byId = new Map(UNITS.map((u) => [u.unitId, u]));
    for (const e of entries) {
      for (const u of packet(e.contentArtifactId).canonicalUnits as unknown as Array<Record<string, never>>) {
        const canonical = byId.get(u.unitId as unknown as string);
        expect(canonical, `${u.unitId} missing from decomposition`).toBeDefined();
        expect(u.objective).toBe((canonical as unknown as { objective: string }).objective);
        expect(u.assessmentStatus).toBe(canonical!.assessmentStatus);
      }
    }
  });

  it('enumerates every mapped unit for multi-unit artifacts', () => {
    // The whole point of reviewing §7.2: all four units must be asked about
    // separately, never collapsed into one verdict.
    for (const e of entries) {
      const p = packet(e.contentArtifactId);
      const listed = (p.canonicalUnits as unknown as Array<{ unitId: string }>).map((u) => u.unitId);
      const asked = ((p.reviewerResponse as unknown as { unitResults: Array<{ unitId: string }> })
        .unitResults).map((u) => u.unitId);
      expect([...listed].sort()).toEqual([...e.canonicalUnits].sort());
      expect([...asked].sort()).toEqual([...listed].sort());
    }
  });

  it('binds each packet to the live lesson content', () => {
    const existing = live();
    for (const e of entries) {
      const a = existing.get(e.contentArtifactId)! as unknown as Record<string, unknown>;
      expect(fingerprint(a), e.contentArtifactId).toBe(e.artifactFingerprint);
    }
  });
});

describe('no judgement is pre-filled and no lifecycle is claimed', () => {
  it('leaves every reviewer field null', () => {
    for (const e of entries) {
      const r = packet(e.contentArtifactId).reviewerResponse as unknown as Record<string, unknown>;
      expect(r.reviewer).toBeNull();
      expect(r.overallRecommendation).toBeNull();
      expect(r.lessonGranularity).toBeNull();
      for (const u of r.unitResults as Array<Record<string, unknown>>) {
        expect(u.materialAlignment, `${e.contentArtifactId}/${u.unitId}`).toBeNull();
        expect(u.mathematicalCorrectness).toBeNull();
      }
    }
  });

  it('claims nothing sent, reviewed, adjudicated or published', () => {
    for (const e of entries) {
      const l = packet(e.contentArtifactId).lifecycle as unknown as Record<string, unknown>;
      expect(l.sentForHumanReview).toBe(false);
      expect(l.humanReviewed).toBe(false);
      expect(l.adjudicated).toBe(false);
      expect(l.published).toBe(false);
      expect(l.state).toBe('PREPARED');
    }
  });

  it('describes automated checks without endorsing the lesson', () => {
    for (const e of entries) {
      const note = (packet(e.contentArtifactId).structuralChecks as unknown as { note: string }).note;
      expect(note).toMatch(/say nothing about whether it teaches/i);
      expect(note).not.toMatch(/pre-reviewed|approved|aligned/i);
    }
  });
});

describe('the response schema demands unit-level answers', () => {
  const schema = rev('RESPONSE_SCHEMA.json');
  it('requires a reviewer, a fingerprint and unit results', () => {
    const req = schema.required as unknown as string[];
    for (const f of ['reviewer', 'reviewedFingerprint', 'unitResults', 'overallRecommendation']) {
      expect(req).toContain(f);
    }
  });

  it('requires material alignment per unit', () => {
    const items = (schema.properties as unknown as Record<string, never>).unitResults as unknown as
      { minItems: number; items: { required: string[]; properties: Record<string, { enum: unknown[] }> } };
    expect(items.minItems).toBe(1);
    expect(items.items.required).toContain('materialAlignment');
    expect(items.items.properties.materialAlignment.enum)
      .toEqual(['ALIGNED', 'PARTIAL', 'MISALIGNED', 'CANNOT_DETERMINE']);
  });
});
