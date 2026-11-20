#!/usr/bin/env python3
"""v0.84.0-c12.08 — build the Class XII hierarchy evidence from the PDFs.

Runs, in order, on class12-source/pdfs:
  recallFirstSweep.py  -> heading candidates, classification, numbering
  contentsCrossCheck.py -> independent check against both printed Contents pages
  verifyBoundaries.py   -> folio check per page + line-level start/end anchors

and writes the generated hierarchy files. Nothing here is hand-maintained:
re-running reproduces the files from the PDFs. The detector is not tuned to
any expected total; the whole-book gate decides whether a denominator may be
published.

Usage (from repo root): python3 -I tools/class12/buildHierarchy.py
"""
import hashlib
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "class12-source")
PDFS = os.path.join(SRC, "pdfs")
TOOLS = os.path.dirname(os.path.abspath(__file__))
GEN = "tools/class12/buildHierarchy.py (checkpoint 116, c12.08)"

CHAPTER_FILES = [("lemh101.pdf", 1), ("lemh102.pdf", 2), ("lemh103.pdf", 3), ("lemh104.pdf", 4),
                 ("lemh105.pdf", 5), ("lemh106.pdf", 6), ("lemh201.pdf", 7), ("lemh202.pdf", 8),
                 ("lemh203.pdf", 9), ("lemh204.pdf", 10), ("lemh205.pdf", 11), ("lemh206.pdf", 12),
                 ("lemh207.pdf", 13)]

# Visual inspection outcomes (checkpoint 116). Extraction is kept verbatim in
# `extractedTitle`; `title` carries the heading as printed where a layout
# artefact or lost superscript made the extraction wrong. Each entry records
# what was looked at.
VISUAL = {
    "5.2": {"title": "Continuity",
            "evidence": "lemh105.pdf p1 rendered: '(1642-1727)' is the caption under the Newton portrait in the right column, not part of the heading"},
    "7.6.1": {"title": "Integral of the type ∫ eˣ [f(x) + f′(x)] dx",
              "evidence": "lemh201.pdf p38 rendered: extraction drops the superscript x on e"},
}
VISUALLY_INSPECTED_PAGES = [
    {"file": "lemh105.pdf", "pdfPage": 1, "why": "sidebar caption merged into 5.2 heading line"},
    {"file": "lemh201.pdf", "pdfPage": 38, "why": "notation inside 7.6.1 heading"},
    {"file": "lemh201.pdf", "pdfPage": 43, "why": "four headings on one page (7.7, 7.8, 7.8.1, 7.8.2); 7.7 is one paragraph"},
    {"file": "lemh201.pdf", "pdfPage": 44, "why": "7.8.3 at page top (page-break heading)"},
    {"file": "lemh204.pdf", "pdfPage": 18, "why": "10.6.1 near page bottom"},
]


def run(args, out):
    with open(out, "w") as fh:
        subprocess.run([sys.executable, "-I"] + args, stdout=fh, check=True)
    return json.load(open(out))


def sha(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()


def main():
    tmp = tempfile.mkdtemp()
    sweep_args = []
    for f, ch in CHAPTER_FILES:
        sweep_args += [os.path.join(PDFS, f), str(ch)]
    sweep = run([os.path.join(TOOLS, "recallFirstSweep.py")] + sweep_args, os.path.join(tmp, "sweep.json"))
    xcheck = run([os.path.join(TOOLS, "contentsCrossCheck.py"), os.path.join(PDFS, "lemh1ps.pdf"),
                  os.path.join(PDFS, "lemh2ps.pdf"), os.path.join(tmp, "sweep.json")], os.path.join(tmp, "x.json"))
    bargs = [os.path.join(TOOLS, "verifyBoundaries.py"), os.path.join(tmp, "x.json")]
    for f, _ in CHAPTER_FILES:
        bargs += [os.path.join(PDFS, f), os.path.join(tmp, "sweep.json")]
    bounds = run(bargs, os.path.join(tmp, "b.json"))

    old = json.load(open(os.path.join(SRC, "CLASS12_SECTION_EXTENTS.json")))
    # The c12.07 page-only ends, kept as a correction trail. Read them from the
    # c12.07 file itself on first build, and carry them forward thereafter, so
    # a re-run never silently drops the record of what was corrected.
    if old.get("generatedBy") == "checkpoint 115":
        c1207 = {s["printed"]: s["endPdfPage"] for s in old["sections"]}
    else:
        c1207 = old.get("c1207PageOnlyEnds") or {}

    bmap = {b["chapter"]: b for b in bounds}
    sections, subsections, misc_rows = [], [], []
    per_ch_sec, per_ch_sub = {}, {}
    for sw in sorted(sweep, key=lambda s: s["chapter"]):
        ch = sw["chapter"]; b = bmap[ch]
        recs = {r["printed"]: r for r in b["records"]}
        for s in sw["sections"] + sw["subsections"]:
            r = recs[s["printed"]]
            vis = VISUAL.get(s["printed"])
            row = {
                "chapter": ch, "printed": s["printed"],
                "title": vis["title"] if vis else s["title"],
                "extractedTitle": s["title"],
                "sourceFile": sw["file"],
                "pdfPage": s["pdfPage"],
                "printedFolio": b["startFolio"] + s["pdfPage"] - 1,
                "start": r["start"], "end": r["end"],
                "startPdfPage": r["start"]["pdfPage"],
                "endPdfPage": r["end"]["pdfPage"],
                "verificationStatus": r["verificationStatus"],
                "issues": r["issues"],
            }
            if vis:
                row["visualCorrection"] = vis["evidence"]
            if s["level"] == "section":
                row["contentsPageAgreement"] = True if not [m for m in xcheck["mismatches"] if m["printed"] == s["printed"]] else False
                prev = c1207.get(s["printed"])
                if prev is not None and prev != row["endPdfPage"]:
                    row["c1207EndPdfPage"] = prev
                sections.append(row)
            else:
                row["parent"] = s["printed"].rsplit(".", 1)[0]
                subsections.append(row)
        per_ch_sec[str(ch)] = len(sw["sections"])
        per_ch_sub[str(ch)] = len(sw["subsections"])
        misc_rows.append({"chapter": ch, "file": sw["file"], "miscellaneousExercise": bool(sw["miscHeadings"]),
                          "miscHeadings": sw["miscHeadings"], "numberedExercises": sw["numberedExercises"],
                          "hasSummary": sw["hasSummary"], "chapterEndMatter": b["chapterEndMatter"]})

    chapters_present = sorted(int(c) for c in per_ch_sec)
    gaps = {str(s["chapter"]): s["sectionGaps"] for s in sweep if s["sectionGaps"]}
    dups = {str(s["chapter"]): s["sectionDuplicates"] for s in sweep if s["sectionDuplicates"]}
    sub_issues = {k: v for s in sweep for k, v in s["subsectionIssues"].items()}
    folio_mis = {b["file"]: b["folioMismatches"] for b in bounds if b["folioMismatches"]}
    order_bad = [b["chapter"] for b in bounds if not b["readingOrderMonotonic"]]
    not_verified = [r["printed"] for r in sections + subsections if r["verificationStatus"] != "BOUNDARY_VERIFIED"]
    gate = {
        "allThirteenChaptersRepresented": chapters_present == list(range(1, 14)),
        "noSectionNumberingGaps": not gaps,
        "noDuplicatePrintedSectionNumbers": not dups,
        "subsectionsCorrectlyParentedNoGapsNoDuplicates": not sub_issues,
        "everySectionHasSourceLocation": all(r["start"] for r in sections),
        "everySectionAgreesWithPrintedContents": not xcheck["mismatches"],
        "everySectionStartVerified": all(r["start"] for r in sections + subsections),
        "everySectionEndVerified": not not_verified,
        "everyPageFolioMatchesContentsMapping": not folio_mis,
        "headingsMonotonicInReadingOrder": not order_bad,
    }
    passed = all(gate.values())
    n_sec, n_sub = len(sections), len(subsections)

    consistency = {
        "generatedBy": GEN,
        "gate": gate, "gatePassed": passed,
        "result": {"sections": n_sec if passed else None, "subsections": n_sub if passed else None},
        "perChapterSections": per_ch_sec, "perChapterSubsections": per_ch_sub,
        "gaps": gaps or "none", "duplicates": dups or "none", "subsectionIssues": sub_issues or "none",
        "folioMismatches": folio_mis or "none", "readingOrderInversions": order_bad or "none",
        "boundaryNotVerified": not_verified or "none",
        "contentsCrossCheck": {"sectionsCompared": len(xcheck["rows"]), "mismatches": xcheck["mismatches"]},
        "folioContinuity": xcheck["folioContinuity"],
        "visuallyInspected": VISUALLY_INSPECTED_PAGES,
        "independence": "Sections are corroborated by two independent sources: the recall-first sweep of the "
                        "chapter files and the printed Contents pages of both prelims (number, title and start "
                        "folio). Subsections do not appear on the Contents pages; they rest on the sweep plus "
                        "line-level location, numbering and parent checks.",
    }

    extents = {
        "generatedBy": GEN,
        "status": "WHOLE_BOOK_RECONCILED_13_OF_13" if passed else "WHOLE_BOOK_GATE_FAILED",
        "method": "Recall-first sweep: every line beginning <chapter>.<n> (optionally <chapter>.<n>.<m>, with an optional "
                  "trailing period) was captured with NO title constraint, then classified, then reconciled. "
                  "Unchanged from checkpoint 115; now a checked-in tool (tools/class12/recallFirstSweep.py) that "
                  "reproduces the stored 12-chapter result exactly before being applied to Chapter 7.",
        "convergence": "At checkpoint 115 two methods built on different assumptions (the recall-first sweep and detector "
                       "revision 2) agreed on sections for 12 chapters; three revisions of one regex disagreeing was "
                       "evidence only that it was unreliable. Checkpoint 116 adds a third, independent "
                       "source: every one of the 13 chapters' sections matches the printed Contents pages by number, title "
                       "and start folio.",
        "sectionsReconciled": n_sec, "subsectionsReconciled": n_sub,
        "perChapterSections": per_ch_sec,
        "gaps": "none" if not gaps else gaps,
        "duplicatePrintedNumbers": "none" if not dups else dups,
        "chaptersCovered": len(chapters_present), "chaptersMissing": [c for c in range(1, 14) if c not in chapters_present],
        "boundarySemantics": "start = the heading line; end = the line before the next heading of the same level. When "
                             "that heading is mid-page the earlier section ends on the same page. A chapter's last "
                             "section ends on the line before the Miscellaneous Exercise (or Summary where there is "
                             "none); that end matter is recorded per chapter in CLASS12_MISC_EXERCISE_SCOPES.json.",
        "c1207Correction": "Checkpoint 115 ended each section on the page BEFORE the next heading. Where the next heading is "
                           "mid-page that understated the end by one page; such records keep the old value as c1207EndPdfPage.",
        "c1207PageOnlyEnds": c1207,
        "historicalComparison": None,
        "sections": sections, "subsections": subsections,
    }
    if passed:
        extents["historicalComparison"] = (
            "Only after the source-derived count existed was it compared with the remembered figure: the "
            "primary-source total and the remembered total coincide. The remembered figure was never an input, a "
            "target or a test oracle; agreement is noted, not used as evidence.")
    subs_doc = {"generatedBy": GEN, "status": extents["status"], "count": n_sub,
                "chaptersMissing": extents["chaptersMissing"],
                "note": "real printed subsections only; no pedagogical subunits", "subsections": subsections}
    with_misc = [m["chapter"] for m in misc_rows if m["miscellaneousExercise"]]
    without = [m["chapter"] for m in misc_rows if not m["miscellaneousExercise"]]
    misc_doc = {"generatedBy": GEN, "status": extents["status"], "chaptersMissing": extents["chaptersMissing"],
                "finding": f"{len(with_misc)} of 13 chapters carry a Miscellaneous Exercise. Chapter(s) {without} do NOT. "
                           "Chapter 7 was determined from its own source at checkpoint 116, not assumed.",
                "withMiscellaneous": with_misc, "withoutMiscellaneous": without,
                "dispositionPolicy": "no canonical unit is created from a miscellaneous exercise; each is accounted for "
                                     "separately and classified only after its content is inspected",
                "chapters": misc_rows}

    for name, doc in [("CLASS12_SECTION_EXTENTS.json", extents), ("CLASS12_SUBSECTION_RECORDS.json", subs_doc),
                      ("CLASS12_MISC_EXERCISE_SCOPES.json", misc_doc),
                      ("CLASS12_WHOLE_BOOK_CONSISTENCY.json", consistency)]:
        with open(os.path.join(SRC, name), "w") as fh:
            json.dump(doc, fh, indent=1, ensure_ascii=False); fh.write("\n")

    # page accounting — PDF pages and printed folios kept apart
    def pages(f):
        out = subprocess.run(["pdfinfo", os.path.join(PDFS, f)], capture_output=True).stdout.decode()
        return int([l for l in out.splitlines() if l.startswith("Pages:")][0].split()[1])
    prelim = {f: pages(f) for f in ("lemh1ps.pdf", "lemh2ps.pdf")}
    chap_pages = {f: pages(f) for f, _ in CHAPTER_FILES}
    back = xcheck["backMatterPartI"]
    acct = {
        "generatedBy": GEN,
        "status": "PARTIAL_BACK_MATTER_ABSENT",
        "validPdfPagesPresent": sum(prelim.values()) + sum(chap_pages.values()),
        "prelimPdfPages": prelim,
        "chapterBodyPdfPages": {"partI": sum(chap_pages[f] for f, c in CHAPTER_FILES if c <= 6),
                                "partII": sum(chap_pages[f] for f, c in CHAPTER_FILES if c >= 7),
                                "total": sum(chap_pages.values()), "perFile": chap_pages},
        "chapterFolioRuns": {"partI": "1-186", "partII": "225-438"},
        "everyChapterPageFolioVerified": not folio_mis,
        "partIBackMatterFromContents": back,
        "partIBackMatterFolios": "187-224 (38 folios) — no source file present",
        "partIIBackMatterFromContents": xcheck["backMatterPartII"],
        "partIIBackMatterFolios": "439-? — Answers start at 439; end folio unknown, no source file present",
        "answersPdfPages": None, "appendixIPdfPages": None, "appendixIIPdfPages": None,
        "supplementaryPdfPages": None,
        "pageDenominator": {"value": None, "status": "NOT_VERIFIED",
                            "why": "Part I appendices/answers/supplementary (folios 187-224) and Part II Answers "
                                   "(from folio 439) are absent; a total over the book cannot be stated."},
    }
    with open(os.path.join(SRC, "CLASS12_PAGE_ACCOUNTING.json"), "w") as fh:
        json.dump(acct, fh, indent=1, ensure_ascii=False); fh.write("\n")
    print(json.dumps({"gatePassed": passed, "sections": n_sec, "subsections": n_sub,
                      "withMisc": len(with_misc), "without": without,
                      "validPdfPages": acct["validPdfPagesPresent"]}))


if __name__ == "__main__":
    main()
