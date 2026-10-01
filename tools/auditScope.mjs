// v0.84.0 checkpoint 13 §4 — one scope helper for every class audit.
export function scopeFor(d, classNumbers) {
  const wanted = new Set(classNumbers);
  const units = d.units.filter((u) => wanted.has(u.classNumber));
  const ids = new Set(units.map((u) => u.officialRecordId));
  for (const e of d.recordExtents) {
    const book = e.officialRecordId.split('_')[1];
    const byBook = { aejm1: 1, bejm1: 2, cemm1: 3, demm1: 4, eemm1: 5 }[book];
    // Class 6 record ids are `ncert_gp_c6_*` rather than a book code.
    const cls = e.officialRecordId.startsWith('ncert_gp_c6') ? 6 : byBook;
    if (wanted.has(cls)) ids.add(e.officialRecordId);
  }
  return {
    officialRecordIds: [...ids],
    units,
    sourceSegments: d.sourceSegments.filter((s) => ids.has(s.officialRecordId)),
    nonInstructional: (d.nonInstructional ?? []).filter((r) => ids.has(r.officialRecordId)),
    recordExtents: d.recordExtents.filter((e) => ids.has(e.officialRecordId)),
  };
}
