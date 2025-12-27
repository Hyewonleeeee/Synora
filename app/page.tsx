import TopBar from '@/components/TopBar';
import Hero from '@/components/Hero';
import FeaturePills from '@/components/FeaturePills';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Page() {
  return (
    <main id="main" className="bg-grain">
      <TopBar />
      <Hero />
      <FeaturePills />
      <section id="about" className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">About</h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 font-normal">
            Synora × GRANHAND 커스텀 퍼스널 향수 테스트의 프롤로그 화면입니다. 테스트는 곧 업데이트될 예정입니다.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}


