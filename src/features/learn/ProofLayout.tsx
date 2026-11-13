// ===========================================================================
// v0.84.0-c11.19 checkpoint 87 — RENDERER FOR AN INDUCTION PROOF.
//
// Semantic HTML rather than a drawn figure: the representation requirement
// is "proof layout; no figure required", and a decorative diagram added to
// fill a stage would be worse than none.
//
// The five parts are real headings, so the structure survives without
// colour or indentation and is navigable to a screen reader. Every line
// carries its justification beside its statement, because a statement with
// no reason is what the model exists to prevent.
// ===========================================================================

import type { ProofLayoutSpec } from '../../curriculum/induction';

export function ProofLayout({ spec }: { spec: ProofLayoutSpec }) {
  const p = spec.proof;
  const part = (heading: string, body: React.ReactNode) => (
    <section className="mt-3">
      <h4 className="text-sm font-bold text-slate-900">{heading}</h4>
      {body}
    </section>
  );
  const steps = (list: typeof p.baseCase.steps) => (
    <ol className="mt-1 space-y-1 text-sm">
      {list.map((s, i) => (
        <li key={`s-${i}`}>
          <span>{s.statement}</span>{' '}
          <span className="opacity-75">— {s.justification}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <figure className="my-4" role="group" aria-label={spec.altText}>
      <div className="rounded border border-slate-300 p-3">
        {part('Claim', <p className="mt-1 text-sm">{p.claim}, for {p.domain.written}.</p>)}
        {part(`Base case (n = ${p.baseCase.at})`, steps(p.baseCase.steps))}
        {part('Induction hypothesis', <p className="mt-1 text-sm">{p.hypothesis.statement}</p>)}
        {part('Inductive step', steps(p.inductiveStep.steps))}
        {part('Conclusion', <p className="mt-1 text-sm">{p.conclusion.statement}</p>)}
      </div>
      <figcaption className="mt-1 text-sm opacity-80">
        Both obligations are met: the claim is checked at {p.baseCase.at}, and each case is carried to the next.
      </figcaption>
    </figure>
  );
}
