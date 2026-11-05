# Class 9 — source readiness

Rewritten at checkpoint 25 after retrieving the official sources directly from
`ncert.nic.in` in this session. The checkpoint-24 finding that no Part II
existed is **superseded**.

## Verdict

**SOURCE_SET_COMPLETE.** Both published parts of the Class 9 textbook are
acquired and verified. Page-level decomposition is not blocked on acquisition —
but one structural level is still uncounted; see below.

## What the primary sources establish

| | |
|---|---|
| Textbook | **Ganita Manjari**, Textbook of Mathematics, Grade 9 |
| Part I | Chapters **1-8**, ISBN 978-93-5729-603-8, First Edition |
| Part II | Chapters **9-14**, ISBN 978-93-5729-236-8, First Edition |
| Chapter denominator | **14 — VERIFIED_FROM_SOURCE** |
| Archives retrieved | `iemh1dd.zip` (19,403,599 bytes), `iemh2dd.zip` (16,881,160 bytes) |
| Files | 16 PDFs, 404 PDF pages, SHA-256 recorded for each |

Evidence: the Part I prelims print "GANITA MANJARI / Textbook of Mathematics for
GRADE 9 / Part I" with a Contents page listing Chapters 1-8; the Part II prelims
print the same title with "GRADE 9 / Part II" and a Contents page listing
Chapters 9-14 plus a Learning Material section. Fourteen chapter PDFs are
present, and each one's first page carries its chapter title.

### Part II chapters, from the Contents page

| # | Title | Printed start page |
|---|---|---|
| 9 | Propositions and their Converses | 1 |
| 10 | How Quantities Combine: Understanding Data | 8 |
| 11 | The World of Algorithms | 37 |
| 12 | Quadrilaterals | 51 |
| 13 | Two Variables, One Line | 85 |
| 14 | Math of Space: Surface Area and Volume | 123 |

## What is still UNKNOWN

**The numbered-section denominator.** Part I has 53 verified sections from
earlier work. Part II's sections have **not** been counted, and a quick
heading-detection pass over all fourteen chapters disagreed with itself across
font-size thresholds — it produced 50 then 70 sections depending on the
threshold, against Part I's known 53, and showed numbering gaps that turned out
to be an extraction artifact (headings carry a `\x07` separator after the
number). That is exactly the per-chapter heading verification pass Classes 6-8
received, and it belongs to the decomposition checkpoint, not to this one.

So: `levels.section` for `ncert_iemh2` is recorded as **unknown**, and the count
of Class 9 records left to verify stays **UNKNOWN** rather than 0.

**Sub-sections** remain UNKNOWN for both parts (finding F6): the books print
numbered sub-sections (N.M.K) and extraction finds them incompletely.

## CBSE and NCERT remain separate hierarchies

The CBSE Class IX syllabus (6 units, 15 named chapters) is still a separate
official structure. **No correspondence is asserted**, and none was used to
establish the textbook's 14 chapters — those come from the two Contents pages
and fourteen chapter files. The counts differing (15 against 14) is itself a
reason not to equate them.

## Next

Class 9 is ready for page-level decomposition, beginning with the per-chapter
heading verification that establishes the section denominator from the bodies.
