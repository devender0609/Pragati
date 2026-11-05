// v0.45 — Language switcher pill.
//
// Rendered in the app header. Toggles between English and Hindi.
// Persists via useT().setLang, which writes to localStorage under
// `pragati.lang.v1` so the choice survives reloads.

import { LANG_LABEL, useT, type Lang } from '../../lib/i18n';

const LANGS: Lang[] = ['en', 'hi'];

export function LanguageSwitcher() {
  const { lang, setLang } = useT();
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200"
    >
      {LANGS.map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={lang === l}
          onClick={() => setLang(l)}
          // v0.50 §13 — 44px minimum touch target. These were 24px
          // tall, which is below every published guideline and hard to
          // hit for the youngest users the app targets.
          className={`inline-flex min-h-[44px] items-center rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
            lang === l
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
