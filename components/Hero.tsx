"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative isolate pb-12 sm:pb-16">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 text-center floating"
      >
        <motion.h1 variants={item} className="text-3xl sm:text-5xl font-bold leading-tight sm:leading-[1.2] tracking-tight text-white">
          {t('headline')}
        </motion.h1>
        <motion.p variants={item} className="mt-6 text-base sm:text-lg opacity-90 text-white font-normal">
          {t('sub')}
        </motion.p>
        <motion.div variants={item} className="mt-12 flex flex-col items-center gap-6">
          <Link
            href="/test"
            className="glass-button-primary inline-flex items-center justify-center rounded-2xl px-12 py-6 text-lg sm:text-2xl font-semibold text-white w-full max-w-md"
            aria-label={t('cta')}
            style={{ minHeight: '70px' }}
          >
            {t('cta')}
          </Link>
          <a
            href="#about"
            className="glass-button inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-medium text-white"
          >
            {t('intro')}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

