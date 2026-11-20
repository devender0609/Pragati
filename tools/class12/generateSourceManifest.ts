/**
 * v0.84.0-c12.04 checkpoint 112 — GENERATE THE CLASS 12 SOURCE MANIFEST.
 *
 * This file exists because the manifest was hand-maintained and developed a
 * contradiction: `cbseSource.status` read AVAILABLE while a stale
 * `searchedFor.result` string still asserted that the very same file "is a
 * Secondary-stage syllabus document, not Class 12". Both were written by
 * me, three checkpoints apart, and neither knew about the other.
 *
 * The lesson is the one the Class 11 completeness ledger already taught at
 * checkpoint 103A: a hand-written evidence file drifts from the truth it
 * claims to describe, because nothing recomputes it. So the manifest is
 * now derived — every status is computed from the files actually present,
 * and the search narrative is rebuilt each run rather than carried
 * forward.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, '../../class12-source');
const UPLOADS = '/mnt/user-data/uploads';

/** The 15 NCERT files the official URL family names. Hints, not structure. */
export const NCERT_EXPECTED = [
  'lemh1ps.pdf', 'lemh101.pdf', 'lemh102.pdf', 'lemh103.pdf', 'lemh104.pdf',
  'lemh105.pdf', 'lemh106.pdf',
  'lemh2ps.pdf', 'lemh201.pdf', 'lemh202.pdf', 'lemh203.pdf', 'lemh204.pdf',
  'lemh205.pdf', 'lemh206.pdf', 'lemh207.pdf',
] as const;

const sha = (p: string): string =>
  crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const MODEL_PATH = path.join(DIR, 'CLASS12_SOURCE_MODEL.json');
const repoRel = (p: string): string => {
  const r = path.relative(path.join(HERE, '../..'), p);
  return r.startsWith('..') ? p : (r || '.');
};
const readModel = (): Record<string, unknown> | null =>
  fs.existsSync(MODEL_PATH) ? JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8')) as Record<string, unknown> : null;

/**
 * v0.84.0-c12.08 — downloads already proven bad, by checksum. A truncated
 * copy that somehow regains a trailing %%EOF (or is re-uploaded under another
 * name) must still be refused: a replacement must have a DIFFERENT SHA.
 */
export function knownInvalidSha256(): Record<string, string> {
  const m = readModel();
  return (m?.knownInvalidSha256 as Record<string, string> | undefined) ?? {};
}

/** A file is a textbook only if it opens as one. Filenames prove nothing. */
export function validatePdf(p: string): { valid: boolean; reason: string; bytes: number } {
  if (!fs.existsSync(p)) return { valid: false, reason: 'absent', bytes: 0 };
  const b = fs.readFileSync(p);
  if (b.length === 0) return { valid: false, reason: 'zero bytes', bytes: 0 };
  const digest = crypto.createHash('sha256').update(b).digest('hex');
  const bad = knownInvalidSha256()[digest];
  if (bad) return { valid: false, reason: `known invalid download — ${bad}`, bytes: b.length };
  // A truncated download keeps a valid %PDF- header and fails only at the
  // end. lemh201.pdf arrived this way: header intact, no %%EOF, no trailer,
  // ~95% of the chapter absent. Signature alone would have passed it.
  if (b.subarray(0, 5).toString('latin1') === '%PDF-' && b.lastIndexOf('%%EOF') < 0) {
    return { valid: false, reason: 'truncated — %PDF- header present but no %%EOF marker', bytes: b.length };
  }
  if (b.subarray(0, 5).toString('latin1') !== '%PDF-') {
    const head = b.subarray(0, 120).toString('latin1');
    return {
      valid: false,
      reason: /upstream connect|503|<html/i.test(head)
        ? 'not a PDF — proxy error body or HTML page saved with a .pdf name'
        : 'not a PDF — missing %PDF- signature',
      bytes: b.length,
    };
  }
  return { valid: true, reason: 'valid PDF signature', bytes: b.length };
}

export function buildManifest(): Record<string, unknown> {
  // v0.84.0-c12.08 — the CBSE PDF was never archived; it lived only in one
  // session's uploads, so a fresh rebuild could not find it and the c12.07
  // "24/24" depended on a file outside the archive. Look in the archive
  // first, and when the bytes are absent say so instead of claiming AVAILABLE.
  const cbseCandidates = [path.join(DIR, 'pdfs', 'Maths_SecP2_2026-27.pdf'), path.join(UPLOADS, 'Maths_SecP2_2026-27.pdf')];
  const cbsePath = cbseCandidates.find((p) => fs.existsSync(p)) ?? cbseCandidates[0];
  const cbseRecordPath = path.join(DIR, 'CLASS12_CBSE_SOURCE.json');
  const cbseRecord = fs.existsSync(cbseRecordPath)
    ? JSON.parse(fs.readFileSync(cbseRecordPath, 'utf8')) as Record<string, unknown>
    : null;
  const cbseFile = validatePdf(cbsePath);
  const recordedSha = (cbseRecord?.sha256 as string | undefined) ?? null;
  const cbseShaMatches = cbseFile.valid && recordedSha !== null && sha(cbsePath) === recordedSha;
  const cbseStatus = cbseFile.valid && cbseRecord
    ? (cbseShaMatches ? 'AVAILABLE' : 'PRESENT_BUT_DIFFERS_FROM_RECORD')
    : cbseRecord && recordedSha ? 'RECORDED_FILE_NOT_PRESENT' : 'UNAVAILABLE';

  // Where the NCERT files would be, if they existed.
  const searched = [path.join(DIR, 'pdfs'), UPLOADS, DIR, path.join(HERE, '../..')];
  const model = readModel();
  const ncert = NCERT_EXPECTED.map((name) => {
    const hit = searched.map((d) => path.join(d, name)).find((p) => fs.existsSync(p));
    const v = hit ? validatePdf(hit) : { valid: false, reason: 'absent', bytes: 0 };
    return {
      filename: name,
      present: Boolean(hit), path: hit ? repoRel(hit) : null,
      valid: v.valid, validation: v.reason, bytes: v.bytes,
      sha256: v.valid && hit ? sha(hit) : null,
      acquisitionRoute: v.valid ? 'owner_download_from_official_ncert_url_then_session_upload' : null,
    };
  });
  const acquired = ncert.filter((f) => f.valid).length;

  return {
    generatedBy: 'tools/class12/generateSourceManifest.ts',
    generatedNote: 'Every status below is computed from the files present at generation time. '
      + 'No narrative is carried forward between runs, which is how the earlier CBSE contradiction arose.',
    // The 15 chapter/prelim files are not the whole book: the Contents pages
    // list appendices and answers that no file supplies. Completeness is read
    // from the model's back-matter accounting, not from the 15-file list.
    status: acquired === NCERT_EXPECTED.length
      && (model?.sourceSetCompleteness as { missing?: unknown[] } | undefined)?.missing?.length === 0
      ? 'SOURCE_SET_COMPLETE_PENDING_INSPECTION' : 'SOURCE_SET_INCOMPLETE',
    cbseSource: {
      status: cbseStatus,
      searchedPaths: cbseCandidates.map(repoRel),
      recordedSha256: recordedSha,
      filename: 'Maths_SecP2_2026-27.pdf',
      validation: cbseFile.reason, bytes: cbseFile.bytes,
      sha256: cbseFile.valid ? sha(cbsePath) : null,
      identityVerification: 'Identity was verified by reading the document at checkpoint 111 and is recorded in '
        + 'CLASS12_CBSE_SOURCE.json. RECORDED_FILE_NOT_PRESENT means the bytes are not in this tree to re-check, '
        + 'not that the identity is in doubt.',
      record: 'class12-source/CLASS12_CBSE_SOURCE.json',
      identity: cbseRecord ? (cbseRecord.identityVerifiedFromDocument as unknown) : null,
      note: 'Verified by reading the document, not the filename. "SecP2" denotes Senior Secondary '
        + 'Part 2; three earlier checkpoints misread it as a Class IX-X syllabus.',
    },
    ncertSource: {
      status: acquired === 0 ? 'UNAVAILABLE' : acquired < NCERT_EXPECTED.length ? 'PARTIAL' : 'PRESENT',
      expectedFiles: NCERT_EXPECTED.length, acquired,
      missing: ncert.filter((f) => !f.valid).map((f) => f.filename),
      files: ncert,
      searchedPaths: searched.map(repoRel),
      backMatterMissing: (model?.sourceSetCompleteness as { missing?: unknown[] } | undefined)?.missing ?? null,
      note: 'The expected filenames come from the official NCERT URL family and are acquisition '
        + 'hints only. They establish nothing about edition, chapters, sections or pages.',
    },
    // Copied from the model, which is written by the whole-book gate
    // (tools/class12/buildHierarchy.py). The manifest never decides a
    // denominator itself.
    denominators: Object.fromEntries(['chapters', 'sections', 'subsections', 'pages'].map((k) => {
      const d = (model?.denominators as Record<string, { value: unknown; status: string }> | undefined)?.[k];
      return [k, d ? { value: d.value ?? null, status: d.status } : { value: null, status: 'NOT_VERIFIED' }];
    })),
  };
}

const RUN = process.argv[1] !== undefined
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (RUN) {
  const m = buildManifest() as Record<string, never>;
  fs.writeFileSync(path.join(DIR, 'CLASS12_SOURCE_MANIFEST.json'), `${JSON.stringify(m, null, 2)}\n`);
  const n = m.ncertSource as unknown as { acquired: number; expectedFiles: number };
  console.log(`manifest: ${m.status} | CBSE ${(m.cbseSource as unknown as { status: string }).status} `
    + `| NCERT ${n.acquired}/${n.expectedFiles}`);
}
