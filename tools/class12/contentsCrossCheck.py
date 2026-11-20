#!/usr/bin/env python3
"""Cross-check recall-first sweep output against the printed Contents pages
of both prelims (lemh1ps.pdf, lemh2ps.pdf).

Contents give, per section: printed number, title, start folio. The chapter
start folio maps folio -> PDF page (pdfPage = folio - chapterStartFolio + 1).
This is an independent source location for every section heading.
Usage: python3 -I contentsCrossCheck.py <prelims1> <prelims2> <sweep.json>...
"""
import json, re, subprocess, sys

def contents(pdf):
    t = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, check=True).stdout.decode("utf-8", "replace")
    chap_re = re.compile(r"^\s*(\d{1,2})\.\s+(\S.*?)\s{2,}(\d+)\s*$")
    sec_re = re.compile(r"^\s*(\d{1,2})\.(\d{1,2})\s+(\S.*?)(?:\s{2,}(\d+))?\s*$")
    chapters, sections, back = {}, [], []
    lines = t.splitlines()
    pending = None
    for ln in lines:
        m = chap_re.match(ln)
        if m and int(m.group(1)) <= 13:
            chapters[int(m.group(1))] = {"title": m.group(2), "startFolio": int(m.group(3))}
            pending = None; continue
        m = sec_re.match(ln)
        if m:
            rec = {"chapter": int(m.group(1)), "printed": f"{m.group(1)}.{m.group(2)}", "title": m.group(3)}
            if m.group(4):
                rec["folio"] = int(m.group(4)); pending = None
            else:
                pending = rec
            sections.append(rec); continue
        if pending is not None:
            m2 = re.match(r"^\s+(\S.*?)\s{2,}(\d+)\s*$", ln)
            if m2:
                pending["title"] += " " + m2.group(1); pending["folio"] = int(m2.group(2)); pending = None
            continue
        m = re.match(r"^\s*(Answers|Appendix\s*\d+.*?|Supplementary Material.*?)\s{2,}(\d+)\s*$", ln)
        if m:
            back.append({"title": m.group(1).strip(), "startFolio": int(m.group(2))})
    # wrapped titles with folio on continuation line
    for i, ln in enumerate(lines):
        pass
    return chapters, sections, back

def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()

def main(p1, p2, sweeps):
    c1, s1, b1 = contents(p1); c2, s2, b2 = contents(p2)
    chapters = {**c1, **c2}; csecs = s1 + s2
    swept = [c for f in sweeps for c in json.load(open(f))]
    rows, mism = [], []
    for ch in swept:
        n = ch["chapter"]; start = chapters[n]["startFolio"]
        mine = {s["printed"]: s for s in ch["sections"]}
        theirs = {s["printed"]: s for s in csecs if s["chapter"] == n}
        for key in sorted(set(mine) | set(theirs), key=lambda k: int(k.split(".")[1])):
            a, b = mine.get(key), theirs.get(key)
            exp_page = (b["folio"] - start + 1) if b and "folio" in b else None
            title_ok = bool(a and b and (norm(b["title"]) == norm(a["title"]) or norm(a["title"]).startswith(norm(b["title"]))))
            page_ok = bool(a and exp_page == a["pdfPage"])
            r = {"printed": key, "inSweep": a is not None, "inContents": b is not None,
                 "sweepPdfPage": a and a["pdfPage"], "contentsFolio": b and b.get("folio"),
                 "contentsPdfPage": exp_page, "titleMatch": title_ok, "pageMatch": page_ok,
                 "contentsTitle": b and b["title"], "sweepTitle": a and a["title"]}
            rows.append(r)
            if not (r["inSweep"] and r["inContents"] and title_ok and page_ok):
                mism.append(r)
    # folio continuity: file page count vs next start folio
    order = sorted(chapters)
    cont = []
    pages = {c["chapter"]: c["pageCount"] for c in swept}
    allstarts = sorted([(chapters[k]["startFolio"], f"chapter {k}") for k in chapters] +
                       [(b["startFolio"], b["title"]) for b in b1 + b2])
    for k in order:
        if k not in pages: continue
        s = chapters[k]["startFolio"]; e = s + pages[k] - 1
        nxt = min((f, name) for f, name in allstarts if f > s)
        cont.append({"chapter": k, "startFolio": s, "endFolio": e, "pdfPages": pages[k],
                     "nextStart": nxt[0], "nextIs": nxt[1], "contiguous": e + 1 == nxt[0]})
    json.dump({"chapters": chapters, "backMatterPartI": b1, "backMatterPartII": b2,
               "rows": rows, "mismatches": mism, "folioContinuity": cont}, sys.stdout, indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
