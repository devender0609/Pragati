# Curriculum Evidence Policy

Pragati draws on sources that disagree. This policy says which wins, and
why the answer depends on **what is being claimed**.

## The core rule

**There is no single ranking of sources.** Authority is per claim type:

| Claim type | Strongest source | Why |
| :--- | :--- | :--- |
| Curricular structure | National framework (NCF-SE 2023) | Goals and competencies are the framework's job |
| Chapter placement | Current official textbook | The textbook *is* the chapter list; frameworks do not enumerate chapters |
| Assessment design | National assessment framework (PARAKH) | Curriculum documents are not assessment design documents |
| Learning outcome wording | NCERT Learning Outcomes | Purpose-built for this |
| Progression order | Mathematical inference | Dependency is a mathematical fact, not a policy choice |

That last row is deliberate: **for dependency ordering, mathematics
outranks policy.** No document is needed to establish that equivalence
precedes comparing unlike denominators.

## Framework generations

Sources belong to generations, and mixing them silently is an error:

- **NCF 2005** — NCERT Learning Outcomes (2017 elementary, 2019
  secondary).
- **NCF-SE 2023** — Ganita Prakash textbooks, CBSE 2026-27 curricula,
  CT&AI curriculum.

A newer framework may have *deliberately changed* what an older
document says. `resolveConflict()` flags any generation mismatch rather
than resolving it silently, because "these two disagree" and "the
policy changed" require different responses.

## Recording requirement

Every source decision records: claim type, source, source type,
framework generation, whether directly inspected, and conflict status.

## Provisional resolutions

When the winning source was **not directly inspected**, the resolution
is marked provisional. Most current resolutions are, because PARAKH,
NCF-SE 2023, and the Ganita Prakash textbooks have not been read.

## What this policy forbids

- Using a coaching website to establish official placement.
- Treating a CBSE reproduction as NCF-SE itself.
- Using NCF-2005-era Learning Outcomes to fix placement in an
  NCF-SE-2023 textbook without flagging the mismatch.
- Letting mathematical inference override a textbook on chapter
  placement, or a textbook override mathematics on dependency order.
