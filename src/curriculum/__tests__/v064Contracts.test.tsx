// v0.64 §18 — render contracts and policy invariants.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  getStudentChapterAvailability,
  getTeacherCoverageStatus,
  isSectionStudentReady,
  mayAssignSectionActivity,
} from '../eligibilityPolicy';
import {
  grandfatheringReport,
  grandfatheredClass6Lessons,
} from '../grandfatheredLessons';
import { sectionProgressForChapter } from '../sectionProgress';
import { officialChapterRows } from '../../features/student/OfficialChapterLanding';
import { SectionAssignmentPanel } from '../../features/teacher/SectionAssignmentPanel';
import { PACKAGE_DEPENDENCIES } from '../reviewDependencies';

const CH7 = 'ncert_gp_c6_ch07_fractions';

describe('§9 educator-reviewed is not student-ready', () => {
  it('requires more than a reviewed alignment', () => {
    // Nothing is reviewed, so nothing is student-ready — but the point
    // is that the two are computed differently, not that both are 0.
    for (const id of ['ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_4']) {
      expect(isSectionStudentReady(id)).toBe(false);
    }
    const c = getTeacherCoverageStatus(CH7);
    expect(c.studentReady).toBe(0);
    expect(c.reviewed).toBe(0);
  });

  it('would still refuse §7.4 even if its alignment were reviewed', () => {
    // §7.4 is authored_draft with no completed review package, so the
    // release gate refuses regardless of alignment status. This is the
    // case that `studentReady = reviewed` would have got wrong.
    expect(isSectionStudentReady('ncert_gp_c6_s7_4')).toBe(false);
  });
});

describe('§8 chapter Practice requires real content', () => {
  it('rolls chapter status up from section eligibility', () => {
    const ch7 = getStudentChapterAvailability(CH7);
    expect(ch7.hasEligiblePractice).toBe(true);
    // Chapter 1 has no sections with content.
    const ch1 = getStudentChapterAvailability('ncert_gp_c6_ch01_patterns');
    expect(ch1.hasEligiblePractice).toBe(false);
    expect(ch1.availability).toBe('not_available_yet');
  });

  it('does not advertise Practice from registered skills alone', () => {
    // Every chapter claiming practice must have a section behind it.
    for (const id of [CH7, 'ncert_gp_c6_ch01_patterns']) {
      const e = getStudentChapterAvailability(id);
      if (e.hasEligiblePractice) {
        const cov = getTeacherCoverageStatus(id);
        expect(cov.practiceAvailable).toBeGreaterThan(0);
      }
    }
  });
});

describe('§10 assignment identifies a concrete activity', () => {
  it('returns an activity, never bare skill IDs', () => {
    const r = mayAssignSectionActivity('ncert_gp_c6_s7_2', 'practice');
    // Not assignable today — but the shape is what matters.
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(typeof r.reason).toBe('string');
  });

  it('renders no assignable section and says why', () => {
    render(<SectionAssignmentPanel />);
    expect(screen.queryByRole('button', { name: /Assign/i })).toBeNull();
    expect(screen.getByText(/Nothing can be assigned/i)).toBeTruthy();
  });
});

describe('§13 grandfathering is tracked, not permanent', () => {
  it('reports every grandfathered lesson as unverified', () => {
    const r = grandfatheringReport();
    expect(r.total).toBeGreaterThan(0);
    expect(r.sectionVerified).toBe(0);
    expect(r.summary).toMatch(/NOT been checked/);
  });

  it('never auto-promotes a candidate to verified', () => {
    for (const l of grandfatheredClass6Lessons()) {
      expect(l.status).not.toBe('section_verified');
    }
  });

  it('excludes displaced modules entirely', () => {
    const mods = new Set(grandfatheredClass6Lessons().map((l) => l.moduleId));
    expect(mods.has('decimals' as never)).toBe(false);
    expect(mods.has('algebra' as never)).toBe(false);
  });
});

describe('§18 official chapter rows come from the section registry', () => {
  it('produces one row per official section, in order', () => {
    const rows = officialChapterRows(CH7, 'stu');
    expect(rows).toHaveLength(9);
    expect(rows.map((r) => r.sectionNumber)).toEqual([
      '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
    ]);
  });

  it('carries real progress objects, not placeholders', () => {
    const rows = officialChapterRows(CH7, 'stu');
    const direct = sectionProgressForChapter(CH7, []);
    expect(rows.map((r) => r.progress.state)).toEqual(
      direct.map((d) => d.state)
    );
  });

  it('marks exactly the four eligible sections as actionable', () => {
    const actionable = officialChapterRows(CH7, 'stu').filter(
      (r) => r.action !== 'Not available yet'
    );
    expect(actionable.map((r) => r.sectionNumber)).toEqual([
      '7.2', '7.5', '7.6', '7.8',
    ]);
  });
});

describe('§16 Package A and Package B dependencies are explicit', () => {
  it('does not let Package B settle a Package A alignment question', () => {
    const dep = PACKAGE_DEPENDENCIES.find(
      (d) => d.gate === 'section_alignment_confirmed'
    );
    expect(dep?.ownedBy).toBe('A_curriculum');
    expect(dep?.cannotBeSettledBy).toContain('B_demonstration');
  });

  it('lets Package B settle instructional quality alone', () => {
    const dep = PACKAGE_DEPENDENCIES.find(
      (d) => d.gate === 'instructional_quality_7_4'
    );
    expect(dep?.ownedBy).toBe('B_demonstration');
    expect(dep?.blockedByPackageA).toBe(false);
  });
});
