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
  text: { ko: string; en: string; cn?: string; jp?: string };
  nextQuestionId: string;
  scoreKeywords: StyleType[];
};

type Question = {
  id: string;
  title: { ko: string; en: string; cn?: string; jp?: string };
  options: QuestionOption[];
};

// 여성 에겐 그룹 질문 데이터
const femaleAegenQuestions: Record<string, Question> = {
  q1_start: {
    id: 'q1_start',
    title: { ko: '첫만남에 당신이 보여주고픈 이미지는 무엇인가요?', en: 'What image do you want to show on first meeting?', cn: '初次见面时，您想展现什么样的形象？', jp: '初対面で、あなたが見せたいイメージは何ですか？' },
    options: [
      { text: { ko: '단아하고 깨끗한 이미지', en: 'Elegant and clean image', cn: '优雅干净的形象', jp: '上品で清潔なイメージ' }, nextQuestionId: 'q2_vibe_egen', scoreKeywords: ['cleanGirl', 'softGirl', 'lightAcademia', 'darkAcademia', 'balletcore', 'moriGirl'] },
      { text: { ko: '시크하고 도도한 이미지', en: 'Chic and aloof image', cn: '时尚高冷的形象', jp: 'シックで気高いイメージ' }, nextQuestionId: 'q2_vibe_teto', scoreKeywords: ['acubi', 'mobWife', 'rockstar', 'vampire', 'bossBabe'] },
    ],
  },
  q2_vibe_egen: {
    id: 'q2_vibe_egen',
    title: { ko: '당신이 원하는 전체적인 분위기는 무엇인가요?', en: 'What overall atmosphere do you want?', cn: '您想要的整体氛围是什么？', jp: 'あなたが望む全体的な雰囲気は何ですか？' },
    options: [
      { text: { ko: '지적이고 세련된 분위기', en: 'Intellectual and sophisticated atmosphere', cn: '知性而精致的氛围', jp: '知的で洗練された雰囲気' }, nextQuestionId: 'q3_color_intellectual', scoreKeywords: ['cleanGirl', 'lightAcademia', 'darkAcademia', 'balletcore'] },
      { text: { ko: '편안하고 따뜻한 분위기', en: 'Comfortable and warm atmosphere', cn: '舒适温暖的氛围', jp: '心地よく温かい雰囲気' }, nextQuestionId: 'q3_color_warm', scoreKeywords: ['softGirl', 'moriGirl'] },
    ],
  },
  q3_color_intellectual: {
    id: 'q3_color_intellectual',
    title: { ko: '어떤 색감의 패션이 더 마음에 드나요?', en: 'Which color palette of fashion do you like more?', cn: '您更喜欢哪种色调的时尚？', jp: 'どの色合いのファッションがよりお好みですか？' },
    options: [
      { text: { ko: '화이트, 아이보리 등의 뉴트럴 톤', en: 'Neutral tones like white and ivory', cn: '白色、象牙色等中性色调', jp: '白、アイボリーなどのニュートラルトーン' }, nextQuestionId: 'q4_makeup_neutral', scoreKeywords: ['cleanGirl', 'lightAcademia', 'balletcore'] },
      { text: { ko: '브라운, 딥 그린 등의 딥 톤', en: 'Deep tones like brown and deep green', cn: '棕色、深绿色等深色调', jp: 'ブラウン、ディープグリーンなどのディープトーン' }, nextQuestionId: 'q4_makeup_dark', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q3_color_warm: {
    id: 'q3_color_warm',
    title: { ko: '어떤 색감의 패션이 더 마음에 드나요?', en: 'Which color palette of fashion do you like more?', cn: '您更喜欢哪种色调的时尚？', jp: 'どの色合いのファッションがよりお好みですか？' },
    options: [
      { text: { ko: '핑크, 라벤더 등의 파스텔 톤', en: 'Pastel tones like pink and lavender', cn: '粉色、薰衣草色等粉彩色调', jp: 'ピンク、ラベンダーなどのパステルトーン' }, nextQuestionId: 'q4_makeup_pastel', scoreKeywords: ['softGirl'] },
      { text: { ko: '베이지, 올리브 등의 어스 톤', en: 'Earth tones like beige and olive', cn: '米色、橄榄色等大地色调', jp: 'ベージュ、オリーブなどのアーストーン' }, nextQuestionId: 'q4_makeup_earth', scoreKeywords: ['moriGirl'] },
    ],
  },
  q4_makeup_neutral: {
    id: 'q4_makeup_neutral',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?', cn: '您更偏好哪种妆容？', jp: 'どのメイクをより好みますか？' },
    options: [
      { text: { ko: '광채 나는 투명 피부와 글로시한 입술', en: 'Glowing transparent skin and glossy lips', cn: '光泽透明的肌肤和光泽唇', jp: '輝く透明な肌とグロッシーな唇' }, nextQuestionId: 'q5_style_glow', scoreKeywords: ['cleanGirl', 'balletcore'] },
      { text: { ko: '보송한 피부와 MLBB 컬러의 입술', en: 'Soft skin and MLBB color lips', cn: '柔嫩肌肤和MLBB色唇', jp: 'ふわふわした肌とMLBBカラーの唇' }, nextQuestionId: 'q5_style_matte_light', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q4_makeup_dark: {
    id: 'q4_makeup_dark',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?', cn: '您更偏好哪种妆容？', jp: 'どのメイクをより好みますか？' },
    options: [
      { text: { ko: '광채 나는 투명 피부와 글로시한 입술', en: 'Glowing transparent skin and glossy lips', cn: '光泽透明的肌肤和光泽唇', jp: '輝く透明な肌とグロッシーな唇' }, nextQuestionId: 'q5_style_glow_dark', scoreKeywords: ['cleanGirl', 'balletcore'] },
      { text: { ko: '보송한 피부와 채도 낮은 뮤트 톤의 입술', en: 'Soft skin and low saturation mute tone lips', cn: '柔嫩肌肤和低饱和度哑光唇', jp: 'ふわふわした肌と低彩度のミュートトーンの唇' }, nextQuestionId: 'q5_style_matte_dark', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q4_makeup_pastel: {
    id: 'q4_makeup_pastel',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?', cn: '您更偏好哪种妆容？', jp: 'どのメイクをより好みますか？' },
    options: [
      { text: { ko: '핑크빛 블러셔에 글로시한 입술', en: 'Pink blush with glossy lips', cn: '粉色腮红和光泽唇', jp: 'ピンクのチークとグロッシーな唇' }, nextQuestionId: 'q5_style_soft', scoreKeywords: ['softGirl'] },
      { text: { ko: '본연의 내추럴한 피부와 가벼운 컬러 립밤', en: 'Natural skin and light color lip balm', cn: '自然肌肤和浅色润唇膏', jp: '本来のナチュラルな肌と軽いカラーのリップバーム' }, nextQuestionId: 'q5_style_mori', scoreKeywords: ['moriGirl'] },
    ],
  },
  q4_makeup_earth: {
    id: 'q4_makeup_earth',
    title: { ko: '당신은 어떤 메이크업을 더 선호하나요?', en: 'What makeup do you prefer more?', cn: '您更偏好哪种妆容？', jp: 'どのメイクをより好みますか？' },
    options: [
      { text: { ko: '핑크빛 블러셔에 글로시한 입술', en: 'Pink blush with glossy lips', cn: '粉色腮红和光泽唇', jp: 'ピンクのチークとグロッシーな唇' }, nextQuestionId: 'q5_style_soft', scoreKeywords: ['softGirl'] },
      { text: { ko: '본연의 내추럴한 피부와 가벼운 컬러 립밤', en: 'Natural skin and light color lip balm', cn: '自然肌肤和浅色润唇膏', jp: '本来のナチュラルな肌と軽いカラーのリップバーム' }, nextQuestionId: 'q5_style_mori', scoreKeywords: ['moriGirl'] },
    ],
  },
  q5_style_glow: {
    id: 'q5_style_glow',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt', cn: '白衬衫和黑裙的极简风格', jp: '白いシャツと黒いスカートのミニマルルック' }, nextQuestionId: 'q6_hair_cvb', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '리본, 타이츠 등의 발레웨어 스타일', en: 'Balletwear style with ribbon and tights', cn: '带有丝带和紧身裤的芭蕾风格', jp: 'リボン、タイツなどのバレエウェアスタイル' }, nextQuestionId: 'q6_hair_cvb', scoreKeywords: ['balletcore'] },
    ],
  },
  q5_style_matte_light: {
    id: 'q5_style_matte_light',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt', cn: '白衬衫和黑裙的极简风格', jp: '白いシャツと黒いスカートのミニマルルック' }, nextQuestionId: 'q6_hair_cvl', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '아이보리 니트와 플리츠 스커트의 클래식 룩', en: 'Classic look of ivory knit and pleated skirt', cn: '象牙色针织衫和百褶裙的经典风格', jp: 'アイボリーのニットとプリーツスカートのクラシックルック' }, nextQuestionId: 'q6_hair_cvl', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q5_style_glow_dark: {
    id: 'q5_style_glow_dark',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt', cn: '白衬衫和黑裙的极简风格', jp: '白いシャツと黒いスカートのミニマルルック' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '트렌치 코트와 롱 스커트의 프렌치 시크 룩', en: 'French chic look of trench coat and long skirt', cn: '风衣和长裙的法式时尚风格', jp: 'トレンチコートとロングスカートのフレンチシックルック' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q5_style_matte_dark: {
    id: 'q5_style_matte_dark',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '화이트 셔츠와 블랙 스커트의 미니멀 룩', en: 'Minimal look of white shirt and black skirt', cn: '白衬衫和黑裙的极简风格', jp: '白いシャツと黒いスカートのミニマルルック' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '트렌치 코트와 롱 스커트의 프렌치 시크 룩', en: 'French chic look of trench coat and long skirt', cn: '风衣和长裙的法式时尚风格', jp: 'トレンチコートとロングスカートのフレンチシックルック' }, nextQuestionId: 'q6_hair_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q5_style_soft: {
    id: 'q5_style_soft',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '리본, 하트 디테일의 니트와 프릴 스커트', en: 'Knit with ribbon and heart details and frill skirt', cn: '带有丝带和心形细节的针织衫和荷叶边裙', jp: 'リボン、ハートディテールのニットとフリルスカート' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '부드러운 린넨 원피스와 느슨한 가디건', en: 'Soft linen dress and loose cardigan', cn: '柔软的亚麻连衣裙和宽松开衫', jp: '柔らかいリネンのワンピースとゆったりしたカーディガン' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q5_style_mori: {
    id: 'q5_style_mori',
    title: { ko: '당신은 어떤 스타일에 더 편안함을 느끼나요?', en: 'Which style makes you feel more comfortable?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '리본, 하트 디테일의 니트와 프릴 스커트', en: 'Knit with ribbon and heart details and frill skirt', cn: '带有丝带和心形细节的针织衫和荷叶边裙', jp: 'リボン、ハートディテールのニットとフリルスカート' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '부드러운 린넨 원피스와 느슨한 가디건', en: 'Soft linen dress and loose cardigan', cn: '柔软的亚麻连衣裙和宽松开衫', jp: '柔らかいリネンのワンピースとゆったりしたカーディガン' }, nextQuestionId: 'q6_hair_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q6_hair_cvb: {
    id: 'q6_hair_cvb',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '클립을 이용한 올림머리 혹은 올백 스타일', en: 'Updo using clips or slicked back style', cn: '使用发夹的盘发或后梳风格', jp: 'クリップを使ったアップスタイルまたはスリックバックスタイル' }, nextQuestionId: 'q7_bag_cvb', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '머리망을 이용한 하이 번 혹은 로우 번 스타일', en: 'High bun or low bun style using hair net', cn: '使用发网的高发髻或低发髻风格', jp: 'ヘアネットを使ったハイバンまたはローバンスタイル' }, nextQuestionId: 'q7_bag_cvb', scoreKeywords: ['balletcore'] },
    ],
  },
  q6_hair_cvl: {
    id: 'q6_hair_cvl',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '클립을 이용한 올림머리 혹은 올백 스타일', en: 'Updo using clips or slicked back style', cn: '使用发夹的盘发或后梳风格', jp: 'クリップを使ったアップスタイルまたはスリックバックスタイル' }, nextQuestionId: 'q7_bag_cvl', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '자연스러운 웨이브나 반 묶음 스타일', en: 'Natural wave or half-up style', cn: '自然波浪或半扎风格', jp: '自然なウェーブまたはハーフアップスタイル' }, nextQuestionId: 'q7_bag_cvl', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q6_hair_cvd: {
    id: 'q6_hair_cvd',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '클립을 이용한 올림머리 혹은 올백 스타일', en: 'Updo using clips or slicked back style', cn: '使用发夹的盘发或后梳风格', jp: 'クリップを使ったアップスタイルまたはスリックバックスタイル' }, nextQuestionId: 'q7_bag_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '자연스러운 웨이브나 반 묶음 스타일', en: 'Natural wave or half-up style', cn: '自然波浪或半扎风格', jp: '自然なウェーブまたはハーフアップスタイル' }, nextQuestionId: 'q7_bag_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q6_hair_svm: {
    id: 'q6_hair_svm',
    title: { ko: '당신은 어떤 헤어 스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '자연스러운 웨이브 혹은 포니테일', en: 'Natural wave or ponytail', cn: '自然波浪或马尾', jp: '自然なウェーブまたはポニーテール' }, nextQuestionId: 'q7_bag_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '긴 생머리 혹은 느슨하게 묶은 머리', en: 'Long straight hair or loosely tied hair', cn: '长直发或松散扎发', jp: '長いストレートヘアまたはゆるく結んだ髪' }, nextQuestionId: 'q7_bag_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q7_bag_cvb: {
    id: 'q7_bag_cvb',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?', cn: '您主要偏好哪种风格的包？', jp: '主にどのスタイルのバッグを好みますか？' },
    options: [
      { text: { ko: '스몰 사이즈의 토트백 혹은 탑핸들백', en: 'Small size tote bag or top handle bag', cn: '小号托特包或手提包', jp: 'スモールサイズのトートバッグまたはトップハンドルバッグ' }, nextQuestionId: 'q8_final_cvb', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '리본 포인트와 은은한 색감의 숄더백', en: 'Shoulder bag with ribbon point and subtle color', cn: '带有丝带细节和柔和色调的肩包', jp: 'リボンポイントと上品な色合いのショルダーバッグ' }, nextQuestionId: 'q8_final_cvb', scoreKeywords: ['balletcore'] },
    ],
  },
  q7_bag_cvl: {
    id: 'q7_bag_cvl',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?', cn: '您主要偏好哪种风格的包？', jp: '主にどのスタイルのバッグを好みますか？' },
    options: [
      { text: { ko: '스몰 사이즈의 토트백 혹은 탑핸들백', en: 'Small size tote bag or top handle bag', cn: '小号托特包或手提包', jp: 'スモールサイズのトートバッグまたはトップハンドルバッグ' }, nextQuestionId: 'q8_final_cvl', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '책이 들어가는 사이즈의 가죽 숄더백', en: 'Leather shoulder bag that fits books', cn: '能装下书籍大小的皮革肩包', jp: '本が入るサイズの革製ショルダーバッグ' }, nextQuestionId: 'q8_final_cvl', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q7_bag_cvd: {
    id: 'q7_bag_cvd',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?', cn: '您主要偏好哪种风格的包？', jp: '主にどのスタイルのバッグを好みますか？' },
    options: [
      { text: { ko: '스몰 사이즈의 토트백 혹은 탑핸들백', en: 'Small size tote bag or top handle bag', cn: '小号托特包或手提包', jp: 'スモールサイズのトートバッグまたはトップハンドルバッグ' }, nextQuestionId: 'q8_final_cvd', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '브라운, 블랙 컬러의 가죽 숄더백', en: 'Leather shoulder bag in brown and black color', cn: '棕色、黑色皮革肩包', jp: 'ブラウン、ブラックカラーの革製ショルダーバッグ' }, nextQuestionId: 'q8_final_cvd', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q7_bag_svm: {
    id: 'q7_bag_svm',
    title: { ko: '당신은 주로 어떤 스타일의 가방을 선호하나요?', en: 'What style of bag do you mainly prefer?', cn: '您主要偏好哪种风格的包？', jp: '主にどのスタイルのバッグを好みますか？' },
    options: [
      { text: { ko: '핑크, 화이트 컬러의 작은 숄더백', en: 'Small shoulder bag in pink and white color', cn: '粉色、白色小肩包', jp: 'ピンク、ホワイトカラーの小さなショルダーバッグ' }, nextQuestionId: 'q8_final_svm', scoreKeywords: ['softGirl'] },
      { text: { ko: '수공예 코튼 백 혹은 부드러운 에코백', en: 'Handmade cotton bag or soft eco bag', cn: '手工棉布包或柔软环保包', jp: '手作りのコットンバッグまたは柔らかいエコバッグ' }, nextQuestionId: 'q8_final_svm', scoreKeywords: ['moriGirl'] },
    ],
  },
  q8_final_cvb: {
    id: 'q8_final_cvb',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '차분하고 자기관리를 잘 하는 이미지', en: 'Calm image that takes good care of oneself', cn: '冷静且善于自我管理的形象', jp: '落ち着いていて自己管理ができるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '섬세하고 여리며 우아한 이미지', en: 'Delicate, tender and elegant image', cn: '细腻、温柔而优雅的形象', jp: '繊細で優しく上品なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['balletcore'] },
    ],
  },
  q8_final_cvl: {
    id: 'q8_final_cvl',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '차분하고 자기관리를 잘 하는 이미지', en: 'Calm image that takes good care of oneself', cn: '冷静且善于自我管理的形象', jp: '落ち着いていて自己管理ができるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '지적이면서 따뜻하고 교양 있는 이미지', en: 'Intellectual, warm and cultured image', cn: '知性、温暖且有教养的形象', jp: '知的で温かく教養のあるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['lightAcademia'] },
    ],
  },
  q8_final_cvd: {
    id: 'q8_final_cvd',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '차분하고 자기관리를 잘 하는 이미지', en: 'Calm image that takes good care of oneself', cn: '冷静且善于自我管理的形象', jp: '落ち着いていて自己管理ができるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanGirl'] },
      { text: { ko: '고요하고 깊이 있는 신비로운 이미지', en: 'Quiet, deep and mysterious image', cn: '安静、深邃而神秘的形象', jp: '静かで深みのある神秘的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['darkAcademia'] },
    ],
  },
  q8_final_svm: {
    id: 'q8_final_svm',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '다정하고 사랑스러운 이미지', en: 'Kind and lovely image', cn: '亲切可爱的形象', jp: '優しく愛らしいイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['softGirl'] },
      { text: { ko: '잔잔하고 자유로운 이미지', en: 'Calm and free image', cn: '平静而自由的形象', jp: '静かで自由なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['moriGirl'] },
    ],
  },
};

// 테토 그룹 질문 데이터
const femaleTetoQuestions: Record<string, Question> = {
  q2_vibe_teto: {
    id: 'q2_vibe_teto',
    title: { ko: '당신은 어떤 분위기의 존재감이 더 끌리나요?', en: 'What kind of presence atmosphere attracts you more?', cn: '哪种氛围的存在感更吸引您？', jp: 'どの雰囲気の存在感がより魅力的ですか？' },
    options: [
      { text: { ko: '대담하고 강렬한 에너지의 존재감', en: 'Bold and intense energy presence', cn: '大胆而强烈的能量存在感', jp: '大胆で強烈なエネルギーの存在感' }, nextQuestionId: 'q3_style_bold', scoreKeywords: ['mobWife', 'rockstar', 'bossBabe'] },
      { text: { ko: '몽환적이고 은은히 드러나는 존재감', en: 'Dreamy and subtly revealed presence', cn: '梦幻而微妙的存在感', jp: '幻想的で控えめに現れる存在感' }, nextQuestionId: 'q3_style_dreamy', scoreKeywords: ['acubi', 'vampire'] },
    ],
  },
  q3_style_bold: {
    id: 'q3_style_bold',
    title: { ko: '당신은 어떤 옷의 스타일이 더 마음에 드나요?', en: 'Which clothing style do you like more?', cn: '您更喜欢哪种服装风格？', jp: 'どの服のスタイルがよりお好みですか？' },
    options: [
      { text: { ko: '깔끔하고 카리스마 있는 오피스 룩', en: 'Neat and charismatic office look', cn: '整洁而有魅力的职场风格', jp: 'きれいでカリスマ性のあるオフィスルック' }, nextQuestionId: 'q4_makeup_neat', scoreKeywords: ['mobWife', 'bossBabe'] },
      { text: { ko: '가죽과 블랙 컬러 위주의 반항적인 룩', en: 'Rebellious look mainly with leather and black color', cn: '以皮革和黑色为主的叛逆风格', jp: 'レザーとブラックカラー中心の反逆的なルック' }, nextQuestionId: 'q4_makeup_rebel', scoreKeywords: ['rockstar'] },
    ],
  },
  q3_style_dreamy: {
    id: 'q3_style_dreamy',
    title: { ko: '당신은 어떤 옷의 스타일이 더 마음에 드나요?', en: 'Which clothing style do you like more?', cn: '您更喜欢哪种服装风格？', jp: 'どの服のスタイルがよりお好みですか？' },
    options: [
      { text: { ko: '미니멀하지만 디테일이 있는 빈티지 룩', en: 'Minimal but detailed vintage look', cn: '极简但细节丰富的复古风格', jp: 'ミニマルだがディテールのあるビンテージルック' }, nextQuestionId: 'q4_makeup_vintage', scoreKeywords: ['acubi'] },
      { text: { ko: '밤에 잘 어울리는 관능적인 고딕 룩', en: 'Sensual gothic look that suits the night', cn: '适合夜晚的性感哥特风格', jp: '夜によく似合う官能的なゴシックルック' }, nextQuestionId: 'q4_makeup_gothic', scoreKeywords: ['vampire'] },
    ],
  },
  q4_makeup_neat: {
    id: 'q4_makeup_neat',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?', cn: '哪种妆容让您感觉更有魅力？', jp: 'どのメイクがより魅力的に感じられますか？' },
    options: [
      { text: { ko: '카리스마 있는 아이라인과 또렷한 윤곽 메이크업', en: 'Charismatic eyeliner and clear contour makeup', cn: '有魅力的眼线和清晰的轮廓妆容', jp: 'カリスマ性のあるアイライナーとはっきりした輪郭メイク' }, nextQuestionId: 'q5_gaze_neat', scoreKeywords: ['bossBabe', 'mobWife'] },
      { text: { ko: '카리스마 있는 아이라인과 또렷한 윤곽 메이크업', en: 'Charismatic eyeliner and clear contour makeup', cn: '有魅力的眼线和清晰的轮廓妆容', jp: 'カリスマ性のあるアイライナーとはっきりした輪郭メイク' }, nextQuestionId: 'q5_gaze_neat', scoreKeywords: ['bossBabe', 'mobWife'] },
    ],
  },
  q4_makeup_rebel: {
    id: 'q4_makeup_rebel',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?', cn: '哪种妆容让您感觉更有魅力？', jp: 'どのメイクがより魅力的に感じられますか？' },
    options: [
      { text: { ko: '살짝 번진 아이라인과 메탈릭 포인트의 메이크업', en: 'Slightly smudged eyeliner and metallic point makeup', cn: '轻微晕染的眼线和金属感点缀妆容', jp: '少しにじんだアイライナーとメタリックポイントのメイク' }, nextQuestionId: 'q5_gaze_rebel', scoreKeywords: ['bossBabe', 'rockstar'] },
      { text: { ko: '살짝 번진 아이라인과 메탈릭 포인트의 메이크업', en: 'Slightly smudged eyeliner and metallic point makeup', cn: '轻微晕染的眼线和金属感点缀妆容', jp: '少しにじんだアイライナーとメタリックポイントのメイク' }, nextQuestionId: 'q5_gaze_rebel', scoreKeywords: ['bossBabe', 'rockstar'] },
    ],
  },
  q4_makeup_vintage: {
    id: 'q4_makeup_vintage',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?', cn: '哪种妆容让您感觉更有魅力？', jp: 'どのメイクがより魅力的に感じられますか？' },
    options: [
      { text: { ko: '뮤트한 색감의 차분하고 힙한 메이크업', en: 'Calm and hip makeup with mute colors', cn: '哑光色调的冷静时尚妆容', jp: 'ミュートな色合いの落ち着いたヒップなメイク' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['acubi'] },
      { text: { ko: '창백한 피부와 딥 레드의 신비롭고 치명적인 메이크업', en: 'Mysterious and fatal makeup with pale skin and deep red', cn: '苍白肌肤和深红色的神秘致命妆容', jp: '青白い肌とディープレッドの神秘的で致命的なメイク' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['vampire'] },
    ],
  },
  q4_makeup_gothic: {
    id: 'q4_makeup_gothic',
    title: { ko: '당신은 어떤 메이크업이 더 매력적으로 느껴지나요?', en: 'What makeup feels more attractive to you?', cn: '哪种妆容让您感觉更有魅力？', jp: 'どのメイクがより魅力的に感じられますか？' },
    options: [
      { text: { ko: '뮤트한 색감의 차분하고 힙한 메이크업', en: 'Calm and hip makeup with mute colors', cn: '哑光色调的冷静时尚妆容', jp: 'ミュートな色合いの落ち着いたヒップなメイク' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['acubi'] },
      { text: { ko: '창백한 피부와 딥 레드의 신비롭고 치명적인 메이크업', en: 'Mysterious and fatal makeup with pale skin and deep red', cn: '苍白肌肤和深红色的神秘致命妆容', jp: '青白い肌とディープレッドの神秘的で致命的なメイク' }, nextQuestionId: 'q5_gaze_dreamy', scoreKeywords: ['vampire'] },
    ],
  },
  q5_gaze_neat: {
    id: 'q5_gaze_neat',
    title: { ko: '당신이 보여주고픈 눈빛은 어떤 것과 더 가깝나요?', en: 'What kind of gaze do you want to show?', cn: '您想展现的眼神更接近哪种？', jp: 'あなたが見せたい目つきはどれに近いですか？' },
    options: [
      { text: { ko: '흔들림 없고 당당한 주도권의 눈빛', en: 'Unwavering and confident dominant gaze', cn: '坚定而自信的主导眼神', jp: '揺るぎなく堂々とした主導権の目つき' }, nextQuestionId: 'q6_color_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '강렬하고 도발적이라 피하기 어려운 눈빛', en: 'Intense and provocative gaze that is hard to avoid', cn: '强烈而挑衅、难以回避的眼神', jp: '強烈で挑発的で避けにくい目つき' }, nextQuestionId: 'q6_color_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q5_gaze_rebel: {
    id: 'q5_gaze_rebel',
    title: { ko: '당신이 보여주고픈 눈빛은 어떤 것과 더 가깝나요?', en: 'What kind of gaze do you want to show?', cn: '您想展现的眼神更接近哪种？', jp: 'あなたが見せたい目つきはどれに近いですか？' },
    options: [
      { text: { ko: '흔들림 없고 당당한 주도권의 눈빛', en: 'Unwavering and confident dominant gaze', cn: '坚定而自信的主导眼神', jp: '揺るぎなく堂々とした主導権の目つき' }, nextQuestionId: 'q6_color_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '규칙에 얽매이지 않는 에너지의 눈빛', en: 'Energetic gaze that is not bound by rules', cn: '不受规则束缚的充满能量的眼神', jp: '規則に縛られないエネルギーの目つき' }, nextQuestionId: 'q6_color_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q5_gaze_dreamy: {
    id: 'q5_gaze_dreamy',
    title: { ko: '당신이 보여주고픈 눈빛은 어떤 것과 더 가깝나요?', en: 'What kind of gaze do you want to show?', cn: '您想展现的眼神更接近哪种？', jp: 'あなたが見せたい目つきはどれに近いですか？' },
    options: [
      { text: { ko: '감정을 쉽게 읽히지 않는 쿨한 눈빛', en: 'Cool gaze that is not easily readable', cn: '难以读懂情感的冷酷眼神', jp: '感情を簡単に読まれないクールな目つき' }, nextQuestionId: 'q6_color_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '어둡고 깊어서 빠져드는 눈빛', en: 'Dark and deep gaze that draws you in', cn: '深邃黑暗、令人沉溺的眼神', jp: '暗く深くて引き込まれる目つき' }, nextQuestionId: 'q6_color_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q6_color_boss: {
    id: 'q6_color_boss',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white', cn: '黑色、白色等清晰有力的组合', jp: 'ブラック、ホワイトなどの明確で力強い組み合わせ' }, nextQuestionId: 'q7_emotion_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '레오파드와 골드, 버건디 등의 대담한 조합', en: 'Bold combinations like leopard, gold, and burgundy', cn: '豹纹、金色、酒红色等大胆组合', jp: 'レオパードとゴールド、バーガンディなどの大胆な組み合わせ' }, nextQuestionId: 'q7_emotion_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q6_color_mob: {
    id: 'q6_color_mob',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white', cn: '黑色、白色等清晰有力的组合', jp: 'ブラック、ホワイトなどの明確で力強い組み合わせ' }, nextQuestionId: 'q7_emotion_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '레오파드와 골드, 버건디 등의 대담한 조합', en: 'Bold combinations like leopard, gold, and burgundy', cn: '豹纹、金色、酒红色等大胆组合', jp: 'レオパードとゴールド、バーガンディなどの大胆な組み合わせ' }, nextQuestionId: 'q7_emotion_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q6_color_boss_rock: {
    id: 'q6_color_boss_rock',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white', cn: '黑色、白色等清晰有力的组合', jp: 'ブラック、ホワイトなどの明確で力強い組み合わせ' }, nextQuestionId: 'q7_emotion_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '블랙과 실버, 다크 레드처럼 대비가 강한 조합', en: 'High contrast combinations like black, silver, and dark red', cn: '黑色、银色、深红色等高对比度组合', jp: 'ブラックとシルバー、ダークレッドのようなコントラストが強い組み合わせ' }, nextQuestionId: 'q7_emotion_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q6_color_rock: {
    id: 'q6_color_rock',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '블랙, 화이트 등의 명확하고 힘 있는 조합', en: 'Clear and powerful combinations like black and white', cn: '黑色、白色等清晰有力的组合', jp: 'ブラック、ホワイトなどの明確で力強い組み合わせ' }, nextQuestionId: 'q7_emotion_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '블랙과 실버, 다크 레드처럼 대비가 강한 조합', en: 'High contrast combinations like black, silver, and dark red', cn: '黑色、银色、深红色等高对比度组合', jp: 'ブラックとシルバー、ダークレッドのようなコントラストが強い組み合わせ' }, nextQuestionId: 'q7_emotion_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q6_color_acubi: {
    id: 'q6_color_acubi',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '그레이, 차콜 등의 톤 다운된 미묘한 조합', en: 'Subtle combinations with toned down colors like gray and charcoal', cn: '灰色、炭色等低调微妙的组合', jp: 'グレー、チャコールなどのトーンダウンした微妙な組み合わせ' }, nextQuestionId: 'q7_emotion_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '블랙, 딥 레드, 와인 등의 관능적인 조합', en: 'Sensual combinations like black, deep red, and wine', cn: '黑色、深红色、酒红色等性感组合', jp: 'ブラック、ディープレッド、ワインなどの官能的な組み合わせ' }, nextQuestionId: 'q7_emotion_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q6_color_vampire: {
    id: 'q6_color_vampire',
    title: { ko: '당신은 어떤 컬러들의 조합을 더 선호하나요?', en: 'Which color combinations do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '그레이, 차콜 등의 톤 다운된 미묘한 조합', en: 'Subtle combinations with toned down colors like gray and charcoal', cn: '灰色、炭色等低调微妙的组合', jp: 'グレー、チャコールなどのトーンダウンした微妙な組み合わせ' }, nextQuestionId: 'q7_emotion_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '블랙, 딥 레드, 와인 등의 관능적인 조합', en: 'Sensual combinations like black, deep red, and wine', cn: '黑色、深红色、酒红色等性感组合', jp: 'ブラック、ディープレッド、ワインなどの官能的な組み合わせ' }, nextQuestionId: 'q7_emotion_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q7_emotion_boss: {
    id: 'q7_emotion_boss',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?', cn: '哪种情感氛围更吸引您？', jp: 'どの感情線の雰囲気がより魅力的ですか？' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions', cn: '不受情感左右、自信的情感线', jp: '感情に振り回されず自信のある感情線' }, nextQuestionId: 'q8_final_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '사랑과 분노, 욕망이 확실하고 극적인 감정선', en: 'Emotional line with clear and dramatic love, anger, and desire', cn: '爱、愤怒、欲望明确而戏剧性的情感线', jp: '愛と怒り、欲望が明確で劇的な感情線' }, nextQuestionId: 'q8_final_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q7_emotion_mob: {
    id: 'q7_emotion_mob',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?', cn: '哪种情感氛围更吸引您？', jp: 'どの感情線の雰囲気がより魅力的ですか？' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions', cn: '不受情感左右、自信的情感线', jp: '感情に振り回されず自信のある感情線' }, nextQuestionId: 'q8_final_boss', scoreKeywords: ['bossBabe'] },
      { text: { ko: '사랑과 분노, 욕망이 확실하고 극적인 감정선', en: 'Emotional line with clear and dramatic love, anger, and desire', cn: '爱、愤怒、欲望明确而戏剧性的情感线', jp: '愛と怒り、欲望が明確で劇的な感情線' }, nextQuestionId: 'q8_final_mob', scoreKeywords: ['mobWife'] },
    ],
  },
  q7_emotion_boss_rock: {
    id: 'q7_emotion_boss_rock',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?', cn: '哪种情感氛围更吸引您？', jp: 'どの感情線の雰囲気がより魅力的ですか？' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions', cn: '不受情感左右、自信的情感线', jp: '感情に振り回されず自信のある感情線' }, nextQuestionId: 'q8_final_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '불안정하지만 솔직해서 충동이 드러나는 감정선', en: 'Emotional line that is unstable but honest, revealing impulses', cn: '不稳定但诚实、显露冲动的情感线', jp: '不安定だが正直で衝動が現れる感情線' }, nextQuestionId: 'q8_final_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q7_emotion_rock: {
    id: 'q7_emotion_rock',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?', cn: '哪种情感氛围更吸引您？', jp: 'どの感情線の雰囲気がより魅力的ですか？' },
    options: [
      { text: { ko: '감정에 휘둘리지 않고 자신감 있는 감정선', en: 'Emotional line that is confident and not swayed by emotions', cn: '不受情感左右、自信的情感线', jp: '感情に振り回されず自信のある感情線' }, nextQuestionId: 'q8_final_boss_rock', scoreKeywords: ['bossBabe'] },
      { text: { ko: '불안정하지만 솔직해서 충동이 드러나는 감정선', en: 'Emotional line that is unstable but honest, revealing impulses', cn: '不稳定但诚实、显露冲动的情感线', jp: '不安定だが正直で衝動が現れる感情線' }, nextQuestionId: 'q8_final_rock', scoreKeywords: ['rockstar'] },
    ],
  },
  q7_emotion_acubi: {
    id: 'q7_emotion_acubi',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?', cn: '哪种情感氛围更吸引您？', jp: 'どの感情線の雰囲気がより魅力的ですか？' },
    options: [
      { text: { ko: '속을 쉽게 드러내지 않는 절제된 감정선', en: 'Restrained emotional line that does not easily reveal inner feelings', cn: '不轻易表露内心的克制情感线', jp: '内面を簡単に表さない抑制された感情線' }, nextQuestionId: 'q8_final_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '고독과 집착, 갈망이 얽힌 깊고 어두운 감정선', en: 'Deep and dark emotional line intertwined with loneliness, obsession, and longing', cn: '孤独、执念、渴望交织的深邃黑暗情感线', jp: '孤独と執着、渇望が絡み合った深く暗い感情線' }, nextQuestionId: 'q8_final_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q7_emotion_vampire: {
    id: 'q7_emotion_vampire',
    title: { ko: '당신은 어떤 감정선의 분위기가 더 끌리나요?', en: 'What kind of emotional atmosphere attracts you more?', cn: '哪种情感氛围更吸引您？', jp: 'どの感情線の雰囲気がより魅力的ですか？' },
    options: [
      { text: { ko: '속을 쉽게 드러내지 않는 절제된 감정선', en: 'Restrained emotional line that does not easily reveal inner feelings', cn: '不轻易表露内心的克制情感线', jp: '内面を簡単に表さない抑制された感情線' }, nextQuestionId: 'q8_final_acubi', scoreKeywords: ['acubi'] },
      { text: { ko: '고독과 집착, 갈망이 얽힌 깊고 어두운 감정선', en: 'Deep and dark emotional line intertwined with loneliness, obsession, and longing', cn: '孤独、执念、渴望交织的深邃黑暗情感线', jp: '孤独と執着、渇望が絡み合った深く暗い感情線' }, nextQuestionId: 'q8_final_vampire', scoreKeywords: ['vampire'] },
    ],
  },
  q8_final_boss: {
    id: 'q8_final_boss',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership', cn: '自信明确且主导的形象', jp: '自己確信が明確で主導的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '쉽게 잊혀지지 않는 관능적인 이미지', en: 'Sensual image that is not easily forgotten', cn: '令人难忘的性感形象', jp: '簡単に忘れられない官能的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['mobWife'] },
    ],
  },
  q8_final_mob: {
    id: 'q8_final_mob',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership', cn: '自信明确且主导的形象', jp: '自己確信が明確で主導的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '쉽게 잊혀지지 않는 관능적인 이미지', en: 'Sensual image that is not easily forgotten', cn: '令人难忘的性感形象', jp: '簡単に忘れられない官能的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['mobWife'] },
    ],
  },
  q8_final_boss_rock: {
    id: 'q8_final_boss_rock',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership', cn: '自信明确且主导的形象', jp: '自己確信が明確で主導的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '틀에 얽매이지 않는 자유로운 이미지', en: 'Free image that is not bound by frames', cn: '不受框架束缚的自由形象', jp: '枠に縛られない自由なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['rockstar'] },
    ],
  },
  q8_final_rock: {
    id: 'q8_final_rock',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '자기 확신이 분명하고 주도적인 이미지', en: 'Image with clear self-confidence and leadership', cn: '自信明确且主导的形象', jp: '自己確信が明確で主導的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['bossBabe'] },
      { text: { ko: '틀에 얽매이지 않는 자유로운 이미지', en: 'Free image that is not bound by frames', cn: '不受框架束缚的自由形象', jp: '枠に縛られない自由なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['rockstar'] },
    ],
  },
  q8_final_acubi: {
    id: 'q8_final_acubi',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '조용하지만 힙하고 쿨한 이미지', en: 'Quiet but hip and cool image', cn: '安静但时尚酷炫的形象', jp: '静かだがヒップでクールなイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['acubi'] },
      { text: { ko: '신비롭고 어두우며 궁금해지는 이미지', en: 'Mysterious, dark, and intriguing image', cn: '神秘、黑暗且引人好奇的形象', jp: '神秘的で暗く、興味をそそるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['vampire'] },
    ],
  },
  q8_final_vampire: {
    id: 'q8_final_vampire',
    title: { ko: '마지막으로, 당신이 현재 보여주고 싶은 이미지를 골라주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '조용하지만 힙하고 쿨한 이미지', en: 'Quiet but hip and cool image', cn: '安静但时尚酷炫的形象', jp: '静かだがヒップでクールなイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['acubi'] },
      { text: { ko: '신비롭고 어두우며 궁금해지는 이미지', en: 'Mysterious, dark, and intriguing image', cn: '神秘、黑暗且引人好奇的形象', jp: '神秘的で暗く、興味をそそるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['vampire'] },
    ],
  },
};

// 남성 질문 데이터 (Linked List 방식)
const maleQuestions: Record<string, Question> = {
  m_q1_start: {
    id: 'm_q1_start',
    title: { ko: '당신은 어떤 인상을 주고 싶은가요?', en: 'What kind of impression do you want to give?', cn: '您想给人什么样的印象？', jp: 'あなたはどのような印象を与えたいですか？' },
    options: [
      { text: { ko: '부드럽고 편안한 인상', en: 'Soft and comfortable impression', cn: '柔和舒适的印象', jp: '柔らかく心地よい印象' }, nextQuestionId: 'm_q2_style_nonteto', scoreKeywords: ['cleanBoy', 'softBoy', 'darkAcademiaBoy', 'naturalBoy'] },
      { text: { ko: '카리스마 있는 강렬한 인상', en: 'Charismatic and intense impression', cn: '有魅力且强烈的印象', jp: 'カリスマ性のある強烈な印象' }, nextQuestionId: 'm_q2_style_teto', scoreKeywords: ['streetBoy', 'rockBoy', 'gentleBoy', 'techBoy'] },
    ],
  },
  m_q2_style_teto: {
    id: 'm_q2_style_teto',
    title: { ko: '당신이 더 편안하게 느끼는 스타일은 무엇인가요?', en: 'Which style do you feel more comfortable with?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '자유롭고 개성적인 스타일', en: 'Free and individualistic style', cn: '自由且个性的风格', jp: '自由で個性的なスタイル' }, nextQuestionId: 'm_q3_imp_teto', scoreKeywords: ['streetBoy', 'rockBoy'] },
      { text: { ko: '정돈된 느낌의 깔끔한 스타일', en: 'Neat and organized style', cn: '整洁有序的风格', jp: '整頓された感じのきれいなスタイル' }, nextQuestionId: 'm_q3_imp_teto', scoreKeywords: ['gentleBoy', 'techBoy'] },
    ],
  },
  m_q3_imp_teto: {
    id: 'm_q3_imp_teto',
    title: { ko: '당신은 스타일링을 통해 어떤 인상을 주고싶나요?', en: 'What impression do you want to give through styling?', cn: '您想通过造型给人什么样的印象？', jp: 'スタイリングを通じてどのような印象を与えたいですか？' },
    options: [
      { text: { ko: '규칙에 얽매이지 않는 자유로운 인상', en: 'Free impression that is not bound by rules', cn: '不受规则束缚的自由印象', jp: '規則に縛られない自由な印象' }, nextQuestionId: 'm_q4_color_wild', scoreKeywords: ['streetBoy', 'rockBoy'] },
      { text: { ko: '세련되고 정돈되어 신뢰감 있는 인상', en: 'Sophisticated and organized impression that gives trust', cn: '精致有序、值得信赖的印象', jp: '洗練され整頓されて信頼感のある印象' }, nextQuestionId: 'm_q4_color_neat', scoreKeywords: ['gentleBoy', 'techBoy'] },
    ],
  },
  m_q4_color_wild: {
    id: 'm_q4_color_wild',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '네온, 레드, 그래픽 컬러 포인트가 대비되는 조합', en: 'Combination with contrasting neon, red, and graphic color points', cn: '霓虹色、红色、图形色点形成对比的组合', jp: 'ネオン、レッド、グラフィックカラーポイントが対比される組み合わせ' }, nextQuestionId: 'm_q5_hair_wild', scoreKeywords: ['streetBoy'] },
      { text: { ko: '워싱 포인트의 거칠고 어두운 무드의 조합', en: 'Combination with rough and dark mood of washing points', cn: '水洗点粗糙黑暗氛围的组合', jp: 'ウォッシングポイントの荒く暗いムードの組み合わせ' }, nextQuestionId: 'm_q5_hair_wild', scoreKeywords: ['rockBoy'] },
    ],
  },
  m_q4_color_neat: {
    id: 'm_q4_color_neat',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '네이비, 그레이처럼 클래식한 조합', en: 'Classic combination like navy and gray', cn: '海军蓝、灰色等经典组合', jp: 'ネイビー、グレーのようなクラシックな組み合わせ' }, nextQuestionId: 'm_q5_hair_neat', scoreKeywords: ['gentleBoy'] },
      { text: { ko: '차콜, 실버 등의 미래적인 조합', en: 'Futuristic combination like charcoal and silver', cn: '炭色、银色等未来感组合', jp: 'チャコール、シルバーなどの未来的な組み合わせ' }, nextQuestionId: 'm_q5_hair_neat', scoreKeywords: ['techBoy'] },
    ],
  },
  m_q5_hair_wild: {
    id: 'm_q5_hair_wild',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '자연스럽게 흐트러진 스트릿 감성의 헤어', en: 'Naturally disheveled street-style hair', cn: '自然凌乱的街头风格发型', jp: '自然に乱れたストリート感覚のヘア' }, nextQuestionId: 'm_q6_final_wild', scoreKeywords: ['streetBoy'] },
      { text: { ko: '장발이나 울프컷처럼 개성이 강한 헤어', en: 'Hair with strong personality like long hair or wolf cut', cn: '长发或狼剪等个性强烈的发型', jp: '長髪やウルフカットのような個性が強いヘア' }, nextQuestionId: 'm_q6_final_wild', scoreKeywords: ['rockBoy'] },
    ],
  },
  m_q5_hair_neat: {
    id: 'm_q5_hair_neat',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '오피스에 잘 어울리는 가르마', en: 'Parted hair that suits the office', cn: '适合职场的分头', jp: 'オフィスによく似合う分け目' }, nextQuestionId: 'm_q6_final_neat', scoreKeywords: ['gentleBoy'] },
      { text: { ko: '미니멀하고 깔끔한 쇼트 컷', en: 'Minimal and neat short cut', cn: '极简整洁的短发', jp: 'ミニマルできれいなショートカット' }, nextQuestionId: 'm_q6_final_neat', scoreKeywords: ['techBoy'] },
    ],
  },
  m_q6_final_wild: {
    id: 'm_q6_final_wild',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '자유롭고 트렌디해서 시선이 가는 이미지', en: 'Free and trendy image that draws attention', cn: '自由时尚、吸引眼球的形象', jp: '自由でトレンディで視線が行くイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['streetBoy'] },
      { text: { ko: '거칠고 대담한 반항적인 이미지', en: 'Rough and bold rebellious image', cn: '粗犷大胆的反叛形象', jp: '荒々しく大胆な反逆的なイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['rockBoy'] },
    ],
  },
  m_q6_final_neat: {
    id: 'm_q6_final_neat',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '차분하고 단정해서 신뢰감 있는 이미지', en: 'Calm and neat image that gives trust', cn: '冷静整洁、值得信赖的形象', jp: '落ち着いていてきちんとしていて信頼感のあるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['gentleBoy'] },
      { text: { ko: '효율적이고 스마트한 감각의 이미지', en: 'Efficient and smart image', cn: '高效且智能的形象', jp: '効率的でスマートな感覚のイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['techBoy'] },
    ],
  },
  m_q2_style_nonteto: {
    id: 'm_q2_style_nonteto',
    title: { ko: '당신이 더 편안하게 느끼는 스타일은 무엇인가요?', en: 'Which style do you feel more comfortable with?', cn: '哪种风格让您感觉更舒适？', jp: 'どのスタイルにより快適さを感じますか？' },
    options: [
      { text: { ko: '차분하고 단정한 룩', en: 'Calm and neat look', cn: '冷静整洁的造型', jp: '落ち着いていてきちんとしたルック' }, nextQuestionId: 'm_q3_imp_nonteto', scoreKeywords: ['cleanBoy', 'darkAcademiaBoy'] },
      { text: { ko: '편안하고 자연스러운 룩', en: 'Comfortable and natural look', cn: '舒适自然的造型', jp: '心地よく自然なルック' }, nextQuestionId: 'm_q3_imp_nonteto', scoreKeywords: ['softBoy', 'naturalBoy'] },
    ],
  },
  m_q3_imp_nonteto: {
    id: 'm_q3_imp_nonteto',
    title: { ko: '당신은 스타일링을 통해 어떤 인상을 주고싶나요?', en: 'What impression do you want to give through styling?', cn: '您想通过造型给人什么样的印象？', jp: 'スタイリングを通じてどのような印象を与えたいですか？' },
    options: [
      { text: { ko: '지적이고 신뢰감 있는 인상', en: 'Intellectual and trustworthy impression', cn: '知性且值得信赖的印象', jp: '知的で信頼感のある印象' }, nextQuestionId: 'm_q4_color_smart', scoreKeywords: ['cleanBoy', 'darkAcademiaBoy'] },
      { text: { ko: '친근하고 편안한 인상', en: 'Friendly and comfortable impression', cn: '友好舒适的印象', jp: '親しみやすく心地よい印象' }, nextQuestionId: 'm_q4_color_soft', scoreKeywords: ['softBoy', 'naturalBoy'] },
    ],
  },
  m_q4_color_smart: {
    id: 'm_q4_color_smart',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '화이트, 블랙 등의 명확한 뉴트럴 조합', en: 'Clear neutral combination like white and black', cn: '白色、黑色等清晰的中性组合', jp: 'ホワイト、ブラックなどの明確なニュートラルな組み合わせ' }, nextQuestionId: 'm_q5_hair_smart', scoreKeywords: ['cleanBoy'] },
      { text: { ko: '브라운, 딥 그린 등의 어스 톤 조합', en: 'Earth tone combination like brown and deep green', cn: '棕色、深绿色等大地色调组合', jp: 'ブラウン、ディープグリーンなどのアーストーンの組み合わせ' }, nextQuestionId: 'm_q5_hair_smart', scoreKeywords: ['darkAcademiaBoy'] },
    ],
  },
  m_q4_color_soft: {
    id: 'm_q4_color_soft',
    title: { ko: '당신이 어떤 컬러 조합을 더 선호하나요?', en: 'Which color combination do you prefer more?', cn: '您更偏好哪种颜色组合？', jp: 'どの色の組み合わせをより好みますか？' },
    options: [
      { text: { ko: '파스텔 톤의 부드럽고 따뜻한 조합', en: 'Soft and warm combination of pastel tones', cn: '粉色调柔和温暖的组合', jp: 'パステルトーンの柔らかく温かい組み合わせ' }, nextQuestionId: 'm_q5_hair_soft', scoreKeywords: ['softBoy'] },
      { text: { ko: '베이지, 카키 등의 내츄럴한 조합', en: 'Natural combination like beige and khaki', cn: '米色、卡其色等自然组合', jp: 'ベージュ、カーキなどのナチュラルな組み合わせ' }, nextQuestionId: 'm_q5_hair_soft', scoreKeywords: ['naturalBoy'] },
    ],
  },
  m_q5_hair_smart: {
    id: 'm_q5_hair_smart',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '짧은 커트나 가르마 등의 손질이 잘 된 스타일', en: 'Well-groomed style like short cut or parted hair', cn: '短发或分头等打理良好的风格', jp: '短いカットや分け目などの手入れがよくされたスタイル' }, nextQuestionId: 'm_q6_final_smart', scoreKeywords: ['cleanBoy'] },
      { text: { ko: '자연스럽게 흐르는 중장발이나 클래식한 가르마', en: 'Naturally flowing medium-long hair or classic parted hair', cn: '自然流动的中长发或经典分头', jp: '自然に流れる中長髪やクラシックな分け目' }, nextQuestionId: 'm_q6_final_smart', scoreKeywords: ['darkAcademiaBoy'] },
    ],
  },
  m_q5_hair_soft: {
    id: 'm_q5_hair_soft',
    title: { ko: '당신은 어떤 헤어스타일을 더 선호하나요?', en: 'Which hairstyle do you prefer more?', cn: '您更偏好哪种发型？', jp: 'どのヘアスタイルをより好みますか？' },
    options: [
      { text: { ko: '부드러운 웨이브나 가르마의 온화한 스타일', en: 'Gentle style with soft waves or parted hair', cn: '柔和波浪或分头的温和风格', jp: '柔らかいウェーブや分け目の穏やかなスタイル' }, nextQuestionId: 'm_q6_final_soft', scoreKeywords: ['softBoy'] },
      { text: { ko: '최소한의 손질로 자연스러운 질감의 스타일', en: 'Style with natural texture with minimal grooming', cn: '最少打理的自然质感风格', jp: '最小限の手入れで自然な質感のスタイル' }, nextQuestionId: 'm_q6_final_soft', scoreKeywords: ['naturalBoy'] },
    ],
  },
  m_q6_final_smart: {
    id: 'm_q6_final_smart',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '신뢰감 있고, 누구에게나 호감인 이미지', en: 'Trustworthy and likable image to everyone', cn: '值得信赖、对任何人都友好的形象', jp: '信頼感があり、誰にでも好感を持たれるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['cleanBoy'] },
      { text: { ko: '지적이고 차분하며, 깊은 생각이 느껴지는 이미지', en: 'Intellectual, calm image that shows deep thinking', cn: '知性冷静、体现深度思考的形象', jp: '知的で落ち着いており、深い思考が感じられるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['darkAcademiaBoy'] },
    ],
  },
  m_q6_final_soft: {
    id: 'm_q6_final_soft',
    title: { ko: '마지막으로, 현재 당신이 보여주고픈 이미지를 선택해주세요!', en: 'Finally, choose the image you want to show now!', cn: '最后，请选择您现在想展现的形象！', jp: '最後に、あなたが現在見せたいイメージを選んでください！' },
    options: [
      { text: { ko: '부드럽고 따뜻해서 함께하면 편안해지는 이미지', en: 'Soft and warm image that makes you feel comfortable together', cn: '柔和温暖、在一起会感到舒适的形象', jp: '柔らかく温かく、一緒にいると心地よくなるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['softBoy'] },
      { text: { ko: '꾸미지 않아도 매력이 전해지는 이미지', en: 'Image that conveys charm without decoration', cn: '不刻意打扮也充满魅力的形象', jp: '飾らなくても魅力が伝わるイメージ' }, nextQuestionId: 'result_calculation', scoreKeywords: ['naturalBoy'] },
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
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
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
  const handleAnswerLinked = (option: QuestionOption, index: number) => {
    // 선택된 옵션 인덱스 설정 (시각적 피드백용)
    setSelectedOptionIndex(index);
    
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
      // 다음 질문으로 넘어가기 전에 선택 상태 초기화
      setTimeout(() => {
        setSelectedOptionIndex(null);
        setCurrentQuestionId(option.nextQuestionId);
        setStep(prev => prev + 1);
      }, 300); // 짧은 딜레이로 선택 효과를 보여줌
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
      // 선택 상태 초기화
      setSelectedOptionIndex(null);
    }
  }, [step, gender]);

  // 질문이 변경될 때마다 선택 상태 초기화
  useEffect(() => {
    if (step >= 2) {
      setSelectedOptionIndex(null);
    }
  }, [currentQuestionId, step]);

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
                      {(['female', 'male'] as const).map((g, idx) => (
                        <label 
                          key={g}
                          className={`glass-button inline-flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer text-white transition-all duration-200 ${
                            gender === g ? 'selected-gender' : ''
                          }`}
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
                  {currentQuestion.title[lang] || currentQuestion.title['en']}
                </h3>
                <div key={currentQuestionId} className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerLinked(option as QuestionOption, idx)}
                      className={`glass-button w-full text-left p-4 rounded-xl hover:bg-white/20 active:scale-[0.99] transition-all duration-200 ${
                        selectedOptionIndex === idx ? 'selected-option' : ''
                      }`}
                    >
                      <span className="text-sm sm:text-base text-white font-normal">
                        {option.text[lang] || option.text['en']}
                      </span>
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
