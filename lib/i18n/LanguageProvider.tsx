"use client";

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

type Language = 'ko' | 'en' | 'cn' | 'jp';

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  ko: {
    headline: "퍼스널 향수 테스트",
    sub: "당신의 무드를 공유하세요. GRANHAND가 향기로 대답합니다.",
    subLine1: "당신의 무드를 공유하세요",
    subLine2: "GRANHAND가 향기로 대답합니다.",
    cta: "테스트 시작하기",
    intro: "프로젝트 소개",
    cobrand: "Kindle × GRANHAND",
    langKo: "한국어",
    langEn: "English",
    pill1Title: "개인화 추천",
    pill1Desc: "성격/무드/MBTI 기반",
    pill2Title: "사운드 스케이프",
    pill2Desc: "향기에 맞춘 공간음향 매칭",
    pill3Title: "팝업 연계",
    pill3Desc: "오프라인 팝업에서 확장 체험",
    footer: "© 2025 Kindle. All rights reserved.",
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
    langCn: "中文",
    langJp: "日本語",
  },
  en: {
    headline: "Personal Fragrance Test",
    sub: "Share your mood. GRANHAND answers in fragrance.",
    subLine1: "Share your mood.",
    subLine2: "GRANHAND answers in fragrance.",
    cta: "Start the test",
    intro: "About the project",
    cobrand: "Kindle × GRANHAND",
    langKo: "Korean",
    langEn: "English",
    pill1Title: "Personalized",
    pill1Desc: "Based on personality/mood/MBTI",
    pill2Title: "Soundscape",
    pill2Desc: "Spatial audio matched to scent",
    pill3Title: "Popup-linked",
    pill3Desc: "Extended experience at offline popup",
    footer: "© 2025 Kindle. All rights reserved.",
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
    langCn: "中文",
    langJp: "日本語",
  },
  cn: {
    headline: "个人香水测试",
    sub: "分享你的心情。GRANHAND用香味回答。",
    subLine1: "分享你的心情。",
    subLine2: "GRANHAND用香味回答。",
    cta: "开始测试",
    intro: "项目介绍",
    cobrand: "Kindle × GRANHAND",
    langKo: "한국어",
    langEn: "English",
    langCn: "中文",
    langJp: "日本語",
    pill1Title: "个性化推荐",
    pill1Desc: "基于性格/心情/MBTI",
    pill2Title: "声音景观",
    pill2Desc: "匹配香味的空间音效",
    pill3Title: "快闪联动",
    pill3Desc: "线下快闪扩展体验",
    footer: "© 2025 Kindle. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    step: "步骤",
    step1Title: "年龄 · 性别",
    step2Title: "MBTI",
    age: "年龄",
    ageHelp: "请输入大致年龄以获得更准确的推荐。",
    gender: "性别",
    female: "女性",
    male: "男性",
    other: "其他/不选择",
    next: "下一步",
    back: "返回",
    mbti: "MBTI",
    select: "请选择",
    submit: "提交",
    testTitle: "个人香水测试",
  },
  jp: {
    headline: "パーソナル香水テスト",
    sub: "あなたのムードを共有してください。GRANHANDが香りで答えます。",
    subLine1: "あなたのムードを共有してください。",
    subLine2: "GRANHANDが香りで答えます。",
    cta: "テストを開始",
    intro: "プロジェクト紹介",
    cobrand: "Kindle × GRANHAND",
    langKo: "한국어",
    langEn: "English",
    langCn: "中文",
    langJp: "日本語",
    pill1Title: "パーソナライズ",
    pill1Desc: "性格/ムード/MBTIベース",
    pill2Title: "サウンドスケープ",
    pill2Desc: "香りに合わせた空間音響",
    pill3Title: "ポップアップ連携",
    pill3Desc: "オフラインポップアップでの拡張体験",
    footer: "© 2025 Kindle. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    step: "ステップ",
    step1Title: "年齢 · 性別",
    step2Title: "MBTI",
    age: "年齢",
    ageHelp: "より正確な推奨のために、おおよその年齢を入力してください。",
    gender: "性別",
    female: "女性",
    male: "男性",
    other: "その他/選択しない",
    next: "次へ",
    back: "戻る",
    mbti: "MBTI",
    select: "選択してください",
    submit: "提出",
    testTitle: "パーソナル香水テスト",
  },
};

type LanguageContextValue = {
  lang: Language;
  t: (key: keyof typeof translations["ko"]) => string;
  toggle: () => void;
  set: (l: Language) => void;
  isLangMenuOpen: boolean;
  setIsLangMenuOpen: (open: boolean) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // localStorage에서 저장된 언어를 불러오거나 기본값 'ko' 사용
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('app-lang') as Language | null;
      if (savedLang && ['ko', 'en', 'cn', 'jp'].includes(savedLang)) {
        return savedLang;
      }
    }
    return 'ko';
  });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // 앱 시작 시 localStorage에서 언어 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('app-lang') as Language | null;
      if (savedLang && ['ko', 'en', 'cn', 'jp'].includes(savedLang)) {
        setLang(savedLang);
      }
    }
  }, []);
  
  // 언어 변경 함수를 useCallback으로 안정화
  const handleSetLang = useCallback((newLang: Language) => {
    if (['ko', 'en', 'cn', 'jp'].includes(newLang)) {
      setLang(newLang);
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('app-lang', newLang);
      }
    }
  }, []);
  
  const t = useCallback((key: keyof typeof translations["ko"]) => {
    // 현재 언어의 번역이 있으면 사용
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    // 영어 번역으로 폴백
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    // 한국어 번역으로 폴백
    if (translations['ko'] && translations['ko'][key]) {
      return translations['ko'][key];
    }
    // 모두 없으면 키 자체를 반환
    return key;
  }, [lang]);
  
  const toggle = useCallback(() => {
    const languageOrder: Language[] = ['ko', 'en', 'cn', 'jp'];
    const currentIndex = languageOrder.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languageOrder.length;
    setLang(languageOrder[nextIndex]);
  }, [lang]);
  
  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    t,
    toggle,
    set: handleSetLang,
    isLangMenuOpen,
    setIsLangMenuOpen,
  }), [lang, t, toggle, handleSetLang, isLangMenuOpen]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

