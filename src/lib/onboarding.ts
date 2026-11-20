// v0.18: persistent onboarding state.
//
// Stores a single record in localStorage at `pragati.onboarding.v1` so the
// 4-step first-run wizard does not nag returning users. Schema is
// versioned in the key so future migrations don't clobber older state.

export type OnboardingState = {
  completed: boolean;
  completedAt: number | null;
  // Free-text answers collected by the quick-setup wizard. All optional;
  // missing fields mean "skipped".
  schoolName?: string;
  grade?: string;
  classSection?: string;
  firstClassroomName?: string;
  // Track which branch the teacher took (signup vs. demo) for analytics.
  branch?: 'signup' | 'demo' | null;
};

const KEY = 'pragati.onboarding.v1';

const DEFAULT_STATE: OnboardingState = {
  completed: false,
  completedAt: null,
};

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadOnboardingState(): OnboardingState {
  const s = safeStorage();
  if (!s) return DEFAULT_STATE;
  try {
    const raw = s.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_STATE;
    return {
      completed: Boolean(parsed.completed),
      completedAt:
        typeof parsed.completedAt === 'number' ? parsed.completedAt : null,
      schoolName: typeof parsed.schoolName === 'string' ? parsed.schoolName : undefined,
      grade: typeof parsed.grade === 'string' ? parsed.grade : undefined,
      classSection:
        typeof parsed.classSection === 'string' ? parsed.classSection : undefined,
      firstClassroomName:
        typeof parsed.firstClassroomName === 'string'
          ? parsed.firstClassroomName
          : undefined,
      branch:
        parsed.branch === 'signup' || parsed.branch === 'demo'
          ? parsed.branch
          : null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveOnboardingState(next: Partial<OnboardingState>): OnboardingState {
  const prev = loadOnboardingState();
  const merged: OnboardingState = { ...prev, ...next };
  const s = safeStorage();
  if (!s) return merged;
  try {
    s.setItem(KEY, JSON.stringify(merged));
  } catch {
    // ignore (quota / private mode)
  }
  return merged;
}

export function saveOnboardingComplete(
  payload?: Partial<OnboardingState>
): OnboardingState {
  return saveOnboardingState({
    ...payload,
    completed: true,
    completedAt: Date.now(),
  });
}

/**
 * Used by the dev console / "Start tour again" footer link. Wipes the local
 * onboarding flag so the wizard surfaces on next launch.
 */
export function resetOnboarding(): void {
  const s = safeStorage();
  if (!s) return;
  try {
    s.removeItem(KEY);
  } catch {
    // ignore
  }
}
