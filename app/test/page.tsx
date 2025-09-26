"use client";

import TestForm from '@/components/TestForm';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function TestPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">{t('testTitle')}</h1>
      </div>
      <TestForm />
    </main>
  );
}


