"use client";

import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { ChevronDown, Hand } from 'lucide-react';

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

  const aestheticDescriptions: Record<string, string> = {
    // 여성
    "Clean Girl": "비누향이 날 것 같은 깨끗하고 미니멀한 분위기",
    "Light Academia": "책과 커피 향이 어울리는 클래식한 무드",
    "Soft Girl": "사랑스럽고 포근한 감성, 로맨틱한 무드",
    "Balletcore": "우아한 여성스러움, 클래식한 발레리나",
    "Dark Academia": "오래된 책장 앞에서 사색하는 지적인 무드",
    "Mori Girl": "햇살 드는 숲속의 몽환적이고 순수한 무드",
    "Mob Wife": "이탈리안 마피아 부인처럼 대담하고 강렬한 여성미",
    "Acubi": "몽환적인 Y2K 감성, 슬픔과 귀여움이 섞인 얼음빛 무드",
    "Rockstar": "자유롭고 반항적인 매력, 무너짐 속에서도 카리스마가 느껴지는 감각",
    "Vampire": "관능적이면서도 고요한 미, 차가운 피부와 붉은 피의 대비",
    "Boss Babe": "프로페셔널하고 당당한 카리스마, 도시적이고 정제된 파워 뷰티",
    // 남성
    "Clean Boy": "깔끔하고 단정한 미니멀 감성, 도시적인 세련미",
    "Soft Boy": "감성적이고 따뜻한 무드, 부드러운 매력",
    "Dark Academia Boy": "지적이고 클래식한 감성, 깊이 있는 분위기",
    "Natural Boy": "자연스러움, 편안함 중심의 스타일",
    "Street Boy": "자유롭고 트렌디한 감성, 개성 있는 스타일",
    "Rock Boy": "강렬하고 예술적인 무드, 반항적인 자유",
    "Gentle Boy": "품격 있고 성숙한 무드, 클래식 신사 스타일",
    "Tech Boy": "미니멀하고 기능적인 하이테크 감성, 도시적인 무드",
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
    ? (lang === 'ko' || lang === 'en' 
        ? styleNames[style as keyof typeof styleNames][lang]
        : styleNames[style as keyof typeof styleNames]['en']) // cn, jp는 영어로 폴백
    : (lang === 'ko' ? '알 수 없음' : 'Unknown');

  // 영문 스타일명으로 aesthetic description 찾기
  const styleNameEn = style && styleNames[style as keyof typeof styleNames]
    ? styleNames[style as keyof typeof styleNames]['en']
    : 'Unknown';
  
  const aestheticDescription = aestheticDescriptions[styleNameEn] || '';

  const fragrances = style ? fragranceData[style] || [] : [];
  // scroll-snap 사용으로 추가 핸들러 불필요

  return (
    <main className="min-h-screen relative">
      {/* 배경 비디오 */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        style={{ objectFit: 'cover', pointerEvents: 'none' }}
        webkit-playsinline="true"
      >
        <source src="/assets/forest.mp4" type="video/mp4" />
      </video>
      
      {/* 검은색 그라데이션 오버레이 (아주 옅게) */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-10"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.2) 100%)',
          pointerEvents: 'none'
        }}
      />
      
      <div className="h-screen overflow-y-auto snap-y snap-mandatory relative z-20">
        {/* 첫 번째 페이지: 무드 인트로 섹션 (아이보리 카드 스타일) */}
        <div className="min-h-screen flex items-center justify-center p-4 snap-start relative">
          <div 
            className="max-w-4xl w-full text-center relative z-10 p-8 sm:p-12 md:p-16"
            style={{
              backgroundColor: 'rgba(253, 252, 240, 0.95)',
              borderRadius: '20px',
              border: '1px solid #EBE9D6',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 5px 15px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* 상단 텍스트: "당신의 추구미는" */}
            <p 
              className="text-lg sm:text-xl mb-4 font-light"
              style={{
                color: '#2C2C2C',
                letterSpacing: '0.15em',
                fontWeight: 300,
                fontSize: '18px',
                opacity: 0.7
              }}
            >
              {lang === 'ko' ? '당신의 추구미는' : 'Your style is'}
            </p>
            
            {/* Main Title: 결과 키워드 - 아주 크고 얇은 폰트 */}
            <h1 
              className="text-6xl sm:text-8xl md:text-9xl font-light tracking-tight mb-6"
              style={{
                color: '#1A1A1A',
                fontWeight: 300,
                letterSpacing: '-0.05em'
              }}
            >
              {styleName}
            </h1>
            
            {/* Sub Description: 한 줄 설명 */}
            {aestheticDescription && (
              <p 
                className="text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto mb-20"
                style={{
                  color: '#3A3A3A',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: 1.6,
                  opacity: 0.85
                }}
              >
                {aestheticDescription}
              </p>
            )}
            
            {/* 홈으로 돌아가기 버튼과 스크롤 아이콘 컨테이너 */}
            <div className="mt-16 flex flex-col items-center gap-10">
              {/* 홈으로 돌아가기 버튼 - 작고 심플하게 */}
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-light transition-all border"
                  style={{
                    color: '#2C2C2C',
                    borderColor: '#2C2C2C',
                    backgroundColor: 'transparent',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = '#2C2C2C';
                    e.currentTarget.style.color = '#FDFCF0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#2C2C2C';
                  }}
                >
                  {lang === 'ko' ? '홈으로 돌아가기' : 'Back to Home'}
                </Link>
              </div>
              
              {/* 스크롤 유도 아이콘 - 손가락 + 화살표 (버튼과 충분한 간격) */}
              <div className="flex flex-col items-center gap-2 animate-bounce" style={{ color: '#2C2C2C', opacity: 0.6 }}>
                <Hand className="h-6 w-6" />
                <ChevronDown className="h-5 w-5 -mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* 향수 페이지들 */}
        {fragrances.map((fragrance, idx) => {
          const imageName = fragrance.name;
          const imagePath = `jpg/${imageName}.jpg`;
          const isLast = idx === fragrances.length - 1;
          
          return (
            <div
              key={idx}
              className={`min-h-screen flex items-center justify-center p-4 snap-start relative ${idx === 0 ? 'mt-32' : ''}`}
              style={{ marginTop: idx === 0 ? '120px' : '0' }}
            >
              <div 
                className="max-w-4xl w-full mx-auto rounded-[20px] overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(253, 252, 240, 0.95)',
                  border: '1px solid #EBE9D6',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 5px 15px -5px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 40px -10px rgba(0, 0, 0, 0.2), 0 8px 20px -5px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 5px 15px -5px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* 이미지 - 상단에 꽉 차게 */}
                <div className="w-full">
                  <img 
                    src={imagePath} 
                    alt={fragrance.koreanName}
                    className="w-full h-auto max-h-[60vh] sm:max-h-[75vh] object-cover"
                  />
                </div>
                
                {/* 텍스트 정보 - 하단에 정렬 */}
                <div className="p-6 sm:p-8">
                  <p 
                    className="text-lg sm:text-xl font-medium mb-3"
                    style={{
                      color: '#2C2C2C',
                      opacity: 0.7
                    }}
                  >
                    {lang === 'ko' ? `추천 향수 ${idx + 1}.` : `Recommendation ${idx + 1}.`}
                  </p>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{
                      color: '#1A1A1A'
                    }}
                  >
                    {fragrance.koreanName}
                  </h2>
                  <p 
                    className="text-base sm:text-lg leading-relaxed font-normal"
                    style={{
                      color: '#3A3A3A',
                      opacity: 0.85
                    }}
                  >
                    {fragrance.description}
                  </p>
                </div>
              </div>
              
              {/* 마지막 향수가 아닐 때만 스크롤 유도 아이콘 표시 */}
              {!isLast && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ color: '#2C2C2C', opacity: 0.6 }}>
                  <Hand className="h-6 w-6" />
                  <ChevronDown className="h-5 w-5" />
                </div>
              )}
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

