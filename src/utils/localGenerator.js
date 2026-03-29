/**
 * Math & English Generator Utility
 * 
 * 특정 단원(unitId)에 대해 자바스크립트 로직으로 퀴즈를 생성합니다.
 */

// ───── 헬퍼 함수 ─────
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGCD(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { a %= b; [a, b] = [b, a]; }
  return a;
}

function simplifyFraction(num, den) {
  const gcd = getGCD(num, den);
  return [num / gcd, den / gcd];
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateChoices(correctAnswer, range = 10) {
  const choices = new Set([correctAnswer]);
  while (choices.size < 4) {
    if (typeof correctAnswer === 'number') {
      const offset = getRandomInt(-range, range);
      if (offset !== 0) choices.add(correctAnswer + offset);
    } else {
      choices.add(`Choice ${choices.size}`);
    }
  }
  return shuffle(Array.from(choices));
}

// ───── 데이터 사전 ─────
const phonicsDict = {
  a: ['apple 🍎', 'ant 🐜', 'alligator 🐊', 'axe 🪓'],
  b: ['bear 🐻', 'ball ⚽', 'bag 🎒', 'banana 🍌'],
  c: ['cat 🐱', 'car 🚗', 'cup 🥤', 'candy 🍭']
};
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'.split('');

// ───── 제너레이터 맵 ─────
const generators = {
  // --- 영어 (ID 동기화) ---
  'g1-en-alpha-u': () => {
    const idx = getRandomInt(0, 25);
    const char = alphabet[idx];
    const ans = alphabetLower[idx];
    const others = shuffle(alphabetLower.filter(c => c !== ans)).slice(0, 3);
    return {
      question: `Pick the lowercase letter for "${char}".`,
      choices: shuffle([ans, ...others]),
      answer: ans,
      explanation: `${char}의 소문자는 ${ans}입니다.`
    };
  },
  'g1-en-alpha-l': () => {
    const idx = getRandomInt(0, 25);
    const char = alphabetLower[idx];
    const ans = alphabet[idx];
    const others = shuffle(alphabet.filter(c => c !== ans)).slice(0, 3);
    return {
      question: `Pick the uppercase letter for "${char}".`,
      choices: shuffle([ans, ...others]),
      answer: ans,
      explanation: `${char}의 대문자는 ${ans}입니다.`
    };
  },
  'g2-en-phonics': () => {
    const words = phonicsDict.a;
    const ans = words[getRandomInt(0, words.length - 1)];
    const others = shuffle([...phonicsDict.b, ...phonicsDict.c]).slice(0, 3);
    return {
      question: `Which word starts with the "A/a" sound?`,
      choices: shuffle([ans, ...others]),
      answer: ans,
      explanation: `"${ans}"은(는) "A" 소리로 시작해요!`
    };
  },

  // --- 수학 (ID 동기화) ---
  'g1-m-1-1': () => { // 9까지의 수
    const n = getRandomInt(1, 9);
    const words = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    return {
      question: `${n}을(를) 숫자로 바르게 쓴 것은 무엇일까요?`,
      choices: generateChoices(n),
      answer: n,
      explanation: `${n}은(는) 숫자 ${n}으로 쓰고 '${words[n]}'이라고 읽어요.`
    };
  },
  'g1-m-1-3': () => { // 덧셈과 뺄셈
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = getRandomInt(1, 8);
      const b = getRandomInt(1, 9 - a);
      const ans = a + b;
      return { question: `${a} + ${b} 는 얼마일까요?`, choices: generateChoices(ans), answer: ans, explanation: `${a}에 ${b}를 더하면 ${ans}이(가) 돼요.` };
    } else {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(1, a - 1);
      const ans = a - b;
      return { question: `${a} - ${b} 는 얼마일까요?`, choices: generateChoices(ans), answer: ans, explanation: `${a}에서 ${b}를 빼면 ${ans}이(가) 남아요.` };
    }
  },
  'g2-m-2-2': () => { // 구구단
    const a = getRandomInt(2, 9);
    const b = getRandomInt(1, 9);
    const ans = a * b;
    return { question: `${a} x ${b} 는 얼마일까요?`, choices: generateChoices(ans), answer: ans, explanation: `${a} x ${b} = ${ans} 입니다.` };
  },
  'g2-m-2-4': () => { // 시각과 시간
    const h = getRandomInt(1, 12);
    const m = getRandomInt(1, 11) * 5;
    const ans = `${h}시 ${m}분`;
    return {
      question: `짧은 바늘이 ${h}를 지나고 긴 바늘이 숫자 ${m/5}를 가리키면 몇 시 몇 분일까요?`,
      choices: shuffle([ans, `${h}시 ${m+5}분`, `${h+1 > 12 ? 1 : h+1}시 ${m}분`, `${h}시 ${m-5 < 0 ? 55 : m-5}분`]),
      answer: ans,
      explanation: `긴 바늘이 가리키는 숫자에 5를 곱하면 '분'이 돼요. ${m/5} x 5 = ${m}분!`
    };
  },
  'g3-m-1-3': () => { // 나눗셈
    const b = getRandomInt(2, 9);
    const ans = getRandomInt(1, 9);
    const a = b * ans;
    return { question: `${a} ÷ ${b} = ?`, choices: generateChoices(ans), answer: ans, explanation: `${b} x ${ans} = ${a} 이므로 정답은 ${ans}!` };
  },
  'g4-m-1-1': () => { // 큰 수
    const units = ['', '만', '억', '조'];
    const idx = getRandomInt(1, 3);
    const n = getRandomInt(1, 9999);
    const ans = `${n}${units[idx]}`;
    return {
      question: `숫자 ${n}${'0'.repeat(idx * 4)} 을(를) 읽어보세요.`,
      choices: shuffle([ans, `${n}${units[idx-1]}`, `${n*10}${units[idx]}`, `${n}0${units[idx]}`]),
      answer: ans,
      explanation: `네 자리마다 단위가 바뀌어요. 정답은 ${ans}!`
    };
  },
  'g5-m-1-2': () => { // 약수와 배수
    const n = getRandomInt(2, 20);
    const divisors = [];
    for(let i=1; i<=n; i++) if(n%i===0) divisors.push(i);
    const ans = divisors[getRandomInt(0, divisors.length-1)];
    const others = [];
    while(others.length < 3) {
      let r = getRandomInt(1, 30);
      if(!divisors.includes(r) && !others.includes(r)) others.push(r);
    }
    return {
      question: `${n}의 약수인 것은 무엇일까요?`,
      choices: shuffle([ans, ...others]),
      answer: ans,
      explanation: `${n}을(를) 나누어 떨어지게 하는 수가 약수예요.`
    };
  },
  'g6-m-1-1': () => { // 분수의 나눗셈
    const n1 = getRandomInt(1, 3);
    const d1 = getRandomInt(2, 5);
    const n2 = getRandomInt(1, 3);
    const d2 = getRandomInt(2, 5);
    const [resN, resD] = simplifyFraction(n1 * d2, d1 * n2);
    const ans = resD === 1 ? `${resN}` : `${resN}/${resD}`;
    return {
      question: `${n1}/${d1} ÷ ${n2}/${d2} = ?`,
      choices: shuffle([ans, `${n1*n2}/${d1*d2}`, `${n1+d2}/${d1+n2}`, `${n1*d2+1}/${d1*n2}`]),
      answer: ans,
      explanation: `뒤집어서 곱하면 돼요! 결과는 ${ans}.`
    };
  }
};

export function isLocalGeneratorSupported(unitId) {
  return !!generators[unitId];
}

export function generateLocalQuiz(unitId, count = 10) {
  const generator = generators[unitId];
  if (!generator) return [];
  const questions = [];
  for (let i = 0; i < count; i++) {
    const q = generator();
    questions.push({
      id: `local-${unitId}-${i}`,
      type: 'multiple-choice',
      ...q,
      hints: [q.explanation || '천천히 계산해 보세요.'],
    });
  }
  return questions;
}
