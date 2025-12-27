"use client";

import { useState, useEffect } from 'react';
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

// Linked List 방식 질문 데이터 구조
type QuestionOption = {
  text: { ko: string; en: string };
  nextQuestionId: string;
  scoreKeywords: StyleType[];
};

type Question = {
  id: string;
  title: { ko: string; en: string };
  options: QuestionOption[];
};

// 여성 에겐 그룹 질문 데이터
const femaleAegenQuestions: Record<string, Question> = {
  q1_start: {
    id: 'q1_start',
    title: { ko: '첫만남에 당신이 보여주고픈 이미지는 무엇인가요?', en: 'What image do you want to show on first meeting?' },
    options: [
      { text: { ko: '단아하고 깨끗한 이미지', en: 'Elegant and clean image' }, nextQuestionId: 'q2_vibe_egen', scoreKeywords: ['cleanGirl', 'softGirl', 'lightAcademia', 'darkAcademia', 'balletcore', 'moriGirl'] },
      { text: { ko: '시크하고 도도한 이미지', en: 'Chic and aloof image' }, nextQuestionId: 'q2_vibe_teto', scoreKeywords: ['acubi', 'mobWife', 'rockstar', 'vampire', 'bossBabe'] },
    ],
  },
  q2_vibe_egen: {
    id: 'q2_vibe_egen',
    title: { ko: '당신이 원하는 전체적인 분위기는 무엇인가요?', en: 'What overall atmosphere do you want?' },
    options: [
      { text: { ko: '지적이고 세련된 분위기', en: 'Intellectual and sophisticated atmosphere' }, nextQuestionId: 'q3_color_intellectual', scoreKeywords: ['cleanGirl', 'lightAcademia', 'darkAcademia', 'balletcore'] },
      { text: { ko: '편안하고 따뜻한 분위기', en: 'Comfortable and warm atmosphere' }, nextQuestionId: 'q3_color_warm', scoreKeywords: ['softGirl', 'moriGirl'] },
    ],
  },
  q3_color_intellectual: {
    id: 'q3_color_intellectual',
    title: { ko: '어떤 색감의 패션이 더 마음에 드나요?', en: 'Which color palette of fashion do you like more?' },
    options: [
      { text: { ko: '화이트, 아이보리 등의 뉴트럴 톤', en: 'Neutral tones like white and ivory' }, nextQuestionId: 'q4_makeup_neutral', scoreKeywords: ['cleanGirl', 'lightAcademia', 'balletcore'] },
      { text: { ko: '브라운, 딥 그린 등의 딥 톤', en: 'Deep tones like brown and deep green' }, nextQuestionId: 'q4_makeup_dark', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q3_color_warm: {
    id: 'q3_color_warm',
    title: { ko: '어떤 색감의 패션이 더 마음에 드나요?', en: 'Which color palette of fashion do you like more?' },
    options: [
      { text: { ko: '핑크, 라벤더 등의 파스텔 톤', en: 'Pastel tones like pink and lavender' }, nextQuestionId: 'q4_makeup_pastel', scoreKeywords: ['softGirl'] },
      { text: { ko: '베이지, 올리브 등의 어스 톤', en: 'Earth tones like beige and olive' }, nextQuestionId: 'q4_makeup_earth', scoreKeywords: ['moriGirl'] },
    ],
  },
  q4_makeup_neutral: {
    id: 'q4_makeup_neutral',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?' },
    options: [
      { text: { ko: '광채 나는 투명 피부와 글로시한 입술', en: 'Glowing transparent skin and glossy lips' }, nextQuestionId: 'q5_style_glow', scoreKeywords: ['cleanGirl', 'balletcore'] },
      { text: { ko: '보송한 피부와 MLBB 컬러의 입술', en: 'Soft skin and MLBB color lips' }, nextQuestionId: 'q5_style_matte_light', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q4_makeup_dark: {
    id: 'q4_makeup_dark',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?' },
    options: [
      { text: { ko: '광채 나는 투명 피부와 글로시한 입술', en: 'Glowing transparent skin and glossy lips' }, nextQuestionId: 'q5_style_glow_dark', scoreKeywords: ['cleanGirl', 'balletcore'] },
      { text: { ko: '보송한 피부와 채도 낮은 뮤트 톤의 입술', en: 'Soft skin and low saturation mute tone lips' }, nextQuestionId: 'q5_style_matte_dark', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q4_makeup_pastel: {
    id: 'q4_makeup_pastel',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?' },
    options: [
      { text: { ko: '핑크빛 블러셔에 글로시한 입술', en: 'Pink blush with glossy lips' }, nextQuestionId: 'q5_style_soft', scoreKeywords: ['softGirl'] },
      { text: { ko: '본연의 내추럴한 피부와 가벼운 컬러 립밤', en: 'Natural skin and light color lip balm' }, nextQuestionId: 'q5_style_mori', scoreKeywords: ['moriGirl'] },
    ],
  },
  q4_makeup_earth: {
    id: 'q4_makeup_earth',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?' },
    options: [
      { text: { ko: '핑크빛 블러셔에 글로시한 입술', en: 'Pink blush with glossy lips' }, nextQuestionId: 'q5_style_soft', scoreKeywords: ['softGirl'] },
      { text: { ko: '본연의 내추럴한 피부와 가벼운 컬러 립밤', en: 'Natural skin and light color lip balm' }, nextQuestionId: 'q5_style_mori', scoreKeywords: ['moriGirl'] },
    ],
  },
  q5_style_glow: {
    id: 'q5_style_glow',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt' }, nextQuestionId: 'q6_hair_cvb', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '리본, 타이츠 등의 발레웨어 스타일', en: 'Balletwear style with ribbon and tights' }, nextQuestionId: 'q6_hair_cvb', scoreKeywords: ['balletcore'] },
    ],
  },
  q5_style_matte_light: {
    id: 'q5_style_matte_light',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt' }, nextQuestionId: 'q6_hair_cvl', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '아이보리 니트와 플리츠 스커트의 클래식 룩', en: 'Classic look of ivory knit and pleated skirt' }, nextQuestionId: 'q6_hair_cvl', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q5_style_glow_dark: {
    id: 'q5_style_glow_dark',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '트렌치 코트와 롱 스커트의 프렌치 시크 룩', en: 'French chic look of trench coat and long skirt' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q5_style_matte_dark: {
    id: 'q5_style_matte_dark',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '트렌치 코트와 롱 스커트의 프렌치 시크 룩', en: 'French chic look of trench coat and long skirt' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q5_style_soft: {
    id: 'q5_style_soft',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
    options: [
      { text: { ko: '리본, 하트 디테일의 니트와 프릴 스커트', en: 'Knit with ribbon and heart details and frill skirt' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '부드러운 린넨 원피스와 느슨한 가디건', en: 'Soft linen dress and loose cardigan' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q5_style_mori: {
    id: 'q5_style_mori',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?' },
    options: [
      { text: { ko: '리본, 하트 디테일의 니트와 프릴 스커트', en: 'Knit with ribbon and heart details and frill skirt' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '부드러운 린넨 원피스와 느슨한 가디건', en: 'Soft linen dress and loose cardigan' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q6_hair_cvb: {
    id: 'q6_hair_cvb',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '클립을 이용한 올림머리 혹은 올백 스타일', en: 'Updo using clips or slicked back style' }, nextQuestionId: 'q7_bag_cvb', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '머리망을 이용한 하이 번 혹은 로우 번 스타일', en: 'High bun or low bun style using hair net' }, nextQuestionId: 'q7_bag_cvb', scoreKeywords: ['balletcore'] },
    ],
  },
  q6_hair_cvl: {
    id: 'q6_hair_cvl',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '클립을 이용한 올림머리 혹은 올백 스타일', en: 'Updo using clips or slicked back style' }, nextQuestionId: 'q7_bag_cvl', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '자연스러운 웨이브나 반 묶음 스타일', en: 'Natural wave or half-up style' }, nextQuestionId: 'q7_bag_cvl', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q6_hair_cvd: {
    id: 'q6_hair_cvd',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '클립을 이용한 올림머리 혹은 올백 스타일', en: 'Updo using clips or slicked back style' }, nextQuestionId: 'q7_bag_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '자연스러운 웨이브나 반 묶음 스타일', en: 'Natural wave or half-up style' }, nextQuestionId: 'q7_bag_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q6_hair_svm: {
    id: 'q6_hair_svm',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '자연스러운 웨이브 혹은 포니테일', en: 'Natural wave or ponytail' }, nextQuestionId: 'q7_bag_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '긴 생머리 혹은 느슨하게 묶은 머리', en: 'Long straight hair or loosely tied hair' }, nextQuestionId: 'q7_bag_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q7_bag_cvb: {
    id: 'q7_bag_cvb',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?' },
    options: [
      { text: { ko: '스몰 사이즈의 토트백 혹은 탑핸들백', en: 'Small size tote bag or top handle bag' }, nextQuestionId: 'q8_final_cvb', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '리본 포인트와 은은한 색감의 숄더백', en: 'Shoulder bag with ribbon point and subtle color' }, nextQuestionId: 'q8_final_cvb', scoreKeywords: ['balletcore'] },
    ],
  },
  q7_bag_cvl: {
    id: 'q7_bag_cvl',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?' },
    options: [
      { text: { ko: '스몰 사이즈의 토트백 혹은 탑핸들백', en: 'Small size tote bag or top handle bag' }, nextQuestionId: 'q8_final_cvl', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '책이 들어가는 사이즈의 가죽 숄더백', en: 'Leather shoulder bag that fits books' }, nextQuestionId: 'q8_final_cvl', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q7_bag_cvd: {
    id: 'q7_bag_cvd',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?' },
    options: [
      { text: { ko: '스몰 사이즈의 토트백 혹은 탑핸들백', en: 'Small size tote bag or top handle bag' }, nextQuestionId: 'q8_final_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '브라운, 블랙 컬러의 가죽 숄더백', en: 'Leather shoulder bag in brown and black color' }, nextQuestionId: 'q8_final_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q7_bag_svm: {
    id: 'q7_bag_svm',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?' },
    options: [
      { text: { ko: '핑크, 화이트 컬러의 작은 숄더백', en: 'Small shoulder bag in pink and white color' }, nextQuestionId: 'q8_final_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '수공예 코튼 백 혹은 부드러운 에코백', en: 'Handmade cotton bag or soft eco bag' }, nextQuestionId: 'q8_final_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q8_final_cvb: {
    id: 'q8_final_cvb',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '차분하고 자기관리를 잘 하는 이미지', en: 'Calm image that takes good care of oneself' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '섬세하고 여리며 우아한 이미지', en: 'Delicate, tender and elegant image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['balletcore'] },
    ],
  },
  q8_final_cvl: {
    id: 'q8_final_cvl',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '차분하고 자기관리를 잘 하는 이미지', en: 'Calm image that takes good care of oneself' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '지적이면서 따뜻하고 교양 있는 이미지', en: 'Intellectual, warm and cultured image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q8_final_cvd: {
    id: 'q8_final_cvd',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '차분하고 자기관리를 잘 하는 이미지', en: 'Calm image that takes good care of oneself' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '고요하고 깊이 있는 신비로운 이미지', en: 'Quiet, deep and mysterious image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q8_final_svm: {
    id: 'q8_final_svm',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '다정하고 사랑스러운 이미지', en: 'Kind and lovely image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['softGirl'] },
      { text: { ko: '잔잔하고 자유로운 이미지', en: 'Calm and free image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['moriGirl'] },
    ],
  },
};

// 테토 그룹 질문 데이터
const femaleTetoQuestions: Record<string, Question> = {
  q2_vibe_teto: {
    id: 'q2_vibe_teto',
    title: { ko: '당신은 어떤 분위기의 존재감이 더 끌리나요?', en: 'What kind of presence atmosphere attracts you more?' },
    options: [
      { text: { ko: '대담하고 강렬한 에너지의 존재감', en: 'Bold and intense energy presence' }, nextQuestionId: 'q3_style_bold', scoreKeywords: ['mobWife', 'rockstar', 'bossBabe'] },
      { text: { ko: '몽환적이고 은은히 드러나는 존재감', en: 'Dreamy and subtly revealed presence' }, nextQuestionId: 'q3_style_dreamy', scoreKeywords: ['acubi', 'vampire'] },
    ],
  },
  q3_style_bold: {
    id: 'q3_style_bold',
    title: { ko: '당신은 어떤 옷의 스타일이 더 마음에 드나요?', en: 'Which clothing style do you like more?' },
    options: [
      { text: { ko: '깔끔하고 카리스마 있는 오피스 룩', en: 'Neat and charismatic office look' }, nextQuestionId: 'q4_makeup_neat', scoreKeywords: ['mobWife', 'bossBabe'] },
      { text: { ko: '가죽과 블랙 컬러 위주의 반항적인 룩', en: 'Rebellious look mainly with leather and black color' }, nextQuestionId: 'q4_makeup_rebel', scoreKeywords: ['rockstar'] },
    ],
  },
  q3_style_dreamy: {
    id: 'q3_style_dreamy',
    title: { ko: '당신은 어떤 옷의 스타일이 더 마음에 드나요?', en: 'Which clothing style do you like more?' },
    options: [
      { text: { ko: '미니멀하지만 디테일이 있는 빈티지 룩', en: 'Minimal but detailed vintage look' }, nextQuestionId: 'q4_makeup_vintage', scoreKeywords: ['acubi'] },
      { text: { ko: '밤에 잘 어울리는 관능적인 고딕 룩', en: 'Sensual gothic look that suits the night' }, nextQuestionId: 'q4_makeup_gothic', scoreKeywords: ['vampire'] },
    ],
  },
  q4_makeup_neat: {
    id: 'q4_makeup_neat',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?' },
    options: [
      { text: { ko: '카리스마 있는 아이라인과 또렷한 윤곽 메이크업', en: 'Charismatic eyeliner and clear contour makeup' }, nextQuestionId: 'q5_gaze_neat', scoreKeywords: ['bossBabe', 'mobWife'] },
      { text: { ko: '카리스마 있는 아이라인과 또렷한 윤곽 메이크업', en: 'Charismatic eyeliner and clear contour makeup' }, nextQuestionId: 'q5_gaze_neat', scoreKeywords: ['bossBabe', 'mobWife'] },
    ],
  },
  q4_makeup_rebel: {
    id: 'q4_makeup_rebel',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?' },
    options: [
      { text: { ko: '살짝 번진 아이라인과 메탈릭 포인트의 메이크업', en: 'Slightly smudged eyeliner and metallic point makeup' }, nextQuestionId: 'q5_gaze_rebel', scoreKeywords: ['bossBabe', 'rockstar'] },
      { text: { ko: '살짝 번진 아이라인과 메탈릭 포인트의 메이크업', en: 'Slightly smudged eyeliner and metallic point makeup' }, nextQuestionId: 'q5_gaze_rebel', scoreKeywords: ['bossBabe', 'rockstar'] },
    ],
  },
  q4_makeup_vintage: {
    id: 'q4_makeup_vintage',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?' },
    options: [
      { text: { ko: '뮤트한 색감의 차분하고 힙한 메이크업', en: 'Calm and hip makeup with mute colors' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['acubi'] },
      { text: { ko: '창백한 피부와 딥 레드의 신비롭고 치명적인 메이크업', en: 'Mysterious and fatal makeup with pale skin and deep red' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['vampire'] },
    ],
  },
  q4_makeup_gothic: {
    id: 'q4_makeup_gothic',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?' },
    options: [
      { text: { ko: '뮤트한 색감의 차분하고 힙한 메이크업', en: 'Calm and hip makeup with mute colors' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['acubi'] },
      { text: { ko: '창백한 피부와 딥 레드의 신비롭고 치명적인 메이크업', en: 'Mysterious and fatal makeup with pale skin and deep red' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['vampire'] },
    ],
  },
  q5_gaze_neat: {
    id: 'q5_gaze_neat',
    title: { ko: '당신이 보여주고픈 눈빛은 어떤 것과 더 가깝나요?', en: 'What kind of gaze do you want to show?' },
    options: [
      { text: { ko: '흔들림 없고 당당한 주도권의 눈빛', en: 'Unwavering and confident dominant gaze' }, nextQuestionId: 'q6_color_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '강렬하고 도발적이라 피하기 어려운 눈빛', en: 'Intense and provocative gaze that is hard to avoid' }, nextQuestionId: 'q6_color_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q5_gaze_rebel: {
    id: 'q5_gaze_rebel',
    title: { ko: '당신이 보여주고픈 눈빛은 어떤 것과 더 가깝나요?', en: 'What kind of gaze do you want to show?' },
    options: [
      { text: { ko: '흔들림 없고 당당한 주도권의 눈빛', en: 'Unwavering and confident dominant gaze' }, nextQuestionId: 'q6_color_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '규칙에 얽매이지 않는 에너지의 눈빛', en: 'Energetic gaze that is not bound by rules' }, nextQuestionId: 'q6_color_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q5_gaze_dreamy: {
    id: 'q5_gaze_dreamy',
    title: { ko: '당신이 보여주고픈 눈빛은 어떤 것과 더 가깝나요?', en: 'What kind of gaze do you want to show?' },
    options: [
      { text: { ko: '감정을 쉽게 읽히지 않는 쿨한 눈빛', en: 'Cool gaze that is not easily readable' }, nextQuestionId: 'q6_color_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '어둡고 깊어서 빠져드는 눈빛', en: 'Dark and deep gaze that draws you in' }, nextQuestionId: 'q6_color_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q6_color_boss: {
    id: 'q6_color_boss',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white' }, nextQuestionId: 'q7_emotion_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '레오파드와 골드, 버건디 등의 대담한 조합', en: 'Bold combinations like leopard, gold, and burgundy' }, nextQuestionId: 'q7_emotion_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q6_color_mob: {
    id: 'q6_color_mob',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white' }, nextQuestionId: 'q7_emotion_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '레오파드와 골드, 버건디 등의 대담한 조합', en: 'Bold combinations like leopard, gold, and burgundy' }, nextQuestionId: 'q7_emotion_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q6_color_boss_rock: {
    id: 'q6_color_boss_rock',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white' }, nextQuestionId: 'q7_emotion_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '블랙과 실버, 다크 레드처럼 대비가 강한 조합', en: 'High contrast combinations like black, silver, and dark red' }, nextQuestionId: 'q7_emotion_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q6_color_rock: {
    id: 'q6_color_rock',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white' }, nextQuestionId: 'q7_emotion_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '블랙과 실버, 다크 레드처럼 대비가 강한 조합', en: 'High contrast combinations like black, silver, and dark red' }, nextQuestionId: 'q7_emotion_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q6_color_acubi: {
    id: 'q6_color_acubi',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?' },
    options: [
      { text: { ko: '그레이, 차콜 등의 톤 다운된 미묘한 조합', en: 'Subtle combinations with toned down colors like gray and charcoal' }, nextQuestionId: 'q7_emotion_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '블랙, 딥 레드, 와인 등의 관능적인 조합', en: 'Sensual combinations like black, deep red, and wine' }, nextQuestionId: 'q7_emotion_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q6_color_vampire: {
    id: 'q6_color_vampire',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?' },
    options: [
      { text: { ko: '그레이, 차콜 등의 톤 다운된 미묘한 조합', en: 'Subtle combinations with toned down colors like gray and charcoal' }, nextQuestionId: 'q7_emotion_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '블랙, 딥 레드, 와인 등의 관능적인 조합', en: 'Sensual combinations like black, deep red, and wine' }, nextQuestionId: 'q7_emotion_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q7_emotion_boss: {
    id: 'q7_emotion_boss',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions' }, nextQuestionId: 'q8_final_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '사랑과 분노, 욕망이 확실하고 극적인 감정선', en: 'Emotional line with clear and dramatic love, anger, and desire' }, nextQuestionId: 'q8_final_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q7_emotion_mob: {
    id: 'q7_emotion_mob',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions' }, nextQuestionId: 'q8_final_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '사랑과 분노, 욕망이 확실하고 극적인 감정선', en: 'Emotional line with clear and dramatic love, anger, and desire' }, nextQuestionId: 'q8_final_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q7_emotion_boss_rock: {
    id: 'q7_emotion_boss_rock',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions' }, nextQuestionId: 'q8_final_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '불안정하지만 솔직해서 충동이 드러나는 감정선', en: 'Emotional line that is unstable but honest, revealing impulses' }, nextQuestionId: 'q8_final_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q7_emotion_rock: {
    id: 'q7_emotion_rock',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions' }, nextQuestionId: 'q8_final_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '불안정하지만 솔직해서 충동이 드러나는 감정선', en: 'Emotional line that is unstable but honest, revealing impulses' }, nextQuestionId: 'q8_final_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q7_emotion_acubi: {
    id: 'q7_emotion_acubi',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?' },
    options: [
      { text: { ko: '속을 쉽게 드러내지 않는 절제된 감정선', en: 'Restrained emotional line that does not easily reveal inner feelings' }, nextQuestionId: 'q8_final_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '고독과 집착, 갈망이 얽힌 깊고 어두운 감정선', en: 'Deep and dark emotional line intertwined with loneliness, obsession, and longing' }, nextQuestionId: 'q8_final_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q7_emotion_vampire: {
    id: 'q7_emotion_vampire',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?' },
    options: [
      { text: { ko: '속을 쉽게 드러내지 않는 절제된 감정선', en: 'Restrained emotional line that does not easily reveal inner feelings' }, nextQuestionId: 'q8_final_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '고독과 집착, 갈망이 얽힌 깊고 어두운 감정선', en: 'Deep and dark emotional line intertwined with loneliness, obsession, and longing' }, nextQuestionId: 'q8_final_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q8_final_boss: {
    id: 'q8_final_boss',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '쉽게 잊혀지지 않는 관능적인 이미지', en: 'Sensual image that is not easily forgotten' }, nextQuestionId: 'result_calculation', scoreKeywords: ['mobWife'] },
    ],
  },
  q8_final_mob: {
    id: 'q8_final_mob',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '쉽게 잊혀지지 않는 관능적인 이미지', en: 'Sensual image that is not easily forgotten' }, nextQuestionId: 'result_calculation', scoreKeywords: ['mobWife'] },
    ],
  },
  q8_final_boss_rock: {
    id: 'q8_final_boss_rock',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '틀에 얽매이지 않는 자유로운 이미지', en: 'Free image that is not bound by frames' }, nextQuestionId: 'result_calculation', scoreKeywords: ['rockstar'] },
    ],
  },
  q8_final_rock: {
    id: 'q8_final_rock',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '틀에 얽매이지 않는 자유로운 이미지', en: 'Free image that is not bound by frames' }, nextQuestionId: 'result_calculation', scoreKeywords: ['rockstar'] },
    ],
  },
  q8_final_acubi: {
    id: 'q8_final_acubi',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '조용하지만 힙하고 쿨한 이미지', en: 'Quiet but hip and cool image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['acubi'] },
      { text: { ko: '신비롭고 어두우며 궁금해지는 이미지', en: 'Mysterious, dark, and intriguing image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['vampire'] },
    ],
  },
  q8_final_vampire: {
    id: 'q8_final_vampire',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '조용하지만 힙하고 쿨한 이미지', en: 'Quiet but hip and cool image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['acubi'] },
      { text: { ko: '신비롭고 어두우며 궁금해지는 이미지', en: 'Mysterious, dark, and intriguing image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['vampire'] },
    ],
  },
};

// 남성 질문 데이터 (Linked List 방식)
const maleQuestions: Record<string, Question> = {
  m_q1_start: {
    id: 'm_q1_start',
    title: { ko: '당신은 어떤 인상을 주고 싶은가요?', en: 'What kind of impression do you want to give?' },
    options: [
      { text: { ko: '부드럽고 편안한 인상', en: 'Soft and comfortable impression' }, nextQuestionId: 'm_q2_style_nonteto', scoreKeywords: ['cleanBoy', 'softBoy', 'darkAcademiaBoy', 'naturalBoy'] },
      { text: { ko: '카리스마 있는 강렬한 인상', en: 'Charismatic and intense impression' }, nextQuestionId: 'm_q2_style_teto', scoreKeywords: ['streetBoy', 'rockBoy', 'gentleBoy', 'techBoy'] },
    ],
  },
  m_q2_style_teto: {
    id: 'm_q2_style_teto',
    title: { ko: '당신이 더 편안하게 느끼는 스타일은 무엇인가요?', en: 'Which style do you feel more comfortable with?' },
    options: [
      { text: { ko: '자유롭고 개성적인 스타일', en: 'Free and individualistic style' }, nextQuestionId: 'm_q3_imp_teto', scoreKeywords: ['streetBoy', 'rockBoy'] },
      { text: { ko: '정돈된 느낌의 깔끔한 스타일', en: 'Neat and organized style' }, nextQuestionId: 'm_q3_imp_teto', scoreKeywords: ['gentleBoy', 'techBoy'] },
    ],
  },
  m_q3_imp_teto: {
    id: 'm_q3_imp_teto',
    title: { ko: '당신은 스타일링을 통해 어떤 인상을 주고싶나요?', en: 'What impression do you want to give through styling?' },
    options: [
      { text: { ko: '규칙에 얽매이지 않는 자유로운 인상', en: 'Free impression that is not bound by rules' }, nextQuestionId: 'm_q4_color_wild', scoreKeywords: ['streetBoy', 'rockBoy'] },
      { text: { ko: '세련되고 정돈되어 신뢰감 있는 인상', en: 'Sophisticated and organized impression that gives trust' }, nextQuestionId: 'm_q4_color_neat', scoreKeywords: ['gentleBoy', 'techBoy'] },
    ],
  },
  m_q4_color_wild: {
    id: 'm_q4_color_wild',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?' },
    options: [
      { text: { ko: '네온, 레드, 그래픽 컬러 포인트가 대비되는 조합', en: 'Combination with contrasting neon, red, and graphic color points' }, nextQuestionId: 'm_q5_hair_wild', scoreKeywords: ['streetBoy'] },
      { text: { ko: '워싱 포인트의 거칠고 어두운 무드의 조합', en: 'Combination with rough and dark mood of washing points' }, nextQuestionId: 'm_q5_hair_wild', scoreKeywords: ['rockBoy'] },
    ],
  },
  m_q4_color_neat: {
    id: 'm_q4_color_neat',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?' },
    options: [
      { text: { ko: '네이비, 그레이처럼 클래식한 조합', en: 'Classic combination like navy and gray' }, nextQuestionId: 'm_q5_hair_neat', scoreKeywords: ['gentleBoy'] },
      { text: { ko: '차콜, 실버 등의 미래적인 조합', en: 'Futuristic combination like charcoal and silver' }, nextQuestionId: 'm_q5_hair_neat', scoreKeywords: ['techBoy'] },
    ],
  },
  m_q5_hair_wild: {
    id: 'm_q5_hair_wild',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '자연스럽게 흐트러진 스트릿 감성의 헤어', en: 'Naturally disheveled street-style hair' }, nextQuestionId: 'm_q6_final_wild', scoreKeywords: ['streetBoy'] },
      { text: { ko: '장발이나 울프컷처럼 개성이 강한 헤어', en: 'Hair with strong personality like long hair or wolf cut' }, nextQuestionId: 'm_q6_final_wild', scoreKeywords: ['rockBoy'] },
    ],
  },
  m_q5_hair_neat: {
    id: 'm_q5_hair_neat',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '오피스에 잘 어울리는 가르마', en: 'Parted hair that suits the office' }, nextQuestionId: 'm_q6_final_neat', scoreKeywords: ['gentleBoy'] },
      { text: { ko: '미니멀하고 깔끔한 쇼트 컷', en: 'Minimal and neat short cut' }, nextQuestionId: 'm_q6_final_neat', scoreKeywords: ['techBoy'] },
    ],
  },
  m_q6_final_wild: {
    id: 'm_q6_final_wild',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '자유롭고 트렌디해서 시선이 가는 이미지', en: 'Free and trendy image that draws attention' }, nextQuestionId: 'result_calculation', scoreKeywords: ['streetBoy'] },
      { text: { ko: '거칠고 대담한 반항적인 이미지', en: 'Rough and bold rebellious image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['rockBoy'] },
    ],
  },
  m_q6_final_neat: {
    id: 'm_q6_final_neat',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '차분하고 단정해서 신뢰감 있는 이미지', en: 'Calm and neat image that gives trust' }, nextQuestionId: 'result_calculation', scoreKeywords: ['gentleBoy'] },
      { text: { ko: '효율적이고 스마트한 감각의 이미지', en: 'Efficient and smart image' }, nextQuestionId: 'result_calculation', scoreKeywords: ['techBoy'] },
    ],
  },
  m_q2_style_nonteto: {
    id: 'm_q2_style_nonteto',
    title: { ko: '당신이 더 편안하게 느끼는 스타일은 무엇인가요?', en: 'Which style do you feel more comfortable with?' },
    options: [
      { text: { ko: '차분하고 단정한 룩', en: 'Calm and neat look' }, nextQuestionId: 'm_q3_imp_nonteto', scoreKeywords: ['cleanBoy', 'darkAcademiaBoy'] },
      { text: { ko: '편안하고 자연스러운 룩', en: 'Comfortable and natural look' }, nextQuestionId: 'm_q3_imp_nonteto', scoreKeywords: ['softBoy', 'naturalBoy'] },
    ],
  },
  m_q3_imp_nonteto: {
    id: 'm_q3_imp_nonteto',
    title: { ko: '당신은 스타일링을 통해 어떤 인상을 주고싶나요?', en: 'What impression do you want to give through styling?' },
    options: [
      { text: { ko: '지적이고 신뢰감 있는 인상', en: 'Intellectual and trustworthy impression' }, nextQuestionId: 'm_q4_color_smart', scoreKeywords: ['cleanBoy', 'darkAcademiaBoy'] },
      { text: { ko: '친근하고 편안한 인상', en: 'Friendly and comfortable impression' }, nextQuestionId: 'm_q4_color_soft', scoreKeywords: ['softBoy', 'naturalBoy'] },
    ],
  },
  m_q4_color_smart: {
    id: 'm_q4_color_smart',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?' },
    options: [
      { text: { ko: '화이트, 블랙 등의 명확한 뉴트럴 조합', en: 'Clear neutral combination like white and black' }, nextQuestionId: 'm_q5_hair_smart', scoreKeywords: ['cleanBoy'] },
      { text: { ko: '브라운, 딥 그린 등의 어스 톤 조합', en: 'Earth tone combination like brown and deep green' }, nextQuestionId: 'm_q5_hair_smart', scoreKeywords: ['darkAcademiaBoy'] },
    ],
  },
  m_q4_color_soft: {
    id: 'm_q4_color_soft',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?' },
    options: [
      { text: { ko: '파스텔 톤의 부드럽고 따뜻한 조합', en: 'Soft and warm combination of pastel tones' }, nextQuestionId: 'm_q5_hair_soft', scoreKeywords: ['softBoy'] },
      { text: { ko: '베이지, 카키 등의 내츄럴한 조합', en: 'Natural combination like beige and khaki' }, nextQuestionId: 'm_q5_hair_soft', scoreKeywords: ['naturalBoy'] },
    ],
  },
  m_q5_hair_smart: {
    id: 'm_q5_hair_smart',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '짧은 커트나 가르마 등의 손질이 잘 된 스타일', en: 'Well-groomed style like short cut or parted hair' }, nextQuestionId: 'm_q6_final_smart', scoreKeywords: ['cleanBoy'] },
      { text: { ko: '자연스럽게 흐르는 중장발이나 클래식한 가르마', en: 'Naturally flowing medium-long hair or classic parted hair' }, nextQuestionId: 'm_q6_final_smart', scoreKeywords: ['darkAcademiaBoy'] },
    ],
  },
  m_q5_hair_soft: {
    id: 'm_q5_hair_soft',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?' },
    options: [
      { text: { ko: '부드러운 웨이브나 가르마의 온화한 스타일', en: 'Gentle style with soft waves or parted hair' }, nextQuestionId: 'm_q6_final_soft', scoreKeywords: ['softBoy'] },
      { text: { ko: '최소한의 손질로 자연스러운 질감의 스타일', en: 'Style with natural texture with minimal grooming' }, nextQuestionId: 'm_q6_final_soft', scoreKeywords: ['naturalBoy'] },
    ],
  },
  m_q6_final_smart: {
    id: 'm_q6_final_smart',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '신뢰감 있고, 누구에게나 호감인 이미지', en: 'Trustworthy and likable image to everyone' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanBoy'] },
      { text: { ko: '지적이고 차분하며, 깊은 생각이 느껴지는 이미지', en: 'Intellectual, calm image that shows deep thinking' }, nextQuestionId: 'result_calculation', scoreKeywords: ['darkAcademiaBoy'] },
    ],
  },
  m_q6_final_soft: {
    id: 'm_q6_final_soft',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!' },
    options: [
      { text: { ko: '부드럽고 따뜻해서 함께하면 편안해지는 이미지', en: 'Soft and warm image that makes you feel comfortable together' }, nextQuestionId: 'result_calculation', scoreKeywords: ['softBoy'] },
      { text: { ko: '꾸미지 않아도 매력이 전해지는 이미지', en: 'Image that conveys charm without decoration' }, nextQuestionId: 'result_calculation', scoreKeywords: ['naturalBoy'] },
    ],
  },
};

export default function QuestionFlow() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mbti, setMbti] = useState('');
  const [selections, setSelections] = useState<string[]>([]); // 남성 질문용
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('q1_start');
  const [isCalculating, setIsCalculating] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  // history 타입: 질문 ID와 선택한 답변의 점수 키워드를 함께 저장
  type HistoryEntry = {
    questionId: string;
    scoreKeywords: StyleType[];
  };
  const [history, setHistory] = useState<HistoryEntry[]>([]); // 질문 ID와 선택한 답변의 점수 키워드 방문 기록
  const [scores, setScores] = useState<Scores>({
    // 여성
    cleanGirl: 0, softGirl: 0, coquette: 0, lightAcademia: 0,
    darkAcademia: 0, balletcore: 0, moriGirl: 0, acubi: 0,
    mobWife: 0, rockstar: 0, vampire: 0, bossBabe: 0,
    // 남성
    cleanBoy: 0, softBoy: 0, darkAcademiaBoy: 0, naturalBoy: 0,
    streetBoy: 0, rockBoy: 0, gentleBoy: 0, techBoy: 0,
  });

  // 모든 질문 데이터 통합
  const allQuestions: Record<string, Question> = {
    ...femaleAegenQuestions,
    ...femaleTetoQuestions,
    ...maleQuestions,
  };

  const addScore = (keywords: StyleType[]) => {
    setScores(prev => {
      const newScores = { ...prev };
      keywords.forEach(k => newScores[k]++);
      return newScores;
    });
  };

  const subtractScore = (keywords: StyleType[]) => {
    setScores(prev => {
      const newScores = { ...prev };
      keywords.forEach(k => {
        if (newScores[k] > 0) {
          newScores[k]--;
        }
      });
      return newScores;
    });
  };

  // Linked List 방식으로 질문 가져오기
  const getQuestion = (): Question | null => {
    if (step < 2) return null;
    
    // Linked List 방식으로 질문 가져오기
    const question = allQuestions[currentQuestionId];
    return question || null;
  };

  // 답변 선택 핸들러 (Linked List 방식)
  const handleAnswerLinked = (option: QuestionOption) => {
    // 현재 질문 ID와 선택한 답변의 점수 키워드를 history에 저장
    setHistory(prev => [...prev, {
      questionId: currentQuestionId,
      scoreKeywords: option.scoreKeywords
    }]);
    
    // 점수 추가
    addScore(option.scoreKeywords);
    
    // 다음 질문으로 이동
    if (option.nextQuestionId === 'result_calculation') {
      calculateResult();
    } else {
      setCurrentQuestionId(option.nextQuestionId);
      setStep(prev => prev + 1);
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

  // step이 2가 될 때 currentQuestionId 초기화 및 history 초기화
  useEffect(() => {
    if (step === 2) {
      if (gender === 'female' && currentQuestionId !== 'q1_start') {
        setCurrentQuestionId('q1_start');
      } else if (gender === 'male' && currentQuestionId !== 'm_q1_start') {
        setCurrentQuestionId('m_q1_start');
      }
      // 질문 시작 시 history 초기화
      setHistory([]);
    }
  }, [step, gender]);

  const currentQuestion = getQuestion();
  const isStep0Valid = age !== '' && gender !== '';
  const isStep1Valid = mbti !== '';

  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-0 py-10">
      <div className="glass-question-box rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-white">{t('step1Title')}</h2>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-white">{t('age')}</label>
                  <select
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-2 w-full h-11 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-200 hover:border-white/30 hover:shadow-md text-white"
                  >
                    <option value="" disabled className="text-gray-800">{t('select')}</option>
                    <option value="10대" className="text-gray-800">10대</option>
                    <option value="20대" className="text-gray-800">20대</option>
                    <option value="30대" className="text-gray-800">30대</option>
                    <option value="40대" className="text-gray-800">40대</option>
                    <option value="50대 이상" className="text-gray-800">50대 이상</option>
                  </select>
                </div>
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium text-white">{t('gender')}</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(['female', 'male'] as const).map((g) => (
                        <label 
                          key={g}
                          className="glass-button inline-flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer text-white"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={gender === g}
                            onChange={(e) => setGender(e.target.value)}
                            className="accent-white"
                          />
                          <span className="font-normal">{t(g)}</span>
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
                    className="glass-button-primary inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium enabled:hover:scale-[1.01] transition disabled:opacity-50"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-white">{t('step2Title')}</h2>
                <label htmlFor="mbti" className="block text-sm font-medium text-white">{t('mbti')}</label>
                <select
                  id="mbti"
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value)}
                  className="mt-2 w-full h-11 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-200 hover:border-white/30 hover:shadow-md text-white"
                >
                  <option value="" disabled className="text-gray-800">{t('select')}</option>
                  <option value="선택안함" className="text-gray-800">선택안함</option>
                  {['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'].map(type => (
                    <option key={type} value={type} className="text-gray-800">{type}</option>
                  ))}
                </select>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" onClick={() => setStep(0)} className="text-sm text-white/80 hover:text-white transition">
                    {t('back')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className="glass-button-primary inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium enabled:hover:scale-[1.01] transition disabled:opacity-50"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}

            {step >= 2 && currentQuestion && (
              <>
                <h3 className="text-base sm:text-lg font-semibold mb-6 text-white">
                  {currentQuestion.title[lang]}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerLinked(option as QuestionOption)}
                      className="glass-button w-full text-left p-4 rounded-xl hover:bg-white/20 active:scale-[0.99] transition-all duration-200"
                    >
                      <span className="text-sm sm:text-base text-white font-normal">{option.text[lang]}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-start">
                  <button 
                    type="button" 
                    onClick={() => {
                      // Linked List 방식 - history를 사용해서 정확한 이전 질문으로 돌아가기
                      if (history.length > 0) {
                        // history에서 가장 최근 항목 가져오기
                        const prevHistory = [...history];
                        const lastEntry = prevHistory.pop();
                        
                        if (lastEntry) {
                          // 마지막 선택한 답변의 점수 취소
                          subtractScore(lastEntry.scoreKeywords);
                          
                          // history 업데이트
                          setHistory(prevHistory);
                          
                          // 이전 질문으로 이동
                          setCurrentQuestionId(lastEntry.questionId);
                          setStep(prev => Math.max(2, prev - 1));
                        }
                      } else {
                        // history가 비어있으면 step 1로 돌아가기
                        setStep(1);
                      }
                    }}
                    className="text-sm text-white/80 hover:text-white transition"
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
