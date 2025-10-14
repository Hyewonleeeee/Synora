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
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function QuestionFlow() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mbti, setMbti] = useState('');
  const [selections, setSelections] = useState<string[]>([]);
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
    // 남성 질문 1 (step 2)
    if (currentStep === 2) {
      return {
        title: { ko: '나는 사람들에게 어떤 인상을 남기고 싶은가?', en: 'What impression do I want to leave on people?' },
        options: [
          { text: { ko: '나는 사람들에게 부드럽고 편안한 인상을 남기고 싶다.', en: 'I want to leave a soft and comfortable impression.' }, value: 'nonTeto', styles: ['cleanBoy', 'softBoy', 'darkAcademiaBoy', 'naturalBoy'] as StyleType[] },
          { text: { ko: '나는 사람들에게 카리스마 있고, 강렬한 인상을 남기고 싶다.', en: 'I want to leave a charismatic and intense impression.' }, value: 'teto', styles: ['streetBoy', 'rockBoy', 'gentleBoy', 'techBoy'] as StyleType[] }
        ]
      };
    }
    
    // 남성 질문 2 (step 3)
    if (currentStep === 3) {
      if (prev[0] === 'nonTeto') {
        return {
          title: { ko: '나의 스타일 성향은?', en: 'What is my style tendency?' },
          options: [
            { text: { ko: '나는 깔끔하고 구조적인 실루엣의 옷이나 액세서리를 좋아한다.', en: 'I like clothes or accessories with neat and structured silhouettes.' }, value: 'minimal', styles: ['cleanBoy', 'naturalBoy'] as StyleType[] },
            { text: { ko: '나는 니트, 셔츠, 가디건 같은 부드러운 옷을 좋아한다.', en: 'I like soft clothes like knits, shirts, cardigans.' }, value: 'emotional', styles: ['softBoy', 'darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else {
        return {
          title: { ko: '나의 스타일 성향은?', en: 'What is my style tendency?' },
          options: [
            { text: { ko: '나는 오버핏이나 그래픽 프린트가 포함된 옷을 좋아한다.', en: 'I like clothes with oversized fit or graphic prints.' }, value: 'highEnergy', styles: ['streetBoy', 'rockBoy'] as StyleType[] },
            { text: { ko: '나는 깔끔하고 구조적인 실루엣의 옷이나 액세서리를 좋아한다.', en: 'I like clothes or accessories with neat and structured silhouettes.' }, value: 'highControl', styles: ['gentleBoy', 'techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 3 (step 4)
    if (currentStep === 4) {
      if (prev[0] === 'nonTeto') {
        // 논테토: 질문2와 무관하게 다시 선택
        return {
          title: { ko: '나에게 더 맞는 스타일은?', en: 'Which style suits me better?' },
          options: [
            { text: { ko: '나는 꾸민 듯 안 꾸민 듯한 미니멀 스타일이 가장 편하다.', en: 'Effortlessly minimal style is most comfortable.' }, value: 'minimal3', styles: ['cleanBoy', 'naturalBoy'] as StyleType[] },
            { text: { ko: '나는 부드럽고 따뜻한 인상을 준다는 말을 자주 듣는다.', en: 'I often hear that I give a soft and warm impression.' }, value: 'emotional3', styles: ['softBoy', 'darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else {
        // 테토: 질문2와 무관하게 다시 선택
        return {
          title: { ko: '나에게 더 맞는 아이템은?', en: 'Which items suit me better?' },
          options: [
            { text: { ko: '나는 체인, 반지 등 메탈 액세서리를 좋아한다.', en: 'I like metal accessories like chains and rings.' }, value: 'metal', styles: ['streetBoy', 'rockBoy'] as StyleType[] },
            { text: { ko: '나는 유행보다는 오래가는 스타일을 선호한다.', en: 'I prefer timeless style over trends.' }, value: 'timeless', styles: ['gentleBoy', 'techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 4 (step 5) - 질문3 결과에 따라 분기
    if (currentStep === 5) {
      const q3 = prev[2];
      if (q3 === 'minimal3') {
        // 미니멀: 클린 vs 내츄럴
        return {
          title: { ko: '나의 스타일 지향점은?', en: 'What is my style direction?' },
          options: [
            { text: { ko: '나는 사람들에게 정돈된 인상을 주고 싶다.', en: 'I want to give an organized impression.' }, value: 'organized', styles: ['cleanBoy'] as StyleType[] },
            { text: { ko: '나는 린넨, 코튼, 니트처럼 자연 소재의 옷을 선호한다.', en: 'I prefer clothes made of natural materials.' }, value: 'naturalMaterial', styles: ['naturalBoy'] as StyleType[] }
          ]
        };
      } else if (q3 === 'emotional3') {
        // 감성: 소프트 vs 다크
        return {
          title: { ko: '나의 색감 선호는?', en: 'What is my color preference?' },
          options: [
            { text: { ko: '나는 파스텔 톤이나 부드러운 컬러의 옷을 자주 고른다.', en: 'I often choose pastel tones or soft colors.' }, value: 'pastelColor', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '나는 트렌치코트나 브라운 계열 블레이저를 자주 입는다.', en: 'I often wear trench coats or brown blazers.' }, value: 'darkCoat', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (q3 === 'metal') {
        // 하이에너지: 스트릿 vs 락
        return {
          title: { ko: '나에게 더 맞는 아이템은?', en: 'Which items suit me better?' },
          options: [
            { text: { ko: '나는 후드티, 조거팬츠, 스니커즈를 자주 입는다.', en: 'I often wear hoodies, jogger pants, sneakers.' }, value: 'hoodie', styles: ['streetBoy'] as StyleType[] },
            { text: { ko: '나는 가죽 재킷이나 부츠를 즐겨 신는다.', en: 'I enjoy wearing leather jackets or boots.' }, value: 'leather', styles: ['rockBoy'] as StyleType[] }
          ]
        };
      } else {
        // 하이컨트롤: 젠틀 vs 테크
        return {
          title: { ko: '나에게 더 맞는 아이템은?', en: 'Which items suit me better?' },
          options: [
            { text: { ko: '나는 구두나 시계 등 디테일한 아이템을 신경 쓴다.', en: 'I care about detailed items like shoes or watches.' }, value: 'details', styles: ['gentleBoy'] as StyleType[] },
            { text: { ko: '나는 애플워치, 이어폰, 백팩 등 테크 아이템을 항상 가지고 다닌다.', en: 'I always carry tech items like Apple Watch, earphones, backpack.' }, value: 'tech', styles: ['techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 5 (step 6)
    if (currentStep === 6) {
      const q3 = prev[2];
      if (q3 === 'minimal3') {
        // 미니멀: 클린 vs 내츄럴
        return {
          title: { ko: '나의 헤어스타일 선호는?', en: 'What is my hairstyle preference?' },
          options: [
            { text: { ko: '나는 헤어스타일은 늘 가지런하고 깔끔하게 유지하려 한다.', en: 'I always try to keep my hairstyle neat and tidy.' }, value: 'neatHair', styles: ['cleanBoy'] as StyleType[] },
            { text: { ko: '나는 꾸며진 느낌보다 자연스럽다는 말을 듣는 게 좋다.', en: 'I prefer being called natural rather than styled.' }, value: 'naturalLook', styles: ['naturalBoy'] as StyleType[] }
          ]
        };
      } else if (q3 === 'emotional3') {
        // 감성: 소프트 vs 다크
        return {
          title: { ko: '나의 헤어와 메이크업 선호는?', en: 'What is my hair and makeup preference?' },
          options: [
            { text: { ko: '나는 자연스러운 헤어와 내추럴 메이크업을 선호한다.', en: 'I prefer natural hair and natural makeup.' }, value: 'naturalMakeup', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '나는 브라운, 다크 그린, 네이비 같은 컬러가 잘 어울린다.', en: 'Colors like brown, dark green, navy suit me well.' }, value: 'darkColor', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (q3 === 'metal') {
        // 하이에너지: 스트릿 vs 락
        return {
          title: { ko: '나의 스타일 선호는?', en: 'What is my style preference?' },
          options: [
            { text: { ko: '틱톡, 인스타그램 등에서 패션 트렌드를 자주 확인한다.', en: 'I often check fashion trends on TikTok, Instagram.' }, value: 'trendCheck', styles: ['streetBoy'] as StyleType[] },
            { text: { ko: '스모키 메이크업이나 다크한 스타일을 선호한다.', en: 'I prefer smoky makeup or dark styles.' }, value: 'smoky', styles: ['rockBoy'] as StyleType[] }
          ]
        };
      } else {
        // 하이컨트롤: 젠틀 vs 테크
        return {
          title: { ko: '나의 이미지 지향점은?', en: 'What is my image direction?' },
          options: [
            { text: { ko: '매너 있고 침착한 이미지를 중요하게 여긴다.', en: 'I value a well-mannered and calm image.' }, value: 'manner', styles: ['gentleBoy'] as StyleType[] },
            { text: { ko: '효율적이고 세련된 스타일이 나를 잘 표현한다고 느낀다.', en: 'I feel efficient and sophisticated style represents me well.' }, value: 'efficient', styles: ['techBoy'] as StyleType[] }
          ]
        };
      }
    }
    
    // 남성 질문 6 (step 7) - 최종
    if (currentStep === 7) {
      const q3 = prev[2];
      if (q3 === 'minimal3') {
        // 미니멀: 클린 vs 내츄럴
        return {
          title: { ko: '나는 어떤 사람으로 기억되고 싶은가?', en: 'How do I want to be remembered?' },
          options: [
            { text: { ko: '나는 깔끔하고 신뢰감 있는 사람으로 기억되고 싶다.', en: 'I want to be remembered as neat and trustworthy.' }, value: 'trustworthy', styles: ['cleanBoy'] as StyleType[] },
            { text: { ko: '패션은 나를 돋보이게 하기보다 조화롭게 스며드는 것이 중요하다고 생각한다.', en: 'I think fashion should blend harmoniously rather than stand out.' }, value: 'harmony', styles: ['naturalBoy'] as StyleType[] }
          ]
        };
      } else if (q3 === 'emotional3') {
        // 감성: 소프트 vs 다크
        return {
          title: { ko: '나는 어떤 사람으로 기억되고 싶은가?', en: 'How do I want to be remembered?' },
          options: [
            { text: { ko: '나는 다정하다, 섬세하다는 말을 듣는 게 좋다.', en: 'I like being called kind and delicate.' }, value: 'kind', styles: ['softBoy'] as StyleType[] },
            { text: { ko: '나는 감정보다는 깊이 있는 분위기로 사람들에게 기억되고 싶다.', en: 'I want to be remembered for deep atmosphere rather than emotion.' }, value: 'deep', styles: ['darkAcademiaBoy'] as StyleType[] }
          ]
        };
      } else if (q3 === 'metal') {
        // 하이에너지: 스트릿 vs 락
        return {
          title: { ko: '나는 어떤 사람으로 기억되고 싶은가?', en: 'How do I want to be remembered?' },
          options: [
            { text: { ko: '나는 자유롭고 즉흥적인 성격이라는 말을 자주 듣는다.', en: 'I often hear I have a free and spontaneous personality.' }, value: 'freeSpirit', styles: ['streetBoy'] as StyleType[] },
            { text: { ko: '나는 반항적이지만 진심이 느껴지는 사람으로 보이고 싶다.', en: 'I want to be seen as rebellious but sincere.' }, value: 'sincere', styles: ['rockBoy'] as StyleType[] }
          ]
        };
      } else {
        // 하이컨트롤: 젠틀 vs 테크
        return {
          title: { ko: '나는 어떤 사람으로 기억되고 싶은가?', en: 'How do I want to be remembered?' },
          options: [
            { text: { ko: '정제된 언행과 깔끔한 스타일이 나의 매력이라고 생각한다.', en: 'I think refined behavior and neat style are my charm.' }, value: 'refined', styles: ['gentleBoy'] as StyleType[] },
            { text: { ko: '나는 심플하지만 스마트한 사람이라는 인상을 주고 싶다.', en: 'I want to give an impression of simple but smart.' }, value: 'smart', styles: ['techBoy'] as StyleType[] }
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
      router.push(`/result?style=${result}`);
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
    
    // 여성 질문지 (기존)
    // 질문 1 (step 2)
    if (step === 2) {
      return {
        title: { ko: '나는 어떤 이미지에 더 끌리는가?', en: 'Which image am I more attracted to?' },
        options: [
          { text: { ko: '부드럽고 사랑스러운 이미지에 더 끌린다.', en: 'I am more attracted to a soft and lovely image.' }, value: 'aegen', styles: ['cleanGirl', 'softGirl', 'coquette', 'lightAcademia', 'darkAcademia', 'balletcore', 'moriGirl'] as StyleType[] },
          { text: { ko: '강렬하고 카리스마 있는 이미지에 더 끌린다.', en: 'I am more attracted to an intense and charismatic image.' }, value: 'teto', styles: ['acubi', 'mobWife', 'rockstar', 'vampire', 'bossBabe'] as StyleType[] }
        ]
      };
    }
    
    // 질문 2 (step 3) - 에겐 vs 테토 분기
    if (step === 3) {
      if (prev[0] === 'aegen') {
        // 에겐 질문 2
        return {
          title: { ko: '메이크업 스타일은 어느 쪽을 선호하는가?', en: 'Which makeup style do I prefer?' },
          options: [
            { text: { ko: '과한 화장보다 피부 본연의 깨끗함이 드러나는 메이크업을 선호한다.', en: 'I prefer makeup that shows the natural cleanliness of my skin.' }, value: 'clean', styles: ['cleanGirl', 'softGirl', 'lightAcademia', 'balletcore'] as StyleType[] },
            { text: { ko: '메이크업에선 살짝 레트로한 요소가 매력적이라고 생각한다.', en: 'I think slightly retro elements are attractive in makeup.' }, value: 'retro', styles: ['darkAcademia', 'moriGirl', 'acubi'] as StyleType[] }
          ]
        };
      } else {
        // 테토 질문 2
        return {
          title: { ko: '어떤 무드를 더 좋아하는가?', en: 'Which mood do I prefer?' },
          options: [
            { text: { ko: '나는 도시적인 성공한 여성의 무드를 좋아한다.', en: 'I like the mood of a successful urban woman.' }, value: 'urban', styles: ['mobWife', 'bossBabe'] as StyleType[] },
            { text: { ko: '나는 무심한듯 예술적인 무드를 좋아한다.', en: 'I like an artistic mood that seems indifferent.' }, value: 'artistic', styles: ['vampire', 'rockstar', 'acubi'] as StyleType[] }
          ]
        };
      }
    }
    
    // 질문 3 (step 4) - 에겐 vs 테토 분기
    if (step === 4) {
      if (prev[0] === 'aegen') {
        // 에겐 질문 3
        if (prev[1] === 'clean') {
          return {
            title: { ko: '코디 스타일 중 어느 쪽이 더 나와 가까운가?', en: 'Which coordination style is closer to me?' },
            options: [
              { text: { ko: '흰 셔츠, 블랙 팬츠처럼 기본템 코디가 가장 마음 편하다.', en: 'Basic coordination like white shirt and black pants is most comfortable.' }, value: 'basic', styles: ['cleanGirl', 'lightAcademia'] as StyleType[] },
              { text: { ko: '귀여운 디테일(하트, 꽃무늬, 리본 등)이 있는 패션 아이템을 좋아한다.', en: 'I like fashion items with cute details.' }, value: 'cute', styles: ['softGirl', 'coquette', 'balletcore'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '패션 아이템 중 어느 쪽에 더 끌리는가?', en: 'Which fashion items attract me more?' },
            options: [
              { text: { ko: '트렌치코트, 니트, 블레이저 같은 고전적인 아이템이 끌린다.', en: 'I am attracted to classic items like trench coats, knits, blazers.' }, value: 'classic', styles: ['darkAcademia'] as StyleType[] },
              { text: { ko: '레이어드 패션에 끌린다.', en: 'I am attracted to layered fashion.' }, value: 'layered', styles: ['acubi', 'moriGirl'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 3
        return {
          title: { ko: '내가 동경하는 이미지는?', en: 'Which image do I admire?' },
          options: [
            { text: { ko: '나는 카리스마 있는 여성상을 동경한다.', en: 'I admire a charismatic female image.' }, value: 'charisma', styles: ['mobWife', 'bossBabe'] as StyleType[] },
            { text: { ko: '나는 블랙, 실버 같은 컬러 조합에 끌린다.', en: 'I am attracted to color combinations like black and silver.' }, value: 'blackSilver', styles: ['acubi', 'rockstar'] as StyleType[] }
          ]
        };
      }
    }
    
    // 질문 4 (step 5) - 에겐 vs 테토 분기
    if (step === 5) {
      const q3 = prev[2];
      
      if (prev[0] === 'aegen') {
        // 에겐 질문 4
        if (q3 === 'basic') {
        return {
          title: { ko: '나를 가장 잘 표현하는 스타일은?', en: 'Which style best represents me?' },
          options: [
            { text: { ko: '정돈된 헤어스타일이 나를 가장 돋보이게 한다.', en: 'A neat hairstyle makes me stand out the most.' }, value: 'neat', styles: ['cleanGirl'] as StyleType[] },
            { text: { ko: '베이지, 크림, 아이보리 같은 색감이 안정감을 준다.', en: 'Colors like beige, cream, ivory give me stability.' }, value: 'beige', styles: ['lightAcademia'] as StyleType[] }
          ]
        };
      } else if (q3 === 'cute') {
        return {
          title: { ko: '나에게 더 어울리는 색감과 디테일은?', en: 'Which colors and details suit me better?' },
          options: [
            { text: { ko: '부드럽고 여성스러운 색감을 선호한다.', en: 'I prefer soft and feminine colors.' }, value: 'soft', styles: ['softGirl', 'balletcore'] as StyleType[] },
            { text: { ko: '리본, 레이스, 프릴 같은 빈티지한 디테일이 좋다.', en: 'I like vintage details like ribbons, lace, frills.' }, value: 'vintage', styles: ['coquette'] as StyleType[] }
          ]
        };
      } else if (q3 === 'classic') {
        return {
          title: { ko: '어떤 감성에 더 매력을 느끼는가?', en: 'Which sensibility attracts me more?' },
          options: [
            { text: { ko: '앤틱한 인테리어나 빈티지 감성에 매력을 느낀다.', en: 'I feel attracted to antique interiors or vintage sensibility.' }, value: 'antique', styles: ['darkAcademia'] as StyleType[] },
            { text: { ko: '도시보다는 숲속 감성이 나에게 잘 맞는다고 느낀다.', en: 'I feel that forest sensibility suits me better.' }, value: 'forest', styles: ['moriGirl'] as StyleType[] }
          ]
        };
        } else {
          return {
            title: { ko: '어떤 스타일에 더 끌리는가?', en: 'Which style attracts me more?' },
            options: [
              { text: { ko: '나는 Y2K 감성에 끌린다.', en: 'I am attracted to Y2K sensibility.' }, value: 'y2k', styles: ['acubi'] as StyleType[] },
              { text: { ko: '자연친화적이고 순수한 이미지를 추구한다.', en: 'I pursue a nature-friendly and pure image.' }, value: 'nature', styles: ['moriGirl'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 4
        return {
          title: { ko: '옷을 고를 때 중요하게 생각하는 것은?', en: 'What do I value when choosing clothes?' },
          options: [
            { text: { ko: '나는 옷을 고를 때, 고급스러운 재질을 중요하게 생각한다.', en: 'I value luxurious materials when choosing clothes.' }, value: 'luxury', styles: ['mobWife', 'bossBabe'] as StyleType[] },
            { text: { ko: '화려하면서도 약간은 기괴하거나 독특한 스타일에 관심이 많다.', en: 'I am interested in styles that are gorgeous yet somewhat bizarre or unique.' }, value: 'unique', styles: ['vampire'] as StyleType[] }
          ]
        };
      }
    }
    
    // 질문 5 (step 6) - 에겐 vs 테토 분기
    if (step === 6) {
      const q4 = prev[3];
      
      if (prev[0] === 'aegen') {
        // 에겐 질문 5
      if (q4 === 'neat' || q4 === 'beige') {
        return {
          title: { ko: '나의 스타일 선호는?', en: 'My style preference is?' },
          options: [
            { text: { ko: '네일은 투명이나 연한 색 위주를 선호한다.', en: 'I prefer transparent or light colored nails.' }, value: 'clearNail', styles: ['cleanGirl'] as StyleType[] },
            { text: { ko: '지적이면서도 온화한 이미지를 원한다.', en: 'I want an intellectual yet gentle image.' }, value: 'intellectual', styles: ['lightAcademia'] as StyleType[] }
          ]
        };
      } else if (q4 === 'soft') {
        return {
          title: { ko: '나에게 더 잘 어울리는 메이크업은?', en: 'Which makeup suits me better?' },
          options: [
            { text: { ko: '러블리한 메이크업이 잘 어울린다고 느낀다.', en: 'I feel lovely makeup suits me well.' }, value: 'lovely', styles: ['softGirl'] as StyleType[] },
            { text: { ko: '가볍고 우아한 분위기를 표현하고 싶다.', en: 'I want to express a light and elegant atmosphere.' }, value: 'elegant', styles: ['balletcore'] as StyleType[] }
          ]
        };
      } else if (q4 === 'vintage') {
        return {
          title: { ko: '나에게 더 끌리는 패션은?', en: 'Which fashion attracts me more?' },
          options: [
            { text: { ko: '코르셋이나 레이스업 디테일 있는 패션이 끌린다.', en: 'I am attracted to fashion with corset or lace-up details.' }, value: 'corset', styles: ['coquette'] as StyleType[] },
            { text: { ko: '러블리한 스타일이 좋다.', en: 'I like lovely style.' }, value: 'lovelyStyle', styles: ['softGirl'] as StyleType[] }
          ]
        };
      } else if (q4 === 'antique') {
        return {
          title: { ko: '어떤 학문과 예술에 관심이 있는가?', en: 'Which studies and arts interest me?' },
          options: [
            { text: { ko: '문학, 철학, 역사 같은 학문에 관심이 많다.', en: 'I am interested in studies like literature, philosophy, history.' }, value: 'study', styles: ['darkAcademia'] as StyleType[] },
            { text: { ko: '자연과 관련된 소박한 예술에 끌린다.', en: 'I am attracted to simple arts related to nature.' }, value: 'natureArt', styles: ['moriGirl'] as StyleType[] }
          ]
        };
      } else if (q4 === 'forest') {
        return {
          title: { ko: '나에게 더 맞는 이미지는?', en: 'Which image suits me better?' },
          options: [
            { text: { ko: '자연친화적이고 순수한 이미지를 추구한다.', en: 'I pursue a nature-friendly and pure image.' }, value: 'natureFriendly', styles: ['moriGirl'] as StyleType[] },
            { text: { ko: '나는 Y2K 감성에 끌린다.', en: 'I am attracted to Y2K sensibility.' }, value: 'acubiSwitch', styles: ['acubi'] as StyleType[] }
          ]
        };
        } else {
          return {
            title: { ko: '나에게 더 맞는 이미지는?', en: 'Which image suits me better?' },
            options: [
              { text: { ko: '자연친화적이고 순수한 이미지를 추구한다.', en: 'I pursue a nature-friendly and pure image.' }, value: 'natureFriendly', styles: ['moriGirl'] as StyleType[] },
              { text: { ko: '나는 Y2K 감성에 끌린다.', en: 'I am attracted to Y2K sensibility.' }, value: 'acubiSwitch', styles: ['acubi'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 5
        if (q4 === 'luxury') {
          return {
            title: { ko: '어떤 소재와 컬러를 선호하는가?', en: 'Which materials and colors do I prefer?' },
            options: [
              { text: { ko: '퍼, 가죽, 패턴 등 화려한 소재에 관심이 많다.', en: 'I am interested in gorgeous materials like fur, leather, patterns.' }, value: 'gorgeous', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '화이트, 베이지, 블랙 같은 모던한 컬러를 자주 고른다.', en: 'I often choose modern colors like white, beige, black.' }, value: 'modern', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '어떤 패션과 컬러에 끌리는가?', en: 'Which fashion and colors attract me?' },
            options: [
              { text: { ko: '사이버펑크 분위기나 미래지향적 패션이 흥미롭다.', en: 'Cyberpunk atmosphere or futuristic fashion is interesting.' }, value: 'cyber', styles: ['acubi', 'rockstar'] as StyleType[] },
              { text: { ko: '블랙, 버건디, 딥 레드 같은 어두운 색감을 자주 고른다.', en: 'I often choose dark colors like black, burgundy, deep red.' }, value: 'darkColor', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 6 (step 7) - 에겐 vs 테토 분기
    if (step === 7) {
      const q5 = prev[4];
      
      if (prev[0] === 'aegen') {
        // 에겐 질문 6
        if (q5 === 'clearNail' || q5 === 'intellectual') {
        return {
          title: { ko: '어떤 이미지를 더 표현하고 싶은가?', en: 'Which image do I want to express more?' },
          options: [
            { text: { ko: '글로시 립이나 생기 있는 피부 표현에 자신감을 느낀다.', en: 'I feel confident expressing glossy lips or vibrant skin.' }, value: 'glossy', styles: ['cleanGirl'] as StyleType[] },
            { text: { ko: '클래식 음악, 문학, 예술과 어울리는 스타일을 좋아한다.', en: 'I like styles that match classic music, literature, art.' }, value: 'classic', styles: ['lightAcademia'] as StyleType[] }
          ]
        };
      } else if (q5 === 'lovely' || q5 === 'elegant') {
        return {
          title: { ko: '나에게 더 끌리는 패션 디테일은?', en: 'Which fashion details attract me more?' },
          options: [
            { text: { ko: '코르셋이나 레이스업 디테일 있는 패션이 끌린다.', en: 'I am attracted to fashion with corset or lace-up details.' }, value: 'corsetDetail', styles: ['coquette'] as StyleType[] },
            { text: { ko: '곡선적인 실루엣을 가진 옷이 잘 어울린다.', en: 'Clothes with curvy silhouettes suit me well.' }, value: 'curve', styles: ['balletcore'] as StyleType[] }
          ]
        };
      } else if (q5 === 'corset' || q5 === 'lovelyStyle') {
        return {
          title: { ko: '나에게 어울리는 무드는?', en: 'Which mood suits me?' },
          options: [
            { text: { ko: '여성적이고 우아한 동시에 장난스러운 무드가 어울린다.', en: 'A feminine, elegant yet playful mood suits me.' }, value: 'playful', styles: ['coquette'] as StyleType[] },
            { text: { ko: '사랑스러운 무드가 잘 어울린다.', en: 'A lovely mood suits me well.' }, value: 'lovelyMood', styles: ['softGirl'] as StyleType[] }
          ]
        };
        } else if (q5 === 'japanese' || q5 === 'oldBook' || q5 === 'study' || q5 === 'natureArt') {
          return {
            title: { ko: '어떤 감성 소품이 더 끌리는가?', en: 'Which sensibility items attract me more?' },
            options: [
              { text: { ko: '일본풍 감성 소품이 마음에 든다.', en: 'I like Japanese-style sensibility items.' }, value: 'japaneseItem', styles: ['moriGirl'] as StyleType[] },
              { text: { ko: '오래된 책, 서재, 클래식 음악이 잘 어울린다.', en: 'Old books, library, classic music suit me well.' }, value: 'oldBookItem', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '편안함을 느끼는 공간은?', en: 'Which space makes me feel comfortable?' },
            options: [
              { text: { ko: '숲이나 시골 같은 자연 공간이 편안하다.', en: 'Natural spaces like forests or countryside are comfortable.' }, value: 'forestSpace', styles: ['moriGirl'] as StyleType[] },
              { text: { ko: '고풍스러운 도서관이나 서재가 편안하다.', en: 'Antique libraries or studies are comfortable.' }, value: 'librarySpace', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 6
        if (q5 === 'gorgeous' || q5 === 'modern') {
          return {
            title: { ko: '어떤 메이크업과 액세서리를 선호하는가?', en: 'Which makeup and accessories do I prefer?' },
            options: [
              { text: { ko: '레드 립 같은 강렬한 메이크업을 즐긴다.', en: 'I enjoy intense makeup like red lips.' }, value: 'redLip', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '굵은 골드 체인이나 명품 시계 같은 액세서리를 선호한다.', en: 'I prefer accessories like thick gold chains or luxury watches.' }, value: 'goldChain', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '어떤 아이템이 더 잘 어울리는가?', en: 'Which items suit me better?' },
            options: [
              { text: { ko: '가죽 재킷, 체인 액세서리 같은 아이템이 잘 어울린다.', en: 'Items like leather jackets and chain accessories suit me well.' }, value: 'leather', styles: ['acubi', 'rockstar'] as StyleType[] },
              { text: { ko: '나는 초커나 레이스 장식 같은 고딕풍 액세서리에 끌린다.', en: 'I am attracted to Gothic accessories like chokers or lace decorations.' }, value: 'gothic', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 7 (step 8) - 에겐 vs 테토 분기
    if (step === 8) {
      const q6 = prev[5];
      
      if (prev[0] === 'aegen') {
        // 에겐 질문 7
        if (q6 === 'glossy' || q6 === 'classic') {
        return {
          title: { ko: '향수 취향은 어느 쪽인가?', en: 'Which fragrance preference do I have?' },
          options: [
            { text: { ko: '향수는 진한 향보다 비누향, 산뜻한 향을 좋아한다.', en: 'I prefer soap scents and fresh fragrances over strong scents.' }, value: 'fresh', styles: ['cleanGirl'] as StyleType[] },
            { text: { ko: '유럽풍 카페나 캠퍼스 무드가 어울린다고 느낀다.', en: 'I feel European cafe or campus mood suits me.' }, value: 'campus', styles: ['lightAcademia'] as StyleType[] }
          ]
        };
      } else if (q6 === 'corsetDetail' || q6 === 'curve' || q6 === 'playful' || q6 === 'lovelyMood') {
        return {
          title: { ko: '어떤 스타일이 더 편안한가?', en: 'Which style is more comfortable?' },
          options: [
            { text: { ko: '파스텔 톤 옷을 보면 마음이 편안해진다.', en: 'I feel comfortable when I see pastel tone clothes.' }, value: 'pastel', styles: ['softGirl'] as StyleType[] },
            { text: { ko: '리본 헤어, 니트 워머 같은 소품이 좋다.', en: 'I like items like ribbon hair and knit warmers.' }, value: 'ribbon', styles: ['balletcore'] as StyleType[] }
          ]
        };
        } else if (q6 === 'japaneseItem' || q6 === 'oldBookItem') {
          return {
            title: { ko: '어떤 소재와 색감을 선호하는가?', en: 'Which materials and colors do I prefer?' },
            options: [
              { text: { ko: '린넨, 코튼 같은 자연 소재 옷을 선호한다.', en: 'I prefer clothes made of natural materials like linen and cotton.' }, value: 'natural', styles: ['moriGirl'] as StyleType[] },
              { text: { ko: '검정, 브라운, 딥 그린 같은 어두운 색감을 좋아한다.', en: 'I like dark colors like black, brown, deep green.' }, value: 'dark', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '어떤 환경에서 가장 편안함을 느끼는가?', en: 'In which environment do I feel most comfortable?' },
            options: [
              { text: { ko: '비 오는 날, 따뜻한 차와 책을 즐기는 시간이 행복하다.', en: 'I am happy with warm tea and books on rainy days.' }, value: 'teaBook', styles: ['moriGirl'] as StyleType[] },
              { text: { ko: '조용한 서재에서 사색하는 시간이 좋다.', en: 'I like time for contemplation in a quiet study.' }, value: 'quietStudy', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 7
        if (q6 === 'redLip' || q6 === 'goldChain') {
          return {
            title: { ko: '내가 더 끌리는 스타일 요소는?', en: 'Which style element attracts me more?' },
            options: [
              { text: { ko: '드라마, 영화 속 마피아 부인 캐릭터에 매력을 느낀다.', en: 'I feel attracted to mafia wife characters in dramas and movies.' }, value: 'mafiaWife', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '패션 아이템으로 애니멀 프린트(호피)를 좋아한다.', en: 'I like animal prints (leopard) as fashion items.' }, value: 'animalFashion', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '어떤 무드와 공간이 더 편안한가?', en: 'Which mood and space are more comfortable?' },
            options: [
              { text: { ko: '공연장, 락 페스티벌 무드에서 편안함을 느낀다.', en: 'I feel comfortable in concert halls and rock festival moods.' }, value: 'concert', styles: ['acubi', 'rockstar'] as StyleType[] },
              { text: { ko: '오래된 성이나 고풍스러운 공간에 매력을 느낀다.', en: 'I feel attracted to old castles or antique spaces.' }, value: 'castle', styles: ['vampire'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    // 질문 8 (step 9) - 에겐 vs 테토 분기
    if (step === 9) {
      const q7 = prev[6];
      
      if (prev[0] === 'aegen') {
        // 에겐 질문 8
        if (q7 === 'fresh' || q7 === 'campus') {
        return {
          title: { ko: '나는 어떤 사람으로 보이고 싶은가?', en: 'How do I want to be seen?' },
          options: [
            { text: { ko: '정리정돈이 잘되고 깔끔한 사람으로 보이고 싶어한다.', en: 'I want to be seen as well-organized and neat.' }, value: 'organized', styles: ['cleanGirl'] as StyleType[] },
            { text: { ko: '가을과 봄처럼 따뜻하면서 차분한 계절의 무드를 담고 싶어한다.', en: 'I want to embody the warm yet calm mood of autumn and spring.' }, value: 'calm', styles: ['lightAcademia'] as StyleType[] }
          ]
        };
      } else if (q7 === 'pastel' || q7 === 'ribbon') {
        return {
          title: { ko: '나에게 어울리는 무드는?', en: 'Which mood suits me?' },
          options: [
            { text: { ko: '편안하면서도 사랑스러운 무드를 표현하고 싶다.', en: 'I want to express a comfortable yet lovely mood.' }, value: 'softMood', styles: ['softGirl'] as StyleType[] },
            { text: { ko: '여성적이고 우아한 동시에 장난스러운 무드가 어울린다.', en: 'A feminine, elegant yet playful mood suits me.' }, value: 'coquetteMood', styles: ['coquette'] as StyleType[] }
          ]
        };
        } else {
          return {
            title: { ko: '내가 원하는 분위기는?', en: 'Which atmosphere do I want?' },
            options: [
              { text: { ko: '소박하고 따뜻한, 약간은 동화적인 분위기를 풍기고 싶어한다.', en: 'I want to give off a simple, warm, fairy-tale atmosphere.' }, value: 'simple', styles: ['moriGirl'] as StyleType[] },
              { text: { ko: '문학, 철학, 역사 같은 학문에 몰두하는 지적인 사람처럼 보이고 싶어한다.', en: 'I want to be seen as intellectual, immersed in literature, philosophy, history.' }, value: 'deep', styles: ['darkAcademia'] as StyleType[] }
            ]
          };
        }
      } else {
        // 테토 질문 8
        if (q7 === 'redLipStyle' || q7 === 'animalPrint') {
          return {
            title: { ko: '내가 추구하는 스타일은?', en: 'Which style do I pursue?' },
            options: [
              { text: { ko: '타인의 시선을 압도하는 파워풀한 스타일을 추구한다.', en: 'I pursue a powerful style that overwhelms others.' }, value: 'powerful', styles: ['mobWife'] as StyleType[] },
              { text: { ko: '깔끔하고 단정하면서도 권위 있는 스타일을 추구한다.', en: 'I pursue a neat, tidy yet authoritative style.' }, value: 'authority', styles: ['bossBabe'] as StyleType[] }
            ]
          };
        } else {
          return {
            title: { ko: '내가 더 끌리는 감성은?', en: 'Which sensibility attracts me more?' },
            options: [
              { text: { ko: '나는 Y2K 감성에 끌린다.', en: 'I am attracted to Y2K sensibility.' }, value: 'y2kFinal', styles: ['acubi'] as StyleType[] },
              { text: { ko: '거칠고 와일드한 분위기가 매력적이라고 본다.', en: 'I find rough and wild atmosphere attractive.' }, value: 'wild', styles: ['rockstar'] as StyleType[] }
            ]
          };
        }
      }
    }
    
    return null;
  };

  const currentQuestion = getQuestion();
  const isStep0Valid = age !== '' && Number(age) > 0 && gender !== '';
  const isStep1Valid = mbti !== '';

  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-0 py-10">
      <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-warmBrown/10 shadow-wood p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/90 hover:ring-softSage/20">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm opacity-70 mb-2">
            <span>{t('step')} {step + 1} / {gender === 'male' ? 8 : 10}</span>
            <span>{Math.round(((step + 1) / (gender === 'male' ? 8 : 10)) * 100)}%</span>
          </div>
          <div className="h-2 bg-warmBeige/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-forestGreen"
              animate={{ width: `${((step + 1) / (gender === 'male' ? 8 : 10)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} variants={fadeVariants} initial="initial" animate="animate" exit="exit">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg sm:text-xl font-medium mb-6">{t('step1Title')}</h2>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium">{t('age')}</label>
                  <input
                    id="age"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-softSage/35 bg-white px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage transition-all duration-200 hover:border-softSage/50 hover:shadow-md"
                  />
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
                  className="mt-2 w-full rounded-xl border border-softSage/35 bg-white px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softSage transition-all duration-200 hover:border-softSage/50 hover:shadow-md"
                >
                  <option value="" disabled>{t('select')}</option>
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
