import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';

export const metadata: Metadata = {
  title: 'Kindle × GRANHAND — 추구미 테스트',
  description: '10개의 질문으로 당신의 추구미를 찾아드려요.',
};

// GitHub Pages basePath 처리
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/Kindle' : '');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-screen text-white antialiased relative overflow-x-hidden">
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
          <source src={`${basePath}/assets/forest.mp4`} type="video/mp4" />
        </video>
        
        {/* 검은색 그라데이션 오버레이 (아주 옅게) */}
        <div 
          className="fixed top-0 left-0 w-full h-full z-10"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.2) 100%)',
            pointerEvents: 'none'
          }}
        />
        
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded-md">
          Skip to content
        </a>
        <LanguageProvider>
          <div className="relative z-20">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}


