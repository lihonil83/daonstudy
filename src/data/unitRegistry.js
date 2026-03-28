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
import { buildArithmeticQuestionBank } from '../models/arithmeticModel.js';

export const MATH_UNITS = {
  'multiplication-2': {
    id: 'multiplication-2',
    title: '2단 구구단',
    description: '2단을 주제로 한 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: multiplication2,
  },
  'multiplication-3': {
    id: 'multiplication-3',
    title: '3단 구구단',
    description: '3단을 주제로 한 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: multiplication3,
  },
  'multiplication-4': {
    id: 'multiplication-4',
    title: '4단 구구단',
    description: '4단을 주제로 한 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: multiplication4,
  },
  'clock-reading': {
    id: 'clock-reading',
    title: '시계 읽기',
    description: '시계 그림을 보고 몇 시인지 고르는 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: clockReading,
  },
  'clock-reading-advanced': {
    id: 'clock-reading-advanced',
    title: '시계 읽기 심화',
    description: '15분과 45분 시각을 읽는 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: clockReadingAdvanced,
  },
  'length-units': {
    id: 'length-units',
    title: '길이 단위',
    description: 'm와 cm를 바꾸어 생각하는 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: lengthUnits,
  },
  'weight-units': {
    id: 'weight-units',
    title: '무게 단위',
    description: 'kg와 g를 바꾸어 생각하는 10문제 랜덤 퀴즈입니다.',
    subject: 'math',
    available: true,
    data: weightUnits,
  },
  'addition-up-to-20': {
    id: 'addition-up-to-20',
    title: '덧셈 20까지',
    description: '20 안에서 덧셈 문제를 자동으로 만드는 10문제 생성형 퀴즈입니다.',
    subject: 'math',
    available: true,
    questionCount: 10,
    data: {
      generateQuestions: () =>
        buildArithmeticQuestionBank({
          operation: 'addition',
          minLeft: 1,
          maxLeft: 10,
          minRight: 1,
          maxRight: 10,
          minAnswer: 2,
          maxAnswer: 20,
        }),
    },
  },
  'subtraction-up-to-20': {
    id: 'subtraction-up-to-20',
    title: '뺄셈 20까지',
    description: '20 안에서 뺄셈 문제를 자동으로 만드는 10문제 생성형 퀴즈입니다.',
    subject: 'math',
    available: true,
    questionCount: 10,
    data: {
      generateQuestions: () =>
        buildArithmeticQuestionBank({
          operation: 'subtraction',
          minLeft: 2,
          maxLeft: 20,
          minRight: 1,
          maxRight: 10,
          minAnswer: 0,
          maxAnswer: 20,
        }),
    },
  },
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
