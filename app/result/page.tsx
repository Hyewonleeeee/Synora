"use client";

import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import Link from 'next/link';
import { Suspense, useState } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const style = searchParams.get('style');
  const { lang } = useLanguage();
  // NOTE: native scroll-snap으로 전환하여 커스텀 스크롤 상태 불필요

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

  const fragranceData: Record<string, { name: string; koreanName: string; description: string }[]> = {
    // 여성
    cleanGirl: [
      { name: 'lily_owen', koreanName: '릴리 오웬', description: '봄비에 젖어 흐르는 꽃잎들.' },
      { name: 'toit_vert', koreanName: '트와 베르', description: '수분기 가득한 식물원의 공기.' },
    ],
    softGirl: [
      { name: 'susie_salmon', koreanName: '수지살몬', description: '달콤한 과일을 먹은 뒤 낮잠.' },
      { name: 'wegener', koreanName: '베게너', description: '화려한 색감의 생화로 만든 꽃다발.' },
    ],
    lightAcademia: [
      { name: 'marine_orchid', koreanName: '마린 오키드', description: '인적이 드문 해안도로에서의 드라이빙.' },
      { name: 'kyujang', koreanName: '규장', description: '오래된 종이에서 느껴지는 시간의 향.' },
    ],
    darkAcademia: [
      { name: 'kyujang', koreanName: '규장', description: '오래된 종이에서 느껴지는 시간의 향.' },
      { name: 'violette', koreanName: '비올레뜨', description: '가을 달빛을 머금은 보라꽃.' },
    ],
    balletcore: [
      { name: 'wegener', koreanName: '베게너', description: '화려한 색감의 생화로 만든 꽃다발.' },
      { name: 'susie_salmon', koreanName: '수지살몬', description: '달콤한 과일을 먹은 뒤 낮잠.' },
    ],
    moriGirl: [
      { name: 'lucien_carr', koreanName: '루시엔 카', description: '안개 낀 소나무 숲에서의 산책.' },
      { name: 'susie_salmon', koreanName: '수지살몬', description: '달콤한 과일을 먹은 뒤 낮잠.' },
    ],
    mobWife: [
      { name: 'violette', koreanName: '비올레뜨', description: '가을 달빛을 머금은 보라꽃.' },
      { name: 'wegener', koreanName: '베게너', description: '화려한 색감의 생화로 만든 꽃다발.' },
    ],
    acubi: [
      { name: 'kyujang', koreanName: '규장', description: '오래된 종이에서 느껴지는 시간의 향.' },
      { name: 'roland', koreanName: '롤랑', description: '도망쳐 온 낙원의 풍경.' },
    ],
    rockstar: [
      { name: 'roland', koreanName: '롤랑', description: '도망쳐 온 낙원의 풍경.' },
      { name: 'marine_orchid', koreanName: '마린 오키드', description: '인적이 드문 해안도로에서의 드라이빙.' },
    ],
    vampire: [
      { name: 'violette', koreanName: '비올레뜨', description: '가을 달빛을 머금은 보라꽃.' },
      { name: 'lucien_carr', koreanName: '루시엔 카', description: '안개 낀 소나무 숲에서의 산책.' },
    ],
    bossBabe: [
      { name: 'wegener', koreanName: '베게너', description: '화려한 색감의 생화로 만든 꽃다발.' },
      { name: 'toit_vert', koreanName: '트와 베르', description: '수분기 가득한 식물원의 공기.' },
    ],
    // 남성
    cleanBoy: [
      { name: 'toit_vert', koreanName: '트와 베르', description: '수분기 가득한 식물원의 공기.' },
      { name: 'marine_orchid', koreanName: '마린 오키드', description: '인적이 드문 해안도로에서의 드라이빙.' },
    ],
    softBoy: [
      { name: 'toit_vert', koreanName: '트와 베르', description: '수분기 가득한 식물원의 공기.' },
      { name: 'lucien_carr', koreanName: '루시엔 카', description: '안개 낀 소나무 숲에서의 산책.' },
    ],
    darkAcademiaBoy: [
      { name: 'kyujang', koreanName: '규장', description: '오래된 종이에서 느껴지는 시간의 향.' },
      { name: 'violette', koreanName: '비올레뜨', description: '가을 달빛을 머금은 보라꽃.' },
    ],
    naturalBoy: [
      { name: 'lucien_carr', koreanName: '루시엔 카', description: '안개 낀 소나무 숲에서의 산책.' },
      { name: 'toit_vert', koreanName: '트와 베르', description: '수분기 가득한 식물원의 공기.' },
    ],
    streetBoy: [
      { name: 'marine_orchid', koreanName: '마린 오키드', description: '인적이 드문 해안도로에서의 드라이빙.' },
      { name: 'roland', koreanName: '롤랑', description: '도망쳐 온 낙원의 풍경.' },
    ],
    rockBoy: [
      { name: 'roland', koreanName: '롤랑', description: '도망쳐 온 낙원의 풍경.' },
      { name: 'marine_orchid', koreanName: '마린 오키드', description: '인적이 드문 해안도로에서의 드라이빙.' },
    ],
    gentleBoy: [
      { name: 'violette', koreanName: '비올레뜨', description: '가을 달빛을 머금은 보라꽃.' },
      { name: 'kyujang', koreanName: '규장', description: '오래된 종이에서 느껴지는 시간의 향.' },
    ],
    techBoy: [
      { name: 'marine_orchid', koreanName: '마린 오키드', description: '인적이 드문 해안도로에서의 드라이빙.' },
      { name: 'violette', koreanName: '비올레뜨', description: '가을 달빛을 머금은 보라꽃.' },
    ],
  };

  const styleName = style && styleNames[style as keyof typeof styleNames]
    ? styleNames[style as keyof typeof styleNames][lang]
    : (lang === 'ko' ? '알 수 없음' : 'Unknown');

  const fragrances = style ? fragranceData[style] || [] : [];
  // scroll-snap 사용으로 추가 핸들러 불필요

  return (
    <main className="min-h-screen bg-grain">
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        {/* 첫 번째 페이지: 추구미 결과 */}
        <div className="min-h-screen flex items-center justify-center p-4 snap-start">
          <div className="max-w-2xl w-full rounded-2xl bg-white/80 backdrop-blur ring-1 ring-warmBrown/10 shadow-wood p-6 sm:p-8 relative z-10">
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold mb-6">
                {lang === 'ko' ? '당신의 추구미는' : 'Your style is'}
              </h1>
              <div className="bg-summerBeige/30 rounded-xl py-4 px-6 inline-block">
                <p className="text-2xl sm:text-3xl font-bold text-forestGreen">
                  {styleName}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-forestGreen opacity-70 mt-6">
                {lang === 'ko' ? '아래로 스크롤하여 추천 향수를 확인해 보세요.' : 'Scroll down to see recommended fragrances.'}
              </p>
            </div>
            
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-forestGreen text-lightMint px-6 py-2.5 text-sm font-medium shadow-soft transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage"
              >
                {lang === 'ko' ? '홈으로 돌아가기' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>

        {/* 향수 페이지들 */}
        {fragrances.map((fragrance, idx) => {
          const imageName = fragrance.name;
          const imagePath = `jpg/${imageName}.jpg`;
          
          return (
            <div
              key={idx}
              className={`min-h-screen flex items-center justify-center p-4 snap-start ${idx > 0 ? '-mt-16' : ''}`}
            >
              <div className="max-w-4xl w-full rounded-[2.5rem] bg-gradient-to-br from-white/90 to-summerBeige/40 backdrop-blur shadow-[0_20px_60px_rgba(76,130,100,0.15)] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(76,130,100,0.25)] cursor-pointer border-4 border-forestGreen/30 hover:border-forestGreen/50">
                <div className="px-6 py-5 text-center">
                  <p className="text-lg sm:text-2xl font-semibold text-forestGreen">
                    {lang === 'ko' ? `추천 향수 ${idx + 1}.` : `Recommendation ${idx + 1}.`}
                  </p>
                </div>
                <div className="p-6">
                  <img 
                    src={imagePath} 
                    alt={fragrance.koreanName}
                    className="w-full h-[78vh] object-contain rounded-3xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </div>
            </div>
          );
        })}
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

