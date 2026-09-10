// v0.43 — Per-item teacher approvals.
//
// Every item authored in v0.29 → v0.36 is `teacher_review_required`.
// This module gives teachers a way to "approve" an item after they've
// walked it — the approval is persisted (localStorage first, Firestore
// optional) and rolls up to an effective module availability status.
//
// The registry itself never mutates — the underlying `teacher_review_required`
// declaration stays for provenance. `effectiveAvailability(moduleId)`
// combines the registry's authored status with the approval rollup:
//
//   - If module registry status is 'available' → keep 'available'.
//   - Else, count approvals for the module. If approved / total ≥
//     APPROVAL_THRESHOLD (default 0.75), upgrade to 'available';
//     otherwise stay 'teacher_review_required'.
//
// The approvals set is a plain string set of itemIds. Keeping it flat
// (no Firestore doc shape assumption) means the localStorage payload
// stays small and future cloud sync is a simple bulk merge.

import { useEffect, useSyncExternalStore } from 'react';
import { ITEMS } from '../data/items';
import { getModule } from '../curriculum/registry';
import { getSkills } from '../curriculum/registry';
import type {
  AvailabilityStatus,
  ModuleId as RegistryModuleId,
} from '../curriculum/schema';

const STORAGE_KEY = 'pragati.itemApprovals.v1';
export const APPROVAL_THRESHOLD = 0.75;

// --- Storage layer -------------------------------------------------------

function readSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v) => typeof v === 'string'));
  } catch {
    return new Set();
  }
}

function writeSet(set: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // localStorage quota / disabled — swallow. Approvals will re-persist
    // next time the browser allows the write.
  }
}

// Pub/sub so React components re-render when approvals change.
type Listener = () => void;
const listeners = new Set<Listener>();
function emit() {
  for (const l of listeners) l();
}

let cache: Set<string> | null = null;
function currentSet(): Set<string> {
  if (cache === null) cache = readSet();
  return cache;
}

// --- Mutations ----------------------------------------------------------

export function approveItem(itemId: string) {
  const s = new Set(currentSet());
  s.add(itemId);
  cache = s;
  writeSet(s);
  emit();
}

export function unapproveItem(itemId: string) {
  const s = new Set(currentSet());
  s.delete(itemId);
  cache = s;
  writeSet(s);
  emit();
}

export function isApproved(itemId: string): boolean {
  return currentSet().has(itemId);
}

export function approvedItemIds(): string[] {
  return Array.from(currentSet());
}

export function resetApprovals() {
  cache = new Set();
  writeSet(cache);
  emit();
}

// --- Rollup: effective module availability ------------------------------

export function moduleApprovalRatio(moduleId: RegistryModuleId): {
  approvedCount: number;
  totalCount: number;
  ratio: number;
} {
  const skills = getSkills(moduleId);
  const skillLegacyIds = new Set(
    skills.map((s) => s.legacyId ?? s.id)
  );
  const items = ITEMS.filter((it) => skillLegacyIds.has(it.skillId as string));
  const total = items.length;
  if (total === 0) {
    return { approvedCount: 0, totalCount: 0, ratio: 0 };
  }
  const approvedSet = currentSet();
  const approved = items.filter((it) => approvedSet.has(it.id)).length;
  return {
    approvedCount: approved,
    totalCount: total,
    ratio: approved / total,
  };
}

export function effectiveAvailability(
  moduleId: RegistryModuleId
): AvailabilityStatus {
  const mod = getModule(moduleId);
  if (!mod) return 'framework_only';
  if (mod.availability === 'available') return 'available';
  const { ratio, totalCount } = moduleApprovalRatio(moduleId);
  if (totalCount > 0 && ratio >= APPROVAL_THRESHOLD) return 'available';
  return mod.availability;
}

// --- React hooks --------------------------------------------------------

/** Subscribe to the approvals set. Re-renders when any approval toggles. */
export function useApprovedItems(): Set<string> {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentSet(),
    () => currentSet()
  );
}

/** Convenience: subscribe to a single item's approval flag. */
export function useIsApproved(itemId: string): boolean {
  const set = useApprovedItems();
  return set.has(itemId);
}

/** Convenience: subscribe to a module's approval ratio + effective status. */
export function useModuleApproval(moduleId: RegistryModuleId) {
  const set = useApprovedItems();
  // Read via `set` argument so React knows to re-run when it changes,
  // even though our functions ultimately dip into the same cache.
  void set;
  return {
    ...moduleApprovalRatio(moduleId),
    effectiveAvailability: effectiveAvailability(moduleId),
  };
}

/** Dev-only helper: hydrate cache on first mount even if the module
 * was imported before window was ready. Never causes re-renders. */
export function useApprovalHydration() {
  useEffect(() => {
    cache = readSet();
    emit();
  }, []);
}
