"use client";

import { createContext, useContext, useMemo, useState } from 'react';

type Language = 'ko' | 'en';

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  ko: {
    headline: "퍼스널 향수 테스트",
    sub: "당신의 무드를 공유하세요. GRANHAND가 향기로 대답합니다.",
    subLine1: "당신의 무드를 공유하세요",
    subLine2: "GRANHAND가 향기로 대답합니다.",
    cta: "테스트 시작하기",
    intro: "프로젝트 소개",
    cobrand: "Synora × GRANHAND",
    langKo: "한국어",
    langEn: "English",
    pill1Title: "개인화 추천",
    pill1Desc: "성격/무드/MBTI 기반",
    pill2Title: "사운드 스케이프",
    pill2Desc: "향기에 맞춘 공간음향 매칭",
    pill3Title: "팝업 연계",
    pill3Desc: "오프라인 팝업에서 확장 체험",
    footer: "© 2025 Synora. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    step: "단계",
    step1Title: "나이 · 성별",
    step2Title: "MBTI",
    age: "나이",
    ageHelp: "정확한 추천을 위해 대략적인 나이를 입력해 주세요.",
    gender: "성별",
    female: "여성",
    male: "남성",
    other: "기타/선택 안 함",
    next: "다음",
    back: "이전",
    mbti: "MBTI",
    select: "선택하세요",
    submit: "제출하기",
    testTitle: "퍼스널 향수 테스트",
  },
  en: {
    headline: "Personal Fragrance Test",
    sub: "Share your mood. GRANHAND answers in fragrance.",
    subLine1: "Share your mood.",
    subLine2: "GRANHAND answers in fragrance.",
    cta: "Start the test",
    intro: "About the project",
    cobrand: "Synora × GRANHAND",
    langKo: "Korean",
    langEn: "English",
    pill1Title: "Personalized",
    pill1Desc: "Based on personality/mood/MBTI",
    pill2Title: "Soundscape",
    pill2Desc: "Spatial audio matched to scent",
    pill3Title: "Popup-linked",
    pill3Desc: "Extended experience at offline popup",
    footer: "© 2025 Synora. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    step: "Step",
    step1Title: "Age · Gender",
    step2Title: "MBTI",
    age: "Age",
    ageHelp: "Enter your approximate age to improve recommendations.",
    gender: "Gender",
    female: "Female",
    male: "Male",
    other: "Other / Prefer not to say",
    next: "Next",
    back: "Back",
    mbti: "MBTI",
    select: "Select",
    submit: "Submit",
    testTitle: "Personal Fragrance Test",
  },
};

type LanguageContextValue = {
  lang: Language;
  t: (key: keyof typeof translations["ko"]) => string;
  toggle: () => void;
  set: (l: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('ko');
  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    t: (key) => translations[lang][key],
    toggle: () => setLang((prev) => (prev === 'ko' ? 'en' : 'ko')),
    set: setLang,
  }), [lang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

