// v0.51 §4 + §5 + §21 — competency framework and cross-grade strand.

import { describe, it, expect } from 'vitest';
import {
  ASSESSMENT_DOMAINS, domainById, studentDomainName,
  frameworkSourceStatus,
} from '../competencyFramework';
import {
  RATIONAL_NUMBER_STRAND, PROGRESSION_NODES, competencyById,
  competenciesAssessableAt, prerequisiteChain, validateStrand,
} from '../rationalNumberStrand';

describe('§4 domains are stable and student-safe', () => {
  it('every domain has a unique ID', () => {
    const ids = ASSESSMENT_DOMAINS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every domain has a student-facing name free of codes', () => {
    for (const d of ASSESSMENT_DOMAINS) {
      expect(d.studentTitle.length).toBeGreaterThan(0);
      // No three-letter domain code, and no framework jargon.
      expect(d.studentTitle).not.toMatch(/[A-Z]{3}/);
      expect(d.studentTitle).not.toMatch(/competency|domain/i);
    }
    expect(studentDomainName('RAT')).toBe('Fractions');
  });

  it('the framework does not overclaim its provenance', () => {
    // It must NOT say it was checked against documents it wasn't.
    expect(frameworkSourceStatus.status).toBe('draft_internal');
    expect(frameworkSourceStatus.notReviewedAgainst).toContain(
      'NCF-SE 2023 primary document'
    );
    expect(frameworkSourceStatus.notReviewedAgainst.length).toBeGreaterThan(0);
  });

  it('domainById throws on an unknown domain rather than guessing', () => {
    expect(() => domainById('ZZZ' as never)).toThrow();
  });
});

describe('§5 the strand is internally consistent', () => {
  it('validates with no errors', () => {
    expect(validateStrand(RATIONAL_NUMBER_STRAND)).toEqual([]);
  });

  it('detects an inverted grade range', () => {
    const broken = [{
      ...RATIONAL_NUMBER_STRAND[0],
      gradeRange: { from: 'class8' as const, to: 'class2' as const },
    }];
    expect(validateStrand(broken).some((e) => /inverted/.test(e))).toBe(true);
  });

  it('rejects a reviewed status with no source evidence', () => {
    const broken = [{
      ...RATIONAL_NUMBER_STRAND[0],
      status: 'reviewed' as const,
      sourceEvidence: [],
    }];
    expect(validateStrand(broken).some((e) => /source evidence/.test(e)))
      .toBe(true);
  });

  it('every competency has evidence requirements', () => {
    for (const c of RATIONAL_NUMBER_STRAND) {
      expect(c.evidenceRequirements.length).toBeGreaterThan(0);
    }
  });

  it('every competency has a student-facing title without codes', () => {
    for (const c of RATIONAL_NUMBER_STRAND) {
      expect(c.studentTitle).not.toMatch(/RAT\.|[A-Z]{3}\./);
    }
  });
});

describe('§5 the strand genuinely crosses grades', () => {
  it('spans well below and above any single grade', () => {
    const froms = RATIONAL_NUMBER_STRAND.map((c) => Number(c.gradeRange.from.replace('class','')));
    const tos = RATIONAL_NUMBER_STRAND.map((c) => Number(c.gradeRange.to.replace('class','')));
    expect(Math.min(...froms)).toBeLessThanOrEqual(2);
    expect(Math.max(...tos)).toBeGreaterThanOrEqual(10);
  });

  it('a Class 6 student is eligible for content from several grades', () => {
    const eligible = competenciesAssessableAt('class6');
    expect(eligible.length).toBeGreaterThan(1);
    const froms = new Set(eligible.map((c) => c.gradeRange.from));
    // The point of cross-grade routing: not all from Class 6.
    expect(froms.size).toBeGreaterThan(1);
  });

  it('eligibility differs by grade', () => {
    const c3 = competenciesAssessableAt('class3').map((c) => c.id);
    const c9 = competenciesAssessableAt('class9').map((c) => c.id);
    expect(c3).not.toEqual(c9);
    expect(c3.filter((id) => c9.includes(id))).toEqual([]);
  });

  it('walks back through prerequisites to the foundation', () => {
    const chain = prerequisiteChain('RAT.PERCENT');
    expect(chain.length).toBeGreaterThan(3);
    expect(chain).toContain('RAT.EQUIV');
    // Terminates at a competency with no prerequisite.
    const last = competencyById(chain[chain.length - 1]);
    expect(last?.prerequisiteIds).toEqual([]);
  });

  it('progression nodes mirror the strand order', () => {
    expect(PROGRESSION_NODES.length).toBe(RATIONAL_NUMBER_STRAND.length);
    for (let i = 1; i < PROGRESSION_NODES.length; i++) {
      expect(PROGRESSION_NODES[i].sequence).toBeGreaterThan(
        PROGRESSION_NODES[i - 1].sequence
      );
    }
  });
});

describe('§5 curriculum mappings stay honest', () => {
  it('no competency claims a mapping without recording its source', () => {
    for (const c of RATIONAL_NUMBER_STRAND) {
      if (c.curriculumMappings.length > 0) {
        expect(c.sourceEvidence.length).toBeGreaterThan(0);
      }
    }
  });

  it('decimals are placed at Class 7, where the current textbook treats them', () => {
    const dec = competencyById('RAT.DECIMAL')!;
    expect(Number(dec.gradeRange.from.replace('class',''))).toBeGreaterThanOrEqual(6);
    expect(dec.sourceEvidence.join(' ')).toMatch(/Grade 7|Class 7/);
  });
});
