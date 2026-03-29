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

const MATH_CHALLENGE_QUESTION_COUNT = 120;

export const MATH_CHALLENGE_UNITS = [
  {
    id: 'multiplication-2',
    title: multiplication2.title,
    description: '2단 구구단을 120문제로 충분히 연습해요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: multiplication2,
  },
  {
    id: 'multiplication-3',
    title: multiplication3.title,
    description: '3단 구구단을 120문제로 반복 연습해요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: multiplication3,
  },
  {
    id: 'multiplication-4',
    title: multiplication4.title,
    description: '4단 구구단까지 120문제로 넓혀서 도전해요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: multiplication4,
  },
  {
    id: 'length-units',
    title: lengthUnits.title,
    description: '길이 단위를 120문제로 충분히 익혀요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: lengthUnits,
  },
  {
    id: 'weight-units',
    title: weightUnits.title,
    description: '무게 단위를 120문제로 반복 연습해요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: weightUnits,
  },
  {
    id: 'clock-reading',
    title: clockReading.title,
    description: '시계 읽기를 120문제로 길게 연습해요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: clockReading,
  },
  {
    id: 'clock-reading-advanced',
    title: clockReadingAdvanced.title,
    description: '확장 시계 읽기를 120문제로 탄탄히 익혀요.',
    subject: 'math',
    available: true,
    questionCount: MATH_CHALLENGE_QUESTION_COUNT,
    data: clockReadingAdvanced,
  },
];

export const ENGLISH_CHALLENGE_UNITS = [
  {
    id: 'alphabet-upper',
    title: alphabetUpper.title,
    description: '알파벳 대문자를 10문제 퀴즈로 익혀요.',
    subject: 'english',
    available: true,
    data: alphabetUpper,
  },
  {
    id: 'alphabet-lower',
    title: alphabetLower.title,
    description: '알파벳 소문자를 10문제 퀴즈로 익혀요.',
    subject: 'english',
    available: true,
    data: alphabetLower,
  },
  {
    id: 'phonics-a',
    title: phonicsA.title,
    description: 'A/a 첫소리를 낱말과 연결해보는 퀴즈예요.',
    subject: 'english',
    available: true,
    data: phonicsA,
  },
  {
    id: 'phonics-b',
    title: phonicsB.title,
    description: 'B/b 첫소리를 낱말과 연결해보는 퀴즈예요.',
    subject: 'english',
    available: true,
    data: phonicsB,
  },
  {
    id: 'phonics-c',
    title: phonicsC.title,
    description: 'C/c 첫소리를 낱말과 연결해보는 퀴즈예요.',
    subject: 'english',
    available: true,
    data: phonicsC,
  },
  {
    id: 'words-colors',
    title: wordsColors.title,
    description: '색깔 단어를 듣고 고르는 영어 퀴즈예요.',
    subject: 'english',
    available: true,
    data: wordsColors,
  },
  {
    id: 'words-animals',
    title: wordsAnimals.title,
    description: '동물 단어를 듣고 고르는 영어 퀴즈예요.',
    subject: 'english',
    available: true,
    data: wordsAnimals,
  },
];

export const MATH_UNITS = Object.fromEntries(
  MATH_CHALLENGE_UNITS.map((unit) => [unit.id, unit]),
);

export const ENGLISH_UNITS = Object.fromEntries(
  ENGLISH_CHALLENGE_UNITS.map((unit) => [unit.id, unit]),
);
