#!/usr/bin/env python3
"""Recall-first line-initial heading sweep for NCERT Class XII Mathematics.

Method (frozen since checkpoint 115):
  1. Capture EVERY line that begins with <chapter>.<n> or <chapter>.<n>.<m>,
     with no constraint on the title text.
  2. Classify: two-part numbers are section candidates, three-part numbers
     are subsection candidates.
  3. Reconcile numbering (gaps / duplicates are reported, never silently
     accepted).
  4. Derive boundaries: start = page of the heading; end = page before the
     next heading at the same level, or the last page of the chapter file.

Cross-references in this book are inline ("in Section 3.4"), never
line-initial, which is why the loose pattern is safe. The detector is NOT
tuned to any expected total.

Usage: python3 -I recallFirstSweep.py <pdf> <chapter> [<pdf> <chapter> ...]
Writes JSON to stdout.
"""
import json
import re
import subprocess
import sys


def page_texts(pdf):
    out = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, check=True).stdout
    return out.decode("utf-8", "replace").split("\f")


MISC_RE = re.compile(r"Miscellaneous\s+Exercise[s]?\s+on\s+Chapter\s+(\d+)", re.I)
EXER_RE = re.compile(r"EXERCISE\s+(\d+)\.(\d+)")
SUMMARY_RE = re.compile(r"^\s*Summary\s*$", re.M)


def sweep(pdf, chapter):
    pages = [p for p in page_texts(pdf)]
    if pages and pages[-1].strip() == "":
        pages = pages[:-1]
    # An optional trailing period after the number ("3.5. Transpose", "9.2.1. Order")
    # is a known printed form (documented at checkpoint 115); it is not a title constraint.
    head = re.compile(r"^\s*(%d)\.(\d+)(?:\.(\d+))?\.?\s+(\S.*)$" % chapter)
    candidates = []
    for i, text in enumerate(pages, start=1):
        for line in text.splitlines():
            m = head.match(line)
            if not m:
                continue
            sec, sub = int(m.group(2)), m.group(3)
            title = m.group(4).strip()
            candidates.append({
                "chapter": chapter,
                "printed": f"{chapter}.{sec}" + (f".{sub}" if sub else ""),
                "level": "subsection" if sub else "section",
                "title": title,
                "pdfPage": i,
            })
    joined = "\n".join(pages)
    misc = sorted({m.group(0) for m in MISC_RE.finditer(joined) if int(m.group(1)) == chapter})
    exercises = sorted({f"{a}.{b}" for a, b in EXER_RE.findall(joined) if int(a) == chapter},
                       key=lambda s: int(s.split(".")[1]))
    return {
        "file": pdf.split("/")[-1],
        "chapter": chapter,
        "pageCount": len(pages),
        "candidates": candidates,
        "miscHeadings": misc,
        "numberedExercises": exercises,
        "hasSummary": bool(SUMMARY_RE.search(joined)),
    }


def reconcile(result):
    secs = [c for c in result["candidates"] if c["level"] == "section"]
    subs = [c for c in result["candidates"] if c["level"] == "subsection"]
    def check(nums):
        dup = sorted({n for n in nums if nums.count(n) > 1})
        uniq = sorted(set(nums))
        gaps = [n for n in range(1, (max(uniq) if uniq else 0) + 1) if n not in uniq]
        return dup, gaps
    sec_nums = [int(c["printed"].split(".")[1]) for c in secs]
    sdup, sgap = check(sec_nums)
    sub_issues = {}
    for parent in sorted({int(c["printed"].split(".")[1]) for c in subs}):
        nums = [int(c["printed"].split(".")[2]) for c in subs if int(c["printed"].split(".")[1]) == parent]
        d, g = check(nums)
        orphan = parent not in sec_nums
        if d or g or orphan:
            sub_issues[f"{result['chapter']}.{parent}"] = {"duplicates": d, "gaps": g, "orphanParent": orphan}
    # boundaries
    last = result["pageCount"]
    for i, s in enumerate(secs):
        s["startPdfPage"] = s["pdfPage"]
        nxt = secs[i + 1]["pdfPage"] if i + 1 < len(secs) else None
        s["endPdfPage"] = (max(nxt - 1, s["pdfPage"]) if nxt is not None and nxt > s["pdfPage"]
                           else (s["pdfPage"] if nxt is not None else last))
    return {
        "sections": secs,
        "subsections": subs,
        "sectionDuplicates": sdup,
        "sectionGaps": sgap,
        "subsectionIssues": sub_issues,
    }


def main(argv):
    pairs = list(zip(argv[0::2], argv[1::2]))
    out = []
    for pdf, ch in pairs:
        r = sweep(pdf, int(ch))
        r.update(reconcile(r))
        out.append(r)
    json.dump(out, sys.stdout, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main(sys.argv[1:])
