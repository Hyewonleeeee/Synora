"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useRouter } from 'next/navigation';

// 여성 + 남성 추구미 타입
type StyleType = 
  // 여성
  | 'cleanGirl' | 'softGirl' | 'coquette' | 'lightAcademia' | 'darkAcademia' | 'balletcore' | 'moriGirl' | 'acubi' | 'mobWife' | 'rockstar' | 'vampire' | 'bossBabe'
  // 남성
  | 'cleanBoy' | 'softBoy' | 'darkAcademiaBoy' | 'naturalBoy' | 'streetBoy' | 'rockBoy' | 'gentleBoy' | 'techBoy';
type Scores = Record<StyleType, number>;

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
};

export default function QuestionFlow() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mbti, setMbti] = useState('');
  const [selections, setSelections] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const [scores, setScores] = useState<Scores>({
    // 여성
    cleanGirl: 0, softGirl: 0, coquette: 0, lightAcademia: 0,
    darkAcademia: 0, balletcore: 0, moriGirl: 0, acubi: 0,
    mobWife: 0, rockstar: 0, vampire: 0, bossBabe: 0,
    // 남성
    cleanBoy: 0, softBoy: 0, darkAcademiaBoy: 0, naturalBoy: 0,
    streetBoy: 0, rockBoy: 0, gentleBoy: 0, techBoy: 0,
  });

  const addScore = (styles: StyleType[]) => {
    setScores(prev => {
      const newScores = { ...prev };
      styles.forEach(s => newScores[s]++);
      return newScores;
    });
  };

  const getMaleQuestion = (currentStep: number, prev: string[]) => {
    // 남성 질문 1 (step 2) - 메인 분기: 논테토 vs 테토
    if (currentStep === 2) {
      return {
        title: { ko: '당신은 어떤 인상을 주고 싶은가요?', en: 'What kind of impression do you want to give?' },
        options: [
          { text: { ko: '부드럽고 편안한 인상', en: 'Soft and comfortable impression' }, value: 'nonTeto', styles: ['cleanBoy', 'softBoy', 'darkAcademiaBoy', 'naturalBoy'] as StyleType[] },
          { text: { ko: '카리스마 있고 강렬한 인상', en: 'Charismatic and intense impression' }, value: 'teto', styles: ['streetBoy', 'rockBoy', 'gentleBoy', 'techBoy'] as StyleType[] }
        ]
      };
    }
    
    // 남성 질문 2 (step 3)
    if (currentStep === 3) {
      if (prev[0] === 'nonTeto') {
        return {
          title: { ko: '당신의 스타일 취향은 어느 쪽에 더 가깝나요?', en: 'Which side is your style preference closer to?' },
          options: [
            { text: { ko: '깔끔하고 구조적인 실루엣의 옷', en: 'Neat and structured silhouette clothes' }, value: 'minimal', styles: ['cleanBoy', 'naturalBoy'] as StyleType[] },
            { text: { ko: '니트·셔츠·가디건 같은 부드러운 옷', en: 'Soft clothes like knits, shirts, cardigans' }, value: 'emotional', styles: ['softBoy', 'darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else {
        return {
          title: { ko: '당신의 스타일 무드는 어떤 쪽에 더 가깝나요?', en: 'Which side is your style mood closer to?' },
          options: [
            { text: { ko: '오버핏·그래픽 같은 에너지 있는 스타일', en: 'Energetic style like oversized and graphic' }, value: 'highEnergy', styles: ['streetBoy', 'rockBoy'] as StyleType[] },
            { text: { ko: '깔끔하고 구조적인 실루엣 스타일', en: 'Neat and structured silhouette style' }, value: 'highControl', styles: ['gentleBoy', 'techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 3 (step 4)
    if (currentStep === 4) {
      if (prev[0] === 'nonTeto') {
        if (prev[1] === 'minimal') {
          // 논테토 미니멀 분기: 클린 vs 내츄럴
          return {
            title: { ko: '어떤 패션 무드가 더 편안한가요?', en: 'Which fashion mood is more comfortable?' },
            options: [
              { text: { ko: '꾸안꾸 미니멀 스타일', en: 'Effortless minimal style' }, value: 'minimal3', styles: ['cleanBoy', 'naturalBoy'] as StyleType[] },
              { text: { ko: '부드럽고 따뜻한 스타일', en: 'Soft and warm style' }, value: 'emotional3', styles: ['softBoy', 'darkAcademiaBoy'] as StyleType[] }
            ]
          };
        } else {
          // 논테토 감성 분기: 소프트 vs 다크
          return {
            title: { ko: '당신이 더 잘 어울린다고 느끼는 분위기는?', en: 'What atmosphere do you feel suits you better?' },
            options: [
              { text: { ko: '부드럽고 파스텔 톤', en: 'Soft and pastel tone' }, value: 'emotional3', styles: ['softBoy'] as StyleType[] },
              { text: { ko: '브라운·다크그린·네이비 같은 깊은 톤', en: 'Deep tones like brown, dark green, navy' }, value: 'darkTone', styles: ['darkAcademiaBoy'] as StyleType[] }
            ]
          };
        }
      } else {
        if (prev[1] === 'highEnergy') {
          // 테토 하이 에너지 분기: 스트릿 vs 락
          return {
            title: { ko: '어떤 스타일 요소에 더 끌리나요?', en: 'Which style element attracts you more?' },
            options: [
              { text: { ko: '체인이나 반지 같은 메탈 액세서리', en: 'Metal accessories like chains and rings' }, value: 'metal', styles: ['streetBoy', 'rockBoy'] as StyleType[] },
              { text: { ko: '오래가는 클래식 스타일', en: 'Timeless classic style' }, value: 'timeless', styles: ['gentleBoy', 'techBoy'] as StyleType[] }
            ]
          };
        } else {
          // 테토 하이 컨트롤 분기: 젠틀 vs 테크
          return {
            title: { ko: '어떤 스타일을 더 선호하나요?', en: 'Which style do you prefer more?' },
            options: [
              { text: { ko: '유행보다 오래가는 스타일', en: 'Timeless style over trends' }, value: 'timeless', styles: ['gentleBoy', 'techBoy'] as StyleType[] },
              { text: { ko: '체인이나 메탈 스타일', en: 'Chain or metal style' }, value: 'metal', styles: ['streetBoy', 'rockBoy'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 남성 질문 4 (step 5) - 질문3 결과에 따라 분기
    if (currentStep === 5) {
      const q2 = prev[1];
      const q3 = prev[2];
      
      if (prev[0] === 'nonTeto' && q2 === 'minimal' && q3 === 'minimal3') {
        // 논테토 미니멀: 클린 vs 내츄럴
        return {
          title: { ko: '당신이 더 편안하게 느끼는 스타일은 무엇인가요?', en: 'What style do you feel more comfortable with?' },
          options: [
            { text: { ko: '정돈된 인상', en: 'Neat impression' }, value: 'organized', styles: ['cleanBoy'] as StyleType[] },
            { text: { ko: '린넨·코튼·니트 같은 자연 소재', en: 'Natural materials like linen, cotton, knit' }, value: 'naturalMaterial', styles: ['naturalBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'nonTeto' && q2 === 'emotional' && q3 === 'emotional3') {
        // 논테토 감성: 소프트 vs 다크
        return {
          title: { ko: '어떤 색감 스타일이 더 끌리나요?', en: 'Which color style attracts you more?' },
          options: [
            { text: { ko: '부드러운 컬러나 따뜻한 분위기', en: 'Soft colors or warm atmosphere' }, value: 'pastelColor', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '트렌치코트나 클래식한 브라운 계열', en: 'Trench coat or classic brown tones' }, value: 'darkCoat', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'nonTeto' && q2 === 'emotional' && q3 === 'darkTone') {
        // 논테토 감성: 소프트 vs 다크 (다크 선택)
        return {
          title: { ko: '어떤 색감 스타일이 더 끌리나요?', en: 'Which color style attracts you more?' },
          options: [
            { text: { ko: '부드러운 컬러나 따뜻한 분위기', en: 'Soft colors or warm atmosphere' }, value: 'pastelColor', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '트렌치코트나 클래식한 브라운 계열', en: 'Trench coat or classic brown tones' }, value: 'darkCoat', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'teto' && q2 === 'highEnergy' && q3 === 'metal') {
        // 테토 하이 에너지: 스트릿 vs 락
        return {
          title: { ko: '당신에게 더 잘 맞는 룩은?', en: 'Which look suits you better?' },
          options: [
            { text: { ko: '후드·조거·스니커즈 같은 스트릿 룩', en: 'Street look like hoodie, jogger, sneakers' }, value: 'hoodie', styles: ['streetBoy'] as StyleType[] },
            { text: { ko: '가죽 재킷·부츠 같은 락 스타일', en: 'Rock style like leather jacket and boots' }, value: 'leather', styles: ['rockBoy'] as StyleType[] }
          ]
        };
      } else {
        // 테토 하이 컨트롤: 젠틀 vs 테크
        return {
          title: { ko: '어떤 디테일이 당신을 더 돋보이게 하나요?', en: 'Which detail makes you stand out more?' },
          options: [
            { text: { ko: '구두·시계 등 정제된 아이템', en: 'Refined items like shoes and watches' }, value: 'details', styles: ['gentleBoy'] as StyleType[] },
            { text: { ko: '애플워치·이어폰·백팩 같은 테크 아이템', en: 'Tech items like Apple Watch, earphones, backpack' }, value: 'tech', styles: ['techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 5 (step 6)
    if (currentStep === 6) {
      const q2 = prev[1];
      const q3 = prev[2];
      const q4 = prev[3];
      
      if (prev[0] === 'nonTeto' && q2 === 'minimal' && q3 === 'minimal3' && (q4 === 'organized' || q4 === 'naturalMaterial')) {
        // 논테토 미니멀: 클린 vs 내츄럴
        return {
          title: { ko: '어떤 헤어스타일이 더 나다운가요?', en: 'Which hairstyle is more like you?' },
          options: [
            { text: { ko: '늘 가지런하고 깔끔하게 유지하는 헤어스타일', en: 'Hairstyle that is always kept neat and tidy' }, value: 'neatHair', styles: ['cleanBoy'] as StyleType[] },
            { text: { ko: '꾸민 느낌보다 자연스러운 헤어스타일', en: 'Natural hairstyle rather than styled feeling' }, value: 'naturalLook', styles: ['naturalBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'nonTeto' && q2 === 'emotional' && (q3 === 'emotional3' || q3 === 'darkTone') && (q4 === 'pastelColor' || q4 === 'darkCoat')) {
        // 논테토 감성: 소프트 vs 다크
        return {
          title: { ko: '어떤 메이크업/헤어 무드를 선호하나요?', en: 'Which makeup/hair mood do you prefer?' },
          options: [
            { text: { ko: '자연스러운 헤어와 편안한 이미지', en: 'Natural hair and comfortable image' }, value: 'naturalMakeup', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '음영감 있고 분위기 있는 이미지', en: 'Image with shading and atmosphere' }, value: 'darkColor', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'teto' && q2 === 'highEnergy' && q3 === 'metal' && (q4 === 'hoodie' || q4 === 'leather')) {
        // 테토 하이 에너지: 스트릿 vs 락
        return {
          title: { ko: '당신의 취향에 맞는 감성은?', en: 'What sensibility matches your taste?' },
          options: [
            { text: { ko: '틱톡·인스타 패션 트렌드', en: 'TikTok and Instagram fashion trends' }, value: 'trendCheck', styles: ['streetBoy'] as StyleType[] },
            { text: { ko: '다크·스모키한 분위기', en: 'Dark and smoky atmosphere' }, value: 'smoky', styles: ['rockBoy'] as StyleType[] }
          ]
        };
      } else {
        // 테토 하이 컨트롤: 젠틀 vs 테크
        return {
          title: { ko: '당신의 이미지에서 어떤 요소가 중요하나요?', en: 'What element is important in your image?' },
          options: [
            { text: { ko: '매너 있고 침착한 분위기', en: 'Well-mannered and calm atmosphere' }, value: 'manner', styles: ['gentleBoy'] as StyleType[] },
            { text: { ko: '효율적이고 스마트한 분위기', en: 'Efficient and smart atmosphere' }, value: 'efficient', styles: ['techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 6 (step 7) - 최종
    if (currentStep === 7) {
      const q2 = prev[1];
      const q3 = prev[2];
      const q4 = prev[3];
      const q5 = prev[4];
      
      if (prev[0] === 'nonTeto' && q2 === 'minimal' && q3 === 'minimal3' && (q4 === 'organized' || q4 === 'naturalMaterial') && (q5 === 'neatHair' || q5 === 'naturalLook')) {
        // 논테토 미니멀: 클린 vs 내츄럴
        return {
          title: { ko: '어떤 \'자기 표현 방식\'이 더 당신답다고 느끼나요?', en: 'What \'self-expression method\' feels more like you?' },
          options: [
            { text: { ko: '깔끔하고 신뢰감 있는 이미지', en: 'Neat and trustworthy image' }, value: 'trustworthy', styles: ['cleanBoy'] as StyleType[] },
            { text: { ko: '패션으로 나를 돋보이게 하기보다는 조화롭게 스며들게 하기', en: 'Blending harmoniously rather than standing out with fashion' }, value: 'harmony', styles: ['naturalBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'nonTeto' && q2 === 'emotional' && (q3 === 'emotional3' || q3 === 'darkTone') && (q4 === 'pastelColor' || q4 === 'darkCoat') && (q5 === 'naturalMakeup' || q5 === 'darkColor')) {
        // 논테토 감성: 소프트 vs 다크
        return {
          title: { ko: '어떤 인상이 더 마음에 드나요?', en: 'Which impression do you like more?' },
          options: [
            { text: { ko: '\'다정하다\', \'섬세하다\'을 주는 인상', en: 'Impression that gives \'kind\' and \'delicate\'' }, value: 'kind', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '감정보다는 \'깊이 있는 분위기\'로 기억되는 인상', en: 'Impression remembered for \'deep atmosphere\' rather than emotion' }, value: 'deep', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (prev[0] === 'teto' && q2 === 'highEnergy' && q3 === 'metal' && (q4 === 'hoodie' || q4 === 'leather') && (q5 === 'trendCheck' || q5 === 'smoky')) {
        // 테토 하이 에너지: 스트릿 vs 락
        return {
          title: { ko: '당신이 어떤 사람으로 보이고 싶나요?', en: 'What kind of person do you want to be seen as?' },
          options: [
            { text: { ko: '자유롭고 즉흥적인 사람', en: 'Free and spontaneous person' }, value: 'freeSpirit', styles: ['streetBoy'] as StyleType[] },
            { text: { ko: '반항적이지만 진심 있는 사람', en: 'Rebellious but sincere person' }, value: 'sincere', styles: ['rockBoy'] as StyleType[] }
          ]
        };
      } else {
        // 테토 하이 컨트롤: 젠틀 vs 테크
        return {
          title: { ko: '당신이 추구하는 이미지는?', en: 'What image do you pursue?' },
          options: [
            { text: { ko: '정제된 언행과 깔끔한 이미지', en: 'Refined behavior and neat image' }, value: 'refined', styles: ['gentleBoy'] as StyleType[] },
            { text: { ko: '\'심플하지만 스마트한 사람\'이라는 이미지', en: 'Image of \'simple but smart person\'' }, value: 'smart', styles: ['techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    return null;
  };

  const handleAnswer = (value: string, styles: StyleType[]) => {
    // 디버깅: 답변과 점수 추가 전 상태
    console.log('Before addScore - value:', value, 'styles:', styles);
    console.log('Before addScore - current scores:', scores);
    
    addScore(styles);
    const newSelections = [...selections, value];
    setSelections(newSelections);
    
    // 디버깅: 답변과 점수 추가 후 상태
    console.log('After addScore - new selections:', newSelections);
    
    // 특별 분기: 질문 5-3에서 아쿠비 선택 시 테토로 전환
    if (step === 6 && value === 'acubiSwitch') {
      // 테토의 질문 1,2를 이미 통과한 것으로 간주
      // 질문 0: teto 선택
      // 질문 1: artistic 선택 (아쿠비 포함)
      const tetoSelections = ['teto', 'artistic', ...newSelections.slice(0, -1)];
      setSelections(tetoSelections);
      addScore(['acubi', 'mobWife', 'rockstar', 'vampire', 'bossBabe']); // 테토 질문 1
      addScore(['vampire', 'rockstar', 'acubi']); // 테토 질문 2
      setStep(4); // 테토 질문 3으로 이동
      return;
    }
    
    // 남성은 7단계(질문 6개), 여성은 9단계(질문 8개)
    const maxStep = gender === 'male' ? 7 : 9;
    
    console.log('Current step:', step, 'Max step:', maxStep, 'Gender:', gender);
    
    if (step < maxStep) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let result: StyleType | null = null;
    let maxScore = 0;

    // 디버깅용: 점수 출력
    console.log('Current scores:', scores);
    console.log('Gender:', gender);

    if (gender === 'female') {
      // 여성: 에겐 소프트걸/코켓/발레코어는 3개 이상
      ['softGirl', 'coquette', 'balletcore'].forEach(style => {
        if (scores[style as StyleType] >= 3 && scores[style as StyleType] > maxScore) {
          maxScore = scores[style as StyleType];
          result = style as StyleType;
        }
      });

      // 여성: 에겐 나머지는 4개 이상
      ['cleanGirl', 'lightAcademia', 'darkAcademia', 'moriGirl'].forEach(style => {
        if (scores[style as StyleType] >= 4 && scores[style as StyleType] > maxScore) {
          maxScore = scores[style as StyleType];
          result = style as StyleType;
        }
      });

      // 여성: 테토 모두 4개 이상
      ['acubi', 'mobWife', 'rockstar', 'vampire', 'bossBabe'].forEach(style => {
        if (scores[style as StyleType] >= 4 && scores[style as StyleType] > maxScore) {
          maxScore = scores[style as StyleType];
          result = style as StyleType;
        }
      });
    } else {
      // 남성: 모두 2개 이상 (더 관대한 기준)
      ['cleanBoy', 'softBoy', 'darkAcademiaBoy', 'naturalBoy', 'streetBoy', 'rockBoy', 'gentleBoy', 'techBoy'].forEach(style => {
        if (scores[style as StyleType] >= 2 && scores[style as StyleType] > maxScore) {
          maxScore = scores[style as StyleType];
          result = style as StyleType;
        }
      });
    }

    if (result) {
      // 5초간 로딩 애니메이션 후 결과 페이지로 이동
      setIsCalculating(true);
      let elapsedMs = 0;
      const dotTimer = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4); // 0~3 순환 (점 0~3개)
      }, 400);
      const doneTimer = setTimeout(() => {
        clearInterval(dotTimer);
        setIsCalculating(false);
        router.push(`/result?style=${result}`);
      }, 3000);
      // 안전장치: 컴포넌트 언마운트 대비
      void elapsedMs;
    } else {
      alert(lang === 'ko' ? '결과를 계산할 수 없습니다.' : 'Cannot calculate result.');
    }
  };

  const getQuestion = () => {
    if (step < 2) return null;
    
    const prev = selections;
    
    // 남성 질문지
    if (gender === 'male') {
      return getMaleQuestion(step, prev);
    }
    
    // 여성 질문지 (새로운 구조)
    // 질문 1 (step 2) - 메인 분기: 에겐 vs 테토
    if (step === 2) {
      return {
        title: { ko: '당신은 어떤 인상을 주고 싶은가요?', en: 'What kind of impression do you want to give?' },
        options: [
          { text: { ko: '빛을 머금은 듯 투명하고 맑은 인상', en: 'Transparent and clear impression like holding light' }, value: 'aegen', styles: ['cleanGirl', 'softGirl', 'lightAcademia', 'darkAcademia', 'balletcore', 'moriGirl'] as StyleType[] },
          { text: { ko: '선이 또렷하고 시크한 카리스마', en: 'Sharp and chic charisma' }, value: 'teto', styles: ['acubi', 'mobWife', 'rockstar', 'vampire', 'bossBabe'] as StyleType[] }
        ]
      };
    }
    
    // 질문 2 (step 3) - 에겐 공통 분기
    if (step === 3) {
      if (prev[0] === 'aegen') {
        return {
          title: { ko: '당신이 원하는 전체 분위기에 더 가까운 쪽은 무엇인가요?', en: 'Which is closer to the overall atmosphere you want?' },
          options: [
            { text: { ko: '지적하고 세련된 단정한 인상', en: 'Intellectual and sophisticated neat impression' }, value: 'intellectual', styles: ['cleanGirl', 'lightAcademia', 'darkAcademia'] as StyleType[] },
            { text: { ko: '따뜻하고 사랑스럽고 편안한 인상', en: 'Warm, lovely and comfortable impression' }, value: 'warm', styles: ['softGirl', 'balletcore', 'moriGirl'] as StyleType[] }
          ]
        };
      } else {
        // 테토 질문 2 - 전체 그룹 분기
        return {
          title: { ko: '어떤 분위기의 카리스마가 더 끌리나요?', en: 'What kind of charismatic atmosphere attracts you more?' },
          options: [
            { text: { ko: '강렬하고 대담한 에너지로 존재감을 드러내는 스타일', en: 'Style that reveals presence with intense and bold energy' }, value: 'bold', styles: ['mobWife', 'rockstar', 'bossBabe'] as StyleType[] },
            { text: { ko: '서늘하거나 몽환적인 분위기로 감정을 은근히 드러내는 스타일', en: 'Style that subtly reveals emotions with cool or dreamy atmosphere' }, value: 'dreamy', styles: ['acubi', 'vampire'] as StyleType[] }
          ]
        };
      }
    }
    
    // 질문 3 (step 4) - 색감 분기
    if (step === 4) {
      if (prev[0] === 'aegen') {
        if (prev[1] === 'intellectual') {
          // 3-1: 클린걸/라이트 vs 다크
          return {
            title: { ko: '어떤 색감의 패션이 더 마음에 드나요?', en: 'Which color palette of fashion do you like more?' },
            options: [
              { text: { ko: '화이트·아이보리의 뉴트럴 색감', en: 'Neutral colors of white and ivory' }, value: 'neutral', styles: ['cleanGirl', 'lightAcademia'] as StyleType[] },
              { text: { ko: '브라운·딥그린의 어두운 색감', en: 'Dark colors of brown and deep green' }, value: 'dark', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else {
          // 3-2: 소프트/발레 vs 모리걸
          return {
            title: { ko: '어떤 색감이 당신의 분위기와 더 잘 맞나요?', en: 'Which color palette matches your atmosphere better?' },
            options: [
              { text: { ko: '핑크·라벤더 같은 파스텔톤', en: 'Pastel tones like pink and lavender' }, value: 'pastel', styles: ['softGirl', 'balletcore'] as StyleType[] },
              { text: { ko: '베이지·올리브·브라운 같은 자연톤', en: 'Natural tones like beige, olive, brown' }, value: 'natural', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 3
        if (prev[1] === 'bold') {
          // 3-1: 몹와이프·보스베이브 vs 락스타
          return {
            title: { ko: '어떤 방식으로 존재감을 드러내는 스타일이 더 좋나요?', en: 'Which style of revealing presence do you prefer more?' },
            options: [
              { text: { ko: '정돈된 실루엣 + 강렬한 룩', en: 'Neat silhouette + intense look' }, value: 'neatIntense', styles: ['mobWife', 'bossBabe'] as StyleType[] },
              { text: { ko: '거친 텍스처 + 반항적인 분위기', en: 'Rough texture + rebellious atmosphere' }, value: 'roughRebel', styles: ['rockstar'] as StyleType[] }
            ]
          };
        } else {
          // 3-2: 아쿠비 vs 뱀파이어
          return {
            title: { ko: '어떤 피부 표현이 더 매력적으로 느껴지나요?', en: 'Which skin expression feels more attractive to you?' },
            options: [
              { text: { ko: '하이라이터가 은은하게 번지는 투명한 피부', en: 'Transparent skin with subtle highlighter glow' }, value: 'transparentGlow', styles: ['acubi'] as StyleType[] },
              { text: { ko: '하얗고 차가운 느낌의 피부 표현', en: 'White and cold-feeling skin expression' }, value: 'coldWhite', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 4 (step 5) - 메이크업 분기
    if (step === 5) {
      if (prev[0] === 'aegen') {
        const q2 = prev[1];
        const q3 = prev[2];
        
        if (q2 === 'intellectual' && q3 === 'neutral') {
          // 4-1: 클린 vs 라이트
          return {
            title: { ko: '당신이 선호하는 베이스 메이크업은 어떤가요?', en: 'What kind of base makeup do you prefer?' },
            options: [
              { text: { ko: '광채 나는 피부 + 투명 립밤', en: 'Glowing skin + transparent lip balm' }, value: 'glow', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '보송한 피부 + 매트 립 컬러', en: 'Soft skin + matte lip color' }, value: 'matte', styles: ['lightAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'dark') {
          // 4-2: 다크 아카데미아 분기
          return {
            title: { ko: '당신이 더 끌리는 메이크업 질감은 무엇인가요?', en: 'What makeup texture attracts you more?' },
            options: [
              { text: { ko: '광채 나는 피부 + 투명 립밤', en: 'Glowing skin + transparent lip balm' }, value: 'glowDark', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '매트 피부 + 음영 메이크업', en: 'Matte skin + contouring makeup' }, value: 'matteDark', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'pastel') {
          // 4-3: 소프트 vs 발레
          return {
            title: { ko: '어떤 메이크업 분위기가 더 잘 맞나요?', en: 'Which makeup atmosphere matches you better?' },
            options: [
              { text: { ko: '핑크 블러셔 + 글로시 립', en: 'Pink blush + glossy lip' }, value: 'pinkGlossy', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '맑고 윤기 나는 내추럴 톤', en: 'Clear and glossy natural tone' }, value: 'naturalGlossy', styles: ['balletcore'] as StyleType[] }
            ]
          };
        } else {
          // 4-4: 소프트 vs 모리걸
          return {
            title: { ko: '당신의 취향에 더 가까운 메이크업 스타일은 무엇인가요?', en: 'What makeup style is closer to your taste?' },
            options: [
              { text: { ko: '핑크 블러셔 + 글로시 립', en: 'Pink blush + glossy lip' }, value: 'pinkGlossyMori', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '내추럴톤 또는 민낯 메이크업', en: 'Natural tone or bare-faced makeup' }, value: 'bareFace', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 4
        const q2 = prev[1];
        const q3 = prev[2];
        
        if (q2 === 'bold' && q3 === 'neatIntense') {
          // 4-1: 몹와이프 vs 보스베이브
          return {
            title: { ko: '어떤 아이메이크업 무드가 더 끌리나요?', en: 'Which eye makeup mood attracts you more?' },
            options: [
              { text: { ko: '진한 스모키 아이 + 긴 속눈썹', en: 'Dark smoky eye + long eyelashes' }, value: 'smokyLashes', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '음영 섀도우 + 날렵한 아이라인', en: 'Contour shadow + sharp eyeliner' }, value: 'sharpLiner', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'roughRebel') {
          // 4-2: 락스타 vs 보스베이브
          return {
            title: { ko: '어떤 눈매 표현이 당신의 스타일에 더 맞나요?', en: 'Which eye expression matches your style better?' },
            options: [
              { text: { ko: '스모키 아이라인 + 지저분한 섀도우', en: 'Smoky eyeliner + messy shadow' }, value: 'messySmoky', styles: ['rockstar'] as StyleType[] },
              { text: { ko: '음영 섀도우 + 날렵한 아이라인', en: 'Contour shadow + sharp eyeliner' }, value: 'sharpLinerRock', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          // 4-3: 아쿠비 vs 뱀파이어
          return {
            title: { ko: '어떤 립 메이크업이 더 취향에 맞나요?', en: 'Which lip makeup matches your taste better?' },
            options: [
              { text: { ko: '촉촉한 립글로스나 유리알 같은 립', en: 'Moist lip gloss or glass-like lip' }, value: 'glossyLip', styles: ['acubi'] as StyleType[] },
              { text: { ko: '딥버건디·와인 같은 짙은 레드 립', en: 'Deep burgundy or wine-like dark red lip' }, value: 'deepRed', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 5 (step 6) - 패션 스타일 분기
    if (step === 6) {
      if (prev[0] === 'aegen') {
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        
        if (q2 === 'intellectual' && q3 === 'neutral' && q4 === 'glow') {
          // 5-1: 클린 vs 라이트
          return {
            title: { ko: '어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
            options: [
              { text: { ko: '화이트 셔츠 + 블랙 팬츠의 미니멀 룩', en: 'Minimal look of white shirt + black pants' }, value: 'minimal', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '아이보리 니트 + 플리츠 스커트의 클래식 룩', en: 'Classic look of ivory knit + pleated skirt' }, value: 'classic', styles: ['lightAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'neutral' && q4 === 'matte') {
          // 5-1: 클린 vs 라이트 (라이트 선택)
          return {
            title: { ko: '어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
            options: [
              { text: { ko: '화이트 셔츠 + 블랙 팬츠의 미니멀 룩', en: 'Minimal look of white shirt + black pants' }, value: 'minimal', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '아이보리 니트 + 플리츠 스커트의 클래식 룩', en: 'Classic look of ivory knit + pleated skirt' }, value: 'classic', styles: ['lightAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'dark' && q4 === 'glowDark') {
          // 5-2: 클린 vs 다크
          return {
            title: { ko: '어떤 무드가 더 끌리나요?', en: 'Which mood attracts you more?' },
            options: [
              { text: { ko: '미니멀한 기본템 스타일', en: 'Minimal basic item style' }, value: 'minimalDark', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '셔츠·니트 베스트·트렌치의 고전적 레이어드', en: 'Classic layered with shirt, knit vest, trench' }, value: 'layeredDark', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'dark' && q4 === 'matteDark') {
          // 5-2: 클린 vs 다크 (다크 선택)
          return {
            title: { ko: '어떤 무드가 더 끌리나요?', en: 'Which mood attracts you more?' },
            options: [
              { text: { ko: '미니멀한 기본템 스타일', en: 'Minimal basic item style' }, value: 'minimalDark', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '셔츠·니트 베스트·트렌치의 고전적 레이어드', en: 'Classic layered with shirt, knit vest, trench' }, value: 'layeredDark', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'pastel' && q4 === 'pinkGlossy') {
          // 5-3: 소프트 vs 발레
          return {
            title: { ko: '어떤 디테일이 당신의 취향에 더 가깝나요?', en: 'Which detail is closer to your taste?' },
            options: [
              { text: { ko: '리본/하트/프릴 같은 귀여운 디테일', en: 'Cute details like ribbon, heart, frill' }, value: 'cuteDetail', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '튤·리본·타이츠 같은 발레웨어 디테일', en: 'Balletwear details like tulle, ribbon, tights' }, value: 'balletDetail', styles: ['balletcore'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'pastel' && q4 === 'naturalGlossy') {
          // 5-3: 소프트 vs 발레 (발레 선택)
          return {
            title: { ko: '어떤 디테일이 당신의 취향에 더 가깝나요?', en: 'Which detail is closer to your taste?' },
            options: [
              { text: { ko: '리본/하트/프릴 같은 귀여운 디테일', en: 'Cute details like ribbon, heart, frill' }, value: 'cuteDetail', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '튤·리본·타이츠 같은 발레웨어 디테일', en: 'Balletwear details like tulle, ribbon, tights' }, value: 'balletDetail', styles: ['balletcore'] as StyleType[] }
            ]
          };
        } else {
          // 5-4: 소프트 vs 모리걸
          return {
            title: { ko: '어떤 패션 무드가 더 끌리나요?', en: 'Which fashion mood attracts you more?' },
            options: [
              { text: { ko: '귀여운 디테일의 러블리 스타일', en: 'Lovely style with cute details' }, value: 'lovelyStyle', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '린넨 원피스·가디건 같은 편안한 내추럴 룩', en: 'Comfortable natural look like linen dress and cardigan' }, value: 'naturalLook', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 5
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        
        if (q2 === 'bold' && q3 === 'neatIntense' && q4 === 'smokyLashes') {
          // 5-1: 몹와이프 vs 보스베이브
          return {
            title: { ko: '어떤 헤어 분위기를 더 선호하나요?', en: 'Which hair atmosphere do you prefer more?' },
            options: [
              { text: { ko: '윤기 나는 블랙 헤어나 펌 스타일', en: 'Glossy black hair or perm style' }, value: 'glossyBlack', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '깔끔하게 묶은 포니테일·슬릭 헤어', en: 'Neatly tied ponytail or slick hair' }, value: 'slickPony', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'roughRebel' && q4 === 'messySmoky') {
          // 5-2: 락스타 vs 보스베이브
          return {
            title: { ko: '어떤 꾸안꾸 헤어 무드에 더 끌리나요?', en: 'Which effortless hair mood attracts you more?' },
            options: [
              { text: { ko: '무심하게 헝클어진 헤어', en: 'Carelessly tousled hair' }, value: 'tousled', styles: ['rockstar'] as StyleType[] },
              { text: { ko: '단정하고 슬릭한 포니테일/업스타일', en: 'Neat and slick ponytail or upstyle' }, value: 'slickUpdo', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'neatIntense' && q4 === 'sharpLiner') {
          // 5-1: 몹와이프 vs 보스베이브 (보스베이브 선택)
          return {
            title: { ko: '어떤 헤어 분위기를 더 선호하나요?', en: 'Which hair atmosphere do you prefer more?' },
            options: [
              { text: { ko: '윤기 나는 블랙 헤어나 펌 스타일', en: 'Glossy black hair or perm style' }, value: 'glossyBlack', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '깔끔하게 묶은 포니테일·슬릭 헤어', en: 'Neatly tied ponytail or slick hair' }, value: 'slickPony', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'roughRebel' && q4 === 'sharpLinerRock') {
          // 5-2: 락스타 vs 보스베이브 (보스베이브 선택)
          return {
            title: { ko: '어떤 꾸안꾸 헤어 무드에 더 끌리나요?', en: 'Which effortless hair mood attracts you more?' },
            options: [
              { text: { ko: '무심하게 헝클어진 헤어', en: 'Carelessly tousled hair' }, value: 'tousled', styles: ['rockstar'] as StyleType[] },
              { text: { ko: '단정하고 슬릭한 포니테일/업스타일', en: 'Neat and slick ponytail or upstyle' }, value: 'slickUpdo', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          // 5-3: 아쿠비 vs 뱀파이어
          return {
            title: { ko: '어떤 옷의 실루엣이 더 마음에 드나요?', en: 'Which clothing silhouette do you like more?' },
            options: [
              { text: { ko: '퍼지한 파스텔 볼레로나 루즈한 니트', en: 'Fuzzy pastel bolero or loose knit' }, value: 'fuzzyLoose', styles: ['acubi'] as StyleType[] },
              { text: { ko: '레이스·벨벳 등 고딕한 디테일의 의상', en: 'Clothing with gothic details like lace and velvet' }, value: 'gothicDetail', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 6 (step 7) - 헤어스타일 분기
    if (step === 7) {
      if (prev[0] === 'aegen') {
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        const q5 = prev[4];
        
        if (q2 === 'intellectual' && q3 === 'neutral' && (q4 === 'glow' || q4 === 'matte') && (q5 === 'minimal' || q5 === 'classic')) {
          // 6-1: 클린 vs 라이트
          return {
            title: { ko: '어떤 헤어 분위기가 더 마음에 드나요?', en: 'Which hair atmosphere do you like more?' },
            options: [
              { text: { ko: '올백·미니 클로우클립 등 깔끔한 업스타일', en: 'Neat upstyle like slicked back or mini claw clip' }, value: 'upstyle', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '자연스러운 웨이브·반묶음', en: 'Natural wave or half-up' }, value: 'wave', styles: ['lightAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'dark' && (q4 === 'glowDark' || q4 === 'matteDark') && (q5 === 'minimalDark' || q5 === 'layeredDark')) {
          // 6-2: 클린 vs 다크
          return {
            title: { ko: '어떤 헤어 스타일이 더 나다운가요?', en: 'Which hair style is more like you?' },
            options: [
              { text: { ko: '깔끔한 업스타일', en: 'Neat upstyle' }, value: 'upstyleDark', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '자연스러운 웨이브 또는 반묶음', en: 'Natural wave or half-up' }, value: 'waveDark', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'pastel' && (q4 === 'pinkGlossy' || q4 === 'naturalGlossy') && (q5 === 'cuteDetail' || q5 === 'balletDetail')) {
          // 6-3: 소프트 vs 발레
          return {
            title: { ko: '당신에게 더 잘 어울린다고 느끼는 헤어스타일은 무엇인가요?', en: 'What hairstyle do you feel suits you better?' },
            options: [
              { text: { ko: '자연 웨이브·낮은 묶음', en: 'Natural wave or low bun' }, value: 'naturalWave', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '번 헤어나 깔끔한 올림머리', en: 'Bun hair or neat updo' }, value: 'bunUpdo', styles: ['balletcore'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'natural' && (q4 === 'pinkGlossyMori' || q4 === 'bareFace') && (q5 === 'lovelyStyle' || q5 === 'naturalLook')) {
          // 6-4: 발레 vs 모리걸
          return {
            title: { ko: '더 선호하는 헤어 분위기는 무엇인가요?', en: 'What hair atmosphere do you prefer more?' },
            options: [
              { text: { ko: '깔끔한 번/올림머리', en: 'Neat bun or updo' }, value: 'bunUpdoMori', styles: ['balletcore'] as StyleType[] },
              { text: { ko: '긴 생머리·낮은 묶음', en: 'Long straight hair or low bun' }, value: 'longStraight', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        } else {
          return null;
        }
      } else {
        // 테토 질문 6
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        const q5 = prev[4];
        
        if (q2 === 'bold' && q3 === 'neatIntense' && (q4 === 'smokyLashes' || q4 === 'sharpLiner') && (q5 === 'glossyBlack' || q5 === 'slickPony')) {
          // 6-1: 몹와이프 vs 보스베이브
          return {
            title: { ko: '어떤 패션 아이템이 더 끌리나요?', en: 'Which fashion item attracts you more?' },
            options: [
              { text: { ko: '퍼 코트·레오파드 등 존재감 강한 아이템', en: 'Items with strong presence like fur coat and leopard' }, value: 'strongPresence', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '핏이 완벽한 테일러드 수트', en: 'Perfectly fitted tailored suit' }, value: 'tailoredSuit', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'roughRebel' && (q4 === 'messySmoky' || q4 === 'sharpLinerRock') && (q5 === 'tousled' || q5 === 'slickUpdo')) {
          // 6-2: 락스타 vs 보스베이브
          return {
            title: { ko: '어떤 분위기의 옷이 더 마음에 드나요?', en: 'Which atmosphere of clothing do you like more?' },
            options: [
              { text: { ko: '가죽 재킷·밴드 티 등 거친 옷', en: 'Rough clothes like leather jacket and band tee' }, value: 'roughClothes', styles: ['rockstar'] as StyleType[] },
              { text: { ko: '테일러 수트처럼 단정한 실루엣', en: 'Neat silhouette like tailored suit' }, value: 'neatSilhouette', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          // 6-3: 아쿠비 vs 뱀파이어
          return {
            title: { ko: '어떤 눈매 분위기가 당신에게 더 맞나요?', en: 'Which eye atmosphere matches you better?' },
            options: [
              { text: { ko: '섬세하고 유리 같은 눈동자', en: 'Delicate and glass-like eyes' }, value: 'glassEyes', styles: ['acubi'] as StyleType[] },
              { text: { ko: '날카로운 아이라인 + 강렬한 속눈썹', en: 'Sharp eyeliner + intense eyelashes' }, value: 'sharpIntense', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 7 (step 8) - 가방/메이크업 포인트 분기
    if (step === 8) {
      if (prev[0] === 'aegen') {
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        const q5 = prev[4];
        const q6 = prev[5];
        
        if (q2 === 'intellectual' && q3 === 'neutral' && (q4 === 'glow' || q4 === 'matte') && (q5 === 'minimal' || q5 === 'classic') && (q6 === 'upstyle' || q6 === 'wave')) {
          // 7-1: 클린 vs 라이트
          return {
            title: { ko: '어떤 가방 스타일이 더 마음에 드나요?', en: 'Which bag style do you like more?' },
            options: [
              { text: { ko: '작은 미니백', en: 'Small mini bag' }, value: 'miniBag', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '책이 들어가는 가죽 크로스백', en: 'Leather crossbody bag that fits books' }, value: 'crossbody', styles: ['lightAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'dark' && (q4 === 'glowDark' || q4 === 'matteDark') && (q5 === 'minimalDark' || q5 === 'layeredDark') && (q6 === 'upstyleDark' || q6 === 'waveDark')) {
          // 7-2: 클린 vs 다크
          return {
            title: { ko: '어떤 가방 분위기가 당신과 더 잘 맞나요?', en: 'Which bag atmosphere matches you better?' },
            options: [
              { text: { ko: '작은 미니백', en: 'Small mini bag' }, value: 'miniBagDark', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '빈티지한 가죽가방', en: 'Vintage leather bag' }, value: 'vintageBag', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'pastel' && (q4 === 'pinkGlossy' || q4 === 'naturalGlossy') && (q5 === 'cuteDetail' || q5 === 'balletDetail') && (q6 === 'naturalWave' || q6 === 'bunUpdo')) {
          // 7-3: 소프트 vs 발레
          return {
            title: { ko: '어떤 메이크업 포인트가 더 끌리나요?', en: 'Which makeup point attracts you more?' },
            options: [
              { text: { ko: '속눈썹 강조 메이크업', en: 'Eyelash emphasizing makeup' }, value: 'lashes', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '눈가의 은은한 펄 포인트', en: 'Subtle pearl point around eyes' }, value: 'pearl', styles: ['balletcore'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'natural' && (q4 === 'pinkGlossyMori' || q4 === 'bareFace') && (q5 === 'lovelyStyle' || q5 === 'naturalLook') && (q6 === 'bunUpdoMori' || q6 === 'longStraight')) {
          // 7-4: 클린 vs 모리걸
          return {
            title: { ko: '어떤 가방 스타일이 더 잘 맞나요?', en: 'Which bag style matches you better?' },
            options: [
              { text: { ko: '작은 미니백', en: 'Small mini bag' }, value: 'miniBagMori', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '코튼백·수공예 가방', en: 'Cotton bag or handmade bag' }, value: 'cottonBag', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        } else {
          return null;
        }
      } else {
        // 테토 질문 7
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        const q5 = prev[4];
        const q6 = prev[5];
        
        if (q2 === 'bold' && q3 === 'neatIntense' && (q4 === 'smokyLashes' || q4 === 'sharpLiner') && (q5 === 'glossyBlack' || q5 === 'slickPony') && (q6 === 'strongPresence' || q6 === 'tailoredSuit')) {
          // 7-1: 몹와이프 vs 보스베이브
          return {
            title: { ko: '선호하는 주얼리 무드는 어떤가요?', en: 'What kind of jewelry mood do you prefer?' },
            options: [
              { text: { ko: '진한 골드 주얼리 + 글램 분위기', en: 'Deep gold jewelry + glam atmosphere' }, value: 'goldGlam', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '심플하지만 고급스러운 주얼리', en: 'Simple but luxurious jewelry' }, value: 'simpleLuxury', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'roughRebel' && (q4 === 'messySmoky' || q4 === 'sharpLinerRock') && (q5 === 'tousled' || q5 === 'slickUpdo') && (q6 === 'roughClothes' || q6 === 'neatSilhouette')) {
          // 7-2: 락스타 vs 보스베이브
          return {
            title: { ko: '어떤 액세서리를 더 선호하나요?', en: 'Which accessory do you prefer more?' },
            options: [
              { text: { ko: '볼드한 피어싱·체인 액세서리', en: 'Bold piercing and chain accessories' }, value: 'boldPiercing', styles: ['rockstar'] as StyleType[] },
              { text: { ko: '심플하고 세련된 주얼리', en: 'Simple and sophisticated jewelry' }, value: 'sophisticated', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          // 7-3: 아쿠비 vs 뱀파이어
          return {
            title: { ko: '어떤 메이크업 색조 조합이 더 끌리나요?', en: 'Which makeup color combination attracts you more?' },
            options: [
              { text: { ko: '핑크 + 실버 조합', en: 'Pink + silver combination' }, value: 'pinkSilver', styles: ['acubi'] as StyleType[] },
              { text: { ko: '피처럼 붉은 립·네일', en: 'Blood-like red lip and nail' }, value: 'bloodRed', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 8 (step 9) - 최종 인상 분기
    if (step === 9) {
      if (prev[0] === 'aegen') {
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        const q5 = prev[4];
        const q6 = prev[5];
        const q7 = prev[6];
        
        if (q2 === 'intellectual' && q3 === 'neutral' && (q4 === 'glow' || q4 === 'matte') && (q5 === 'minimal' || q5 === 'classic') && (q6 === 'upstyle' || q6 === 'wave') && (q7 === 'miniBag' || q7 === 'crossbody')) {
          // 8-1: 클린 vs 라이트
          return {
            title: { ko: '어떤 인상으로 보이고 싶나요?', en: 'What impression do you want to give?' },
            options: [
              { text: { ko: '깔끔하고 맑은 이미지', en: 'Neat and clear image' }, value: 'clear', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '따뜻하고 지적인 이미지', en: 'Warm and intellectual image' }, value: 'warmIntellectual', styles: ['lightAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'intellectual' && q3 === 'dark' && (q4 === 'glowDark' || q4 === 'matteDark') && (q5 === 'minimalDark' || q5 === 'layeredDark') && (q6 === 'upstyleDark' || q6 === 'waveDark') && (q7 === 'miniBagDark' || q7 === 'vintageBag')) {
          // 8-2: 클린 vs 다크
          return {
            title: { ko: '어떤 첫인상을 더 원하나요?', en: 'What first impression do you want more?' },
            options: [
              { text: { ko: '맑고 단정한 이미지', en: 'Clear and neat image' }, value: 'clearNeat', styles: ['cleanGirl'] as StyleType[] },
              { text: { ko: '지적이고 약간 미스터리한 이미지', en: 'Intellectual and slightly mysterious image' }, value: 'mysterious', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'pastel' && (q4 === 'pinkGlossy' || q4 === 'naturalGlossy') && (q5 === 'cuteDetail' || q5 === 'balletDetail') && (q6 === 'naturalWave' || q6 === 'bunUpdo') && (q7 === 'lashes' || q7 === 'pearl')) {
          // 8-3: 소프트 vs 발레
          return {
            title: { ko: '어떤 인상이 더 당신의 성향에 가깝나요?', en: 'Which impression is closer to your tendency?' },
            options: [
              { text: { ko: '사랑스럽고 부드러운 이미지', en: 'Lovely and soft image' }, value: 'lovelySoft', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '우아하고 품격 있는 이미지', en: 'Elegant and dignified image' }, value: 'elegant', styles: ['balletcore'] as StyleType[] }
            ]
          };
        } else if (q2 === 'warm' && q3 === 'natural' && (q4 === 'pinkGlossyMori' || q4 === 'bareFace') && (q5 === 'lovelyStyle' || q5 === 'naturalLook') && (q6 === 'bunUpdoMori' || q6 === 'longStraight') && (q7 === 'miniBagMori' || q7 === 'cottonBag')) {
          // 8-4: 소프트 vs 모리걸
          return {
            title: { ko: '어떤 분위기로 보이고 싶나요?', en: 'What atmosphere do you want to show?' },
            options: [
              { text: { ko: '사랑스럽고 부드러운 사람', en: 'Lovely and soft person' }, value: 'lovelyPerson', styles: ['softGirl'] as StyleType[] },
              { text: { ko: '자연스럽고 따뜻한 사람', en: 'Natural and warm person' }, value: 'naturalWarm', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        } else {
          return null;
        }
      } else {
        // 테토 질문 8
        const q2 = prev[1];
        const q3 = prev[2];
        const q4 = prev[3];
        const q5 = prev[4];
        const q6 = prev[5];
        const q7 = prev[6];
        
        if (q2 === 'bold' && q3 === 'neatIntense' && (q4 === 'smokyLashes' || q4 === 'sharpLiner') && (q5 === 'glossyBlack' || q5 === 'slickPony') && (q6 === 'strongPresence' || q6 === 'tailoredSuit') && (q7 === 'goldGlam' || q7 === 'simpleLuxury')) {
          // 8-1: 몹와이프 vs 보스베이브
          return {
            title: { ko: '어떤 인상에 더 가까워지고 싶나요?', en: 'What impression do you want to get closer to?' },
            options: [
              { text: { ko: '자신감 넘치고 관능적인 여성스러움', en: 'Confident and sensual femininity' }, value: 'sensual', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '성공한 여성의 여유가 느껴지는 세련됨', en: 'Sophistication that feels like a successful woman\'s ease' }, value: 'sophisticatedEase', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else if (q2 === 'bold' && q3 === 'roughRebel' && (q4 === 'messySmoky' || q4 === 'sharpLinerRock') && (q5 === 'tousled' || q5 === 'slickUpdo') && (q6 === 'roughClothes' || q6 === 'neatSilhouette') && (q7 === 'boldPiercing' || q7 === 'sophisticated')) {
          // 8-2: 락스타 vs 보스베이브
          return {
            title: { ko: '어떤 분위기가 당신에게 더 매력적이라고 느껴지나요?', en: 'Which atmosphere feels more attractive to you?' },
            options: [
              { text: { ko: '거칠지만 자신감 있는 반항적 무드', en: 'Rough but confident rebellious mood' }, value: 'rebellious', styles: ['rockstar'] as StyleType[] },
              { text: { ko: '도시적이고 정돈된 세련된 스타일', en: 'Urban and neat sophisticated style' }, value: 'urbanNeat', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          // 8-3: 아쿠비 vs 뱀파이어
          return {
            title: { ko: '어떤 감정선을 가진 분위기가 더 끌리나요?', en: 'Which atmosphere with emotional line attracts you more?' },
            options: [
              { text: { ko: '차분하지만 어딘가 쓸쓸한 분위기', en: 'Calm but somehow lonely atmosphere' }, value: 'lonely', styles: ['acubi'] as StyleType[] },
              { text: { ko: '차가운 아름다움 속의 강한 긴장감', en: 'Strong tension within cold beauty' }, value: 'coldTension', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    return null;
  };

  const currentQuestion = getQuestion();
  const isStep0Valid = age !== '' && gender !== '';
  const isStep1Valid = mbti !== '';

  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-0 py-10">
      <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-warmBrown/10 shadow-wood p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/90 hover:ring-softSage/20">
        {isCalculating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="rounded-2xl bg-white/90 ring-1 ring-warmBrown/10 shadow-wood px-6 py-5">
              <p className="text-sm sm:text-base font-medium text-forestGreen">
                {lang === 'ko' ? '추구미 산출 중' : 'Calculating your style'}
                {'.'.repeat(dotCount)}
              </p>
            </div>
          </div>
        )}
        {step >= 2 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm opacity-70 mb-2">
              <span>{t('step')} {step - 1} / {gender === 'male' ? 6 : 8}</span>
              <span>{Math.round(((step - 1) / (gender === 'male' ? 6 : 8)) * 100)}%</span>
            </div>
            <div className="h-2 bg-warmBeige/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-forestGreen"
                animate={{ width: `${((step - 1) / (gender === 'male' ? 6 : 8)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} variants={fadeVariants} initial="initial" animate="animate" exit="exit">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-medium mb-6">{t('step1Title')}</h2>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium">{t('age')}</label>
                  <select
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-2 w-full h-11 rounded-xl border border-softSage/35 bg-white px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage transition-all duration-200 hover:border-softSage/50 hover:shadow-md"
                  >
                    <option value="" disabled>{t('select')}</option>
                    <option value="10대">10대</option>
                    <option value="20대">20대</option>
                    <option value="30대">30대</option>
                    <option value="40대">40대</option>
                    <option value="50대 이상">50대 이상</option>
                  </select>
                </div>
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium">{t('gender')}</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(['female', 'male'] as const).map((g) => (
                        <label 
                          key={g}
                          className="inline-flex items-center gap-2 rounded-xl border border-softSage/35 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:border-softSage/50 hover:shadow-md hover:bg-summerBeige/30 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={gender === g}
                            onChange={(e) => setGender(e.target.value)}
                            className="accent-forestGreen"
                          />
                          <span>{t(g)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={!isStep0Valid}
                    className="inline-flex items-center justify-center rounded-xl bg-forestGreen text-lightMint px-5 py-2 text-sm font-medium shadow-soft enabled:hover:scale-[1.01] transition disabled:opacity-50"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg sm:text-xl font-medium mb-6">{t('step2Title')}</h2>
                <label htmlFor="mbti" className="block text-sm font-medium">{t('mbti')}</label>
                <select
                  id="mbti"
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value)}
                  className="mt-2 w-full h-11 rounded-xl border border-softSage/35 bg-white px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage transition-all duration-200 hover:border-softSage/50 hover:shadow-md"
                >
                  <option value="" disabled>{t('select')}</option>
                  <option value="선택안함">선택안함</option>
                  {['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" onClick={() => setStep(0)} className="text-sm opacity-70 hover:opacity-100 transition">
                    {t('back')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className="inline-flex items-center justify-center rounded-xl bg-forestGreen text-lightMint px-5 py-2 text-sm font-medium shadow-soft enabled:hover:scale-[1.01] transition disabled:opacity-50"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}

            {step >= 2 && currentQuestion && (
              <>
                <h3 className="text-base sm:text-lg font-medium mb-6 text-forestGreen">
                  {currentQuestion.title[lang]}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.value, option.styles)}
                      className="w-full text-left p-4 rounded-xl border border-softSage/35 bg-white hover-mouse:bg-summerBeige/30 hover-mouse:border-softSage/50 hover-mouse:shadow-md active:bg-summerBeige/40 active:scale-[0.99] transition-all duration-200"
                    >
                      <span className="text-sm sm:text-base leading-relaxed">{option.text[lang]}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-start">
                  <button 
                    type="button" 
                    onClick={() => {
                      setStep(Math.max(0, step - 1));
                      setSelections(selections.slice(0, -1));
                    }}
                    className="text-sm opacity-70 hover:opacity-100 transition"
                  >
                    {t('back')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
