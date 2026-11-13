// v0.42 — MathText with lazy-loaded KaTeX.
//
// v0.38 loaded KaTeX (~275 kB) into the main bundle unconditionally,
// even for plain-text items with no math markers. v0.42 dynamically
// imports KaTeX + its CSS the first time a `$...$` fragment is
// encountered. Plain-text items pay zero extra bundle cost; math items
// briefly render as text, then upgrade in-place once KaTeX resolves
// (usually one render tick after mount).

import { useEffect, useMemo, useState } from 'react';

type MathSegment =
  | { kind: 'text'; value: string }
  | { kind: 'inline'; value: string }
  | { kind: 'block'; value: string };

// --- Segment parser (unchanged from v0.38). ---
function parseSegments(input: string): MathSegment[] {
  const out: MathSegment[] = [];
  let i = 0;
  let text = '';
  while (i < input.length) {
    const ch = input[i];
    if (ch === '\\' && input[i + 1] === '$') {
      text += '$';
      i += 2;
      continue;
    }
    if (ch === '$') {
      if (input[i + 1] === '$') {
        const end = input.indexOf('$$', i + 2);
        if (end === -1) {
          text += input.slice(i);
          break;
        }
        if (text) out.push({ kind: 'text', value: text });
        text = '';
        out.push({ kind: 'block', value: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
      const end = input.indexOf('$', i + 1);
      if (end === -1) {
        text += input.slice(i);
        break;
      }
      if (text) out.push({ kind: 'text', value: text });
      text = '';
      out.push({ kind: 'inline', value: input.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    text += ch;
    i += 1;
  }
  if (text) out.push({ kind: 'text', value: text });
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Module-level cache: a Promise for the KaTeX module. Ensures we
// only download / parse the KaTeX bundle once per page load, no
// matter how many MathText instances mount.
type KatexModule = typeof import('katex');
let katexPromise: Promise<KatexModule> | null = null;
function loadKatex(): Promise<KatexModule> {
  if (!katexPromise) {
    katexPromise = Promise.all([
      import('katex'),
      import('katex/dist/katex.min.css'),
    ]).then(([mod]) => (mod as unknown as { default: KatexModule }).default ?? (mod as unknown as KatexModule));
  }
  return katexPromise;
}

function safeRender(katex: KatexModule, tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode,
      strict: 'ignore',
    });
  } catch {
    return `<span class="text-amber-700 font-mono">$${escapeHtml(tex)}$</span>`;
  }
}

export function MathText({
  children,
  className,
  as: Tag = 'span',
}: {
  children: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
}) {
  const segments = useMemo(
    () => parseSegments(String(children ?? '')),
    [children]
  );

  const hasMath = segments.some((s) => s.kind !== 'text');
  const [katex, setKatex] = useState<KatexModule | null>(null);

  useEffect(() => {
    // Only load KaTeX if this text actually contains math markers.
    if (!hasMath) return;
    let cancelled = false;
    loadKatex().then((mod) => {
      if (!cancelled) setKatex(mod);
    });
    return () => {
      cancelled = true;
    };
  }, [hasMath]);

  const html = useMemo(() => {
    let out = '';
    for (const seg of segments) {
      if (seg.kind === 'text') {
        out += escapeHtml(seg.value);
      } else if (katex) {
        out += safeRender(katex, seg.value, seg.kind === 'block');
      } else {
        // KaTeX not ready yet — render the source as-is so the item
        // is still readable during the initial paint.
        out +=
          seg.kind === 'block'
            ? `<span class="font-mono">$$${escapeHtml(seg.value)}$$</span>`
            : `<span class="font-mono">$${escapeHtml(seg.value)}$</span>`;
      }
    }
    return out;
  }, [segments, katex]);

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
