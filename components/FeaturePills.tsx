"use client";

import { AudioLines, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const features = [
  { icon: Sparkles, titleKey: 'pill1Title', descKey: 'pill1Desc' },
  { icon: AudioLines, titleKey: 'pill2Title', descKey: 'pill2Desc' },
  { icon: MapPin, titleKey: 'pill3Title', descKey: 'pill3Desc' },
] as const;

export default function FeaturePills() {
  const { t, lang } = useLanguage();
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-8 sm:pb-12" aria-label="Key features">
      <ul className="grid grid-cols-3 gap-3 sm:gap-4">
        {features.map((f, i) => (
          <motion.li
            key={f.titleKey}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: 0.15 * i }}
            className="glass-card rounded-xl p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/15"
          >
            <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/90 mb-2" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-white text-xs sm:text-sm">{t(f.titleKey)}</h3>
              <p className={`text-xs opacity-90 mt-1 text-white leading-tight font-normal ${lang === 'en' && f.descKey === 'pill3Desc' ? 'whitespace-nowrap' : ''}`}>{t(f.descKey)}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

