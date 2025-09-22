"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function TestForm() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [mbti, setMbti] = useState<string>('');

  const isStep1Valid = age !== '' && Number(age) > 0 && gender !== '';
  const isStep2Valid = mbti !== '';

  const next = () => {
    if (step === 1 && isStep1Valid) setStep(2);
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-0 py-10">
      <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-black/5 shadow-soft p-6">
        <div className="mb-4 flex items-center justify-between text-sm opacity-70" aria-live="polite">
          <span>{t('step')} {step} / 2</span>
          <span>{t(step === 1 ? 'step1Title' : 'step2Title')}</span>
        </div>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" variants={fadeVariants} initial="initial" animate="animate" exit="exit">
              <div className="space-y-5">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium">{t('age')}</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastelLavender"
                    aria-describedby="age-help"
                  />
                  <p id="age-help" className="mt-1 text-xs opacity-70">{t('ageHelp')}</p>
                </div>
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium">{t('gender')}</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <label className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === 'female'}
                          onChange={(e) => setGender(e.target.value)}
                          className="accent-slateInk"
                        />
                        <span>{t('female')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === 'male'}
                          onChange={(e) => setGender(e.target.value)}
                          className="accent-slateInk"
                        />
                        <span>{t('male')}</span>
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm col-span-2">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={gender === 'other'}
                          onChange={(e) => setGender(e.target.value)}
                          className="accent-slateInk"
                        />
                        <span>{t('other')}</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={back} disabled className="opacity-40 cursor-not-allowed text-sm">
                  {t('back')}
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!isStep1Valid}
                  className="inline-flex items-center justify-center rounded-xl bg-slateInk text-white px-5 py-2 text-sm font-medium shadow-soft enabled:hover:scale-[1.01] transition disabled:opacity-50"
                >
                  {t('next')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" variants={fadeVariants} initial="initial" animate="animate" exit="exit">
              <div>
                <label htmlFor="mbti" className="block text-sm font-medium">{t('mbti')}</label>
                <select
                  id="mbti"
                  name="mbti"
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastelLavender"
                >
                  <option value="" disabled>{t('select')}</option>
                  {[
                    'INTJ','INTP','ENTJ','ENTP',
                    'INFJ','INFP','ENFJ','ENFP',
                    'ISTJ','ISFJ','ESTJ','ESFJ',
                    'ISTP','ISFP','ESTP','ESFP',
                  ].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={back} className="text-sm">
                  {t('back')}
                </button>
                <button
                  type="button"
                  disabled={!isStep2Valid}
                  className="inline-flex items-center justify-center rounded-xl bg-slateInk text-white px-5 py-2 text-sm font-medium shadow-soft enabled:hover:scale-[1.01] transition disabled:opacity-50"
                  onClick={() => alert(`${lang === 'ko' ? '제출되었습니다' : 'Submitted'}`)}
                >
                  {t('submit')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


