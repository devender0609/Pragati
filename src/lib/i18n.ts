// v0.45 — Lightweight i18n framework.
//
// Goal: give the app a plain t()/useT() API so future strings can be
// translated without changing call sites, and seed Hindi translation
// for the most-visible UI copy. Item content (stems, options,
// solutions) is NOT translated here — that's a per-item authoring
// pass, out of scope for this iteration.
//
// Language selection persists to localStorage under `pragati.lang.v1`
// and defaults to English. A LanguageSwitcher component lives in
// components/common/LanguageSwitcher.tsx.

import { useSyncExternalStore } from 'react';

export type Lang = 'en' | 'hi';

export const LANG_LABEL: Record<Lang, string> = {
  en: 'English',
  hi: 'हिन्दी',
};

const STORAGE_KEY = 'pragati.lang.v1';

// --- Dictionaries -------------------------------------------------------

// Every UI string is keyed here. `en` is source of truth; `hi` fills
// in where translated, falls back to en on missing keys.
const dict = {
  en: {
    // Home / hero
    'home.title': 'Pragati — Growth Assessment',
    'home.subtitle':
      'A CBSE / NCERT-informed prototype. Not a calibrated assessment. Teacher review required before pilot use.',
    'home.start': 'Start assessment',
    'home.resume': 'Resume',
    'home.pickAssessment': 'Pick an assessment',
    // Session
    'session.question': 'Question',
    'session.of': 'of up to',
    'session.progress': 'Progress',
    'session.submit': 'Submit answer',
    'session.saving': 'Saving…',
    'session.yourAnswer': 'Your answer',
    'session.tipKeyboard': 'Tip: press 1–4 to select · Enter to submit',
    // Results
    'results.correct': 'Correct',
    'results.incorrect': 'Incorrect',
    'results.yourAnswer': 'Your answer',
    'results.correctAnswer': 'Correct answer',
    'results.whyTempting': 'Why this looked tempting',
    'results.whatToTry': 'What to try',
    'results.learnThis': 'Learn this skill →',
    'results.reviewTitle': "Let's look at what went wrong",
    'results.reviewNone':
      'Every answer was correct — nothing to review here.',
    'results.anotherSession': 'Take another session',
    'results.home': 'Home',
    // Common
    'common.back': '← Back',
    'common.next': 'Next →',
    'common.class': 'Class',
    'common.teacherReviewRequired': 'Teacher review required',
    'common.available': 'Available',
    'common.approved': 'Approved',
    'common.approve': 'Approve this item',
    'common.language': 'Language',
    'common.beta': 'prototype',
  },
  hi: {
    'home.title': 'प्रगति — विकास मूल्यांकन',
    'home.subtitle':
      'CBSE / NCERT से प्रेरित एक प्रोटोटाइप। यह एक अंशांकित (calibrated) मूल्यांकन नहीं है। किसी भी पायलट उपयोग से पहले शिक्षक समीक्षा आवश्यक है।',
    'home.start': 'मूल्यांकन शुरू करें',
    'home.resume': 'जारी रखें',
    'home.pickAssessment': 'एक मूल्यांकन चुनें',
    'session.question': 'प्रश्न',
    'session.of': 'में से (अधिकतम)',
    'session.progress': 'प्रगति',
    'session.submit': 'उत्तर सबमिट करें',
    'session.saving': 'सहेजा जा रहा है…',
    'session.yourAnswer': 'आपका उत्तर',
    'session.tipKeyboard': 'सुझाव: 1–4 दबाकर विकल्प चुनें · Enter से सबमिट करें',
    'results.correct': 'सही',
    'results.incorrect': 'गलत',
    'results.yourAnswer': 'आपका उत्तर',
    'results.correctAnswer': 'सही उत्तर',
    'results.whyTempting': 'यह विकल्प क्यों आकर्षक लगा',
    'results.whatToTry': 'आगे क्या करें',
    'results.learnThis': 'यह कौशल सीखें →',
    'results.reviewTitle': 'देखते हैं कहाँ गलती हुई',
    'results.reviewNone': 'सभी उत्तर सही थे — यहाँ समीक्षा के लिए कुछ नहीं है।',
    'results.anotherSession': 'एक और सत्र लें',
    'results.home': 'होम',
    'common.back': '← वापस',
    'common.next': 'अगला →',
    'common.class': 'कक्षा',
    'common.teacherReviewRequired': 'शिक्षक समीक्षा आवश्यक',
    'common.available': 'उपलब्ध',
    'common.approved': 'स्वीकृत',
    'common.approve': 'इस प्रश्न को स्वीकृत करें',
    'common.language': 'भाषा',
    'common.beta': 'प्रोटोटाइप',
  },
} as const;

export type TranslationKey = keyof (typeof dict)['en'];

// --- Store --------------------------------------------------------------

function readLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'en' || raw === 'hi') return raw;
  } catch {}
  return 'en';
}

let currentLang: Lang = readLang();
type Listener = () => void;
const listeners = new Set<Listener>();

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  try {
    if (typeof window !== 'undefined')
      window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
  for (const l of listeners) l();
}

export function t(key: TranslationKey, lang: Lang = currentLang): string {
  const table = dict[lang] as Record<string, string>;
  const fallback = dict.en as Record<string, string>;
  return table[key] ?? fallback[key] ?? key;
}

// React hook — returns { lang, t, setLang }.
export function useT() {
  const lang = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentLang,
    () => currentLang
  );
  return {
    lang,
    t: (k: TranslationKey) => t(k, lang),
    setLang,
  };
}
