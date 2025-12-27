"use client";

import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Languages } from 'lucide-react';
import Link from 'next/link';

export default function TopBar() {
  const { lang, toggle, t } = useLanguage();
  return (
    <header className="sticky top-0 z-40 glass-container border-b border-white/20">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-white" aria-label="Synora" role="img">
          Synora
        </div>
        <div className="text-sm sm:text-base font-medium opacity-90 text-white" aria-label={t('cobrand')}>
          {t('cobrand')}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="glass-button inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white hover:bg-white/20 transition-all duration-200"
            aria-label={`Toggle language. Current ${lang === 'ko' ? t('langKo') : t('langEn')}`}
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            <span>{lang.toUpperCase()}</span>
          </button>
          <Link href="#about" className="sr-only">About</Link>
        </div>
      </nav>
    </header>
  );
}

