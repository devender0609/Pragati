#!/usr/bin/env python3
"""Line-level boundary verification for NCERT Class XII Mathematics sections.

Input: recall-first sweep JSON (recallFirstSweep.py) + contents cross-check
JSON (contentsCrossCheck.py). For every chapter file:

  * every page's running-head folio is read and checked against
    startFolio + pdfPage - 1 (printed folios kept distinct from PDF pages);
  * every section/subsection heading is located to a (pdfPage, bodyLine);
  * headings must occur in strictly increasing printed order in reading
    order (an inversion would mean the stream, not the book, is wrong);
  * a section ENDS on the line before the next section heading. If that
    heading is mid-page, the earlier section ends on the SAME page — the
    c12.07 page-only rule ("page before the next heading") understated this;
  * the chapter's last section ends on the line before the chapter's
    terminal back-matter: "Miscellaneous Exercise on Chapter N", else
    "Summary", else the end of the file. That back-matter is recorded as a
    chapter-level extent, not silently folded into the last section.

A boundary is BOUNDARY_VERIFIED only when both anchors were found and the
start page also agrees with the printed Contents. Anything else is reported,
never coerced.
Usage: python3 -I verifyBoundaries.py <xcheck.json> <pdf> <sweep.json> [<pdf> <sweep.json> ...]
"""
import json
import re
import subprocess
import sys

FOOTER = re.compile(r"^\s*Reprint\s+20\d\d-\d\d\s*$")


def pages_of(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, check=True).stdout.decode("utf-8", "replace")
    ps = t.split("\f")
    if ps and not ps[-1].strip():
        ps = ps[:-1]
    return ps


def body_and_folio(page):
    lines = [l for l in page.splitlines()]
    nonblank = [l for l in lines if l.strip()]
    folio = None
    head_line = None
    # running head: the first non-blank line, carrying a bare folio number
    if nonblank:
        m = re.findall(r"(?<![\d.])(\d{1,3})(?![\d.])", nonblank[0])
        if m and re.search(r"[A-Z]{4,}", nonblank[0]):
            folio = int(m[-1] if nonblank[0].rstrip().endswith(m[-1]) else m[0])
            head_line = nonblank[0]
    body = [l for l in nonblank if l is not head_line and not FOOTER.match(l)]
    if head_line is None:
        body = [l for l in nonblank if not FOOTER.match(l)]
    return folio, head_line, body


def verify(pdf, sweep, xcheck):
    ch = sweep["chapter"]
    start_folio = xcheck["chapters"][str(ch)]["startFolio"]
    contents_rows = {r["printed"]: r for r in xcheck["rows"] if r["printed"].split(".")[0] == str(ch)}
    pages = pages_of(pdf)
    folio_checks = []
    bodies = []
    for i, p in enumerate(pages, start=1):
        folio, head, body = body_and_folio(p)
        expected = start_folio + i - 1
        folio_checks.append({"pdfPage": i, "printedFolio": folio, "expectedFolio": expected,
                             "status": "MATCH" if folio == expected else ("NO_RUNNING_HEAD" if folio is None else "MISMATCH")})
        bodies.append(body)
    stream = [(pi + 1, li, line) for pi, b in enumerate(bodies) for li, line in enumerate(b)]

    def locate(printed, title, page):
        pat = re.compile(r"^\s*" + re.escape(printed) + r"\.?\s+")
        hits = [(p, li) for (p, li, line) in stream if p == page and pat.match(line)]
        return hits[0] if len(hits) == 1 else (None if not hits else ("AMBIGUOUS", hits))

    heads = []
    for s in sweep["sections"] + sweep["subsections"]:
        loc = locate(s["printed"], s["title"], s["pdfPage"])
        heads.append({"rec": s, "loc": loc})
    located = [h for h in heads if isinstance(h["loc"], tuple) and h["loc"][0] != "AMBIGUOUS"]
    def key(printed):
        return tuple(int(x) for x in printed.split("."))
    order_ok = True
    seq = sorted(located, key=lambda h: (h["loc"][0], h["loc"][1]))
    for a, b in zip(seq, seq[1:]):
        if key(a["rec"]["printed"]) >= key(b["rec"]["printed"]):
            order_ok = False

    # terminal back matter anchor
    misc_re = re.compile(r"^\s*Miscellaneous\s+Exercise[s]?\s+on\s+Chapter\s+%d\b" % ch, re.I)
    summ_re = re.compile(r"^\s*Summary\s*$")
    term = None
    for p, li, line in stream:
        if misc_re.match(line):
            term = {"kind": "MISCELLANEOUS_EXERCISE", "pdfPage": p, "bodyLine": li}
            break
    if term is None:
        for p, li, line in stream:
            if summ_re.match(line):
                term = {"kind": "SUMMARY", "pdfPage": p, "bodyLine": li}
                break
    last_page = len(pages)

    def end_before(page, line):
        if line > 0:
            return {"pdfPage": page, "bodyLine": line - 1}
        prev = page - 1
        while prev >= 1 and not bodies[prev - 1]:
            prev -= 1
        return {"pdfPage": prev, "bodyLine": len(bodies[prev - 1]) - 1}

    results = []
    for level in ("section", "subsection"):
        recs = [h for h in heads if h["rec"]["level"] == level]
        for i, h in enumerate(recs):
            s = h["rec"]
            issues = []
            loc = h["loc"]
            if not (isinstance(loc, tuple) and loc and loc[0] != "AMBIGUOUS"):
                issues.append("HEADING_NOT_UNIQUELY_LOCATED")
                start = None
            else:
                start = {"pdfPage": loc[0], "bodyLine": loc[1]}
            if level == "section":
                nxt = recs[i + 1] if i + 1 < len(recs) else None
                parent_end = None
            else:
                parent = s["printed"].rsplit(".", 1)[0]
                sibs = [r for r in recs if r["rec"]["printed"].rsplit(".", 1)[0] == parent]
                j = [r["rec"]["printed"] for r in sibs].index(s["printed"])
                nxt = sibs[j + 1] if j + 1 < len(sibs) else None
                parent_end = parent
            if nxt is not None and isinstance(nxt["loc"], tuple) and nxt["loc"][0] != "AMBIGUOUS":
                end = end_before(*nxt["loc"]); end["anchor"] = "LINE_BEFORE_NEXT_" + level.upper() + " " + nxt["rec"]["printed"]
            elif nxt is None and level == "subsection":
                end = {"anchor": "ENDS_WITH_PARENT " + parent_end}
            elif nxt is None and term is not None:
                end = end_before(term["pdfPage"], term["bodyLine"]); end["anchor"] = "LINE_BEFORE_" + term["kind"]
            elif nxt is None:
                end = {"pdfPage": last_page, "bodyLine": len(bodies[-1]) - 1, "anchor": "END_OF_FILE"}
            else:
                end = None; issues.append("NEXT_HEADING_NOT_LOCATED")
            if level == "section":
                cr = contents_rows.get(s["printed"])
                if not (cr and cr["titleMatch"] and cr["pageMatch"]):
                    issues.append("CONTENTS_DISAGREES")
            results.append({"printed": s["printed"], "level": level, "title": s["title"],
                            "start": start, "end": end, "issues": issues})
    # resolve subsection ENDS_WITH_PARENT
    by = {r["printed"]: r for r in results}
    for r in results:
        if r["end"] and r["end"].get("anchor", "").startswith("ENDS_WITH_PARENT"):
            par = by[r["end"]["anchor"].split()[1]]
            if par["end"] and "pdfPage" in par["end"]:
                r["end"] = dict(par["end"]); r["end"]["anchor"] = "ENDS_WITH_PARENT " + par["printed"] + " (" + par["end"]["anchor"] + ")"
            else:
                r["issues"].append("PARENT_END_UNRESOLVED")
    for r in results:
        if not order_ok:
            r["issues"].append("READING_ORDER_INVERSION_IN_CHAPTER")
        ok = not r["issues"] and r["start"] and r["end"] and "pdfPage" in r["end"]
        if ok and (r["end"]["pdfPage"], r["end"]["bodyLine"]) < (r["start"]["pdfPage"], r["start"]["bodyLine"]):
            r["issues"].append("END_BEFORE_START"); ok = False
        r["verificationStatus"] = "BOUNDARY_VERIFIED" if ok else ("SOURCE_HEADING_VERIFIED" if r["start"] else "DISCOVERED")
    chapter_end = None
    if term is not None:
        chapter_end = {"kind": term["kind"], "startPdfPage": term["pdfPage"], "endPdfPage": last_page}
    return {"chapter": ch, "file": pdf.split("/")[-1], "pdfPages": len(pages),
            "startFolio": start_folio, "endFolio": start_folio + len(pages) - 1,
            "folioMismatches": [f for f in folio_checks if f["status"] == "MISMATCH"],
            "pagesWithoutRunningHead": [f["pdfPage"] for f in folio_checks if f["status"] == "NO_RUNNING_HEAD"],
            "readingOrderMonotonic": order_ok, "chapterEndMatter": chapter_end, "records": results}


def main(argv):
    xcheck = json.load(open(argv[0]))
    out = []
    rest = argv[1:]
    for pdf, sw in zip(rest[0::2], rest[1::2]):
        for s in json.load(open(sw)):
            if s["file"] == pdf.split("/")[-1]:
                out.append(verify(pdf, s, xcheck))
    json.dump(out, sys.stdout, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main(sys.argv[1:])
