import { shuffleArray } from './shuffle.js';

/**
 * 학습 이력과 기존 데이터를 기반으로 새로운 퀴즈 단원을 동적으로 생성합니다.
 */

// 수학: 특정 구구단들의 혼합 문제 생성
export function generateMathMixedUnit(danList, count = 10, wrongAnswers = []) {
  const allPossible = [];
  
  // 틀린 문제의 정보를 정리 (단-곱수 조합)
  const wrongMap = new Set(
    wrongAnswers
      .filter(w => w.subject === 'math')
      .map(w => {
        // "3 × 5 = ?" 형태의 질문에서 숫자 추출
        const match = w.question.match(/(\d+)\s*×\s*(\d+)/);
        return match ? `${match[1]}-${match[2]}` : null;
      })
      .filter(Boolean)
  );

  danList.forEach(dan => {
    for (let i = 1; i <= 9; i++) {
      let weight = 1;
      // 1. 틀렸던 문제면 가중치 대폭 부여 (5배)
      if (wrongMap.has(`${dan}-${i}`)) weight += 5;
      
      // 2. 어려운 숫자 (6, 7, 8, 9단)인 경우 가중치 부여 (2배)
      if (i >= 6 || dan >= 6) weight += 2;

      // 가중치만큼 리스트에 추가 (간단한 확률 구현)
      for (let w = 0; w < weight; w++) {
        allPossible.push({ dan, multiplier: i });
      }
    }
  });

  // 무작위로 추출하여 문제 객체 생성
  const selection = shuffleArray(allPossible).slice(0, count);
  
  return selection.map((item, index) => {
    const { dan, multiplier } = item;
    const answer = dan * multiplier;
    
    // 오답 후보 생성 (정답 근처의 숫자들)
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5; // -5 ~ +4
      const wrong = Math.max(1, answer + offset);
      choices.add(wrong);
    }

    return {
      id: `gen-math-${dan}-${multiplier}-${index}`,
      type: 'multiple-choice',
      question: `${dan} × ${multiplier} = ?`,
      choices: Array.from(choices),
      answer: answer,
      hints: [
        `${dan}을 ${multiplier}번 더해볼까요?`,
        `${dan}단 노래를 떠올려보세요!`
      ]
    };
  });
}

// 영어: 기존 단어 유닛들의 혼합 문제 생성
export function generateEnglishMixedUnit(sourceUnits, count = 10) {
  const allQuestions = sourceUnits.flatMap(unit => unit.data.questions || []);
  if (allQuestions.length === 0) return [];

  return shuffleArray(allQuestions).slice(0, count).map((q, index) => ({
    ...q,
    id: `gen-eng-mixed-${index}`
  }));
}

/**
 * 다음으로 도전할 만한 '생성형 단원'을 제안합니다.
 */
export function suggestNextDynamicUnit(progress, mathUnits, englishUnits, wrongAnswers = []) {
  const suggestions = [];

  // 수학: 완료된 구구단들을 섞은 도전 모드 제안
  const completedMathDan = Object.keys(mathUnits)
    .filter(id => id.startsWith('multiplication-') && progress.math?.units?.[id]?.stars === 3)
    .map(id => parseInt(id.split('-')[1], 10));

  if (completedMathDan.length >= 2) {
    suggestions.push({
      id: `math-mixed-${completedMathDan.join('-')}`,
      title: '구구단 믹스 도전!',
      description: `${completedMathDan.join(', ')}단을 섞은 특별 퀴즈예요. 틀렸던 문제와 어려운 숫자가 더 많이 나옵니다!`,
      subject: 'math',
      type: 'generated',
      config: { type: 'math-mixed', danList: completedMathDan, wrongAnswers },
      available: true
    });
  }

  // 영어: 완료된 단어 그룹들을 섞은 도전 모드 제안
  const completedEnglishUnits = Object.keys(englishUnits)
    .filter(id => progress.english?.units?.[id]?.stars === 3)
    .map(id => englishUnits[id]);

  if (completedEnglishUnits.length >= 2) {
    suggestions.push({
      id: 'english-mixed-challenge',
      title: '단어 믹스 챌린지',
      description: '지금까지 배운 단어들을 한꺼번에 복습해봐요!',
      subject: 'english',
      type: 'generated',
      config: { type: 'english-mixed', sourceUnits: completedEnglishUnits },
      available: true
    });
  }

  return suggestions;
}
