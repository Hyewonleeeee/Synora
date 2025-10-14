"use client";

import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import Link from 'next/link';
import { Suspense } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const style = searchParams.get('style');
  const { lang } = useLanguage();

  const styleNames: Record<string, { ko: string; en: string }> = {
    // 여성
    cleanGirl: { ko: '클린걸', en: 'Clean Girl' },
    softGirl: { ko: '소프트걸', en: 'Soft Girl' },
    coquette: { ko: '코켓', en: 'Coquette' },
    lightAcademia: { ko: '라이트 아카데미아', en: 'Light Academia' },
    darkAcademia: { ko: '다크 아카데미아', en: 'Dark Academia' },
    balletcore: { ko: '발레코어', en: 'Balletcore' },
    moriGirl: { ko: '모리걸', en: 'Mori Girl' },
    acubi: { ko: '아쿠비', en: 'Acubi' },
    mobWife: { ko: '몹 와이프', en: 'Mob Wife' },
    rockstar: { ko: '락스타', en: 'Rockstar' },
    vampire: { ko: '뱀파이어', en: 'Vampire' },
    bossBabe: { ko: '보스 베이브', en: 'Boss Babe' },
    // 남성
    cleanBoy: { ko: '클린 보이', en: 'Clean Boy' },
    softBoy: { ko: '소프트 보이', en: 'Soft Boy' },
    darkAcademiaBoy: { ko: '다크 아카데미아 보이', en: 'Dark Academia Boy' },
    naturalBoy: { ko: '내츄럴 보이', en: 'Natural Boy' },
    streetBoy: { ko: '스트릿 보이', en: 'Street Boy' },
    rockBoy: { ko: '락 보이', en: 'Rock Boy' },
    gentleBoy: { ko: '젠틀 보이', en: 'Gentle Boy' },
    techBoy: { ko: '테크 보이', en: 'Tech Boy' },
  };

  const styleName = style && styleNames[style as keyof typeof styleNames]
    ? styleNames[style as keyof typeof styleNames][lang]
    : (lang === 'ko' ? '알 수 없음' : 'Unknown');

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-warmBrown/10 shadow-wood p-8 sm:p-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-semibold mb-4">
            {lang === 'ko' ? '당신의 추구미는' : 'Your style is'}
          </h1>
          <div className="my-8 py-6 px-8 bg-summerBeige/30 rounded-2xl">
            <p className="text-3xl sm:text-5xl font-bold text-forestGreen">
              {styleName}
            </p>
          </div>
          <p className="text-base sm:text-lg opacity-80 mb-8">
            {lang === 'ko' 
              ? '추천 향수는 곧 업데이트될 예정입니다.' 
              : 'Recommended fragrances will be updated soon.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-forestGreen text-lightMint px-8 py-3 text-base font-medium shadow-soft transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage"
          >
            {lang === 'ko' ? '홈으로 돌아가기' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}

