# Page-level intent audit — Classes 1 and 2

What the words mean, because the first pass blurred them:

- **Indexed** — `digest.py` output: the page's folio, its headings and its
  opening text. Useful for finding things. It is not an inspection.
- **Full text** — every line of extracted text on every page of the range.
- **Visual** — the page was rendered and looked at. Early-primary
  mathematics usually lives in the ten frame, the strip, the array or the
  picture task, so for these classes text alone rarely settles a unit.

A unit is READY_FOR_AUTHORING only when its whole range is full text and,
where the mathematics is visual, its pages were seen. Everything else is a
draft or is flagged, however plausible it looks.

| Chapter | Title | Printed pages | PDF pages | Text inspection | Visual inspection | Units | Ready | Verdict |
|---|---|---|---|---|---|---|---|---|
| `ncert_aejm1_ch01` | Finding the Furry Cat! | 1–10 | 1–10 | all pages | none | 3 | 0 | needs visual pass |
| `ncert_aejm1_ch02` | What is Long? What is Round? | 10–17 | 1–8 | all pages | none | 2 | 0 | needs visual pass |
| `ncert_aejm1_ch03` | Mango Treat | 18–32 | 1–15 | all pages | pdf pp. 8, 11 | 4 | 1 | needs visual pass |
| `ncert_aejm1_ch04` | Making 10 | 33–46 | 1–14 | all pages | pdf pp. 1, 6, 9 | 6 | 3 | needs visual pass |
| `ncert_aejm1_ch05` | How Many? | 48–63 | 1–16 | all pages | pdf pp. 7 | 6 | 1 | needs visual pass |
| `ncert_aejm1_ch06` | Vegetable Farm | 64–71 | 1–8 | tail only (pdf pp. 5-8) | none | 4 | 0 | needs visual pass |
| `ncert_aejm1_ch07` | Lina’s Family | 72–80 | 1–9 | indexed only | pdf pp. 6, 8 | 3 | 0 | needs full reading |
| `ncert_aejm1_ch08` | Fun with Numbers | 84–97 | 1–14 | tail only (pdf pp. 10-14) | none | 5 | 0 | needs visual pass |
| `ncert_aejm1_ch09` | Utsav | 98–104 | 1–7 | indexed only | pdf pp. 3 | 3 | 0 | needs full reading |
| `ncert_aejm1_ch10` | How do I Spend my Day? | 105–110 | 1–6 | indexed only | none | 3 | 0 | needs full reading |
| `ncert_aejm1_ch11` | How Many Times? | 111–114 | 1–4 | indexed only | pdf pp. 3 | 1 | 0 | needs full reading |
| `ncert_aejm1_ch12` | How Much Can We Spend? | 115–119 | 1–5 | indexed only | none | 2 | 0 | needs full reading |
| `ncert_aejm1_ch13` | So Many Toys | 120–127 | 1–8 | indexed only | pdf pp. 1, 5, 6, 8 | 2 | 0 | needs full reading |
| `ncert_bejm1_ch01` | A Day at the Beach | 1–10 | 1–10 | indexed only | pdf pp. 4, 5 | 4 | 0 | needs full reading |
| `ncert_bejm1_ch02` | Shapes Around Us | 17–22 | 2–7 | indexed only | pdf pp. 6 | 2 | 0 | needs full reading |
| `ncert_bejm1_ch03` | Fun with Numbers | 23–31 | 1–9 | indexed only | pdf pp. 4, 6 | 3 | 0 | needs full reading |
| `ncert_bejm1_ch04` | Shadow Story (Togalu) | 32–41 | 1–10 | indexed only | pdf pp. 6 | 3 | 0 | needs full reading |
| `ncert_bejm1_ch05` | Playing with Lines | 44–49 | 1–6 | indexed only | none | 2 | 0 | needs full reading |
| `ncert_bejm1_ch06` | Decoration for Festival | 50–69 | 1–20 | tail only (pdf pp. 11-20) | pdf pp. 14, 17 | 8 | 2 | needs visual pass |
| `ncert_bejm1_ch07` | Rani’s Gift | 71–78 | 1–8 | indexed only | pdf pp. 4 | 3 | 0 | needs full reading |
| `ncert_bejm1_ch08` | Grouping and Sharing | 83–97 | 1–15 | tail only (pdf pp. 9-15) | pdf pp. 2, 10, 13 | 8 | 2 | needs visual pass |
| `ncert_bejm1_ch09` | Which Season is it? | 98–112 | 1–15 | tail only (pdf pp. 9-15) | pdf pp. 11 | 7 | 1 | needs visual pass |
| `ncert_bejm1_ch10` | Fun at the Fair | 113–120 | 1–8 | indexed only | pdf pp. 6 | 3 | 0 | needs full reading |
| `ncert_bejm1_ch11` | Data Handling | 123–129 | 1–7 | indexed only | pdf pp. 4, 6 | 3 | 0 | needs full reading |

## Unit-by-unit verdicts

| Unit | Chapter | Evidence depth | Classification | Status |
|---|---|---|---|---|
| `pragati_iu_g01_ch01_u1` Where is it? Position words | `ncert_aejm1_ch01` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch01_u2` Before, after and between in a line | `ncert_aejm1_ch01` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch01_u3` Sorting things into groups | `ncert_aejm1_ch01` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch02_u1` Long things and round things | `ncert_aejm1_ch02` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch02_u2` Rolls, slides, or both | `ncert_aejm1_ch02` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch03_u1` Counting up to 9, and one more | `ncert_aejm1_ch03` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch03_u2` More, less and as many as | `ncert_aejm1_ch03` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch03_u3` Writing the numerals 1 to 9 | `ncert_aejm1_ch03` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g01_ch03_u4` Counting in a busy picture, and two groups that make a number | `ncert_aejm1_ch03` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch04_u1` Seeing how many without counting | `ncert_aejm1_ch04` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g01_ch04_u2` Zero: when there is nothing left | `ncert_aejm1_ch04` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch04_u3` Ten as one group | `ncert_aejm1_ch04` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g01_ch04_u4` Number pairs that make 5 and 10 | `ncert_aejm1_ch04` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch04_u5` Numbers 11 to 20 as ten and some more | `ncert_aejm1_ch04` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g01_ch04_u6` Comparing and ordering numbers to 20 | `ncert_aejm1_ch04` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch05_u1` Putting groups together: addition to 9 | `ncert_aejm1_ch05` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch05_u2` Ways of adding | `ncert_aejm1_ch05` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g01_ch05_u3` Addition stories | `ncert_aejm1_ch05` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch05_u4` Taking away: subtraction to 9 | `ncert_aejm1_ch05` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch05_u5` Hidden dots: the parts of ten | `ncert_aejm1_ch05` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch05_u6` Subtracting by hopping back | `ncert_aejm1_ch05` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch06_u1` Adding past ten on a bead string | `ncert_aejm1_ch06` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch06_u2` Subtraction within 20 | `ncert_aejm1_ch06` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch06_u3` Adding and subtracting can land in the same place | `ncert_aejm1_ch06` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch06_u4` Two-step and missing-part problem stories | `ncert_aejm1_ch06` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch07_u1` Comparing how tall and how long | `ncert_aejm1_ch07` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch07_u2` Measuring with handspans and footspans | `ncert_aejm1_ch07` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch07_u3` Heavier and lighter | `ncert_aejm1_ch07` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch08_u1` Numbers 21 to 50 as tens and ones | `ncert_aejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch08_u2` Counting forward and back, and missing numbers | `ncert_aejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch08_u3` Numbers 51 to 99 | `ncert_aejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch08_u4` Numbers 81 to 100, and one hundred | `ncert_aejm1_ch08` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch08_u5` Counting what you see in a picture | `ncert_aejm1_ch08` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g01_ch09_u1` Repeating patterns with shapes and colours | `ncert_aejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch09_u2` Number patterns | `ncert_aejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch09_u3` Patterns in kolam and rangoli | `ncert_aejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch10_u1` Parts of the day and the order of events | `ncert_aejm1_ch10` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch10_u2` Which takes longer? | `ncert_aejm1_ch10` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch10_u3` Seasons of the year | `ncert_aejm1_ch10` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch11_u1` Equal groups and repeated addition | `ncert_aejm1_ch11` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch12_u1` Knowing our coins and notes | `ncert_aejm1_ch12` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch12_u2` Making an amount in different ways | `ncert_aejm1_ch12` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch13_u1` Counting groups in a picture and comparing them | `ncert_aejm1_ch13` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g01_ch13_u2` Puzzles that need a new kind of reasoning | `ncert_aejm1_ch13` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch01_u1` Counting in groups of ten | `ncert_bejm1_ch01` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch01_u2` Tens and ones with strips and blocks | `ncert_bejm1_ch01` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch01_u3` Making 100 | `ncert_bejm1_ch01` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch01_u4` Trays, groups and leftovers | `ncert_bejm1_ch01` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch02_u1` Solid shapes around us | `ncert_bejm1_ch02` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch02_u2` Faces, edges and corners | `ncert_bejm1_ch02` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch03_u1` Numbers on the bead string and number strip | `ncert_bejm1_ch03` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch03_u2` Skip counting and jumps | `ncert_bejm1_ch03` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch03_u3` Patterns in the number chart | `ncert_bejm1_ch03` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch04_u1` Shadows and flat shapes | `ncert_bejm1_ch04` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch04_u2` Telling shapes apart by their properties | `ncert_bejm1_ch04` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch04_u3` Making patterns with shapes | `ncert_bejm1_ch04` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch05_u1` Kinds of lines | `ncert_bejm1_ch05` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch05_u2` Drawing with lines | `ncert_bejm1_ch05` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch06_u1` Adding tens and ones without regrouping | `ncert_bejm1_ch06` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch06_u2` Adding on a bead string and a number line | `ncert_bejm1_ch06` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch06_u3` Adding with regrouping | `ncert_bejm1_ch06` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch06_u4` Taking away two-digit numbers | `ncert_bejm1_ch06` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch06_u5` Subtracting on the number line | `ncert_bejm1_ch06` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g02_ch06_u6` Column subtraction without regrouping | `ncert_bejm1_ch06` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g02_ch06_u7` Subtraction with regrouping: opening a garland | `ncert_bejm1_ch06` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g02_ch06_u8` Fact families and missing parts | `ncert_bejm1_ch06` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g02_ch07_u1` Why we need the same unit | `ncert_bejm1_ch07` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch07_u2` Measuring with a chosen unit | `ncert_bejm1_ch07` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch07_u3` Heavier, lighter and a simple balance | `ncert_bejm1_ch07` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch08_u1` Equal groups and "times" | `ncert_bejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch08_u2` The multiplication sign | `ncert_bejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch08_u3` Tables of 2, 3, 5 and 10 | `ncert_bejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch08_u4` Using multiplication in pictures and stories | `ncert_bejm1_ch08` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch08_u5` Building a table from tables you know | `ncert_bejm1_ch08` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g02_ch08_u6` Sharing equally | `ncert_bejm1_ch08` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g02_ch08_u7` How many groups? | `ncert_bejm1_ch08` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g02_ch08_u8` Sharing and grouping problems | `ncert_bejm1_ch08` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g02_ch09_u1` Seasons and the year | `ncert_bejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch09_u2` Reading a calendar | `ncert_bejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch09_u3` How long does it take? | `ncert_bejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch09_u4` Telling the time of day | `ncert_bejm1_ch09` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch09_u5` Reading the clock at the hour | `ncert_bejm1_ch09` | FULL_PAGE_INSPECTED | CONFIRMED | READY_FOR_AUTHORING |
| `pragati_iu_g02_ch09_u6` Finding the way: left, right and straight | `ncert_bejm1_ch09` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g02_ch09_u7` North, south, east and west | `ncert_bejm1_ch09` | FULL_TEXT_INSPECTED | NEEDS_HUMAN_CHECK | NEEDS_HUMAN_CHECK |
| `pragati_iu_g02_ch10_u1` Money: notes, coins and totals | `ncert_bejm1_ch10` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch10_u2` Paise and making a rupee | `ncert_bejm1_ch10` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch10_u3` Spending, change and different ways to pay | `ncert_bejm1_ch10` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch11_u1` Collecting data into a table | `ncert_bejm1_ch11` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch11_u2` Showing data in a picture chart | `ncert_bejm1_ch11` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |
| `pragati_iu_g02_ch11_u3` Asking your own question and collecting answers | `ncert_bejm1_ch11` | DIGEST_ONLY | NEEDS_HUMAN_CHECK | DRAFT_DECOMPOSITION |

## Non-instructional and enrichment material

- **ncert_aejm1_ch13_puzzles** (class1, ENRICHMENT) — Re-inspected by rendering the pages. Most of the section rehearses taught material and is recorded here, but the constraint and symmetry puzzles on pages 124-127 do introduce new reasoning and are now a unit (pragati_iu_g01_ch13_u2) rather than being hidden inside this record.
- **ncert_bejm1_ch11_puzzles** (class2, ENRICHMENT) — First-pass classification from the page index only. Rendering was not done for this section, so whether its puzzles introduce new reasoning is UNRESOLVED; it must not be treated as settled.

## Uncertainties carried forward

1. Class 2's puzzle section was classified from the index alone; whether it
   introduces new reasoning is **unresolved**. Class 1's equivalent did, once
   rendered — which is why the Class 2 claim cannot stand on an index.
2. Two prerequisites (counting to 100, money values) still point at units
   that do not exist yet and are written in plain language rather than as
   invented ids.
3. Neither class is COMPLETE: unread pages, not human judgement, are what
   holds them open.

