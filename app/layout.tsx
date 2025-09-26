import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';

export const metadata: Metadata = {
  title: 'Synora × GRANHAND — 추구미 테스트',
  description: '10개의 질문으로 당신의 추구미를 찾아드려요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-screen bg-mintCream text-slateInk antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded-md">
          Skip to content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}


