"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Languages, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const languages: Array<{ code: 'ko' | 'en' | 'cn' | 'jp'; label: string; labelKey: 'langKo' | 'langEn' | 'langCn' | 'langJp' }> = [
  { code: 'ko', label: 'KO', labelKey: 'langKo' },
  { code: 'en', label: 'EN', labelKey: 'langEn' },
  { code: 'cn', label: 'CN', labelKey: 'langCn' },
  { code: 'jp', label: 'JP', labelKey: 'langJp' },
];

export default function TopBar() {
  const { lang, set, t, isLangMenuOpen, setIsLangMenuOpen } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === lang);
  
  // 현재 언어에 맞는 버튼 텍스트 생성
  const getButtonText = () => {
    if (currentLang) {
      return t(currentLang.labelKey);
    }
    return lang.toUpperCase();
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen, setIsLangMenuOpen]);

  const handleLanguageSelect = useCallback((languageCode: 'ko' | 'en' | 'cn' | 'jp') => {
    // 언어 변경 - 명시적으로 언어 코드를 전달
    set(languageCode);
    setIsLangMenuOpen(false);
  }, [set, setIsLangMenuOpen]);

  return (
    <header className="sticky top-0 z-40 glass-container border-b border-white/20" lang={lang}>
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-white" aria-label="Kindle" role="img">
          Kindle
        </div>
        <div className="text-sm sm:text-base font-medium opacity-90 text-white" aria-label={t('cobrand')}>
          {t('cobrand')}
        </div>
        <div className="flex items-center gap-2 relative" ref={menuRef}>
          {/* 언어 선택 버튼 */}
          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="glass-button inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white hover:bg-white/20 transition-all duration-200"
            aria-label={`Select language. Current ${getButtonText()}`}
            aria-expanded={isLangMenuOpen}
            aria-haspopup="true"
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            <span>{currentLang?.label || lang.toUpperCase()}</span>
            <ChevronDown 
              className={`h-3 w-3 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          
          {/* 드롭다운 메뉴 */}
          <AnimatePresence>
            {isLangMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full right-0 mt-2 glass-dropdown rounded-xl overflow-hidden shadow-lg min-w-[140px] z-[9999]"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageSelect(l.code)}
                    className={`w-full text-left px-4 py-2.5 text-sm text-white transition-all duration-200 hover:bg-white/25 ${
                      lang === l.code ? 'bg-white/15 font-semibold' : 'font-normal'
                    }`}
                  >
                    {t(l.labelKey)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <Link href="#about" className="sr-only">About</Link>
        </div>
      </nav>
    </header>
  );
}

