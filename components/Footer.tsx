"use client";

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-10 border-t border-black/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-80">
        <p>{t('footer')}</p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="hover:underline">{t('privacy')}</Link>
          <Link href="#" className="hover:underline">{t('terms')}</Link>
        </nav>
      </div>
    </footer>
  );
}

