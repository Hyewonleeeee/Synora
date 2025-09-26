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
      <div className="absolute inset-0 -z-10 bg-ambient" aria-hidden="true" />
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 text-center"
      >
        <motion.h1 variants={item} className="text-3xl sm:text-5xl font-semibold leading-tight sm:leading-[1.2] tracking-normal">
          {t('headline')}
        </motion.h1>
        <motion.p variants={item} className="mt-6 text-base sm:text-lg opacity-80">
          {t('sub')}
        </motion.p>
        <motion.div variants={item} className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/test"
            className="inline-flex items-center justify-center rounded-2xl bg-forestGreen text-lightMint px-6 py-3 text-sm sm:text-base font-medium shadow-soft transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage"
            aria-label={t('cta')}
          >
            {t('cta')}
          </Link>
          <a
            href="#about"
            className="inline-flex items-center justify-center rounded-2xl bg-white/80 ring-1 ring-warmBrown/20 px-5 py-3 text-sm sm:text-base font-medium text-slateInk/80 hover:bg-white transition"
          >
            {t('intro')}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

