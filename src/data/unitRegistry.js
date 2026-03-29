import alphabetUpper from './english/alphabet-upper.json';
import alphabetLower from './english/alphabet-lower.json';
import phonicsA from './english/phonics-a.json';
import phonicsB from './english/phonics-b.json';
import phonicsC from './english/phonics-c.json';
import wordsAnimals from './english/words-animals.json';
import wordsColors from './english/words-colors.json';
import clockReadingAdvanced from './math/clock-reading-advanced.json';
import clockReading from './math/clock-reading.json';
import lengthUnits from './math/length-units.json';
import multiplication2 from './math/multiplication-2.json';
import multiplication3 from './math/multiplication-3.json';
import multiplication4 from './math/multiplication-4.json';
import weightUnits from './math/weight-units.json';

export const MATH_UNITS = {
  'g1-m-1-1': { id: 'g1-m-1-1', title: '9까지의 수', subject: 'math', available: true },
  'g1-m-1-3': { id: 'g1-m-1-3', title: '덧셈과 뺄셈', subject: 'math', available: true },
  'g2-m-2-2': { id: 'g2-m-2-2', title: '구구단', subject: 'math', available: true },
  'g2-m-2-4': { id: 'g2-m-2-4', title: '시각과 시간', subject: 'math', available: true },
  'g3-m-1-3': { id: 'g3-m-1-3', title: '나눗셈', subject: 'math', available: true },
  'g4-m-1-1': { id: 'g4-m-1-1', title: '큰 수', subject: 'math', available: true },
  'g5-m-1-2': { id: 'g5-m-1-2', title: '약수와 배수', subject: 'math', available: true },
  'g6-m-1-1': { id: 'g6-m-1-1', title: '분수의 나눗셈', subject: 'math', available: true },
  // 기존 레거시 ID (호환성 유지)
  'multiplication-2': { id: 'multiplication-2', title: '2단 구구단', subject: 'math', available: true },
  'clock-reading': { id: 'clock-reading', title: '시계 읽기', subject: 'math', available: true },
};

export const ENGLISH_UNITS = {
  'alphabet-upper': {
    id: 'alphabet-upper',
    title: '알파벳 대문자',
    description: '알파벳 대문자 기초를 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: alphabetUpper,
  },
  'alphabet-lower': {
    id: 'alphabet-lower',
    title: '알파벳 소문자',
    description: '알파벳 소문자 기초를 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: alphabetLower,
  },
  'words-colors': {
    id: 'words-colors',
    title: '색깔 단어',
    description: '색깔 기초 단어를 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: wordsColors,
  },
  'words-animals': {
    id: 'words-animals',
    title: '동물 단어',
    description: '동물 기초 단어를 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: wordsAnimals,
  },
  'phonics-a': {
    id: 'phonics-a',
    title: '파닉스 A',
    description: 'A/a 첫소리와 연결되는 낱말을 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: phonicsA,
  },
  'phonics-b': {
    id: 'phonics-b',
    title: '파닉스 B',
    description: 'B/b 첫소리와 연결되는 낱말을 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: phonicsB,
  },
  'phonics-c': {
    id: 'phonics-c',
    title: '파닉스 C',
    description: 'C/c 첫소리와 연결되는 낱말을 익히는 10문제 랜덤 퀴즈입니다.',
    subject: 'english',
    available: true,
    data: phonicsC,
  },
};
