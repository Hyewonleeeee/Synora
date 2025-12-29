"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { lang } = useLanguage();

  const content = {
    ko: {
      title: "향기, 그 이상의 감각적 몰입을 위하여",
      paragraph1: "보이지 않는 가치를 지향하는 ",
      paragraph1Bold: "GRANHAND",
      paragraph1End: "와 함께 당신의 진정한 추구미를 발견해 보세요. 간단한 테스트를 통해 당신이 동경하는 '나만의 무드'를 정의하고, 그 분위기에 가장 깊이 스며들 두 가지 향기를 추천해 드립니다.",
      paragraph2: "저희는 여기서 한 걸음 더 나아가, 각 향기의 영혼을 담은 ",
      paragraph2Bold: "사운드 스케이프",
      paragraph2End: "를 제공합니다. 향기가 공간을 채울 때, 그 무드에 맞게 제작된 사운드가 더해져 당신만의 완전한 ",
      paragraph2Bold2: "몰입형 공간",
      paragraph2End2: "을 경험하게 될 것입니다.",
    },
    en: {
      title: "For Fragrance, Beyond Sensory Immersion",
      paragraph1: "Discover your true aesthetic with ",
      paragraph1Bold: "GRANHAND",
      paragraph1End: ", which pursues invisible values. Through a simple test, define your desired 'personal mood' and we'll recommend two fragrances that deeply immerse you in that atmosphere.",
      paragraph2: "We go one step further by providing ",
      paragraph2Bold: "soundscapes",
      paragraph2End: "that capture the soul of each fragrance. When the fragrance fills the space, the sound crafted to match that mood is added, creating your own complete ",
      paragraph2Bold2: "immersive space",
      paragraph2End2: "experience.",
    },
    cn: {
      title: "为了香味，超越感官沉浸",
      paragraph1: "与追求无形价值的 ",
      paragraph1Bold: "GRANHAND",
      paragraph1End: "一起发现您真正的追求美学。通过简单的测试，定义您向往的'个人氛围'，我们将为您推荐两种能深深融入该氛围的香水。",
      paragraph2: "我们更进一步，提供承载每种香水灵魂的 ",
      paragraph2Bold: "声音景观",
      paragraph2End: "。当香味充满空间时，与这种氛围相匹配的声音会加入其中，创造您自己的完整 ",
      paragraph2Bold2: "沉浸式空间",
      paragraph2End2: "体验。",
    },
    jp: {
      title: "香り、感覚的没入を超えて",
      paragraph1: "見えない価値を追求する ",
      paragraph1Bold: "GRANHAND",
      paragraph1End: "と共に、あなたの真の追求美を発見してください。簡単なテストを通じて、あなたが憧れる「自分だけのムード」を定義し、その雰囲気に最も深く浸透する2つの香水をおすすめします。",
      paragraph2: "私たちはさらに一歩進んで、各香水の魂を込めた ",
      paragraph2Bold: "サウンドスケープ",
      paragraph2End: "を提供します。香りが空間を満たすとき、そのムードに合わせて作られたサウンドが加わり、あなただけの完全な ",
      paragraph2Bold2: "没入型空間",
      paragraph2End2: "を体験できます。",
    },
  };

  const text = content[lang] || content['en'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* 모달 컨텐츠 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[20px] p-8 sm:p-10 md:p-12"
              style={{
                backgroundColor: 'rgba(253, 252, 240, 0.95)',
                border: '1px solid #EBE9D6',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15), 0 5px 15px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:bg-black/5"
                aria-label="Close"
                style={{ color: '#2C2C2C' }}
              >
                <X className="h-5 w-5" />
              </button>

              {/* 컨텐츠 */}
              <div className="pr-6">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-6"
                  style={{ color: '#1A1A1A' }}
                >
                  {text.title}
                </h2>
                
                <div
                  className="space-y-4 text-base sm:text-lg leading-relaxed"
                  style={{ color: '#3A3A3A' }}
                >
                  <p>
                    {text.paragraph1}
                    <span className="font-semibold" style={{ color: '#1A1A1A' }}>
                      {text.paragraph1Bold}
                    </span>
                    {text.paragraph1End}
                  </p>
                  
                  <p>
                    {text.paragraph2}
                    <span className="font-semibold" style={{ color: '#1A1A1A' }}>
                      {text.paragraph2Bold}
                    </span>
                    {text.paragraph2End}
                    <span className="font-semibold" style={{ color: '#1A1A1A' }}>
                      {text.paragraph2Bold2}
                    </span>
                    {text.paragraph2End2}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

