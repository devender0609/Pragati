# Teacher Product Value Gap

**Written:** 2026-08-24 (v0.61 §16) · Based on the captured teacher console.

## 1. Against the §16 questions

| Question | Can a teacher answer it? | Evidence |
| :-- | :-- | :-- |
| What are students learning? | **Partly.** Chapter names, no section detail | Overview cards |
| What official section is this? | **No.** The section model exists but is Admin-only | `officialSections.ts` not surfaced in teacher UI |
| Who needs help? | **Honestly empty.** "No completed sessions in this class yet." | Overview |
| On what concept? | **Honestly empty.** "Not enough recent activity yet." | Overview |
| What is available to assign? | **Yes** — Assign and Assess tabs | Captured |
| What should I teach next? | **Honestly empty.** "Not enough recent activity yet." | Overview |
| Which content is incomplete? | **No.** Section-level gaps are Admin-only | Roadmap is under Admin & Research |
| What evidence supports a recommendation? | N/A — no recommendations are made | — |

## 2. The main finding is a positive one

Every card that lacks data **says so plainly**: "No completed sessions
in this class yet", "Not enough recent activity yet". No fabricated
percentages, no invented risk scores, no empty charts implying data
exists. Given how easy it would be to fill these with plausible
numbers, this is the right behaviour and should be preserved.

## 3. The main gap

**The teacher cannot see the curriculum picture the product now holds.**

v0.61 established that Ganita Prakash Chapter 7 has nine official
sections and Pragati covers five, and that five of ten chapters have no
content at all. A Class 6 teacher would find that immediately useful —
it tells them what Pragati can and cannot take off their hands.

It is currently visible only under Admin & Research, behind a
"Secondary tools" panel described as separate from the ordinary teacher
flow. The information most useful to a teacher is filed where teachers
are told not to look.

**Recommended for v0.62:** surface a read-only section-coverage view in
the teacher Resources tab. Counts only, same rule as Admin — mapping
coverage is not instructional completeness.

## 4. Not done

No teacher-facing change was made this iteration. The gap is an
information-architecture decision about what belongs in the teacher flow
versus Admin, and §15/§16 explicitly scope this iteration to auditing
rather than redesigning.
