// localStorage cache for v0.17 Classrooms and the last-sync timestamp.
//
// Classrooms originate in the cloud (Firestore) but are mirrored to
// localStorage so the teacher can see + edit them while offline. The
// cloud is the source of truth on conflict (cloud-wins on pull).

import type { Classroom } from './cloudStore';

const CLASSROOMS_KEY = 'pragati.classrooms.v1';
const LAST_SYNC_KEY = 'pragati.last_sync.v1';

const safeRead = <T>(key: string): T[] => {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as T[];
  } catch {
    return [];
  }
};

const safeWrite = (key: string, value: unknown): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode errors */
  }
};

// ---------------------------------------------------------------------------
// Classrooms
// ---------------------------------------------------------------------------

export function loadClassrooms(): Classroom[] {
  return safeRead<Classroom>(CLASSROOMS_KEY);
}

export function saveClassrooms(classrooms: Classroom[]): void {
  safeWrite(CLASSROOMS_KEY, classrooms);
}

export function saveClassroom(classroom: Classroom): void {
  const all = loadClassrooms();
  const idx = all.findIndex((c) => c.id === classroom.id);
  if (idx >= 0) {
    all[idx] = classroom;
  } else {
    all.push(classroom);
  }
  saveClassrooms(all);
}

export function deleteClassroom(id: string): void {
  saveClassrooms(loadClassrooms().filter((c) => c.id !== id));
}

// ---------------------------------------------------------------------------
// Last sync timestamp
// ---------------------------------------------------------------------------

export function loadLastSyncedAt(): number | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(LAST_SYNC_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveLastSyncedAt(ms: number): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LAST_SYNC_KEY, String(ms));
  } catch {
    /* ignore */
  }
}
