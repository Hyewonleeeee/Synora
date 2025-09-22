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
    <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-14 sm:pb-20" aria-label="Key features">
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {features.map((f, i) => (
          <motion.li
            key={f.titleKey}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: 0.15 * i }}
            className="rounded-2xl bg-white/60 backdrop-blur ring-1 ring-black/5 shadow-soft p-5 flex items-start gap-3"
          >
            <f.icon className="h-5 w-5 text-slateInk/70" aria-hidden="true" />
            <div>
              <h3 className="font-medium">{t(f.titleKey)}</h3>
              <p className={`text-sm opacity-80 mt-1 ${lang === 'en' && f.descKey === 'pill3Desc' ? 'whitespace-nowrap' : ''}`}>{t(f.descKey)}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

