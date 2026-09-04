// v0.69 §7/§9/§10 — LESSON PRESENTATION COMPONENTS.
//
// v0.68 lessons rendered as documents: heading, seven paragraphs,
// heading, list. Correct and unreadable on a phone.
//
// These components change PRESENTATION ONLY. No component here alters,
// reorders, filters or reinterprets any mathematical content — they
// take authored strings and give them structure. That constraint is
// what makes this safe to apply to content that has been hand-audited
// twice but never educator-reviewed.
//
// COGNITIVE CHUNKING, NOT FRAGMENTATION (§7)
//
// The goal is that a student can see where they are. Splitting a
// paragraph into three cards to make something animate would be worse
// than the wall of text, because it would break an argument into pieces
// that no longer read as an argument.
//
// COLOUR IS NEVER THE ONLY CUE (§10, §38)
//
// Every semantic block pairs its hue with an explicit text label and an
// icon. A student who cannot distinguish violet from teal still reads
// "Worked example" and "Try it yourself".

import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// §9 — mathematics should look like mathematics
// ---------------------------------------------------------------------------

/**
 * A fraction, stacked.
 *
 * "3/8" in running text is a division sign between two numbers. A
 * stacked fraction is the object the chapter is about. The screen
 * reader gets "3 eighths" rather than "3 slash 8", which is what a
 * teacher would say aloud.
 */
export function Frac({
  n,
  d,
  className = '',
}: {
  n: number;
  d: number;
  className?: string;
}) {
  return (
    <span className={`frac font-semibold ${className}`} role="math" aria-label={`${n} over ${d}`}>
      <span className="frac-n" aria-hidden="true">{n}</span>
      <span className="frac-d" aria-hidden="true">{d}</span>
    </span>
  );
}

/**
 * Render inline fraction notation in authored prose as stacked
 * fractions, leaving everything else exactly as written.
 *
 * Only `a/b` where both sides are plain digits is touched. Dates,
 * ratios written with words, and anything with a space survive
 * untouched — the transform is deliberately timid, because silently
 * reformatting authored mathematics is how a presentation layer starts
 * changing meaning.
 */
export function MathText({ children }: { children: string }) {
  const parts = children.split(/(\b\d{1,3}\/\d{1,3}\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^(\d{1,3})\/(\d{1,3})$/.exec(part);
        if (!m) return <span key={i}>{part}</span>;
        return (
          <Frac key={i} n={Number(m[1])} d={Number(m[2])} className="mx-0.5 text-[1.05em]" />
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Structural blocks
// ---------------------------------------------------------------------------

function BlockLabel({
  icon,
  text,
  tone,
}: {
  icon: ReactNode;
  text: string;
  tone: string;
}) {
  return (
    <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${tone}`}>
      <span aria-hidden="true">{icon}</span>
      {text}
    </p>
  );
}

const Dot = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor"><circle cx="6" cy="6" r="4" /></svg>
);
const Eye = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1.8 10S4.8 4.5 10 4.5 18.2 10 18.2 10 15.2 15.5 10 15.5 1.8 10 1.8 10Z" /><circle cx="10" cy="10" r="2.2" />
  </svg>
);
const Pencil = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 3.5 16.5 6.5 7 16H4v-3z" />
  </svg>
);
const Alert = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10 2.8 18.3 17H1.7z" strokeLinejoin="round" /><path d="M10 8v3.5" /><circle cx="10" cy="14.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10.5 8.2 14.5 16 6" />
  </svg>
);
const Board = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
    <rect x="2.5" y="3.5" width="15" height="11" rx="1.5" /><path d="M7 17.5h6" />
  </svg>
);

/** The section's goal, stated before anything else. */
export function ConceptIntro({
  eyebrow,
  title,
  goal,
}: {
  eyebrow?: string;
  title: string;
  goal: string;
}) {
  return (
    <header className="rounded-xl2 bg-gradient-to-br from-brand-600 to-learn-600 p-5 text-white shadow-card">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{eyebrow}</p>
      ) : null}
      <h1 className="mt-1 font-display text-xl font-bold leading-snug sm:text-2xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/90">
        <MathText>{goal}</MathText>
      </p>
    </header>
  );
}

/** What the student should already be able to do. */
export function PriorKnowledge({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="rounded-xl2 border border-slate-200 bg-white p-4">
      <BlockLabel icon={<Check />} text="Before you start" tone="text-slate-500" />
      <ul className="mt-2 space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
            <span><MathText>{t}</MathText></span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * One idea, as one card.
 *
 * `paragraphs` are kept whole. An explanation is an argument, and this
 * component gives it a boundary — it does not chop it up.
 */
export function IdeaCard({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="surface-learn">
      <BlockLabel icon={<Dot />} text="The idea" tone="text-learn-700" />
      <h2 className="mt-1.5 font-display text-base font-bold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-2.5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-slate-700">
            <MathText>{p}</MathText>
          </p>
        ))}
      </div>
    </section>
  );
}

/** A mathematical visual, given room and a caption. */
export function MathVisualCard({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
      <BlockLabel icon={<Eye />} text="See it" tone="text-progress-700" />
      {/* §9/§27 — visuals get width and vertical air. A fraction strip
          squeezed into a 120px row cannot be read, and an unreadable
          diagram is worse than none because it looks like it worked. */}
      <div className="mt-3">{children}</div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-relaxed text-slate-500">
          <MathText>{caption}</MathText>
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * A worked example: prompt, numbered steps with their reasoning, and a
 * visually distinct answer.
 *
 * §9 — the final answer must be easy to locate. In v0.68 it was the
 * last line of a paragraph run and a student scanning back for it had
 * to re-read the whole example.
 */
export function WorkedExampleCard({
  index,
  prompt,
  steps,
  answer,
  visual,
}: {
  index: number;
  prompt: string;
  steps: Array<{ text: string; reasoning: string }>;
  answer: string;
  visual?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <BlockLabel icon={<Board />} text={`Worked example ${index}`} tone="text-slate-500" />
        <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-900">
          <MathText>{prompt}</MathText>
        </p>
      </div>
      <ol className="divide-y divide-slate-100">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 px-4 py-3">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-slate-800">
                <MathText>{s.text}</MathText>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                <MathText>{s.reasoning}</MathText>
              </p>
            </div>
          </li>
        ))}
      </ol>
      {visual ? <div className="border-t border-slate-100 px-4 py-3">{visual}</div> : null}
      <div className="flex items-center gap-2 border-t border-correct-200 bg-correct-50 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-correct-700">
          Answer
        </span>
        <span className="text-sm font-bold text-correct-900">
          <MathText>{answer}</MathText>
        </span>
      </div>
    </section>
  );
}

/** A thing worth pausing on. Not a warning. */
export function NoticeThis({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-xl2 border-l-4 border-progress-400 bg-progress-50 py-3 pl-4 pr-4">
      <BlockLabel icon={<Eye />} text="Notice this" tone="text-progress-700" />
      <div className="mt-1.5 text-sm leading-relaxed text-slate-700">{children}</div>
    </aside>
  );
}

/**
 * A common mistake, named before the student makes it.
 *
 * Amber, not red. This is a warning about a trap, not a report that the
 * student has fallen into one.
 */
export function CommonMistake({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="surface-attend">
      <BlockLabel icon={<Alert />} text="Watch out for" tone="text-attend-800" />
      <ul className="mt-2 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="text-sm leading-relaxed text-attend-900">
            <MathText>{t}</MathText>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Practice, with the guided/independent distinction kept visible. */
export function PracticeCard({
  kind,
  items,
}: {
  kind: 'guided' | 'independent';
  items: Array<{ id: string; prompt: string; answer: string; rationale: string }>;
}) {
  if (items.length === 0) return null;
  const guided = kind === 'guided';
  return (
    <section className="surface-practice">
      <BlockLabel
        icon={<Pencil />}
        text={guided ? 'Try it together' : 'Now you try'}
        tone="text-practice-800"
      />
      <ol className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={it.id} className="rounded-lg bg-white/80 p-3">
            <p className="text-sm leading-relaxed text-slate-800">
              <span className="mr-1.5 font-semibold text-practice-700">{i + 1}.</span>
              <MathText>{it.prompt}</MathText>
            </p>
            {/* Guided practice shows its reasoning; independent practice
                does not, which is the actual difference between them. */}
            {guided ? (
              <p className="mt-1.5 text-xs leading-relaxed text-practice-800">
                <span className="font-semibold">Answer: </span>
                <MathText>{it.answer}</MathText>
                {' — '}
                <MathText>{it.rationale}</MathText>
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** An open reasoning task. Longer prompts are legitimate here. */
export function ReasoningChallenge({
  items,
}: {
  items: Array<{ id: string; prompt: string }>;
}) {
  if (items.length === 0) return null;
  return (
    <section className="rounded-xl2 border border-learn-300 bg-white p-4">
      <BlockLabel icon={<Dot />} text="Think about it" tone="text-learn-700" />
      <ul className="mt-2 space-y-2">
        {items.map((it) => (
          <li key={it.id} className="text-sm leading-relaxed text-slate-800">
            <MathText>{it.prompt}</MathText>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The one sentence to leave with. */
export function SummaryCard({ text }: { text: string }) {
  return (
    <section className="rounded-xl2 bg-slate-900 p-5 text-white">
      <BlockLabel icon={<Check />} text="The big idea" tone="text-white/60" />
      <p className="mt-2 text-sm font-medium leading-relaxed text-white">
        <MathText>{text}</MathText>
      </p>
    </section>
  );
}

/** Teacher-only material. Never shown on a student surface. */
export function TeacherNoteCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="surface-teacher">
      <BlockLabel icon={<Board />} text="Teacher notes" tone="text-teacher-600" />
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}
