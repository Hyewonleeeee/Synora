"use client";

import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Languages } from 'lucide-react';
import Link from 'next/link';

export default function TopBar() {
  const { lang, toggle, t } = useLanguage();
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/40 border-b border-warmBrown/10">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-tight" aria-label="Synora" role="img">
          Synora
        </div>
        <div className="text-sm sm:text-base font-medium opacity-80" aria-label={t('cobrand')}>
          {t('cobrand')}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm shadow-soft ring-1 ring-warmBrown/20 hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-200"
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

