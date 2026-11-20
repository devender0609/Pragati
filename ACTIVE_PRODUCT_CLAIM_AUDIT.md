# Active product-claim audit — v0.83.5

Every occurrence of *adaptive, assessment, growth, ability, prototype, RIT,
norm, score* **in text a person can read** — quoted strings and JSX text in the
runtime tree, comments stripped. Identifiers, imports and type names are
excluded on purpose: `import { updateAbility }` is not a product claim, and
deleting the word everywhere would be vandalism rather than an audit.

| Class | Meaning | Count |
|---|---|---|
| A | active Student-facing | 29 |
| B | active Teacher-facing | 30 |
| C | owner/admin or shell, caveated | 16 |
| D | internal engineering / curriculum records | 149 |
| E | content catalogue, historical docs, test fixtures | 602 |

## Changed in v0.83.5

| File | Was | Now | Why |
|---|---|---|---|
| `src/components/OnboardingFlow.tsx` (Step 2) | "Assign an assessment"; "Students see 10 short items adapted to how they answer. No timer." | "Assign learning or practice"; "Students learn and practise … No timer, and a wrong answer explains the mistake behind it."; step 4 now "You review the work and decide what is next" | Described a calibrated adaptive test. Growth is frozen, the picker is a rule of thumb, and Assign was reframed around learning. |
| `index.html` meta description | "Pragati: prototype adaptive growth assessment for CBSE Class 6 Math (FR.06)." | "Pragati is a mathematics learning and practice platform aligned to current CBSE/NCERT Mathematics courses." | It is the sentence search results and link previews quote; it claimed Growth and scoped the product to Class 6. |

## Changed in earlier releases

| File | Change | Release |
|---|---|---|
| `OnboardingFlow.tsx` (Step 1) | "adaptive assessment prototype for Class 6 Math" replaced | v0.83.4 |
| `index.html` `<title>` | "Growth Assessment Prototype" → "Pragati — Mathematics Learning" | v0.83.2 |

## Deliberately retained, with the reason

- **Internal engineering** — `src/features/assessment/*`, `lib/adaptiveEngine`,
  `AssessmentRouter`, heuristic ability state. Growth is frozen; a module name
  is not a product claim. Untouched by instruction (§10).
- **The Growth Check student card** (`StudentHomeView.tsx`) — renders only when
  a teacher assigns a Growth Check, and the teacher-side track is the frozen
  governed one. It is conditional, not a standing claim. **Flagged for the next
  phase**: it is the one place the word Growth still reaches a student, and the
  copy should be revisited when Growth's status is settled rather than edited
  piecemeal now.
- **`ResultsView` "Prototype ability estimate"** (teacher label; students see
  "Level right now") and its "this is a prototype estimate based on seed
  difficulty values, not a calibrated score" caveat.
- **`AssignmentForm` "Prototype note: the adaptive engine still uses its current
  stop rule"** — accurate about a rule-based picker.
- **Assessment vocabulary on the legacy Class 6 assessment path**
  (`features/legacy/*`, `AssessmentPicker`, `StartForm`) — these name a feature
  that exists and is labelled a prototype wherever it appears.
- **`Footer` "Pragati does not produce a calibrated score"** — a disclaimer.
- **Content catalogues** (`src/data/*`, `src/types.ts`) — "Prototype content,
  teacher review required" understates; "probability" and "score" occur inside
  the mathematics itself.
- **Version reports, historical review packages, `docs/review/*`** — history.

## Full occurrence list

| File | Line | Text a person reads | Class | Action |
|---|---|---|---|---|
| `index.html` | 7 | Pragati is a mathematics learning and practice platform aligned to current CBSE/NCERT Mathematics courses. | A | changed |
| `src/App.tsx` | 467 | No items found for this assessment mode. Please choose another skill or contact the teacher. | C | kept |
| `src/App.tsx` | 478 | No items found for this assessment mode. Please choose another skill or contact the teacher. | C | kept |
| `src/App.tsx` | 530 | This assessment has no items left to show. Please choose another assessment. | C | kept |
| `src/App.tsx` | 585 | Could not start the assessment. Please choose another one. | C | kept |
| `src/App.tsx` | 1637 | Ordinary classroom evidence: a set of questions you choose, for a class or a student, to see how a piece of teaching lan | C | kept |
| `src/App.tsx` | 1661 | Pragati Growth | C | kept |
| `src/App.tsx` | 1669 | Growth Check setup | C | kept |
| `src/components/AlignmentReviewView.tsx` | 118 | CBSE/NCERT-informed prototype · mapped to draft skill framework | B | kept |
| `src/components/AlignmentReviewView.tsx` | 410 | This page is the prototype's mapping of items to a draft skill | B | kept |
| `src/components/AlignmentReviewView.tsx` | 473 | Prototype starter content — no hand-authored alignment record | B | kept |
| `src/components/AssessmentPicker.tsx` | 158 | Pick an assessment first. | A | kept |
| `src/components/AssessmentPicker.tsx` | 203 | Pragati · assessment picker | A | kept |
| `src/components/AssessmentPicker.tsx` | 206 | Choose an assessment | A | kept |
| `src/components/AssessmentPicker.tsx` | 303 | Step 3 · Assessment | A | kept |
| `src/components/AssessmentPicker.tsx` | 307 | No assessments are registered for | A | kept |
| `src/components/AssignmentForm.tsx` | 121 | This creates a clear assessment card on the student home. It does | B | kept |
| `src/components/AssignmentForm.tsx` | 141 | Assessment focus | B | kept |
| `src/components/AssignmentForm.tsx` | 177 | Prototype note: the adaptive engine still uses its current stop | B | kept |
| `src/components/AssignmentsView.tsx` | 132 | Your own check on what the class can do, built from the item bank. Classroom evidence, not a calibrated score. | B | kept |
| `src/components/AssignmentsView.tsx` | 146 | Pragati Growth | B | kept |
| `src/components/AssignmentsView.tsx` | 148 | The formal assessment track. An instructional check never becomes one: Growth carries calibration and norming claims tha | B | kept |
| `src/components/ClassroomWorkflowTest.tsx` | 119 | 5. Complete an assigned assessment | B | kept |
| `src/components/ClassroomWorkflowTest.tsx` | 313 | Pre-pilot prototype. This page only reflects data on THIS device. | B | kept |
| `src/components/ClassroomsView.tsx` | 849 | No students on this device yet. Start an assessment for a new | B | kept |
| `src/components/CurriculumCoverageView.tsx` | 40 | Assessment only | C | kept |
| `src/components/CurriculumCoverageView.tsx` | 42 | Partial (prototype) | C | kept |
| `src/components/CurriculumCoverageView.tsx` | 43 | Prototype complete | C | kept |
| `src/components/CurriculumCoverageView.tsx` | 119 | Prototype-complete rows | C | kept |
| `src/components/Footer.tsx` | 43 | Pragati does not produce a calibrated score. Results need teacher | A | kept |
| `src/components/ImportedSubmissionsView.tsx` | 321 | Pre-pilot prototype. Imported sessions inherit the | B | kept |
| `src/components/ItemReviewView.tsx` | 808 | s effective availability status. | B | kept |
| `src/components/JoinClassroomView.tsx` | 119 | Pragati is a prototype. Your name is stored on this device; nothing is | C | kept |
| `src/components/LearnView.tsx` | 271 | Take the Mixed assessment | A | kept |
| `src/components/LearnView.tsx` | 399 | One question at a time. Nothing here is scored. | A | kept |
| `src/components/LearnView.tsx` | 478 | Lesson content is a prototype draft. Review with a CBSE Class 6 math | A | kept |
| `src/components/LearnView.tsx` | 664 | Nothing here is scored. When you want a set that is, open a | A | kept |
| `src/components/OnboardingFlow.tsx` | 260 | Assign learning or practice / Students learn and practise | A | changed |
| `src/components/PilotReportView.tsx` | 209 | Assessment modes used | C | kept |
| `src/components/PilotReportView.tsx` | 482 | Pragati is a CBSE/NCERT-informed prototype. The numbers above are | C | kept |
| `src/components/ResultsView.tsx` | 145 | Assessment complete | A | kept |
| `src/components/ResultsView.tsx` | 179 | Prototype ability estimate | A | kept |
| `src/components/ResultsView.tsx` | 214 | Growth comparison unavailable | A | kept |
| `src/components/ResultsView.tsx` | 297 | This is a prototype estimate based on seed difficulty values, not a | A | kept |
| `src/components/StartForm.tsx` | 90 | Who is taking this assessment? | A | kept |
| `src/components/StartForm.tsx` | 194 | Assessment window | A | kept |
| `src/components/StartForm.tsx` | 245 | Start assessment | A | kept |
| `src/components/StudentLearningPath.tsx` | 245 | Quick check — answer these two before you retake the assessment. | A | kept |
| `src/components/StudentLearningPath.tsx` | 294 | Retake the assessment on | A | kept |
| `src/components/TeacherAdminValidationTab.tsx` | 60 | Everyday teacher tools first, research & prototype-quality tools below. Wire-level behaviour is unchanged from v0.45. | B | kept |
| `src/components/TeacherAdminValidationTab.tsx` | 97 | Per-student growth + history | B | kept |
| `src/components/TeacherAdminValidationTab.tsx` | 98 | One row per student with sessions, growth history, item-by-item responses, and recommended next steps. | B | kept |
| `src/components/TeacherAdminValidationTab.tsx` | 153 | CBSE / NCERT-informed prototype | B | kept |
| `src/components/TeacherAdminValidationTab.tsx` | 284 | Prototype notes | B | kept |
| `src/components/TeacherAdminValidationTab.tsx` | 302 | This is a pre-pilot prototype. Skill-status labels, alignment | B | kept |
| `src/components/TeacherWorkflowHome.tsx` | 122 | Teacher · CBSE/NCERT-informed prototype · pre-pilot | B | kept |
| `src/components/TeachingPlanView.tsx` | 266 | This plan is a prototype heuristic — useful as a starting point for a | B | kept |
| `src/components/common/GrowthCard.tsx` | 19 | : growth.direction === | A | kept |
| `src/components/common/GrowthCard.tsx` | 31 | Prototype change indicator | A | kept |
| `src/components/common/GrowthCard.tsx` | 34 | Early signal · not calibrated growth | A | kept |
| `src/components/common/GrowthCard.tsx` | 122 | Prototype change indicator | A | kept |
| `src/components/common/SessionFeedbackCard.tsx` | 104 | Tell us how the assessment went. | A | kept |
| `src/components/common/SessionFeedbackCard.tsx` | 114 | Was the assessment easy, okay, or hard? | A | kept |
| `src/curriculum/__tests__/inventory.test.ts` | 59 | canLaunchAssessment guards zero-item chapters | E | kept |
| `src/curriculum/__tests__/migrations.test.ts` | 97 | scopesAreComparable — growth guard | E | kept |
| `src/curriculum/__tests__/recommend.test.ts` | 70 | pickRecommendedBlueprint — availability preference | E | kept |
| `src/curriculum/__tests__/registry.test.ts` | 148 | curriculum registry — assessments availability | E | kept |
| `src/curriculum/__tests__/sessionScope.test.ts` | 61 | areSessionsComparable — growth guard | E | kept |
| `src/curriculum/__tests__/studentNames.test.ts` | 61 | Algebra (prototype) | E | kept |
| `src/curriculum/__tests__/v054Governance.test.ts` | 111 | §8 a blueprint domain does not become a scored subscale | E | kept |
| `src/curriculum/__tests__/v054Governance.test.ts` | 112 | converting with no evidence yields an unreportable subscore | E | kept |
| `src/curriculum/__tests__/v054Governance.test.ts` | 135 | partial evidence never yields a scored subscore | E | kept |
| `src/curriculum/__tests__/v054Governance.test.ts` | 263 | the teacher summary never mentions Growth readiness | E | kept |
| `src/curriculum/__tests__/v056Governance.test.ts` | 239 | §12 Growth readiness is derived and currently blocked | E | kept |
| `src/curriculum/__tests__/v056Governance.test.ts` | 240 | no chapter is Growth-eligible | E | kept |
| `src/curriculum/__tests__/v061ContentModel.test.ts` | 272 | has no Class 6 literal anywhere in the formal assessment source | E | kept |
| `src/curriculum/__tests__/v061ContentModel.test.ts` | 306 | imports FormalGrowthAssignment or its derived view, never the legacy type | E | kept |
| `src/curriculum/__tests__/v061ContentModel.test.ts` | 390 | starts at insufficient, because zero questions is a usability fact | E | kept |
| `src/curriculum/__tests__/v061FrameworkEvidence.test.ts` | 76 | states the probability finding precisely | E | kept |
| `src/curriculum/__tests__/v061FrameworkStage.test.ts` | 98 | has no probability competency at Middle Stage | E | kept |
| `src/curriculum/__tests__/v061FrameworkStage.test.ts` | 216 | §21 blueprint availability reads the registry | E | kept |
| `src/curriculum/__tests__/v062Class6Pilot.test.ts` | 311 | keeps instructional practice out of Growth | E | kept |
| `src/curriculum/__tests__/v066Lifecycle.test.ts` | 280 | marks mobile readability as presentation-dependent | E | kept |
| `src/curriculum/__tests__/v067Chapter.test.ts` | 193 | keeps all instructional items out of Growth | E | kept |
| `src/curriculum/__tests__/v068Quality.test.ts` | 325 | §7 the readability audit is broad and honest about its limits | E | kept |
| `src/curriculum/__tests__/v068Quality.test.ts` | 339 | claims no readability grade | E | kept |
| `src/curriculum/__tests__/v068Quality.test.ts` | 444 | §13 the chapter quality summary uses counts and flags, not scores | E | kept |
| `src/curriculum/__tests__/v068Quality.test.ts` | 464 | publishes no composite score anywhere in the summary | E | kept |
| `src/curriculum/__tests__/v070Routes.test.ts` | 143 | §27 chapter availability rolls up from sections | E | kept |
| `src/curriculum/__tests__/v071Consolidation.test.tsx` | 154 | leads with learning, not an assessment | E | kept |
| `src/curriculum/__tests__/v071Consolidation.test.tsx` | 183 | drops prototype and calibration language | E | kept |
| `src/curriculum/__tests__/v071Consolidation.test.tsx` | 192 | growth indicator | E | kept |
| `src/curriculum/__tests__/v071Consolidation.test.tsx` | 247 | leaves Class 6 availability truthful | E | kept |
| `src/curriculum/__tests__/v074Docs.test.ts` | 48 | records the teacher reachability defect rather than quietly fixing it | E | kept |
| `src/curriculum/__tests__/v074Planning.test.ts` | 190 | uses exactly three applicability values, never a silent gap | E | kept |
| `src/curriculum/__tests__/v077StudentUi.test.tsx` | 135 | counts questions worked, never a score | E | kept |
| `src/curriculum/__tests__/v077StudentUi.test.tsx` | 167 | does not call ordinary practice an assessment | E | kept |
| `src/curriculum/__tests__/v0832LiveCurriculum.test.ts` | 218 | the browser title is not the old prototype name | E | kept |
| `src/curriculum/__tests__/v0832LiveCurriculum.test.ts` | 221 | Growth Assessment Prototype | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 44 | calls itself an adaptive assessment | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 45 | calls itself an adaptive growth assessment | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 47 | presents the retired assessment workflow | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 48 | claims ability estimation | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 49 | claims national norms | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 52 | claims RIT equivalence | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 53 | claims norms | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 54 | claims a growth score | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 60 | Assign an assessment | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 94 | keeps the retired assessment loop out of the source, not just off screen | E | kept |
| `src/curriculum/__tests__/v0834ProductTruth.test.tsx` | 98 | Assign an assessment | E | kept |
| `src/curriculum/chapterCatalogue.ts` | 266 | Reference chapter for the Chapter Landing prototype (v0.46 Checkpoint 3). | D | kept |
| `src/curriculum/chapterQuality.ts` | 43 | Some prose was flagged by the advisory readability audit and needs a human read. | D | kept |
| `src/curriculum/competencyFramework.ts` | 44 | PARAKH National Assessment Framework | D | kept |
| `src/curriculum/competencyFramework.ts` | 66 | Analyses and interprets data using statistical concepts AND probability (one goal). | D | kept |
| `src/curriculum/contentAuditLog.ts` | 187 | §7 (advisory readability) | D | kept |
| `src/curriculum/contentAuditLog.ts` | 197 | §7 (advisory readability) | D | kept |
| `src/curriculum/contentAuditLog.ts` | 209 | §7 (advisory readability) | D | kept |
| `src/curriculum/curriculumCrosswalk.ts` | 74 | Assessment Framework, PARAKH Rashtriya Sarvekshan | D | kept |
| `src/curriculum/curriculumCrosswalk.ts` | 353 | Ibid. §9.2: assessment via projects, reflective journals, observation — not short-form testing. | D | kept |
| `src/curriculum/curriculumCrosswalk.ts` | 388 | Data, Statistics & Probability | D | kept |
| `src/curriculum/evidenceProvenance.ts` | 156 | Its stated assessment methods are projects, journals and observation. | D | kept |
| `src/curriculum/evidenceProvenance.ts` | 159 | PARAKH assessment framework review. | D | kept |
| `src/curriculum/frameworkEvidenceGate.ts` | 152 | PARAKH Assessment Framework | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 209 | proposed content domain (merged with Probability) | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 214 | CG-6 covers data interpretation AND probability as ONE goal, with C-6.1 and C-6.2 as siblings. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 218 | Data handling and probability share a reasoning-under-uncertainty core at school level. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 225 | Recorded as sharing a goal with Probability on Secondary CG-6 evidence. At Middle Stage, CG-5 is data only. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 233 | . This is a statement about the Middle CG block and those two textbooks, NOT a claim that probability is absent from Mid | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 245 | NO probability competency exists at Middle Stage. Any Class 6-8 probability claim must be withdrawn, not renumbered. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 301 | Selected-response items can evidence decomposition and pattern recognition partially, but a short form cannot support a  | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 303 | Heavy official emphasis (100 h/yr) versus inability to report it from a short Mathematics form. Schools may expect to se | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 421 | Tag items that elicit CT processes; report no CT score. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 437 | CT is out of scope for short-form Growth entirely. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 445 | Option A. MODERATE confidence. Selected-response items can carry partial CT evidence; what a short form cannot support i | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 454 | should REPORT it as a Growth domain. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 533 | STILL NOT READ: PARAKH Assessment Framework. This remains the | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 534 | strongest unavailable assessment-design evidence and is the | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 535 | principal outstanding Growth blocker. | D | kept |
| `src/curriculum/frameworkFreezeCandidate.ts` | 544 | No domain is reportable as a subscore regardless of blueprint share. | D | kept |
| `src/curriculum/inventory.ts` | 80 | Assessment prototype | D | kept |
| `src/curriculum/inventory.ts` | 81 | Lesson prototype | D | kept |
| `src/curriculum/inventory.ts` | 82 | Partial prototype | D | kept |
| `src/curriculum/inventory.ts` | 83 | Prototype — ready for review | D | kept |
| `src/curriculum/inventory.ts` | 194 | Hand-authored lessons exist but no assessment items. | D | kept |
| `src/curriculum/masterMapDocs.ts` | 203 | Current applicability | D | kept |
| `src/curriculum/ncfStages.ts` | 146 | Develops mathematical thinking and the ability to communicate mathematical ideas logically and precisely | D | kept |
| `src/curriculum/numberPlayAlignment.ts` | 124 | Number lines at several different SCALES, with most positions unlabelled. The work is reading and assigning large-number | D | kept |
| `src/curriculum/officialCompleteness.ts` | 290 | Statistics and Probability | D | kept |
| `src/curriculum/officialCompleteness.ts` | 315 | Statistics and Probability | D | kept |
| `src/curriculum/officialCompleteness.ts` | 331 | Statistics and Probability | D | kept |
| `src/curriculum/officialCurriculum.ts` | 341 | Statistics and Probability | D | kept |
| `src/curriculum/officialCurriculum.ts` | 342 | Introduction to Probability | D | kept |
| `src/curriculum/officialCurriculum.ts` | 344 | Introduction to Probability | D | kept |
| `src/curriculum/officialCurriculum.ts` | 404 | Statistics and Probability | D | kept |
| `src/curriculum/officialCurriculum.ts` | 462 | Statistics and Probability | D | kept |
| `src/curriculum/officialCurriculum.ts` | 505 | Continuity and Differentiability | D | kept |
| `src/curriculum/readabilityAudit.ts` | 292 | Structural counts only. These are not a readability grade and no reading age is claimed. | D | kept |
| `src/curriculum/readiness.ts` | 70 | Prototype lessons | D | kept |
| `src/curriculum/readiness.ts` | 83 | Not eligible for Growth | D | kept |
| `src/curriculum/readiness.ts` | 133 | \\|\\| p.growth === | D | kept |
| `src/curriculum/recommend.ts` | 118 | \\|\\| b.availability === | D | kept |
| `src/curriculum/registry.ts` | 158 | \\|\\| b.availability === | D | kept |
| `src/curriculum/registry.ts` | 280 | India (CBSE / NCERT-informed prototype) | D | kept |
| `src/curriculum/registry.ts` | 281 | v0.26 prototype | D | kept |
| `src/curriculum/registry.ts` | 288 | CBSE/NCERT-informed prototype only. Not an official CBSE alignment. Every alignment statement requires teacher review be | D | kept |
| `src/curriculum/registry.ts` | 352 | Stratified session drawn across every Class 6 Math module. Prototype heuristic router, not a calibrated diagnostic. | D | kept |
| `src/curriculum/reviewFeedbackClassification.ts` | 67 | Re-run the advisory readability audit after changing anything, and record the new counts. Do not treat the audit as evid | D | kept |
| `src/curriculum/reviewFeedbackClassification.ts` | 189 | Age and readability | D | kept |
| `src/curriculum/schema.ts` | 79 | 2025-informed prototype | D | kept |
| `src/curriculum/sectionReviewPackages.ts` | 249 | new mathematical claim — but that is our assessment, not yours, and | D | kept |
| `src/curriculum/validate.ts` | 57 | \\|\\| m.availability === | D | kept |
| `src/data/class7.ts` | 1958 | A fair coin is tossed once. What is the probability of getting HEADS? | E | kept |
| `src/data/class7.ts` | 1973 | A fair six-sided die is rolled. What is the probability of getting a 4? | E | kept |
| `src/data/class7.ts` | 1988 | A fair six-sided die is rolled. What is the probability of getting an EVEN number? | E | kept |
| `src/data/class7.ts` | 2003 | A bag contains 3 red, 4 green, and 5 blue marbles, all the same size. One marble is drawn at random. What is the probabi | E | kept |
| `src/data/class7.ts` | 2018 | A spinner has 8 equal sectors numbered 1–8. What is the probability of the pointer landing on a NUMBER GREATER THAN 5? | E | kept |
| `src/data/class7.ts` | 2033 | The probability of an EVENT is always: | E | kept |
| `src/data/class7.ts` | 2041 | Probability is a number from 0 (impossible) to 1 (certain). It can never be negative or greater than 1. | E | kept |
| `src/data/class7.ts` | 2048 | A fair die is rolled. What is the probability of getting a PRIME number? | E | kept |
| `src/data/class7.ts` | 2063 | A bag has 10 balls: 7 white and 3 black. The probability of drawing a WHITE ball is 7/10. What is the probability of dra | E | kept |
| `src/data/class7.ts` | 2975 | Newspapers and cricket score apps are full of bar graphs. Pick one, decode the axis units, and see how quickly the story | E | kept |
| `src/data/class7.ts` | 3035 | When outcomes are EQUALLY LIKELY, the probability of an event is (favourable outcomes) / (total outcomes). Probabilities | E | kept |
| `src/data/class7.ts` | 3037 | Reteach: simple probability | E | kept |
| `src/data/class7.ts` | 3073 | Reporting probability greater than 1 | E | kept |
| `src/data/class7.ts` | 3076 | Probability is always between 0 and 1. Estimate first; reject any answer outside that range. | E | kept |
| `src/data/class7.ts` | 3083 | Card games, dice games, and weather forecasts are full of probability talk. Ask: "What is the chance of …?" and check by | E | kept |
| `src/data/class7.ts` | 3274 | Applies percent-of and percent-change operators in everyday contexts including discounts, pay rises, and population grow | E | kept |
| `src/data/class7.ts` | 3319 | Basic probability of equally likely outcomes | E | kept |
| `src/data/class7.ts` | 3322 | NCERT / Ganita Prakash Class 7 — Data Handling chapter (probability strand): equally likely outcomes, P(event) = favoura | E | kept |
| `src/data/items.ts` | 2703 | Geeta scored 7/10 in a Maths test and 4/5 in a Science test. By how much did her Science score exceed her Maths score? | E | kept |
| `src/data/lessonSynthesis.ts` | 171 | Prototype starter content — no hand-authored teacher note yet. Suggested: work one item on the board, then hand the clas | E | kept |
| `src/data/lessonSynthesis.ts` | 173 | Prototype starter content — no hand-authored parent note yet. Suggested: ask your child to explain one worked example al | E | kept |
| `src/data/lessons.ts` | 2265 | s score, give x + 5. | E | kept |
| `src/data/lessons.ts` | 2574 | s reading. The "sanity check" rule (acute < 90°, obtuse > 90°) is the single biggest reliability gain. | E | kept |
| `src/data/starterGrades.ts` | 956 | Counting up to 20, single-digit addition, single-digit subtraction. Prototype starter content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 966 | Place value up to 99, two-digit addition and subtraction. Prototype starter content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 976 | Multiplication tables 2–5, simple division, three-digit place value. Prototype starter content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 986 | Introduction to fractions, length/weight, multi-digit multiplication. Prototype starter content, teacher review required | E | kept |
| `src/data/starterGrades.ts` | 996 | Decimal place value, percentage introduction, long division. Prototype starter content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1006 | Operations on rational numbers, one-variable linear equations, squares/cubes and roots. Prototype starter content, teach | E | kept |
| `src/data/starterGrades.ts` | 1016 | Real number classification, polynomial arithmetic, coordinate geometry basics. Prototype starter content, teacher review | E | kept |
| `src/data/starterGrades.ts` | 1026 | HCF/LCM basics, quadratic equations, standard-angle trigonometry. Prototype starter content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1036 | Sets and set operations, functions basics, trigonometric identities. Prototype starter content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1046 | Matrix basics, derivatives of standard functions, definite integrals. Prototype starter content, teacher review required | E | kept |
| `src/data/starterGrades.ts` | 1062 | 2D shape recognition, length comparison, Indian coins. Prototype content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1072 | Repeated addition and tables 2–3, rupees and paise, reading clocks. Prototype content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1082 | Halves, thirds and quarters; 3-digit addition with regrouping; length in metres. Prototype content, teacher review requi | E | kept |
| `src/data/starterGrades.ts` | 1092 | Numbers up to a lakh, division with remainders, tenths and hundredths. Prototype content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1102 | Add/subtract fractions with unlike denominators, perimeter/area of rectangle, reading bar graphs. Prototype content, tea | E | kept |
| `src/data/starterGrades.ts` | 1112 | Area of triangles and parallelograms, bar graphs and pie charts, algebraic identities. Prototype content, teacher review | E | kept |
| `src/data/starterGrades.ts` | 1122 | Solutions of two-variable linear equations, congruence of triangles, mean/median/mode of ungrouped data. Prototype conte | E | kept |
| `src/data/starterGrades.ts` | 1132 | Distance and section formulae, nth term and sum of an AP, tangent-to-circle properties. Prototype content, teacher revie | E | kept |
| `src/data/starterGrades.ts` | 1142 | Imaginary unit and modulus, GP sum formula, slope and equation of a line. Prototype content, teacher review required. | E | kept |
| `src/data/starterGrades.ts` | 1152 | 2×2 and 3×3 determinants, chain rule for derivatives, dot product of vectors. Prototype content, teacher review required | E | kept |
| `src/data/starterGradesFull.ts` | 389 | The probability of an impossible event is: | E | kept |
| `src/data/starterGradesFull.ts` | 390 | Impossible event → probability 0; sure event → probability 1. | E | kept |
| `src/data/starterGradesFull.ts` | 686 | Conditional probability formula. | E | kept |
| `src/data/starterGradesFull.ts` | 689 | Independence: joint probability equals product of marginals. | E | kept |
| `src/data/starterGradesFull.ts` | 698 | Marginal probability | E | kept |
| `src/data/starterGradesFull.ts` | 698 | Reverse conditional probability P(cause \\| effect) | E | kept |
| `src/data/starterGradesFull.ts` | 704 | Any small probability | E | kept |
| `src/data/starterGradesFull.ts` | 704 | Prior probability of an event A means: | E | kept |
| `src/data/starterGradesFull.ts` | 704 | Probability after observing evidence | E | kept |
| `src/data/starterGradesFull.ts` | 704 | Probability before observing new evidence | E | kept |
| `src/data/starterGradesFull.ts` | 704 | Probability of B given A | E | kept |
| `src/data/starterGradesFull.ts` | 707 | A test is 99% sensitive; disease prevalence is 1%. If someone tests positive, the true probability of disease can be: | E | kept |
| `src/data/starterGradesFull.ts` | 714 | Sum of probabilities in a discrete probability distribution: | E | kept |
| `src/data/starterGradesFull.ts` | 715 | All outcomes together must have total probability 1. | E | kept |
| `src/data/starterGradesFull.ts` | 749 | Types and degree of polynomials, zeros and coefficient relations, division algorithm and Remainder/Factor theorems. Prot | E | kept |
| `src/data/starterGradesFull.ts` | 761 | Graphical method, substitution, elimination, consistency and number of solutions. Prototype content, teacher review requ | E | kept |
| `src/data/starterGradesFull.ts` | 773 | Basic Proportionality Theorem, similar triangles criteria, Pythagoras theorem. Prototype content, teacher review require | E | kept |
| `src/data/starterGradesFull.ts` | 785 | Angle of elevation and depression, heights and distances word problems. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 797 | Circumference and area of a circle, area and arc length of a sector, area of a segment. Prototype content, teacher revie | E | kept |
| `src/data/starterGradesFull.ts` | 809 | Surface area of combinations of solids, volumes of combinations, frustum of a cone. Prototype content, teacher review re | E | kept |
| `src/data/starterGradesFull.ts` | 821 | Mean, median, and mode of grouped data. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 832 | Probability (Class 10 — Ch 14) | E | kept |
| `src/data/starterGradesFull.ts` | 833 | Classical probability, simple events, complementary events. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 846 | Types of relations, types of functions, composition and inverse. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 858 | Principal values, standard identities, domain and range. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 870 | Increasing/decreasing functions, maxima and minima, rate of change. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 882 | Area under a curve, area between two curves, definite integral properties. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 894 | Order and degree, variable separable, linear first-order ODEs. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 906 | Direction cosines, equation of a line in 3D, equation of a plane. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 918 | Basics, constraints and objective, graphical solution. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFull.ts` | 929 | Probability (Class 12 — Ch 13) | E | kept |
| `src/data/starterGradesFull.ts` | 930 | Conditional probability, Bayes theorem intuition, random variables. Prototype content, teacher review required. | E | kept |
| `src/data/starterGradesFullG11.ts` | 166 | A student needs at least 40 to pass. They have 25. What must they score more (x)? | E | kept |
| `src/data/starterGradesFullG11.ts` | 345 | The probability of any event is: | E | kept |
| `src/data/starterGradesFullG11.ts` | 348 | The probability of the sample space is: | E | kept |
| `src/data/starterGradesFullG11.ts` | 364 | Complementary probability: P(not A) = ? | E | kept |
| `src/data/starterGradesFullG11.ts` | 374 | A probability value | E | kept |
| `src/data/starterGradesFullG15.ts` | 754 | 5 students scored: 8, 9, 10, 7, 6. Mean: | E | kept |
| `src/data/starterGradesFullG89.ts` | 133 | Probability of any event lies between: | E | kept |
| `src/data/starterGradesFullG89.ts` | 136 | Probability of getting a tail when tossing a fair coin: | E | kept |
| `src/data/starterGradesFullG89.ts` | 139 | Probability of drawing a red card from a standard deck (26 red / 52 total): | E | kept |
| `src/data/starterGradesFullG89.ts` | 142 | Probability of rolling a number greater than 4 on a fair die: | E | kept |
| `src/data/starterGradesFullG89.ts` | 643 | Empirical probability = ? | E | kept |
| `src/data/starterGradesFullG89.ts` | 652 | As more trials happen, empirical probability tends to: | E | kept |
| `src/data/starterGradesFullG89.ts` | 652 | The theoretical probability | E | kept |
| `src/data/starterGradesFullG89.ts` | 676 | Total probability = 1. | E | kept |
| `src/data/starterGradesFullG89.ts` | 679 | Certain = probability 1. | E | kept |
| `src/features/admin/ChapterQualitySummary.tsx` | 47 | Counts and flags only. No quality score is calculated, because | C | kept |
| `src/features/admin/__tests__/v068ReviewerPreview.dom.test.tsx` | 70 | shows counts for every part and no score | E | kept |
| `src/features/admin/reviewNotes.ts` | 40 | Age / readability issue | C | kept |
| `src/features/assessment/AssessmentRouter.ts` | 150 | true ability | D | kept |
| `src/features/assessment/AssessmentRouter.ts` | 151 | calibrated growth | D | kept |
| `src/features/assessment/AssessmentRouter.ts` | 152 | projected score | D | kept |
| `src/features/assessment/AssignmentManagementPanel.tsx` | 80 | No Growth Checks assigned | D | kept |
| `src/features/assessment/AssignmentManagementPanel.tsx` | 83 | Assigned Growth Checks will appear here, with who has started and who | D | kept |
| `src/features/assessment/AssignmentManagementPanel.tsx` | 95 | Growth Checks | D | kept |
| `src/features/assessment/AssignmentManagementPanel.tsx` | 96 | Participation only. A field test produces no scores or results. | D | kept |
| `src/features/assessment/AssignmentManagementPanel.tsx` | 150 | Cancel this Growth Check | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 170 | Pragati Growth — Mathematics | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 181 | Growth readiness has not been checked for this class. It cannot | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 190 | Growth assessment isn&apos;t ready to assign yet | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 205 | Assessment architecture drafted | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 216 | National assessment framework review | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 226 | Why isn&apos;t Growth ready? | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 229 | A Growth Check is meant to tell you where a student is across | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 377 | Your Growth Check is ready | D | kept |
| `src/features/assessment/GrowthAdministration.tsx` | 405 | Growth Check | D | kept |
| `src/features/assessment/__tests__/appRoot.test.tsx` | 161 | cannot assign a formal Growth check with nothing injected | E | kept |
| `src/features/assessment/__tests__/appRoot.test.tsx` | 248 | shows no Growth card when the teacher has assigned nothing | E | kept |
| `src/features/assessment/__tests__/growthAdministration.dom.test.tsx` | 17 | explains unavailability in teacher language, not diagnostics | E | kept |
| `src/features/assessment/__tests__/growthAdministration.dom.test.tsx` | 95 | uses the canonical support model without a blanket comparability claim | E | kept |
| `src/features/assessment/__tests__/growthAdministration.dom.test.tsx` | 110 | §6 Growth appears on Home only when assigned | E | kept |
| `src/features/assessment/__tests__/growthAdministration.dom.test.tsx` | 116 | renders the Growth Check card when assigned | E | kept |
| `src/features/assessment/__tests__/growthAdministration.dom.test.tsx` | 121 | uses child-friendly framing, not assessment jargon | E | kept |
| `src/features/assessment/__tests__/growthAdministration.dom.test.tsx` | 162 | §19 the completion screen reports no score | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 21 | §6 a Growth pool draws only from the secure bank | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 22 | refuses to build from the current bank, which has no Growth items | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 28 | refuses a Growth item with no valid specification | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 36 | ), growthItem( | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 59 | §6 Growth items cannot leak into Learn or Practice | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 72 | §6 Growth administration locks instruction | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 94 | §6 exposure is recorded for Growth administrations | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 95 | increments the growth counter | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 104 | §7 assignment drives whether Growth appears at all | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 106 | , assessmentId: | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 170 | carries the prototype status line | E | kept |
| `src/features/assessment/__tests__/growthSession.test.ts` | 205 | ignores an ability estimate even when one is passed in | E | kept |
| `src/features/assessment/__tests__/itemFormats.test.ts` | 11 | scores a correct and incorrect choice | E | kept |
| `src/features/assessment/__tests__/itemFormats.test.ts` | 40 | scores exact and tolerance matches | E | kept |
| `src/features/assessment/__tests__/itemFormats.test.ts` | 139 | routes each implemented format to its scorer | E | kept |
| `src/features/assessment/__tests__/itemSecurity.test.ts` | 29 | §13 Growth items never reach instructional contexts | E | kept |
| `src/features/assessment/__tests__/itemSecurity.test.ts` | 67 | §13 instructional items never reach a Growth session | E | kept |
| `src/features/assessment/__tests__/itemSecurity.test.ts` | 74 | a Growth pool built from the current bank is empty | E | kept |
| `src/features/assessment/__tests__/itemSecurity.test.ts` | 143 | counts growth and instructional administrations separately | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 100 | §12 a Growth item cannot exist without a specification | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 101 | refuses a Growth item with no specificationId | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 108 | refuses a Growth item whose specification does not resolve | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 115 | refuses a Growth item whose specification is for another use | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 124 | accepts a Growth item with a matching valid specification | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 186 | growth readiness is never inferred from practice readiness | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 192 | rejects a calibrated or operational growth claim | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 206 | every student availability label is plain language | E | kept |
| `src/features/assessment/__tests__/itemSpecification.test.ts` | 225 | never reveals Growth readiness to a student | E | kept |
| `src/features/assessment/__tests__/router.test.ts` | 61 | starts at the configured ability | E | kept |
| `src/features/assessment/__tests__/v052Integrity.test.ts` | 81 | instructional exposure permanently blocks Growth use | E | kept |
| `src/features/assessment/__tests__/v052Integrity.test.ts` | 97 | an instructional item can never be Growth-eligible | E | kept |
| `src/features/assessment/__tests__/v052Integrity.test.ts` | 109 | a field-test item cannot enter operational Growth | E | kept |
| `src/features/assessment/__tests__/v052Integrity.test.ts` | 132 | operational Growth is disabled at product level | E | kept |
| `src/features/assessment/__tests__/v052Integrity.test.ts` | 390 | overall comparability takes the most cautious status used | E | kept |
| `src/features/assessment/__tests__/v057Pipeline.test.ts` | 64 | refuses when no formal Growth items exist — the real product state | E | kept |
| `src/features/assessment/__tests__/v058Endtoend.test.ts` | 411 | completion yields field-test evidence with NO score | E | kept |
| `src/features/assessment/__tests__/v059AppIntegration.test.tsx` | 143 | §17 the right student sees the Growth Check | E | kept |
| `src/features/assessment/__tests__/v059AppIntegration.test.tsx` | 290 | completing the frozen form yields a score-free completion screen | E | kept |
| `src/features/assessment/__tests__/v060Integrity.test.tsx` | 292 | no scores or results | E | kept |
| `src/features/assessment/assessmentAssembler.ts` | 303 | The item bank cannot satisfy this blueprint. The assessment was NOT assembled — constraints are never relaxed to produce | D | kept |
| `src/features/assessment/assessmentAssembler.ts` | 374 | v0.58: checked before assembly in prepareGrowthAdministration. | D | kept |
| `src/features/assessment/assessmentGovernance.ts` | 217 | Widely used and generally accepted, but comparability for THIS instrument is an empirical question until field-test data | D | kept |
| `src/features/assessment/formalSessionRunner.ts` | 284 | Pilot field test. These responses are research evidence for item calibration and produce no achievement, mastery, or gro | D | kept |
| `src/features/assessment/growthEligibility.ts` | 133 | Item has instructional exposure recorded; it is permanently ineligible for Growth use. | D | kept |
| `src/features/assessment/growthEligibility.ts` | 165 | No permitted format of this specification has a scorer. | D | kept |
| `src/features/assessment/growthEligibility.ts` | 260 | Operational Growth administration is disabled. It requires calibrated items, and Pragati has completed no field test or  | D | kept |
| `src/features/assessment/growthReadiness.ts` | 72 | No secure Growth items authored. | D | kept |
| `src/features/assessment/growthSession.ts` | 122 | No Growth items are available. Pragati has no authored Growth item bank yet. | D | kept |
| `src/features/assessment/growthSession.ts` | 125 | See docs/PRAGATI_GROWTH_ASSESSMENT_SPEC.md. | D | kept |
| `src/features/assessment/growthSession.ts` | 134 | Growth items are missing valid specifications. | D | kept |
| `src/features/assessment/growthSession.ts` | 142 | The Growth item bank is too small for this assessment. | D | kept |
| `src/features/assessment/growthSession.ts` | 241 | Prototype diagnostic evidence — not yet psychometrically calibrated. | D | kept |
| `src/features/assessment/growthSession.ts` | 275 | This is not a calibrated assessment. The questions have not been field tested or analysed. | D | kept |
| `src/features/assessment/growthSession.ts` | 276 | No score, percentile, grade equivalent, or growth measure can be reported. | D | kept |
| `src/features/assessment/growthSession.ts` | 292 | calibrated ability | D | kept |
| `src/features/assessment/growthSession.ts` | 293 | ability estimate | D | kept |
| `src/features/assessment/growthSession.ts` | 295 | growth score | D | kept |
| `src/features/assessment/itemSpecification.ts` | 218 | fieldTestEligible but no permitted format has a scorer | D | kept |
| `src/features/assessment/itemUse.ts` | 47 | Growth — field test | D | kept |
| `src/features/assessment/itemUse.ts` | 48 | Growth — operational | D | kept |
| `src/features/assessment/itemUse.ts` | 195 | Instructional items cannot be promoted to operational Growth use: their exposure is unbounded and unrecorded, so respons | D | kept |
| `src/features/assessment/itemUse.ts` | 209 | This item has instructional exposure recorded and is permanently ineligible for operational Growth use. | D | kept |
| `src/features/assessment/itemUse.ts` | 215 | Automatic promotion to operational Growth use is not implemented. Promotion is a deliberate, human, post-calibration dec | D | kept |
| `src/features/assessment/pilotFrameworkAuthorization.ts` | 125 | The assessment framework has not been finalised yet, so a pilot form cannot be created. | D | kept |
| `src/features/assessment/prepareGrowthAdministration.ts` | 252 | 0 formal Growth items authored. | D | kept |
| `src/features/assessment/rationalNumberSpecifications.ts` | 240 | Dichotomous for single_select. Ordering format is authored but NOT administrable until an ordering scorer exists. | D | kept |
| `src/features/assessment/reportableScales.ts` | 62 | precision / reliability evidence | D | kept |
| `src/features/assessment/reportableScales.ts` | 64 | interpretability evidence | D | kept |
| `src/features/legacy/Class6MathDashboard.tsx` | 120 | Pick a module to learn or assess one skill at a time, or run a Mixed Class 6 Math Assessment that draws across every mod | D | kept |
| `src/features/legacy/Class6MathDashboard.tsx` | 128 | Take the Mixed Class 6 Math Assessment | D | kept |
| `src/features/legacy/Class6MathDashboard.tsx` | 151 | The content here is a prototype, not a published curriculum. Status | D | kept |
| `src/features/legacy/ModuleDashboard.tsx` | 135 | The lessons here are content drafts for a prototype, not a published | D | kept |
| `src/features/legacy/ModuleDashboard.tsx` | 162 | Status pips are a prototype signal from session history on this device | D | kept |
| `src/features/legacy/ModuleDashboard.tsx` | 305 | Start assessment | D | kept |
| `src/features/session/__tests__/chapterSession.test.ts` | 141 | differ in hint availability | E | kept |
| `src/features/session/__tests__/integrity.test.ts` | 114 | , chosenIndex: 0, correct: true, timeMs: 1, difficultyAtAttempt: 3, abilityBefore: 5, abilityAfter: 6, misconceptionTrig | E | kept |
| `src/features/session/__tests__/integrity.test.ts` | 115 | , chosenIndex: 0, correct: true, timeMs: 1, difficultyAtAttempt: 3, abilityBefore: 6, abilityAfter: 6, misconceptionTrig | E | kept |
| `src/features/student/StudentHomeView.tsx` | 177 | Continue your Growth Check | A | kept |
| `src/features/student/StudentHomeView.tsx` | 178 | Your Math Growth Check is ready | A | kept |
| `src/features/student/__tests__/accessibility.dom.test.tsx` | 96 | §13 focus visibility and keyboard reachability | E | kept |
| `src/features/student/__tests__/ageStageAndCopy.dom.test.tsx` | 77 | Prototype — ready for review | E | kept |
| `src/features/student/__tests__/growthCard.dom.test.tsx` | 31 | §9 the Growth Check card appears only when assigned | E | kept |
| `src/features/student/__tests__/growthCard.dom.test.tsx` | 62 | uses child-friendly wording, not assessment jargon | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 69 | leaks no formal Growth into low-stakes practice | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 71 | Growth Check | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 71 | Pragati Growth | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 176 | forbids Growth leakage on the student practice contract | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 178 | Pragati Growth | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 182 | requires the Assess screen to name itself as formal Growth | E | kept |
| `src/features/student/__tests__/v074Practice.dom.test.tsx` | 187 | Pragati Growth | E | kept |
| `src/features/student/__tests__/v078AssignmentEndToEnd.test.tsx` | 77 | does not let an assignment impersonate a Growth Check | E | kept |
| `src/features/teacher/ReadinessMatrix.tsx` | 107 | : p.growth === | B | kept |
| `src/features/teacher/ReadinessMatrix.tsx` | 175 | Track curriculum mapping, learning content, practice, and Growth readiness for each Pragati unit. A unit can be ready to | B | kept |
| `src/features/teacher/ReadinessMatrix.tsx` | 273 | Growth not eligible | B | kept |
| `src/features/teacher/TeacherInsightsBody.tsx` | 131 | No mastery or ability score. | B | kept |
| `src/features/teacher/TeacherInsightsBody.tsx` | 139 | No class-level growth. | B | kept |
| `src/features/teacher/TeacherStudentDetail.tsx` | 216 | Growth history | B | kept |
| `src/features/teacher/TeacherStudentDetail.tsx` | 219 | Prototype · not calibrated | B | kept |
| `src/features/teacher/__tests__/teacherResources.dom.test.tsx` | 124 | reports skills, questions, lessons, worked examples, misconceptions, assessment, and printables | E | kept |
| `src/features/teacher/__tests__/v0781Populated.test.tsx` | 20 | §4 the roster makes no ability or proficiency claim | E | kept |
| `src/features/teacher/__tests__/v078Assign.test.tsx` | 23 | §9 Assign is about learning, not the old assessment prototype | E | kept |
| `src/features/teacher/__tests__/v078Assign.test.tsx` | 24 | no longer calls the screen or its output an assessment card | E | kept |
| `src/features/teacher/__tests__/v078Assign.test.tsx` | 39 | §12 Growth stays separate and stays frozen | E | kept |
| `src/features/teacher/__tests__/v078Assign.test.tsx` | 40 | names Growth only to say it is not assigned here | E | kept |
| `src/features/teacher/__tests__/v078Assign.test.tsx` | 42 | Pragati Growth | E | kept |
| `src/features/teacher/__tests__/v078TeacherProduct.test.tsx` | 19 | makes no growth, mastery or diagnosis claim | E | kept |
| `src/features/teacher/__tests__/v078TeacherProduct.test.tsx` | 33 | the roster does not promise growth history | E | kept |
| `src/features/teacher/reviewAdjudication.ts` | 23 | Assessment / measurement specialist | B | kept |
| `src/lib/i18n.ts` | 29 | Pragati — Growth Assessment | D | kept |
| `src/lib/i18n.ts` | 31 | A CBSE / NCERT-informed prototype. Not a calibrated assessment. Teacher review required before pilot use. | D | kept |
| `src/lib/i18n.ts` | 32 | Start assessment | D | kept |
| `src/lib/i18n.ts` | 34 | Pick an assessment | D | kept |
| `src/lib/pilotReport.ts` | 475 | Note: Pragati is a CBSE/NCERT-informed prototype. Not an official CBSE alignment, | D | kept |
| `src/lib/pilotReport.ts` | 476 | not a calibrated assessment. Teacher review required before any pilot decisions. | D | kept |
| `src/lib/productPositioning.ts` | 10 | Pragati is a Mathematics learning and practice platform for Indian schools, with an adaptive assessment system under dev | D | kept |
| `src/lib/productPositioning.ts` | 19 | An assessment framework under development, with published limitations. | D | kept |
| `src/lib/productPositioning.ts` | 22 | A validated Growth assessment. | D | kept |
| `src/lib/productPositioning.ts` | 23 | An Indian MAP, or equivalence with any commercial assessment. | D | kept |
| `src/lib/productPositioning.ts` | 24 | Nationally normed results. | D | kept |
| `src/lib/productPositioning.ts` | 25 | Measurement of true growth. | D | kept |
| `src/lib/productPositioning.ts` | 26 | Psychometrically calibrated scores. | D | kept |
| `src/lib/productPositioning.ts` | 34 | validated growth | D | kept |
| `src/lib/productPositioning.ts` | 35 | nationally normed | D | kept |
| `src/lib/productPositioning.ts` | 37 | measures true growth | D | kept |
| `src/lib/progression.ts` | 39 | At least 5 attempts and accuracy is 70% or higher on this device. Prototype signal — not a calibrated mastery claim. | D | kept |
| `src/lib/progression.ts` | 264 | Solid across the whole Class 6 Math prototype on this device. | D | kept |
| `src/lib/scoring.ts` | 275 | Across the Fractions Module, the basics (visualising, equivalence, like denominators) are not yet stable. Strong candida | D | kept |
| `src/lib/scoring.ts` | 281 | Fluent across the Fractions module on this prototype. Appropriate to bridge to multiplication / division of fractions. | D | kept |
| `src/lib/scoring.ts` | 467 | Across Geometry Basics, the basic objects (points, lines, rays) and the angle types are not yet stable. Revisit GB.01 an | D | kept |
| `src/lib/scoring.ts` | 473 | Fluent across Geometry Basics on this prototype. Appropriate to begin perimeter / area / construction work in later grad | D | kept |
| `src/lib/scoring.ts` | 477 | Across the whole Class 6 Math prototype, basics in multiple modules are not yet stable. Use the per-module / per-skill b | D | kept |
| `src/lib/scoring.ts` | 483 | Fluent across the whole Class 6 Math prototype on this device. Appropriate to begin bridging to harder topics. | D | kept |
| `src/lib/scoring.ts` | 628 | Some progress; slips on even-count median and on probability complements. | D | kept |
| `src/lib/scoring.ts` | 630 | Fluent across graphs, mean/median/mode, and basic probability. | D | kept |
| `src/lib/scoring.ts` | 640 | Foundational on this prototype starter session — needs teacher review before any pilot use. | D | kept |
| `src/lib/scoring.ts` | 641 | Developing on this prototype starter session — needs teacher review before any pilot use. | D | kept |
| `src/lib/scoring.ts` | 642 | On track on this prototype starter session — needs teacher review before any pilot use. | D | kept |
| `src/lib/scoring.ts` | 643 | Advanced on this prototype starter session — needs teacher review before any pilot use. | D | kept |
| `src/lib/scoring.ts` | 1065 | Equivalent fractions (for simplifying probability fractions) | D | kept |
| `src/lib/scoring.ts` | 1257 | Confidence is moderate (still not a calibrated growth measurement). | D | kept |
| `src/lib/storage.ts` | 423 | CBSE/NCERT-informed prototype — mapped to a draft skill framework. | D | kept |
| `src/lib/storage.ts` | 424 | NOT an official CBSE alignment, NOT a calibrated assessment, NOT a teacher-validated mapping. | D | kept |
| `src/lib/workflow.ts` | 147 | Assign an assessment | D | kept |
| `src/lib/workflow.ts` | 256 | At least one assessment assigned | D | kept |
| `src/types.ts` | 31 | First assessment of the year. Establishes a starting point so later sessions can be compared against it. | E | kept |
| `src/types.ts` | 33 | Mid-year check-in. Useful for spotting drift or growth since the baseline. | E | kept |
| `src/types.ts` | 37 | Practice attempt. Useful for the student, but you may want to exclude it from growth comparisons. | E | kept |
| `src/types.ts` | 663 | Probability (Class 10 · Ch 14) | E | kept |
| `src/types.ts` | 671 | Probability (Class 12 · Ch 13) | E | kept |
| `src/types.ts` | 687 | Probability (Class 9 · Ch 15) | E | kept |
| `src/types.ts` | 697 | Probability (Class 11 · Ch 16) | E | kept |
| `src/types.ts` | 747 | Prototype starter — counting up to 20, single-digit addition, single-digit subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 749 | Prototype starter — place value up to 99, two-digit addition and subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 751 | Prototype starter — multiplication tables 2–5, simple division, three-digit place value. Teacher review required. | E | kept |
| `src/types.ts` | 753 | Prototype starter — introduction to fractions, length and weight, multi-digit multiplication. Teacher review required. | E | kept |
| `src/types.ts` | 755 | Prototype starter — decimal place value, introduction to percentage, long division. Teacher review required. | E | kept |
| `src/types.ts` | 757 | Prototype starter — operations on rational numbers, one-variable linear equations, squares/cubes and roots. Teacher revi | E | kept |
| `src/types.ts` | 759 | Prototype starter — real number classification, polynomial arithmetic, coordinate geometry basics. Teacher review requir | E | kept |
| `src/types.ts` | 761 | Prototype starter — HCF/LCM, quadratic equations, basic trigonometry. Teacher review required. | E | kept |
| `src/types.ts` | 763 | Prototype starter — sets and operations, functions basics, trigonometric identities. Teacher review required. | E | kept |
| `src/types.ts` | 765 | Prototype starter — matrix basics, derivatives of standard functions, definite integrals. Teacher review required. | E | kept |
| `src/types.ts` | 767 | Prototype module 2 — 2D shapes recognition, length comparison, Indian coins. Teacher review required. | E | kept |
| `src/types.ts` | 769 | Prototype module 2 — repeated addition and tables of 2 and 3, money in rupees and paise, reading clocks. Teacher review  | E | kept |
| `src/types.ts` | 771 | Prototype module 2 — halves, thirds and quarters; 3-digit addition and subtraction with regrouping; length in meters. Te | E | kept |
| `src/types.ts` | 773 | Prototype module 2 — numbers up to a lakh, division with remainders, tenths and hundredths as decimals. Teacher review r | E | kept |
| `src/types.ts` | 775 | Prototype module 2 — addition/subtraction of fractions with unlike denominators, perimeter and area of rectangle, readin | E | kept |
| `src/types.ts` | 777 | Prototype module 2 — area of triangles and parallelograms, bar graphs and pie charts, algebraic identities. Teacher revi | E | kept |
| `src/types.ts` | 779 | Prototype module 2 — solutions of linear equations in two variables, congruence of triangles, mean/median/mode of ungrou | E | kept |
| `src/types.ts` | 781 | Prototype module 2 — distance and section formulae, nth term and sum of an AP, tangent-to-circle properties. Teacher rev | E | kept |
| `src/types.ts` | 783 | Prototype module 2 — imaginary unit and modulus of complex numbers, GP sum formula, slope and equation of a line. Teache | E | kept |
| `src/types.ts` | 785 | Prototype module 2 — 2×2 and 3×3 determinants, chain rule for derivatives, dot product of vectors. Teacher review requir | E | kept |
| `src/types.ts` | 787 | Prototype content — types and degree of polynomials, zeros and coefficient relations, division algorithm and Remainder/F | E | kept |
| `src/types.ts` | 788 | Prototype content — solving pair of linear equations graphically, by substitution and elimination; consistency condition | E | kept |
| `src/types.ts` | 789 | Prototype content — Basic Proportionality Theorem, criteria for similar triangles, Pythagoras theorem. Teacher review re | E | kept |
| `src/types.ts` | 790 | Prototype content — angles of elevation and depression, heights and distances word problems. Teacher review required. | E | kept |
| `src/types.ts` | 791 | Prototype content — circumference and area of a circle, sector area and arc length, segment area. Teacher review require | E | kept |
| `src/types.ts` | 792 | Prototype content — surface area of combinations of solids, volume of combinations, frustum of a cone. Teacher review re | E | kept |
| `src/types.ts` | 793 | Prototype content — mean, median, and mode of grouped data. Teacher review required. | E | kept |
| `src/types.ts` | 794 | Prototype content — classical probability, sample spaces, complementary events. Teacher review required. | E | kept |
| `src/types.ts` | 795 | Prototype content — types of relations, types of functions, composition and inverse of functions. Teacher review require | E | kept |
| `src/types.ts` | 796 | Prototype content — principal values, standard identities, domain and range of inverse trig functions. Teacher review re | E | kept |
| `src/types.ts` | 797 | Prototype content — increasing/decreasing functions, maxima and minima, rate of change. Teacher review required. | E | kept |
| `src/types.ts` | 798 | Prototype content — area under a curve, area between two curves, properties of definite integrals. Teacher review requir | E | kept |
| `src/types.ts` | 799 | Prototype content — order and degree of ODEs, variable separable, linear first-order ODEs. Teacher review required. | E | kept |
| `src/types.ts` | 800 | Prototype content — direction cosines, equation of a line in 3D, equation of a plane. Teacher review required. | E | kept |
| `src/types.ts` | 801 | Prototype content — linear programming basics, constraints and objectives, graphical solution. Teacher review required. | E | kept |
| `src/types.ts` | 802 | Prototype content — conditional probability, Bayes theorem intuition, random variables and distributions. Teacher review | E | kept |
| `src/types.ts` | 804 | Prototype content — angle sum, types of quadrilaterals, parallelogram properties. Teacher review required. | E | kept |
| `src/types.ts` | 805 | Prototype content — histograms, pie chart interpretation, introduction to probability. Teacher review required. | E | kept |
| `src/types.ts` | 806 | Prototype content — percent change, profit/loss, SI and CI. Teacher review required. | E | kept |
| `src/types.ts` | 807 | Prototype content — multiplication of algebraic expressions, standard identities, factorisation basics. Teacher review r | E | kept |
| `src/types.ts` | 808 | Prototype content — area of trapezium, surface area and volume of cube and cuboid. Teacher review required. | E | kept |
| `src/types.ts` | 809 | Prototype content — positive integer exponents, negative exponents, scientific notation. Teacher review required. | E | kept |
| `src/types.ts` | 810 | Prototype content — direct proportion, inverse proportion, proportion word problems. Teacher review required. | E | kept |
| `src/types.ts` | 811 | Prototype content — bar and line graphs, coordinate axes, plotting points. Teacher review required. | E | kept |
| `src/types.ts` | 812 | Prototype content — angle pairs, parallel lines and transversal, extended triangle angle sum. Teacher review required. | E | kept |
| `src/types.ts` | 813 | Prototype content — parallelogram properties, rhombus and rectangle, midpoint theorem. Teacher review required. | E | kept |
| `src/types.ts` | 814 | Prototype content — parallelograms and triangles on same base and same parallels, area proofs. Teacher review required. | E | kept |
| `src/types.ts` | 815 | Prototype content — chords and arcs, cyclic quadrilaterals, angle in semicircle. Teacher review required. | E | kept |
| `src/types.ts` | 816 | Prototype content — semiperimeter, Heron's formula, area of a quadrilateral via triangulation. Teacher review required. | E | kept |
| `src/types.ts` | 817 | Prototype content — cube, cuboid, cylinder, cone, sphere and hemisphere. Teacher review required. | E | kept |
| `src/types.ts` | 818 | Prototype content — empirical probability, coin and die probability, probability from experimental data. Teacher review  | E | kept |
| `src/types.ts` | 819 | Prototype content — Euclid's axioms and postulates, rationalisation of surds. Teacher review required. | E | kept |
| `src/types.ts` | 821 | Prototype content — Cartesian product, relations vs functions, composition of functions. Teacher review required. | E | kept |
| `src/types.ts` | 822 | Prototype content — radian and degree measure, standard trig values, sum/difference and double-angle formulas. Teacher r | E | kept |
| `src/types.ts` | 823 | Prototype content — solving linear inequalities, graphing solutions, inequality word problems. Teacher review required. | E | kept |
| `src/types.ts` | 824 | Prototype content — counting principle, permutations, combinations. Teacher review required. | E | kept |
| `src/types.ts` | 825 | Prototype content — binomial expansion, general term, Pascal's triangle. Teacher review required. | E | kept |
| `src/types.ts` | 826 | Prototype content — circle equations, parabola, ellipse and hyperbola basics. Teacher review required. | E | kept |
| `src/types.ts` | 827 | Prototype content — concept of limit, derivative as a limit, derivative rules (sum/power/product). Teacher review requir | E | kept |
| `src/types.ts` | 828 | Prototype content — axiomatic probability, addition rule, sample spaces and events. Teacher review required. | E | kept |
| `src/types.ts` | 830 | Prototype content — numbers 21-50, 51-99, and number names. Teacher review required. | E | kept |
| `src/types.ts` | 831 | Prototype content — addition and subtraction up to 50; skip counting by 2s, 5s, 10s. Teacher review required. | E | kept |
| `src/types.ts` | 832 | Prototype content — parts of the day, days of the week, months of the year. Teacher review required. | E | kept |
| `src/types.ts` | 833 | Prototype content — heavy/light, full/empty, non-standard length units. Teacher review required. | E | kept |
| `src/types.ts` | 834 | Prototype content — place value to 999, 3-digit addition and subtraction (no regrouping). Teacher review required. | E | kept |
| `src/types.ts` | 835 | Prototype content — multiplication tables 4, 5, and 10; division as equal sharing. Teacher review required. | E | kept |
| `src/types.ts` | 836 | Prototype content — half/quarter, length in cm/m, weight in g/kg. Teacher review required. | E | kept |
| `src/types.ts` | 837 | Prototype content — capacity in mL/L, pictographs, basic 3D shapes. Teacher review required. | E | kept |
| `src/types.ts` | 838 | Prototype content — place value to 10,000, 4-digit addition and subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 839 | Prototype content — tables of 6, 7, 8, 9 and division using the tables. Teacher review required. | E | kept |
| `src/types.ts` | 840 | Prototype content — fractions on number line, hours and minutes, money problems. Teacher review required. | E | kept |
| `src/types.ts` | 841 | Prototype content — weight in g/kg, basic bar graphs, number patterns. Teacher review required. | E | kept |
| `src/types.ts` | 842 | Prototype content — numbers up to 99,999, long multiplication (2×2 digit), long division (3÷1). Teacher review required. | E | kept |
| `src/types.ts` | 843 | Prototype content — equivalent fractions, same-denominator addition/subtraction, decimal arithmetic to tenths. Teacher r | E | kept |
| `src/types.ts` | 844 | Prototype content — perimeter, area of rectangles, lines of symmetry. Teacher review required. | E | kept |
| `src/types.ts` | 845 | Prototype content — calendar (year/leap year/weeks), money word problems, tally and simple tables. Teacher review requir | E | kept |
| `src/types.ts` | 846 | Prototype content — Indian large number system, HCF and LCM introduction. Teacher review required. | E | kept |
| `src/types.ts` | 847 | Prototype content — decimal ×/÷ and fraction multiplication. Teacher review required. | E | kept |
| `src/types.ts` | 848 | Prototype content — percent of a quantity, informal volume of cuboid, types of angles. Teacher review required. | E | kept |
| `src/types.ts` | 849 | Prototype content — mean, bar graph reading, mixed-operation word problems. Teacher review required. | E | kept |
| `src/types.ts` | 914 | Basic probability of equally likely outcomes | E | kept |
| `src/types.ts` | 965 | Classical probability and sample space | E | kept |
| `src/types.ts` | 965 | Probability of simple events | E | kept |
| `src/types.ts` | 973 | Conditional probability | E | kept |
| `src/types.ts` | 976 | Introduction to probability | E | kept |
| `src/types.ts` | 989 | Coin and die probability | E | kept |
| `src/types.ts` | 989 | Empirical probability | E | kept |
| `src/types.ts` | 989 | Experimental data probability | E | kept |
| `src/types.ts` | 1013 | Axiomatic probability | E | kept |
| `src/types.ts` | 1014 | Addition rule of probability | E | kept |
| `src/types.ts` | 1133 | DH.03 — Basic probability | E | kept |
| `src/types.ts` | 1292 | Adaptive session drawn only from the FR.02 bank (reading and representing fractions on visual models). | E | kept |
| `src/types.ts` | 1294 | Adaptive session drawn only from the FR.03 bank (equivalent fractions and simplifying). | E | kept |
| `src/types.ts` | 1296 | Adaptive session drawn only from the FR.04 bank (mixed numbers and improper fractions). | E | kept |
| `src/types.ts` | 1298 | Adaptive session drawn only from the FR.05 bank (adding and subtracting with like denominators). | E | kept |
| `src/types.ts` | 1300 | Adaptive session drawn only from the FR.06 bank (adding fractions with unlike denominators). | E | kept |
| `src/types.ts` | 1302 | Adaptive session drawn only from the FR.07 bank (subtracting fractions with unlike denominators). | E | kept |
| `src/types.ts` | 1304 | Adaptive session drawn only from the FR.08 bank (multi-step word problems on fractions). | E | kept |
| `src/types.ts` | 1306 | Adaptive session drawn only from the DE.01 bank (decimal place value). | E | kept |
| `src/types.ts` | 1308 | Adaptive session drawn only from the DE.02 bank (converting between fractions and decimals). | E | kept |
| `src/types.ts` | 1310 | Adaptive session drawn only from the DE.03 bank (comparing and ordering decimals). | E | kept |
| `src/types.ts` | 1312 | Adaptive session drawn only from the DE.04 bank (adding and subtracting decimals). | E | kept |
| `src/types.ts` | 1314 | Adaptive session drawn only from the DE.05 bank (decimal word problems). | E | kept |
| `src/types.ts` | 1316 | Adaptive session drawn only from the FM.03 bank (prime and composite numbers). | E | kept |
| `src/types.ts` | 1318 | Adaptive session drawn only from the FM.04 bank (divisibility rules for 2, 3, 4, 5, 6, 9, 10). | E | kept |
| `src/types.ts` | 1320 | Adaptive session drawn only from the FM.06 bank (Highest Common Factor). | E | kept |
| `src/types.ts` | 1322 | Adaptive session drawn only from the FM.07 bank (Lowest Common Multiple). | E | kept |
| `src/types.ts` | 1324 | Adaptive session drawn only from the FM.08 bank (HCF / LCM word problems). | E | kept |
| `src/types.ts` | 1326 | Adaptive session drawn only from the RP.01 bank (concept of ratio). | E | kept |
| `src/types.ts` | 1328 | Adaptive session drawn only from the RP.02 bank (equivalent ratios). | E | kept |
| `src/types.ts` | 1330 | Adaptive session drawn only from the RP.03 bank (proportion: a:b :: c:d). | E | kept |
| `src/types.ts` | 1332 | Adaptive session drawn only from the RP.04 bank (unitary method). | E | kept |
| `src/types.ts` | 1334 | Adaptive session drawn only from the RP.05 bank (ratio and proportion word problems). | E | kept |
| `src/types.ts` | 1336 | Adaptive session drawn only from the AL.01 bank (variables as unknowns). | E | kept |
| `src/types.ts` | 1338 | Adaptive session drawn only from the AL.02 bank (writing and reading simple algebraic expressions). | E | kept |
| `src/types.ts` | 1340 | Adaptive session drawn only from the AL.03 bank (evaluating expressions for given values). | E | kept |
| `src/types.ts` | 1342 | Adaptive session drawn only from the AL.04 bank (one-step equations like x + 3 = 7). | E | kept |
| `src/types.ts` | 1344 | Adaptive session drawn only from the AL.05 bank (word problems leading to one-step equations). | E | kept |
| `src/types.ts` | 1346 | Adaptive session drawn only from the GB.01 bank (points, lines, line segments, rays). | E | kept |
| `src/types.ts` | 1348 | Adaptive session drawn only from the GB.02 bank (parallel and intersecting lines). | E | kept |
| `src/types.ts` | 1350 | Adaptive session drawn only from the GB.03 bank (acute, right, obtuse, straight, and reflex angles). | E | kept |
| `src/types.ts` | 1352 | Adaptive session drawn only from the GB.04 bank (measuring and drawing angles with a protractor). | E | kept |
| `src/types.ts` | 1354 | Adaptive session drawn only from the GB.05 bank (classifying triangles by side length and by angle type). | E | kept |
| `src/types.ts` | 1356 | Adaptive session drawn only from the GB.06 bank (squares, rectangles, parallelograms, rhombuses, trapeziums, and basic p | E | kept |
| `src/types.ts` | 1358 | Adaptive session drawn only from the GB.07 bank (centre, radius, diameter, chord, and arc of a circle). | E | kept |
| `src/types.ts` | 1360 | Adaptive session drawn only from the GB.08 bank (lines of symmetry in plane figures and simple shapes). | E | kept |
| `src/types.ts` | 1362 | Adaptive session drawn only from the GB.09 bank (axes, origin, and plotting points in the first quadrant). | E | kept |
| `src/types.ts` | 1365 | Adaptive session drawn only from the IR.01 bank (adding and subtracting integers with sign rules). | E | kept |
| `src/types.ts` | 1367 | Adaptive session drawn only from the IR.02 bank (multiplying and dividing integers with sign rules). | E | kept |
| `src/types.ts` | 1369 | Adaptive session drawn only from the IR.03 bank (introduction to rational numbers — representing, ordering, basic arithm | E | kept |
| `src/types.ts` | 1371 | Adaptive session drawn only from the FE.01 bank (multiplying and dividing fractions, including by whole numbers). | E | kept |
| `src/types.ts` | 1373 | Adaptive session drawn only from the FE.02 bank (multiplying and dividing decimals by 10, 100, 1000). | E | kept |
| `src/types.ts` | 1375 | Adaptive session drawn only from the FE.03 bank (decimal arithmetic to the thousandths place). | E | kept |
| `src/types.ts` | 1377 | Adaptive session drawn only from the AE.01 bank (combining like terms in algebraic expressions). | E | kept |
| `src/types.ts` | 1379 | Adaptive session drawn only from the AE.02 bank (evaluating expressions with positive and negative values). | E | kept |
| `src/types.ts` | 1381 | Adaptive session drawn only from the AE.03 bank (light two-step equations like 2x + 3 = 11). | E | kept |
| `src/types.ts` | 1384 | Adaptive session drawn only from the LA.01 bank (complementary, supplementary, vertically opposite, and linear-pair angl | E | kept |
| `src/types.ts` | 1386 | Adaptive session drawn only from the LA.02 bank (corresponding, alternate, and co-interior angles on parallel lines cut  | E | kept |
| `src/types.ts` | 1388 | Adaptive session drawn only from the LA.03 bank (angle sum property of a triangle and exterior-angle reasoning). | E | kept |
| `src/types.ts` | 1390 | Adaptive session drawn only from the CQ.01 bank (converting fluently between fractions, decimals, and percentages). | E | kept |
| `src/types.ts` | 1392 | Adaptive session drawn only from the CQ.02 bank (finding a percentage of a quantity and reasoning about percent increase | E | kept |
| `src/types.ts` | 1394 | Adaptive session drawn only from the CQ.03 bank (simple interest, and profit / loss percent in everyday contexts). | E | kept |
| `src/types.ts` | 1396 | Adaptive session drawn only from the DH.01 bank (reading pictographs, bar graphs, and double-bar graphs). | E | kept |
| `src/types.ts` | 1398 | Adaptive session drawn only from the DH.02 bank (computing and interpreting the mean, median, and mode of small datasets | E | kept |
| `src/types.ts` | 1400 | Adaptive session drawn only from the DH.03 bank (basic probability of equally likely outcomes — coins, dice, simple spin | E | kept |
| `src/types.ts` | 1409 | Prototype starter session on Class 1 Counting up to 20. Teacher review required. | E | kept |
| `src/types.ts` | 1410 | Prototype starter session on Class 1 Single-digit addition. Teacher review required. | E | kept |
| `src/types.ts` | 1411 | Prototype starter session on Class 1 Single-digit subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 1412 | Prototype starter session on Class 2 Place value up to 99. Teacher review required. | E | kept |
| `src/types.ts` | 1413 | Prototype starter session on Class 2 Two-digit addition. Teacher review required. | E | kept |
| `src/types.ts` | 1414 | Prototype starter session on Class 2 Two-digit subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 1415 | Prototype starter session on Class 3 Multiplication tables 2–5. Teacher review required. | E | kept |
| `src/types.ts` | 1416 | Prototype starter session on Class 3 Simple division. Teacher review required. | E | kept |
| `src/types.ts` | 1417 | Prototype starter session on Class 3 Three-digit place value. Teacher review required. | E | kept |
| `src/types.ts` | 1418 | Prototype starter session on Class 4 Fractions introduction. Teacher review required. | E | kept |
| `src/types.ts` | 1419 | Prototype starter session on Class 4 Length and weight basics. Teacher review required. | E | kept |
| `src/types.ts` | 1420 | Prototype starter session on Class 4 Multi-digit multiplication. Teacher review required. | E | kept |
| `src/types.ts` | 1421 | Prototype starter session on Class 5 Decimal place value. Teacher review required. | E | kept |
| `src/types.ts` | 1422 | Prototype starter session on Class 5 Percentage introduction. Teacher review required. | E | kept |
| `src/types.ts` | 1423 | Prototype starter session on Class 5 Long division. Teacher review required. | E | kept |
| `src/types.ts` | 1424 | Prototype starter session on Class 8 Rational number operations. Teacher review required. | E | kept |
| `src/types.ts` | 1425 | Prototype starter session on Class 8 Linear equations. Teacher review required. | E | kept |
| `src/types.ts` | 1426 | Prototype starter session on Class 8 Squares and cubes. Teacher review required. | E | kept |
| `src/types.ts` | 1427 | Prototype starter session on Class 9 Real number classification. Teacher review required. | E | kept |
| `src/types.ts` | 1428 | Prototype starter session on Class 9 Polynomial arithmetic. Teacher review required. | E | kept |
| `src/types.ts` | 1429 | Prototype starter session on Class 9 Coordinate geometry basics. Teacher review required. | E | kept |
| `src/types.ts` | 1430 | Prototype starter session on Class 10 Real numbers HCF/LCM. Teacher review required. | E | kept |
| `src/types.ts` | 1431 | Prototype starter session on Class 10 Quadratic equations. Teacher review required. | E | kept |
| `src/types.ts` | 1432 | Prototype starter session on Class 10 Basic trigonometry. Teacher review required. | E | kept |
| `src/types.ts` | 1433 | Prototype starter session on Class 11 Sets and operations. Teacher review required. | E | kept |
| `src/types.ts` | 1434 | Prototype starter session on Class 11 Functions basics. Teacher review required. | E | kept |
| `src/types.ts` | 1435 | Prototype starter session on Class 11 Trigonometric identities. Teacher review required. | E | kept |
| `src/types.ts` | 1436 | Prototype starter session on Class 12 Matrix operations. Teacher review required. | E | kept |
| `src/types.ts` | 1437 | Prototype starter session on Class 12 Derivatives basics. Teacher review required. | E | kept |
| `src/types.ts` | 1438 | Prototype starter session on Class 12 Definite integrals. Teacher review required. | E | kept |
| `src/types.ts` | 1440 | Prototype starter session on Class 1 2D shape recognition. Teacher review required. | E | kept |
| `src/types.ts` | 1441 | Prototype starter session on Class 1 Length comparison. Teacher review required. | E | kept |
| `src/types.ts` | 1442 | Prototype starter session on Class 1 Indian coins. Teacher review required. | E | kept |
| `src/types.ts` | 1443 | Prototype starter session on Class 2 Repeated addition (tables 2–3). Teacher review required. | E | kept |
| `src/types.ts` | 1444 | Prototype starter session on Class 2 Rupees and paise. Teacher review required. | E | kept |
| `src/types.ts` | 1445 | Prototype starter session on Class 2 Reading clocks. Teacher review required. | E | kept |
| `src/types.ts` | 1446 | Prototype starter session on Class 3 Halves, thirds and quarters. Teacher review required. | E | kept |
| `src/types.ts` | 1447 | Prototype starter session on Class 3 3-digit addition with regrouping. Teacher review required. | E | kept |
| `src/types.ts` | 1448 | Prototype starter session on Class 3 Length in meters. Teacher review required. | E | kept |
| `src/types.ts` | 1449 | Prototype starter session on Class 4 Numbers up to a lakh. Teacher review required. | E | kept |
| `src/types.ts` | 1450 | Prototype starter session on Class 4 Division with remainders. Teacher review required. | E | kept |
| `src/types.ts` | 1451 | Prototype starter session on Class 4 Tenths and hundredths. Teacher review required. | E | kept |
| `src/types.ts` | 1452 | Prototype starter session on Class 5 Fractions with unlike denominators. Teacher review required. | E | kept |
| `src/types.ts` | 1453 | Prototype starter session on Class 5 Perimeter and area. Teacher review required. | E | kept |
| `src/types.ts` | 1454 | Prototype starter session on Class 5 Reading bar graphs. Teacher review required. | E | kept |
| `src/types.ts` | 1455 | Prototype starter session on Class 8 Area of triangles and parallelograms. Teacher review required. | E | kept |
| `src/types.ts` | 1456 | Prototype starter session on Class 8 Bar graphs and pie charts. Teacher review required. | E | kept |
| `src/types.ts` | 1457 | Prototype starter session on Class 8 Algebraic identities. Teacher review required. | E | kept |
| `src/types.ts` | 1458 | Prototype starter session on Class 9 Linear equations in two variables. Teacher review required. | E | kept |
| `src/types.ts` | 1459 | Prototype starter session on Class 9 Congruence of triangles. Teacher review required. | E | kept |
| `src/types.ts` | 1460 | Prototype starter session on Class 9 Mean, median, mode (ungrouped). Teacher review required. | E | kept |
| `src/types.ts` | 1461 | Prototype starter session on Class 10 Distance and section formulae. Teacher review required. | E | kept |
| `src/types.ts` | 1462 | Prototype starter session on Class 10 Arithmetic progressions. Teacher review required. | E | kept |
| `src/types.ts` | 1463 | Prototype starter session on Class 10 Tangent to a circle. Teacher review required. | E | kept |
| `src/types.ts` | 1464 | Prototype starter session on Class 11 Complex numbers. Teacher review required. | E | kept |
| `src/types.ts` | 1465 | Prototype starter session on Class 11 Geometric progression sum. Teacher review required. | E | kept |
| `src/types.ts` | 1466 | Prototype starter session on Class 11 Slope and equation of a line. Teacher review required. | E | kept |
| `src/types.ts` | 1467 | Prototype starter session on Class 12 Determinants. Teacher review required. | E | kept |
| `src/types.ts` | 1468 | Prototype starter session on Class 12 Chain rule for derivatives. Teacher review required. | E | kept |
| `src/types.ts` | 1469 | Prototype starter session on Class 12 Dot product of vectors. Teacher review required. | E | kept |
| `src/types.ts` | 1471 | Prototype session on Class 10 Polynomials — types and degree. Teacher review required. | E | kept |
| `src/types.ts` | 1472 | Prototype session on Class 10 Zeros of a polynomial. Teacher review required. | E | kept |
| `src/types.ts` | 1473 | Prototype session on Class 10 Division of polynomials. Teacher review required. | E | kept |
| `src/types.ts` | 1474 | Prototype session on Class 10 Solving linear equations graphically. Teacher review required. | E | kept |
| `src/types.ts` | 1475 | Prototype session on Class 10 Substitution method. Teacher review required. | E | kept |
| `src/types.ts` | 1476 | Prototype session on Class 10 Consistency of linear equations. Teacher review required. | E | kept |
| `src/types.ts` | 1477 | Prototype session on Class 10 Basic Proportionality Theorem. Teacher review required. | E | kept |
| `src/types.ts` | 1478 | Prototype session on Class 10 Similar triangles criteria. Teacher review required. | E | kept |
| `src/types.ts` | 1479 | Prototype session on Class 10 Pythagoras theorem. Teacher review required. | E | kept |
| `src/types.ts` | 1480 | Prototype session on Class 10 Angle of elevation. Teacher review required. | E | kept |
| `src/types.ts` | 1481 | Prototype session on Class 10 Angle of depression. Teacher review required. | E | kept |
| `src/types.ts` | 1482 | Prototype session on Class 10 Heights and distances. Teacher review required. | E | kept |
| `src/types.ts` | 1483 | Prototype session on Class 10 Circumference and area of a circle. Teacher review required. | E | kept |
| `src/types.ts` | 1484 | Prototype session on Class 10 Sector area and arc length. Teacher review required. | E | kept |
| `src/types.ts` | 1485 | Prototype session on Class 10 Segment area. Teacher review required. | E | kept |
| `src/types.ts` | 1486 | Prototype session on Class 10 Surface area of combinations. Teacher review required. | E | kept |
| `src/types.ts` | 1487 | Prototype session on Class 10 Volume of combinations. Teacher review required. | E | kept |
| `src/types.ts` | 1488 | Prototype session on Class 10 Frustum of a cone. Teacher review required. | E | kept |
| `src/types.ts` | 1489 | Prototype session on Class 10 Mean of grouped data. Teacher review required. | E | kept |
| `src/types.ts` | 1490 | Prototype session on Class 10 Median of grouped data. Teacher review required. | E | kept |
| `src/types.ts` | 1491 | Prototype session on Class 10 Mode of grouped data. Teacher review required. | E | kept |
| `src/types.ts` | 1492 | Prototype session on Class 10 Sample spaces. Teacher review required. | E | kept |
| `src/types.ts` | 1493 | Prototype session on Class 10 Probability of simple events. Teacher review required. | E | kept |
| `src/types.ts` | 1494 | Prototype session on Class 10 Complementary events. Teacher review required. | E | kept |
| `src/types.ts` | 1495 | Prototype session on Class 12 Types of relations. Teacher review required. | E | kept |
| `src/types.ts` | 1496 | Prototype session on Class 12 Types of functions. Teacher review required. | E | kept |
| `src/types.ts` | 1497 | Prototype session on Class 12 Composition and inverse. Teacher review required. | E | kept |
| `src/types.ts` | 1498 | Prototype session on Class 12 Principal values of inverse trig. Teacher review required. | E | kept |
| `src/types.ts` | 1499 | Prototype session on Class 12 Inverse trig identities. Teacher review required. | E | kept |
| `src/types.ts` | 1500 | Prototype session on Class 12 Domain and range of inverse trig. Teacher review required. | E | kept |
| `src/types.ts` | 1501 | Prototype session on Class 12 Increasing and decreasing functions. Teacher review required. | E | kept |
| `src/types.ts` | 1502 | Prototype session on Class 12 Maxima and minima. Teacher review required. | E | kept |
| `src/types.ts` | 1503 | Prototype session on Class 12 Rate of change. Teacher review required. | E | kept |
| `src/types.ts` | 1504 | Prototype session on Class 12 Area under a curve. Teacher review required. | E | kept |
| `src/types.ts` | 1505 | Prototype session on Class 12 Area between two curves. Teacher review required. | E | kept |
| `src/types.ts` | 1506 | Prototype session on Class 12 Definite integral properties. Teacher review required. | E | kept |
| `src/types.ts` | 1507 | Prototype session on Class 12 Order and degree of ODEs. Teacher review required. | E | kept |
| `src/types.ts` | 1508 | Prototype session on Class 12 Variable-separable ODEs. Teacher review required. | E | kept |
| `src/types.ts` | 1509 | Prototype session on Class 12 Linear first-order ODEs. Teacher review required. | E | kept |
| `src/types.ts` | 1510 | Prototype session on Class 12 Direction cosines. Teacher review required. | E | kept |
| `src/types.ts` | 1511 | Prototype session on Class 12 Equation of a line in 3D. Teacher review required. | E | kept |
| `src/types.ts` | 1512 | Prototype session on Class 12 Equation of a plane. Teacher review required. | E | kept |
| `src/types.ts` | 1513 | Prototype session on Class 12 Linear programming basics. Teacher review required. | E | kept |
| `src/types.ts` | 1514 | Prototype session on Class 12 Constraints and objective. Teacher review required. | E | kept |
| `src/types.ts` | 1515 | Prototype session on Class 12 Graphical solution of LPP. Teacher review required. | E | kept |
| `src/types.ts` | 1516 | Prototype session on Class 12 Conditional probability. Teacher review required. | E | kept |
| `src/types.ts` | 1517 | Prototype session on Class 12 Bayes theorem intuition. Teacher review required. | E | kept |
| `src/types.ts` | 1518 | Prototype session on Class 12 Random variables and distributions. Teacher review required. | E | kept |
| `src/types.ts` | 1520 | Prototype session on Class 8 Angle sum of quadrilaterals. Teacher review required. | E | kept |
| `src/types.ts` | 1521 | Prototype session on Class 8 Types of quadrilaterals. Teacher review required. | E | kept |
| `src/types.ts` | 1522 | Prototype session on Class 8 Parallelogram properties. Teacher review required. | E | kept |
| `src/types.ts` | 1523 | Prototype session on Class 8 Histograms. Teacher review required. | E | kept |
| `src/types.ts` | 1524 | Prototype session on Class 8 Pie chart interpretation. Teacher review required. | E | kept |
| `src/types.ts` | 1525 | Prototype session on Class 8 Introduction to probability. Teacher review required. | E | kept |
| `src/types.ts` | 1526 | Prototype session on Class 8 Percent change. Teacher review required. | E | kept |
| `src/types.ts` | 1527 | Prototype session on Class 8 Profit and loss. Teacher review required. | E | kept |
| `src/types.ts` | 1528 | Prototype session on Class 8 Simple and compound interest. Teacher review required. | E | kept |
| `src/types.ts` | 1529 | Prototype session on Class 8 Multiplication of algebraic expressions. Teacher review required. | E | kept |
| `src/types.ts` | 1530 | Prototype session on Class 8 Algebraic identities. Teacher review required. | E | kept |
| `src/types.ts` | 1531 | Prototype session on Class 8 Factorisation basics. Teacher review required. | E | kept |
| `src/types.ts` | 1532 | Prototype session on Class 8 Area of trapezium. Teacher review required. | E | kept |
| `src/types.ts` | 1533 | Prototype session on Class 8 Surface area of cube/cuboid. Teacher review required. | E | kept |
| `src/types.ts` | 1534 | Prototype session on Class 8 Volume of cube/cuboid. Teacher review required. | E | kept |
| `src/types.ts` | 1535 | Prototype session on Class 8 Positive integer exponents. Teacher review required. | E | kept |
| `src/types.ts` | 1536 | Prototype session on Class 8 Negative exponents. Teacher review required. | E | kept |
| `src/types.ts` | 1537 | Prototype session on Class 8 Scientific notation. Teacher review required. | E | kept |
| `src/types.ts` | 1538 | Prototype session on Class 8 Direct proportion. Teacher review required. | E | kept |
| `src/types.ts` | 1539 | Prototype session on Class 8 Inverse proportion. Teacher review required. | E | kept |
| `src/types.ts` | 1540 | Prototype session on Class 8 Proportion word problems. Teacher review required. | E | kept |
| `src/types.ts` | 1541 | Prototype session on Class 8 Bar and line graphs. Teacher review required. | E | kept |
| `src/types.ts` | 1542 | Prototype session on Class 8 Coordinate axes. Teacher review required. | E | kept |
| `src/types.ts` | 1543 | Prototype session on Class 8 Plotting points. Teacher review required. | E | kept |
| `src/types.ts` | 1544 | Prototype session on Class 9 Angle pairs. Teacher review required. | E | kept |
| `src/types.ts` | 1545 | Prototype session on Class 9 Parallel lines and transversal. Teacher review required. | E | kept |
| `src/types.ts` | 1546 | Prototype session on Class 9 Triangle angle sum (extended). Teacher review required. | E | kept |
| `src/types.ts` | 1547 | Prototype session on Class 9 Parallelogram properties. Teacher review required. | E | kept |
| `src/types.ts` | 1548 | Prototype session on Class 9 Rhombus and rectangle. Teacher review required. | E | kept |
| `src/types.ts` | 1549 | Prototype session on Class 9 Midpoint theorem. Teacher review required. | E | kept |
| `src/types.ts` | 1550 | Prototype session on Class 9 Area on same base same parallels. Teacher review required. | E | kept |
| `src/types.ts` | 1551 | Prototype session on Class 9 Triangles on same base equal area. Teacher review required. | E | kept |
| `src/types.ts` | 1552 | Prototype session on Class 9 Area proofs. Teacher review required. | E | kept |
| `src/types.ts` | 1553 | Prototype session on Class 9 Chords and arcs. Teacher review required. | E | kept |
| `src/types.ts` | 1554 | Prototype session on Class 9 Cyclic quadrilaterals. Teacher review required. | E | kept |
| `src/types.ts` | 1555 | Prototype session on Class 9 Angle in semicircle. Teacher review required. | E | kept |
| `src/types.ts` | 1556 | Prototype session on Class 9 Semiperimeter. Teacher review required. | E | kept |
| `src/types.ts` | 1557 | : "Prototype session on Class 9 Heron | E | kept |
| `src/types.ts` | 1558 | Prototype session on Class 9 Area of quadrilateral via Heron. Teacher review required. | E | kept |
| `src/types.ts` | 1559 | Prototype session on Class 9 Cuboid and cube. Teacher review required. | E | kept |
| `src/types.ts` | 1560 | Prototype session on Class 9 Cylinder surface area. Teacher review required. | E | kept |
| `src/types.ts` | 1561 | Prototype session on Class 9 Cone and sphere. Teacher review required. | E | kept |
| `src/types.ts` | 1562 | Prototype session on Class 9 Empirical probability. Teacher review required. | E | kept |
| `src/types.ts` | 1563 | Prototype session on Class 9 Coin and die probability. Teacher review required. | E | kept |
| `src/types.ts` | 1564 | Prototype session on Class 9 Experimental data probability. Teacher review required. | E | kept |
| `src/types.ts` | 1565 | : "Prototype session on Class 9 Euclid | E | kept |
| `src/types.ts` | 1566 | : "Prototype session on Class 9 Euclid | E | kept |
| `src/types.ts` | 1567 | Prototype session on Class 9 Rationalisation. Teacher review required. | E | kept |
| `src/types.ts` | 1569 | Prototype session on Class 11 Cartesian product. Teacher review required. | E | kept |
| `src/types.ts` | 1570 | Prototype session on Class 11 Relations vs functions. Teacher review required. | E | kept |
| `src/types.ts` | 1571 | Prototype session on Class 11 Composition of functions. Teacher review required. | E | kept |
| `src/types.ts` | 1572 | Prototype session on Class 11 Radian and degree measure. Teacher review required. | E | kept |
| `src/types.ts` | 1573 | Prototype session on Class 11 Trigonometric function values. Teacher review required. | E | kept |
| `src/types.ts` | 1574 | Prototype session on Class 11 Sum and difference formulas. Teacher review required. | E | kept |
| `src/types.ts` | 1575 | Prototype session on Class 11 Solving linear inequalities. Teacher review required. | E | kept |
| `src/types.ts` | 1576 | Prototype session on Class 11 Graphing inequality solutions. Teacher review required. | E | kept |
| `src/types.ts` | 1577 | Prototype session on Class 11 Inequality word problems. Teacher review required. | E | kept |
| `src/types.ts` | 1578 | Prototype session on Class 11 Counting principle. Teacher review required. | E | kept |
| `src/types.ts` | 1579 | Prototype session on Class 11 Permutations. Teacher review required. | E | kept |
| `src/types.ts` | 1580 | Prototype session on Class 11 Combinations. Teacher review required. | E | kept |
| `src/types.ts` | 1581 | Prototype session on Class 11 Binomial expansion. Teacher review required. | E | kept |
| `src/types.ts` | 1582 | Prototype session on Class 11 General term. Teacher review required. | E | kept |
| `src/types.ts` | 1583 | : "Prototype session on Class 11 Pascal | E | kept |
| `src/types.ts` | 1584 | Prototype session on Class 11 Circle equations. Teacher review required. | E | kept |
| `src/types.ts` | 1585 | Prototype session on Class 11 Parabola. Teacher review required. | E | kept |
| `src/types.ts` | 1586 | Prototype session on Class 11 Ellipse and hyperbola basics. Teacher review required. | E | kept |
| `src/types.ts` | 1587 | Prototype session on Class 11 Concept of limit. Teacher review required. | E | kept |
| `src/types.ts` | 1588 | Prototype session on Class 11 Derivative as a limit. Teacher review required. | E | kept |
| `src/types.ts` | 1589 | Prototype session on Class 11 Derivative rules. Teacher review required. | E | kept |
| `src/types.ts` | 1590 | Prototype session on Class 11 Axiomatic probability. Teacher review required. | E | kept |
| `src/types.ts` | 1591 | Prototype session on Class 11 Addition rule of probability. Teacher review required. | E | kept |
| `src/types.ts` | 1592 | Prototype session on Class 11 Sample spaces and events. Teacher review required. | E | kept |
| `src/types.ts` | 1594 | Prototype session on Class 1 Numbers 21-50. Teacher review required. | E | kept |
| `src/types.ts` | 1595 | Prototype session on Class 1 Numbers 51-99. Teacher review required. | E | kept |
| `src/types.ts` | 1596 | Prototype session on Class 1 Number names 20-50. Teacher review required. | E | kept |
| `src/types.ts` | 1597 | Prototype session on Class 1 Addition up to 50. Teacher review required. | E | kept |
| `src/types.ts` | 1598 | Prototype session on Class 1 Subtraction up to 50. Teacher review required. | E | kept |
| `src/types.ts` | 1599 | Prototype session on Class 1 Skip counting. Teacher review required. | E | kept |
| `src/types.ts` | 1600 | Prototype session on Class 1 Parts of the day. Teacher review required. | E | kept |
| `src/types.ts` | 1601 | Prototype session on Class 1 Days of the week. Teacher review required. | E | kept |
| `src/types.ts` | 1602 | Prototype session on Class 1 Months of the year. Teacher review required. | E | kept |
| `src/types.ts` | 1603 | Prototype session on Class 1 Heavy and light. Teacher review required. | E | kept |
| `src/types.ts` | 1604 | Prototype session on Class 1 Capacity (full/empty). Teacher review required. | E | kept |
| `src/types.ts` | 1605 | Prototype session on Class 1 Non-standard length units. Teacher review required. | E | kept |
| `src/types.ts` | 1606 | Prototype session on Class 2 Numbers up to 999. Teacher review required. | E | kept |
| `src/types.ts` | 1607 | Prototype session on Class 2 3-digit addition. Teacher review required. | E | kept |
| `src/types.ts` | 1608 | Prototype session on Class 2 3-digit subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 1609 | Prototype session on Class 2 Tables 4 and 5. Teacher review required. | E | kept |
| `src/types.ts` | 1610 | Prototype session on Class 2 Table of 10. Teacher review required. | E | kept |
| `src/types.ts` | 1611 | Prototype session on Class 2 Division as equal sharing. Teacher review required. | E | kept |
| `src/types.ts` | 1612 | Prototype session on Class 2 Half and quarter. Teacher review required. | E | kept |
| `src/types.ts` | 1613 | Prototype session on Class 2 Length in cm and m. Teacher review required. | E | kept |
| `src/types.ts` | 1614 | Prototype session on Class 2 Weight in g and kg. Teacher review required. | E | kept |
| `src/types.ts` | 1615 | Prototype session on Class 2 Capacity in mL and L. Teacher review required. | E | kept |
| `src/types.ts` | 1616 | Prototype session on Class 2 Pictographs. Teacher review required. | E | kept |
| `src/types.ts` | 1617 | Prototype session on Class 2 3D shapes. Teacher review required. | E | kept |
| `src/types.ts` | 1618 | Prototype session on Class 3 Numbers up to 10,000. Teacher review required. | E | kept |
| `src/types.ts` | 1619 | Prototype session on Class 3 4-digit addition. Teacher review required. | E | kept |
| `src/types.ts` | 1620 | Prototype session on Class 3 4-digit subtraction. Teacher review required. | E | kept |
| `src/types.ts` | 1621 | Prototype session on Class 3 Tables 6 and 7. Teacher review required. | E | kept |
| `src/types.ts` | 1622 | Prototype session on Class 3 Tables 8 and 9. Teacher review required. | E | kept |
| `src/types.ts` | 1623 | Prototype session on Class 3 Division with tables. Teacher review required. | E | kept |
| `src/types.ts` | 1624 | Prototype session on Class 3 Fractions on number line. Teacher review required. | E | kept |
| `src/types.ts` | 1625 | Prototype session on Class 3 Hours and minutes. Teacher review required. | E | kept |
| `src/types.ts` | 1626 | Prototype session on Class 3 Money problems. Teacher review required. | E | kept |
| `src/types.ts` | 1627 | Prototype session on Class 3 Weight g/kg. Teacher review required. | E | kept |
| `src/types.ts` | 1628 | Prototype session on Class 3 Bar graphs. Teacher review required. | E | kept |
| `src/types.ts` | 1629 | Prototype session on Class 3 Number patterns. Teacher review required. | E | kept |
| `src/types.ts` | 1630 | Prototype session on Class 4 Numbers up to 99,999. Teacher review required. | E | kept |
| `src/types.ts` | 1631 | Prototype session on Class 4 Long multiplication. Teacher review required. | E | kept |
| `src/types.ts` | 1632 | Prototype session on Class 4 Long division. Teacher review required. | E | kept |
| `src/types.ts` | 1633 | Prototype session on Class 4 Equivalent fractions. Teacher review required. | E | kept |
| `src/types.ts` | 1634 | Prototype session on Class 4 Same-denominator fractions. Teacher review required. | E | kept |
| `src/types.ts` | 1635 | Prototype session on Class 4 Decimal arithmetic. Teacher review required. | E | kept |
| `src/types.ts` | 1636 | Prototype session on Class 4 Perimeter. Teacher review required. | E | kept |
| `src/types.ts` | 1637 | Prototype session on Class 4 Area of rectangles. Teacher review required. | E | kept |
| `src/types.ts` | 1638 | Prototype session on Class 4 Symmetry. Teacher review required. | E | kept |
| `src/types.ts` | 1639 | Prototype session on Class 4 Calendar and time. Teacher review required. | E | kept |
| `src/types.ts` | 1640 | Prototype session on Class 4 Money word problems. Teacher review required. | E | kept |
| `src/types.ts` | 1641 | Prototype session on Class 4 Data tables. Teacher review required. | E | kept |
| `src/types.ts` | 1642 | Prototype session on Class 5 Large numbers (crore). Teacher review required. | E | kept |
| `src/types.ts` | 1643 | Prototype session on Class 5 HCF introduction. Teacher review required. | E | kept |
| `src/types.ts` | 1644 | Prototype session on Class 5 LCM introduction. Teacher review required. | E | kept |
| `src/types.ts` | 1645 | Prototype session on Class 5 Decimal multiplication. Teacher review required. | E | kept |
| `src/types.ts` | 1646 | Prototype session on Class 5 Decimal division. Teacher review required. | E | kept |
| `src/types.ts` | 1647 | Prototype session on Class 5 Fraction multiplication. Teacher review required. | E | kept |
| `src/types.ts` | 1648 | Prototype session on Class 5 Percent of a quantity. Teacher review required. | E | kept |
| `src/types.ts` | 1649 | Prototype session on Class 5 Volume of cuboid. Teacher review required. | E | kept |
| `src/types.ts` | 1650 | Prototype session on Class 5 Types of angles. Teacher review required. | E | kept |
| `src/types.ts` | 1651 | Prototype session on Class 5 Mean introduction. Teacher review required. | E | kept |
| `src/types.ts` | 1652 | Prototype session on Class 5 Bar graph reading. Teacher review required. | E | kept |
| `src/types.ts` | 1653 | Prototype session on Class 5 Mixed word problems. Teacher review required. | E | kept |
| `src/types.ts` | 1852 | The expected answer involves a symbol the prototype parser cannot evaluate (typically an algebraic expression). Item is  | E | kept |
