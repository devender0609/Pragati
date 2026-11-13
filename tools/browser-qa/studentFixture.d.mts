// Types for the browser QA fixture, so the regression suite can import it
// under `tsc --noEmit` without the harness itself becoming TypeScript.
export declare const STORAGE_KEYS: {
  students: string; appMode: string; onboarding: string;
  sessions: string; legacySelectedGrade: string;
};
export declare function class11Student(overrides?: Record<string, unknown>): {
  id: string; name: string; grade: string; createdAt: number;
  [k: string]: unknown;
};
export declare function seedStudentForBrowserQa(
  page: unknown,
  options?: { origin?: string; student?: Record<string, unknown>; expectGradeLabel?: RegExp }
): Promise<{ student: Record<string, unknown>; confirmedBy: string }>;
export declare function clickByText(page: unknown, label: string, settle?: number): Promise<boolean>;
