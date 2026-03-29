/**
 * Math & English Generator Utility
 *
 * 특정 단원(unitId)에 대해 자바스크립트 로직으로 퀴즈를 생성합니다.
 * 모든 수학 단원(1~6학년 전체 69단원) + 영어 3단원 지원.
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

function getLCM(a, b) {
  return (a * b) / getGCD(a, b);
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
      const offset = getRandomInt(1, range);
      choices.add(correctAnswer + (Math.random() > 0.5 ? offset : -offset));
    } else {
      choices.add(`Choice ${choices.size}`);
    }
  }
  return shuffle(Array.from(choices));
}

function strChoices(correct, others) {
  return shuffle([correct, ...others.slice(0, 3)]);
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

  // ══════════════════════════════════════════
  // 영어 (ID 동기화)
  // ══════════════════════════════════════════
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

  // ══════════════════════════════════════════
  // 1학년 1학기
  // ══════════════════════════════════════════

  'g1-m-1-1': () => { // 9까지의 수
    const n = getRandomInt(1, 9);
    const words = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    return {
      question: `"${words[n]}"은 어떤 숫자일까요?`,
      choices: generateChoices(n, 4),
      answer: n,
      explanation: `'${words[n]}'은 숫자 ${n}이에요.`
    };
  },

  'g1-m-1-2': () => { // 여러 가지 모양
    const shapes = [
      { q: '공처럼 둥근 모양은?', a: '구', w: ['원기둥', '정육면체', '삼각기둥'] },
      { q: '주사위처럼 생긴 모양은?', a: '정육면체', w: ['구', '원기둥', '삼각형'] },
      { q: '통조림 캔처럼 생긴 모양은?', a: '원기둥', w: ['구', '정육면체', '삼각기둥'] },
      { q: '뾰족한 꼭짓점이 없는 모양은?', a: '구', w: ['정육면체', '원기둥', '삼각기둥'] },
      { q: '평평한 면이 2개인 모양은?', a: '원기둥', w: ['구', '정육면체', '원뿔'] },
    ];
    const item = shapes[getRandomInt(0, shapes.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g1-m-1-3': () => { // 덧셈과 뺄셈 (한 자리)
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = getRandomInt(1, 8);
      const b = getRandomInt(1, 9 - a);
      const ans = a + b;
      return { question: `${a} + ${b} = ?`, choices: generateChoices(ans, 3), answer: ans, explanation: `${a}에 ${b}를 더하면 ${ans}이에요.` };
    } else {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(1, a - 1);
      const ans = a - b;
      return { question: `${a} - ${b} = ?`, choices: generateChoices(ans, 3), answer: ans, explanation: `${a}에서 ${b}를 빼면 ${ans}이 남아요.` };
    }
  },

  'g1-m-1-4': () => { // 비교하기
    const items = [
      { q: '연필과 지우개 중 더 긴 것은?', a: '연필', w: ['지우개', '같다', '모른다'] },
      { q: '코끼리와 개미 중 더 무거운 것은?', a: '코끼리', w: ['개미', '같다', '모른다'] },
      { q: '욕조와 컵 중 더 넓은 것은?', a: '욕조', w: ['컵', '같다', '모른다'] },
      { q: '책상과 연필 중 더 넓은 것은?', a: '책상', w: ['연필', '같다', '모른다'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g1-m-1-5': () => { // 50까지의 수
    const n = getRandomInt(11, 50);
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const tensWords = ['', '십', '이십', '삼십', '사십', '오십'];
    const onesWords = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const reading = ones === 0 ? tensWords[tens] : tensWords[tens] + onesWords[ones];
    return {
      question: `${n}을 어떻게 읽을까요?`,
      choices: strChoices(reading, [`${tens}십${ones === 0 ? '' : ones + '일'}`, `${tens * 10 + ones + 1}`, `${n - 10}`].map(String)),
      answer: reading,
      explanation: `${n} = ${tens}십 ${ones !== 0 ? ones : ''} → "${reading}"`
    };
  },

  // ══════════════════════════════════════════
  // 1학년 2학기
  // ══════════════════════════════════════════

  'g1-m-2-1': () => { // 100까지의 수
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const n = getRandomInt(51, 99);
      return {
        question: `${n}보다 1 큰 수는?`,
        choices: generateChoices(n + 1, 3),
        answer: n + 1,
        explanation: `${n}보다 1 큰 수는 ${n + 1}이에요.`
      };
    } else if (type === 2) {
      const n = getRandomInt(52, 100);
      return {
        question: `${n}보다 1 작은 수는?`,
        choices: generateChoices(n - 1, 3),
        answer: n - 1,
        explanation: `${n}보다 1 작은 수는 ${n - 1}이에요.`
      };
    } else {
      const a = getRandomInt(51, 99);
      const b = getRandomInt(51, 99);
      const bigger = Math.max(a, b);
      return {
        question: `${a}와 ${b} 중 더 큰 수는?`,
        choices: strChoices(String(bigger), [String(Math.min(a, b)), String(bigger + 1), String(bigger - 1)]),
        answer: String(bigger),
        explanation: `${a}와 ${b}를 비교하면 ${bigger}가 더 커요.`
      };
    }
  },

  'g1-m-2-2': () => { // 덧셈과 뺄셈(1) — 받아올림 없음
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = getRandomInt(10, 50);
      const b = getRandomInt(1, 99 - a);
      const ans = a + b;
      return { question: `${a} + ${b} = ?`, choices: generateChoices(ans, 5), answer: ans, explanation: `${a} + ${b} = ${ans}` };
    } else {
      const a = getRandomInt(20, 99);
      const b = getRandomInt(1, a - 10);
      const ans = a - b;
      return { question: `${a} - ${b} = ?`, choices: generateChoices(ans, 5), answer: ans, explanation: `${a} - ${b} = ${ans}` };
    }
  },

  'g1-m-2-3': () => { // 여러 가지 모양으로 만들기
    const items = [
      { q: '삼각형 모양의 조각 3개로 만들 수 있는 도형은?', a: '삼각형', w: ['원', '사각형', '오각형'] },
      { q: '사각형 조각 2개를 붙이면 만들 수 있는 도형은?', a: '사각형', w: ['삼각형', '원', '오각형'] },
      { q: '모양 조각을 뒤집어서 같아 보이는 것은?', a: '원', w: ['삼각형', '사다리꼴', '화살표'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g1-m-2-4': () => { // 덧셈과 뺄셈(2) — 세 수
    const a = getRandomInt(1, 5);
    const b = getRandomInt(1, 5);
    const c = getRandomInt(1, 5);
    const useAdd = Math.random() > 0.5;
    if (useAdd) {
      const ans = a + b + c;
      return { question: `${a} + ${b} + ${c} = ?`, choices: generateChoices(ans, 4), answer: ans, explanation: `${a}+${b}=${a+b}, ${a+b}+${c}=${ans}` };
    } else {
      const big = getRandomInt(7, 15);
      const x = getRandomInt(1, big - 2);
      const y = getRandomInt(1, big - x - 1);
      const ans = big - x - y;
      return { question: `${big} - ${x} - ${y} = ?`, choices: generateChoices(ans, 4), answer: ans, explanation: `${big}-${x}=${big-x}, ${big-x}-${y}=${ans}` };
    }
  },

  'g1-m-2-5': () => { // 시계 보기와 규칙
    const h = getRandomInt(1, 12);
    const useHalf = Math.random() > 0.5;
    if (useHalf) {
      const ans = `${h}시 30분`;
      return {
        question: `짧은 바늘이 ${h}와 ${h+1 > 12 ? 1 : h+1} 사이, 긴 바늘이 6을 가리키면?`,
        choices: strChoices(ans, [`${h}시`, `${h+1 > 12 ? 1 : h+1}시`, `${h}시 15분`]),
        answer: ans,
        explanation: `긴 바늘이 6을 가리키면 30분이에요. 정답은 ${ans}!`
      };
    } else {
      const ans = `${h}시`;
      return {
        question: `짧은 바늘이 ${h}에 딱 맞고 긴 바늘이 12를 가리키면?`,
        choices: strChoices(ans, [`${h}시 30분`, `${h}시 15분`, `${h-1 < 1 ? 12 : h-1}시`]),
        answer: ans,
        explanation: `긴 바늘이 12를 가리키면 정각이에요. 정답은 ${ans}!`
      };
    }
  },

  'g1-m-2-6': () => { // 덧셈과 뺄셈(3) — 10을 이용
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const a = getRandomInt(1, 9);
      const b = 10 - a;
      return { question: `${a} + ? = 10`, choices: generateChoices(b, 3), answer: b, explanation: `${a} + ${b} = 10` };
    } else if (type === 2) {
      const a = getRandomInt(11, 19);
      const b = getRandomInt(1, a - 10);
      const ans = a - b;
      return { question: `${a} - ${b} = ?`, choices: generateChoices(ans, 3), answer: ans, explanation: `10을 이용해요: ${a} - ${b} = ${ans}` };
    } else {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(2, 10 - a + 5);
      const ans = a + b;
      return { question: `${a} + ${b} = ?`, choices: generateChoices(ans, 3), answer: ans, explanation: `10을 만들어서 계산해요: ${a} + ${b} = ${ans}` };
    }
  },

  // ══════════════════════════════════════════
  // 2학년 1학기
  // ══════════════════════════════════════════

  'g2-m-1-1': () => { // 세 자리 수
    const h = getRandomInt(1, 9);
    const t = getRandomInt(0, 9);
    const o = getRandomInt(0, 9);
    const n = h * 100 + t * 10 + o;
    const type = getRandomInt(1, 3);
    if (type === 1) {
      return {
        question: `${n}에서 백의 자리 숫자는?`,
        choices: strChoices(String(h), [String(t), String(o), String((h + 1) % 10)].map(String)),
        answer: String(h),
        explanation: `${n}의 백의 자리는 ${h}이에요.`
      };
    } else if (type === 2) {
      return {
        question: `${n}에서 십의 자리 숫자는?`,
        choices: strChoices(String(t), [String(h), String(o), String((t + 1) % 10)].map(String)),
        answer: String(t),
        explanation: `${n}의 십의 자리는 ${t}이에요.`
      };
    } else {
      const bigger = n + getRandomInt(1, 50);
      return {
        question: `${n}과 ${bigger} 중 더 큰 수는?`,
        choices: strChoices(String(bigger), [String(n), String(bigger + 1), String(n - 1)]),
        answer: String(bigger),
        explanation: `${bigger} > ${n}이에요.`
      };
    }
  },

  'g2-m-1-2': () => { // 여러 가지 도형
    const items = [
      { q: '꼭짓점이 3개인 도형은?', a: '삼각형', w: ['사각형', '원', '오각형'] },
      { q: '변이 4개인 도형은?', a: '사각형', w: ['삼각형', '원', '육각형'] },
      { q: '꼭짓점이 없는 도형은?', a: '원', w: ['삼각형', '사각형', '오각형'] },
      { q: '직각이 4개인 도형은?', a: '직사각형', w: ['삼각형', '원', '평행사변형'] },
      { q: '변의 길이가 모두 같고 각도 모두 같은 삼각형은?', a: '정삼각형', w: ['이등변삼각형', '직각삼각형', '사각형'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g2-m-1-3': () => { // 덧셈과 뺄셈 (받아올림/내림)
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = getRandomInt(15, 99);
      const b = getRandomInt(5, 99 - a);
      const ans = a + b;
      return { question: `${a} + ${b} = ?`, choices: generateChoices(ans, 8), answer: ans, explanation: `${a} + ${b} = ${ans}` };
    } else {
      const a = getRandomInt(20, 99);
      const b = getRandomInt(5, a - 1);
      const ans = a - b;
      return { question: `${a} - ${b} = ?`, choices: generateChoices(ans, 8), answer: ans, explanation: `${a} - ${b} = ${ans}` };
    }
  },

  'g2-m-1-4': () => { // 길이 재기 (cm)
    const len = getRandomInt(2, 20);
    const type = getRandomInt(1, 3);
    if (type === 1) {
      return {
        question: `1cm짜리 칸이 ${len}개면 길이는?`,
        choices: generateChoices(len, 3),
        answer: len,
        explanation: `1cm × ${len} = ${len}cm`
      };
    } else if (type === 2) {
      const total = getRandomInt(10, 30);
      const cut = getRandomInt(2, total - 1);
      const ans = total - cut;
      return {
        question: `${total}cm 끈에서 ${cut}cm를 잘랐어요. 남은 길이는?`,
        choices: generateChoices(ans, 4),
        answer: ans,
        explanation: `${total} - ${cut} = ${ans}cm`
      };
    } else {
      const a = getRandomInt(5, 15);
      const b = getRandomInt(3, 10);
      const ans = a + b;
      return {
        question: `${a}cm와 ${b}cm를 이으면 전체 길이는?`,
        choices: generateChoices(ans, 4),
        answer: ans,
        explanation: `${a} + ${b} = ${ans}cm`
      };
    }
  },

  'g2-m-1-5': () => { // 분류하기
    const items = [
      { q: '동물을 "날 수 있다 / 없다"로 분류할 때 기준은?', a: '날 수 있는지 없는지', w: ['색깔', '크기', '발의 수'] },
      { q: '색깔로 분류할 때 빨간 사과, 빨간 딸기는 같은 무리인가요?', a: '예', w: ['아니요', '모른다', '상관없다'] },
      { q: '모양으로 분류할 때 기준이 될 수 없는 것은?', a: '좋아하는 것', w: ['둥근 것', '네모난 것', '세모난 것'] },
      { q: '크기로 분류할 때 코끼리와 함께 묶이는 것은?', a: '고래', w: ['개미', '나비', '달팽이'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g2-m-1-6': () => { // 곱셈 (개념)
    const groups = getRandomInt(2, 5);
    const each = getRandomInt(2, 6);
    const ans = groups * each;
    return {
      question: `사과가 한 접시에 ${each}개씩 ${groups}접시 있어요. 사과는 모두 몇 개일까요?`,
      choices: generateChoices(ans, 5),
      answer: ans,
      explanation: `${each} × ${groups} = ${ans}개`
    };
  },

  // ══════════════════════════════════════════
  // 2학년 2학기
  // ══════════════════════════════════════════

  'g2-m-2-1': () => { // 네 자리 수
    const th = getRandomInt(1, 9);
    const h = getRandomInt(0, 9);
    const t = getRandomInt(0, 9);
    const o = getRandomInt(0, 9);
    const n = th * 1000 + h * 100 + t * 10 + o;
    const type = getRandomInt(1, 3);
    if (type === 1) {
      return {
        question: `${n}에서 천의 자리 숫자는?`,
        choices: strChoices(String(th), [String(h), String(t), String((th + 1) % 10)]),
        answer: String(th),
        explanation: `${n}의 천의 자리는 ${th}이에요.`
      };
    } else if (type === 2) {
      const bigger = n + getRandomInt(1, 100);
      return {
        question: `${n}과 ${bigger} 중 더 큰 수는?`,
        choices: strChoices(String(bigger), [String(n), String(bigger + 10), String(n - 1)]),
        answer: String(bigger),
        explanation: `${bigger} > ${n}이에요.`
      };
    } else {
      return {
        question: `1000이 ${th}개, 100이 ${h}개, 10이 ${t}개, 1이 ${o}개이면?`,
        choices: generateChoices(n, 100),
        answer: n,
        explanation: `${th}×1000 + ${h}×100 + ${t}×10 + ${o} = ${n}`
      };
    }
  },

  'g2-m-2-2': () => { // 구구단
    const a = getRandomInt(2, 9);
    const b = getRandomInt(1, 9);
    const ans = a * b;
    return { question: `${a} × ${b} = ?`, choices: generateChoices(ans, 8), answer: ans, explanation: `${a} × ${b} = ${ans}` };
  },

  'g2-m-2-3': () => { // 길이 재기 (m, cm)
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const m = getRandomInt(1, 5);
      const cm = getRandomInt(1, 99);
      const total = m * 100 + cm;
      return {
        question: `${m}m ${cm}cm는 몇 cm일까요?`,
        choices: generateChoices(total, 20),
        answer: total,
        explanation: `${m}m = ${m * 100}cm, ${m * 100} + ${cm} = ${total}cm`
      };
    } else if (type === 2) {
      const total = getRandomInt(150, 500);
      const m = Math.floor(total / 100);
      const cm = total % 100;
      return {
        question: `${total}cm는 몇 m 몇 cm일까요?`,
        choices: strChoices(`${m}m ${cm}cm`, [`${m+1}m ${cm}cm`, `${m}m ${cm+10}cm`, `${m-1}m ${cm}cm`]),
        answer: `${m}m ${cm}cm`,
        explanation: `${total}cm = ${m}m ${cm}cm`
      };
    } else {
      const a = getRandomInt(1, 3);
      const b = getRandomInt(1, 3);
      const ans = a + b;
      return {
        question: `${a}m짜리 막대와 ${b}m짜리 막대를 이으면?`,
        choices: generateChoices(ans, 2),
        answer: ans,
        explanation: `${a}m + ${b}m = ${ans}m`
      };
    }
  },

  'g2-m-2-4': () => { // 시각과 시간
    const h = getRandomInt(1, 12);
    const m = getRandomInt(1, 11) * 5;
    const ans = `${h}시 ${m}분`;
    return {
      question: `짧은 바늘이 ${h}를 지나고 긴 바늘이 숫자 ${m / 5}를 가리키면?`,
      choices: shuffle([ans, `${h}시 ${m + 5}분`, `${h + 1 > 12 ? 1 : h + 1}시 ${m}분`, `${h}시 ${m - 5 < 0 ? 55 : m - 5}분`]),
      answer: ans,
      explanation: `긴 바늘의 숫자 × 5 = 분. ${m / 5} × 5 = ${m}분`
    };
  },

  'g2-m-2-5': () => { // 표와 그래프
    const fruits = ['사과', '바나나', '포도', '딸기'];
    const counts = fruits.map(() => getRandomInt(2, 8));
    const maxIdx = counts.indexOf(Math.max(...counts));
    const minIdx = counts.indexOf(Math.min(...counts));
    const type = getRandomInt(1, 2);
    if (type === 1) {
      return {
        question: `사과:${counts[0]}, 바나나:${counts[1]}, 포도:${counts[2]}, 딸기:${counts[3]} 중 가장 많은 것은?`,
        choices: strChoices(fruits[maxIdx], fruits.filter((_, i) => i !== maxIdx)),
        answer: fruits[maxIdx],
        explanation: `${fruits[maxIdx]}가 ${counts[maxIdx]}개로 가장 많아요.`
      };
    } else {
      return {
        question: `사과:${counts[0]}, 바나나:${counts[1]}, 포도:${counts[2]}, 딸기:${counts[3]} 중 가장 적은 것은?`,
        choices: strChoices(fruits[minIdx], fruits.filter((_, i) => i !== minIdx)),
        answer: fruits[minIdx],
        explanation: `${fruits[minIdx]}가 ${counts[minIdx]}개로 가장 적어요.`
      };
    }
  },

  'g2-m-2-6': () => { // 규칙 찾기
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const start = getRandomInt(1, 5);
      const step = getRandomInt(2, 5);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const ans = start + step * 4;
      return {
        question: `${seq.join(', ')}, □ — □에 들어갈 수는?`,
        choices: generateChoices(ans, 4),
        answer: ans,
        explanation: `${step}씩 커지는 규칙이에요. 정답은 ${ans}.`
      };
    } else if (type === 2) {
      const start = getRandomInt(20, 50);
      const step = getRandomInt(2, 5);
      const seq = [start, start - step, start - step * 2, start - step * 3];
      const ans = start - step * 4;
      return {
        question: `${seq.join(', ')}, □ — □에 들어갈 수는?`,
        choices: generateChoices(ans, 4),
        answer: ans,
        explanation: `${step}씩 작아지는 규칙이에요. 정답은 ${ans}.`
      };
    } else {
      const base = getRandomInt(2, 4);
      const seq = [base, base * 2, base * 4, base * 8];
      const ans = base * 16;
      return {
        question: `${seq.join(', ')}, □ — □에 들어갈 수는?`,
        choices: generateChoices(ans, 10),
        answer: ans,
        explanation: `2배씩 커지는 규칙이에요. 정답은 ${ans}.`
      };
    }
  },

  // ══════════════════════════════════════════
  // 3학년 1학기
  // ══════════════════════════════════════════

  'g3-m-1-1': () => { // 덧셈과 뺄셈 (세 자리)
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = getRandomInt(100, 699);
      const b = getRandomInt(100, 999 - a);
      const ans = a + b;
      return { question: `${a} + ${b} = ?`, choices: generateChoices(ans, 50), answer: ans, explanation: `${a} + ${b} = ${ans}` };
    } else {
      const a = getRandomInt(200, 999);
      const b = getRandomInt(100, a - 100);
      const ans = a - b;
      return { question: `${a} - ${b} = ?`, choices: generateChoices(ans, 50), answer: ans, explanation: `${a} - ${b} = ${ans}` };
    }
  },

  'g3-m-1-2': () => { // 평면도형
    const items = [
      { q: '선분 두 개가 만나서 이루는 것은?', a: '각', w: ['직선', '점', '면'] },
      { q: '직각보다 작은 각은?', a: '예각', w: ['둔각', '직각', '평각'] },
      { q: '직각이 하나인 삼각형은?', a: '직각삼각형', w: ['정삼각형', '이등변삼각형', '둔각삼각형'] },
      { q: '두 직선이 만나 이루는 각이 90°일 때?', a: '수직', w: ['평행', '교차', '대각'] },
      { q: '만나지 않는 두 직선의 관계는?', a: '평행', w: ['수직', '교차', '직각'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g3-m-1-3': () => { // 나눗셈
    const b = getRandomInt(2, 9);
    const ans = getRandomInt(1, 9);
    const a = b * ans;
    return {
      question: `${a} ÷ ${b} = ?`,
      choices: generateChoices(ans, 4),
      answer: ans,
      explanation: `${b} × ${ans} = ${a} → ${a} ÷ ${b} = ${ans}`
    };
  },

  'g3-m-1-4': () => { // 곱셈 (두 자리 × 한 자리)
    const a = getRandomInt(11, 99);
    const b = getRandomInt(2, 9);
    const ans = a * b;
    return {
      question: `${a} × ${b} = ?`,
      choices: generateChoices(ans, 20),
      answer: ans,
      explanation: `${a} × ${b} = ${ans}`
    };
  },

  'g3-m-1-5': () => { // 길이와 시간
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const cm = getRandomInt(2, 9);
      const mm = getRandomInt(1, 9);
      return {
        question: `${cm}cm ${mm}mm는 몇 mm일까요?`,
        choices: generateChoices(cm * 10 + mm, 5),
        answer: cm * 10 + mm,
        explanation: `${cm}cm = ${cm * 10}mm, ${cm * 10} + ${mm} = ${cm * 10 + mm}mm`
      };
    } else if (type === 2) {
      const km = getRandomInt(1, 5);
      const m = getRandomInt(100, 900);
      return {
        question: `${km}km ${m}m는 몇 m일까요?`,
        choices: generateChoices(km * 1000 + m, 100),
        answer: km * 1000 + m,
        explanation: `${km}km = ${km * 1000}m, ${km * 1000} + ${m} = ${km * 1000 + m}m`
      };
    } else {
      const h = getRandomInt(1, 3);
      const min = getRandomInt(10, 50);
      const ans = h * 60 + min;
      return {
        question: `${h}시간 ${min}분은 모두 몇 분일까요?`,
        choices: generateChoices(ans, 15),
        answer: ans,
        explanation: `${h}시간 = ${h * 60}분, ${h * 60} + ${min} = ${ans}분`
      };
    }
  },

  'g3-m-1-6': () => { // 분수와 소수 입문
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const den = getRandomInt(2, 6);
      const num = getRandomInt(1, den - 1);
      return {
        question: `피자 ${den}조각 중 ${num}조각을 먹었어요. 먹은 양을 분수로 나타내면?`,
        choices: strChoices(`${num}/${den}`, [`${den}/${num}`, `${num + 1}/${den}`, `${num}/${den + 1}`]),
        answer: `${num}/${den}`,
        explanation: `전체 ${den}조각 중 ${num}조각 → ${num}/${den}`
      };
    } else {
      const dec = (getRandomInt(1, 9) / 10).toFixed(1);
      return {
        question: `0.1이 ${parseFloat(dec) * 10}개이면 어떤 소수일까요?`,
        choices: strChoices(dec, [(parseFloat(dec) + 0.1).toFixed(1), (parseFloat(dec) - 0.1).toFixed(1), (parseFloat(dec) + 0.2).toFixed(1)]),
        answer: dec,
        explanation: `0.1 × ${parseFloat(dec) * 10} = ${dec}`
      };
    }
  },

  // ══════════════════════════════════════════
  // 3학년 2학기
  // ══════════════════════════════════════════

  'g3-m-2-1': () => { // 곱셈 (세 자리 × 한 자리, 두 자리 × 두 자리)
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const a = getRandomInt(100, 300);
      const b = getRandomInt(2, 4);
      const ans = a * b;
      return { question: `${a} × ${b} = ?`, choices: generateChoices(ans, 50), answer: ans, explanation: `${a} × ${b} = ${ans}` };
    } else {
      const a = getRandomInt(11, 30);
      const b = getRandomInt(11, 30);
      const ans = a * b;
      return { question: `${a} × ${b} = ?`, choices: generateChoices(ans, 30), answer: ans, explanation: `${a} × ${b} = ${ans}` };
    }
  },

  'g3-m-2-2': () => { // 나눗셈 (내림 있는)
    const b = getRandomInt(2, 9);
    const q = getRandomInt(10, 30);
    const r = getRandomInt(0, b - 1);
    const a = b * q + r;
    if (r === 0) {
      return { question: `${a} ÷ ${b} = ?`, choices: generateChoices(q, 5), answer: q, explanation: `${a} ÷ ${b} = ${q}` };
    } else {
      return {
        question: `${a} ÷ ${b}의 나머지는?`,
        choices: generateChoices(r, 3),
        answer: r,
        explanation: `${a} = ${b} × ${q} + ${r}, 나머지는 ${r}`
      };
    }
  },

  'g3-m-2-3': () => { // 원
    const r = getRandomInt(2, 10);
    const d = r * 2;
    const type = getRandomInt(1, 3);
    if (type === 1) {
      return {
        question: `반지름이 ${r}cm인 원의 지름은?`,
        choices: generateChoices(d, 3),
        answer: d,
        explanation: `지름 = 반지름 × 2 = ${r} × 2 = ${d}cm`
      };
    } else if (type === 2) {
      return {
        question: `지름이 ${d}cm인 원의 반지름은?`,
        choices: generateChoices(r, 3),
        answer: r,
        explanation: `반지름 = 지름 ÷ 2 = ${d} ÷ 2 = ${r}cm`
      };
    } else {
      return {
        question: `원의 중심에서 원 위의 점까지의 거리를 뭐라고 하나요?`,
        choices: strChoices('반지름', ['지름', '둘레', '넓이']),
        answer: '반지름',
        explanation: `원의 중심에서 원 위의 점까지의 거리는 반지름이에요.`
      };
    }
  },

  'g3-m-2-4': () => { // 분수 (진분수, 가분수, 대분수)
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const den = getRandomInt(3, 6);
      const num = getRandomInt(1, den - 1);
      return {
        question: `${num}/${den}은 어떤 분수인가요?`,
        choices: strChoices('진분수', ['가분수', '대분수', '자연수']),
        answer: '진분수',
        explanation: `분자(${num}) < 분모(${den})이므로 진분수예요.`
      };
    } else if (type === 2) {
      const den = getRandomInt(2, 5);
      const num = den + getRandomInt(1, den);
      return {
        question: `${num}/${den}은 어떤 분수인가요?`,
        choices: strChoices('가분수', ['진분수', '대분수', '자연수']),
        answer: '가분수',
        explanation: `분자(${num}) ≥ 분모(${den})이므로 가분수예요.`
      };
    } else {
      const whole = getRandomInt(1, 3);
      const den = getRandomInt(2, 5);
      const num = getRandomInt(1, den - 1);
      const imprNum = whole * den + num;
      return {
        question: `대분수 ${whole}과${num}/${den}을 가분수로 나타내면?`,
        choices: strChoices(`${imprNum}/${den}`, [`${whole * den}/${num}`, `${imprNum + 1}/${den}`, `${imprNum}/${den + 1}`]),
        answer: `${imprNum}/${den}`,
        explanation: `${whole} × ${den} + ${num} = ${imprNum} → ${imprNum}/${den}`
      };
    }
  },

  'g3-m-2-5': () => { // 들이와 무게
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const l = getRandomInt(1, 5);
      const ml = getRandomInt(100, 900);
      return {
        question: `${l}L ${ml}mL는 몇 mL일까요?`,
        choices: generateChoices(l * 1000 + ml, 100),
        answer: l * 1000 + ml,
        explanation: `${l}L = ${l * 1000}mL, ${l * 1000} + ${ml} = ${l * 1000 + ml}mL`
      };
    } else if (type === 2) {
      const kg = getRandomInt(1, 5);
      const g = getRandomInt(100, 900);
      return {
        question: `${kg}kg ${g}g는 몇 g일까요?`,
        choices: generateChoices(kg * 1000 + g, 100),
        answer: kg * 1000 + g,
        explanation: `${kg}kg = ${kg * 1000}g, ${kg * 1000} + ${g} = ${kg * 1000 + g}g`
      };
    } else {
      const a = getRandomInt(1, 3);
      const b = getRandomInt(1, 3);
      const ans = a + b;
      return {
        question: `${a}kg짜리 수박과 ${b}kg짜리 참외를 함께 들면 몇 kg일까요?`,
        choices: generateChoices(ans, 2),
        answer: ans,
        explanation: `${a} + ${b} = ${ans}kg`
      };
    }
  },

  'g3-m-2-6': () => { // 자료의 정리
    const items = ['강아지', '고양이', '토끼', '햄스터'];
    const counts = items.map(() => getRandomInt(2, 8));
    const total = counts.reduce((s, c) => s + c, 0);
    const maxIdx = counts.indexOf(Math.max(...counts));
    const type = getRandomInt(1, 2);
    if (type === 1) {
      return {
        question: `강아지:${counts[0]}, 고양이:${counts[1]}, 토끼:${counts[2]}, 햄스터:${counts[3]}. 전체 합은?`,
        choices: generateChoices(total, 5),
        answer: total,
        explanation: `${counts.join(' + ')} = ${total}`
      };
    } else {
      return {
        question: `강아지:${counts[0]}, 고양이:${counts[1]}, 토끼:${counts[2]}, 햄스터:${counts[3]}. 가장 많이 선택된 것은?`,
        choices: strChoices(items[maxIdx], items.filter((_, i) => i !== maxIdx)),
        answer: items[maxIdx],
        explanation: `${items[maxIdx]}가 ${counts[maxIdx]}명으로 가장 많아요.`
      };
    }
  },

  // ══════════════════════════════════════════
  // 4학년 1학기
  // ══════════════════════════════════════════

  'g4-m-1-1': () => { // 큰 수
    const units = ['', '만', '억', '조'];
    const idx = getRandomInt(1, 3);
    const n = getRandomInt(1, 9999);
    const ans = `${n}${units[idx]}`;
    return {
      question: `숫자 ${n}${'0'.repeat(idx * 4)}을 읽어보세요.`,
      choices: shuffle([ans, `${n}${units[idx - 1]}`, `${n * 10}${units[idx]}`, `${n}0${units[idx]}`]),
      answer: ans,
      explanation: `네 자리마다 단위가 바뀌어요. 정답은 ${ans}!`
    };
  },

  'g4-m-1-2': () => { // 각도
    const angles = [30, 45, 60, 90, 120, 135, 150];
    const a = angles[getRandomInt(0, angles.length - 1)];
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const kind = a < 90 ? '예각' : a === 90 ? '직각' : '둔각';
      return {
        question: `${a}°는 어떤 각인가요?`,
        choices: strChoices(kind, ['예각', '직각', '둔각'].filter(k => k !== kind)),
        answer: kind,
        explanation: `${a}° → ${kind} (예각: 0~90°미만, 직각: 90°, 둔각: 90°초과~180°미만)`
      };
    } else if (type === 2) {
      const sup = 180 - a;
      return {
        question: `${a}°의 보각(합이 180°)은?`,
        choices: generateChoices(sup, 15),
        answer: sup,
        explanation: `180 - ${a} = ${sup}°`
      };
    } else {
      const comp = 90 - a > 0 ? 90 - a : null;
      if (comp) {
        return {
          question: `${a}°의 여각(합이 90°)은?`,
          choices: generateChoices(comp, 10),
          answer: comp,
          explanation: `90 - ${a} = ${comp}°`
        };
      } else {
        const x = getRandomInt(20, 70);
        return {
          question: `삼각형의 두 각이 ${x}°, 90°이면 나머지 각은?`,
          choices: generateChoices(90 - x, 10),
          answer: 90 - x,
          explanation: `삼각형 내각의 합 = 180°. 180 - ${x} - 90 = ${90 - x}°`
        };
      }
    }
  },

  'g4-m-1-3': () => { // 곱셈과 나눗셈
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const a = getRandomInt(100, 300);
      const b = getRandomInt(10, 30);
      const ans = a * b;
      return { question: `${a} × ${b} = ?`, choices: generateChoices(ans, 500), answer: ans, explanation: `${a} × ${b} = ${ans}` };
    } else {
      const b = getRandomInt(10, 30);
      const q = getRandomInt(10, 30);
      const a = b * q;
      return { question: `${a} ÷ ${b} = ?`, choices: generateChoices(q, 5), answer: q, explanation: `${a} ÷ ${b} = ${q}` };
    }
  },

  'g4-m-1-4': () => { // 평면도형의 이동
    const items = [
      { q: '도형을 위아래 방향으로 뒤집는 것은?', a: '상하 뒤집기', w: ['좌우 뒤집기', '90° 돌리기', '평행이동'] },
      { q: '도형의 모양과 크기는 그대로이고 위치만 바꾸는 것은?', a: '밀기', w: ['뒤집기', '돌리기', '확대'] },
      { q: '도형을 90° 돌리면 방향이 어떻게 되나요?', a: '가로↔세로 바뀜', w: ['같다', '상하가 바뀜', '크기가 달라짐'] },
      { q: '도형을 360° 돌리면?', a: '처음과 같다', w: ['상하가 바뀜', '좌우가 바뀜', '크기가 커짐'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g4-m-1-5': () => { // 막대그래프
    const subjects = ['수학', '국어', '과학', '사회'];
    const scores = subjects.map(() => getRandomInt(20, 80));
    const maxIdx = scores.indexOf(Math.max(...scores));
    const total = scores.reduce((s, c) => s + c, 0);
    const type = getRandomInt(1, 2);
    if (type === 1) {
      return {
        question: `수학:${scores[0]}, 국어:${scores[1]}, 과학:${scores[2]}, 사회:${scores[3]}. 점수가 가장 높은 과목은?`,
        choices: strChoices(subjects[maxIdx], subjects.filter((_, i) => i !== maxIdx)),
        answer: subjects[maxIdx],
        explanation: `${subjects[maxIdx]}가 ${scores[maxIdx]}점으로 가장 높아요.`
      };
    } else {
      return {
        question: `수학:${scores[0]}, 국어:${scores[1]}, 과학:${scores[2]}, 사회:${scores[3]}. 전체 합은?`,
        choices: generateChoices(total, 20),
        answer: total,
        explanation: `${scores.join(' + ')} = ${total}`
      };
    }
  },

  'g4-m-1-6': () => { // 규칙 찾기
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const base = getRandomInt(2, 5);
      const step = getRandomInt(3, 7);
      const seq = Array.from({ length: 4 }, (_, i) => base + step * i);
      const ans = base + step * 4;
      return {
        question: `${seq.join(', ')}, □ — 규칙을 찾아 □를 채워라.`,
        choices: generateChoices(ans, 5),
        answer: ans,
        explanation: `${step}씩 더하는 규칙. 정답: ${ans}`
      };
    } else {
      const r = getRandomInt(2, 3);
      const seq = Array.from({ length: 4 }, (_, i) => Math.pow(r, i + 1));
      const ans = Math.pow(r, 5);
      return {
        question: `${seq.join(', ')}, □ — 규칙을 찾아 □를 채워라.`,
        choices: generateChoices(ans, 10),
        answer: ans,
        explanation: `${r}배씩 곱하는 규칙. 정답: ${ans}`
      };
    }
  },

  // ══════════════════════════════════════════
  // 4학년 2학기
  // ══════════════════════════════════════════

  'g4-m-2-1': () => { // 분수의 덧셈 뺄셈 (동분모)
    const den = getRandomInt(3, 8);
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const a = getRandomInt(1, den - 1);
      const b = getRandomInt(1, den - a);
      const [rn, rd] = simplifyFraction(a + b, den);
      const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
      return {
        question: `${a}/${den} + ${b}/${den} = ?`,
        choices: strChoices(ans, [`${a + b + 1}/${den}`, `${a + b - 1}/${den}`, `${a * b}/${den * den}`]),
        answer: ans,
        explanation: `분모가 같으면 분자끼리 더해요: (${a}+${b})/${den} = ${a + b}/${den} = ${ans}`
      };
    } else {
      const a = getRandomInt(2, den);
      const b = getRandomInt(1, a - 1);
      const [rn, rd] = simplifyFraction(a - b, den);
      const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
      return {
        question: `${a}/${den} - ${b}/${den} = ?`,
        choices: strChoices(ans, [`${a - b + 1}/${den}`, `${Math.abs(a - b - 1)}/${den}`, `${a + b}/${den}`]),
        answer: ans,
        explanation: `분자끼리 빼요: (${a}-${b})/${den} = ${a - b}/${den} = ${ans}`
      };
    }
  },

  'g4-m-2-2': () => { // 삼각형
    const items = [
      { q: '세 변의 길이가 모두 같은 삼각형은?', a: '정삼각형', w: ['이등변삼각형', '직각삼각형', '둔각삼각형'] },
      { q: '두 변의 길이가 같은 삼각형은?', a: '이등변삼각형', w: ['정삼각형', '직각삼각형', '예각삼각형'] },
      { q: '한 각이 직각(90°)인 삼각형은?', a: '직각삼각형', w: ['정삼각형', '이등변삼각형', '예각삼각형'] },
      { q: '세 각이 모두 예각인 삼각형은?', a: '예각삼각형', w: ['둔각삼각형', '직각삼각형', '정삼각형'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g4-m-2-3': () => { // 소수의 덧셈 뺄셈
    const isAdd = Math.random() > 0.5;
    const a = (getRandomInt(10, 90) / 10).toFixed(1);
    const b = (getRandomInt(1, 90) / 10).toFixed(1);
    if (isAdd) {
      const ans = (parseFloat(a) + parseFloat(b)).toFixed(1);
      return { question: `${a} + ${b} = ?`, choices: [ans, (parseFloat(ans) + 0.1).toFixed(1), (parseFloat(ans) - 0.1).toFixed(1), (parseFloat(ans) + 1).toFixed(1)].sort(() => Math.random() - 0.5), answer: ans, explanation: `${a} + ${b} = ${ans}` };
    } else {
      const bigger = Math.max(parseFloat(a), parseFloat(b));
      const smaller = Math.min(parseFloat(a), parseFloat(b));
      const ans = (bigger - smaller).toFixed(1);
      return { question: `${bigger.toFixed(1)} - ${smaller.toFixed(1)} = ?`, choices: [ans, (parseFloat(ans) + 0.1).toFixed(1), (parseFloat(ans) - 0.1).toFixed(1), (parseFloat(ans) + 1).toFixed(1)].sort(() => Math.random() - 0.5), answer: ans, explanation: `${bigger.toFixed(1)} - ${smaller.toFixed(1)} = ${ans}` };
    }
  },

  'g4-m-2-4': () => { // 사각형
    const items = [
      { q: '마주 보는 두 쌍의 변이 평행인 사각형은?', a: '평행사변형', w: ['사다리꼴', '마름모', '직사각형'] },
      { q: '네 변의 길이가 모두 같은 사각형은?', a: '마름모', w: ['직사각형', '정사각형', '사다리꼴'] },
      { q: '한 쌍의 변만 평행인 사각형은?', a: '사다리꼴', w: ['평행사변형', '마름모', '정사각형'] },
      { q: '네 변의 길이도 같고 네 각도 직각인 사각형은?', a: '정사각형', w: ['마름모', '직사각형', '평행사변형'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g4-m-2-5': () => { // 꺾은선그래프
    const months = [1, 2, 3, 4, 5];
    const temps = months.map(() => getRandomInt(5, 30));
    const maxIdx = temps.indexOf(Math.max(...temps));
    const type = getRandomInt(1, 2);
    if (type === 1) {
      return {
        question: `1월:${temps[0]}°, 2월:${temps[1]}°, 3월:${temps[2]}°, 4월:${temps[3]}°, 5월:${temps[4]}°. 가장 더운 달은?`,
        choices: strChoices(`${maxIdx + 1}월`, months.filter(m => m !== maxIdx + 1).map(m => `${m}월`)),
        answer: `${maxIdx + 1}월`,
        explanation: `${maxIdx + 1}월이 ${temps[maxIdx]}°로 가장 높아요.`
      };
    } else {
      const diff = temps[4] - temps[0];
      return {
        question: `1월(${temps[0]}°)에서 5월(${temps[4]}°)까지 온도 변화는?`,
        choices: generateChoices(diff, 5),
        answer: diff,
        explanation: `${temps[4]} - ${temps[0]} = ${diff}°`
      };
    }
  },

  'g4-m-2-6': () => { // 다각형
    const items = [
      { q: '변이 5개인 다각형은?', a: '오각형', w: ['사각형', '육각형', '삼각형'] },
      { q: '변이 6개인 다각형은?', a: '육각형', w: ['오각형', '칠각형', '팔각형'] },
      { q: '모든 변의 길이와 모든 각이 같은 다각형을 무엇이라 하나요?', a: '정다각형', w: ['부등변다각형', '볼록다각형', '다각형'] },
      { q: '정육각형의 내각의 합은?', a: '720°', w: ['360°', '540°', '900°'] },
      { q: '사각형의 두 꼭짓점을 연결한 선 중 변이 아닌 것은?', a: '대각선', w: ['변', '꼭짓점', '모서리'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  // ══════════════════════════════════════════
  // 5학년 1학기
  // ══════════════════════════════════════════

  'g5-m-1-1': () => { // 혼합 계산
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const a = getRandomInt(2, 8);
      const b = getRandomInt(2, 6);
      const c = getRandomInt(1, 10);
      const ans = a * b + c;
      return { question: `${a} × ${b} + ${c} = ?`, choices: generateChoices(ans, 8), answer: ans, explanation: `곱셈 먼저: ${a}×${b}=${a * b}, 그 다음 덧셈: ${a * b}+${c}=${ans}` };
    } else if (type === 2) {
      const a = getRandomInt(20, 50);
      const b = getRandomInt(2, 6);
      const c = getRandomInt(2, 5);
      const ans = a - b * c;
      return { question: `${a} - ${b} × ${c} = ?`, choices: generateChoices(ans, 8), answer: ans, explanation: `곱셈 먼저: ${b}×${c}=${b * c}, 그 다음 뺄셈: ${a}-${b * c}=${ans}` };
    } else {
      const a = getRandomInt(10, 30);
      const b = getRandomInt(2, 6);
      const c = getRandomInt(2, 5);
      const ans = (a + b) * c;
      return { question: `(${a} + ${b}) × ${c} = ?`, choices: generateChoices(ans, 15), answer: ans, explanation: `괄호 먼저: (${a}+${b})=${a + b}, 그 다음 곱셈: ${a + b}×${c}=${ans}` };
    }
  },

  'g5-m-1-2': () => { // 약수와 배수
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const n = getRandomInt(2, 20);
      const divisors = [];
      for (let i = 1; i <= n; i++) if (n % i === 0) divisors.push(i);
      const ans = divisors[getRandomInt(0, divisors.length - 1)];
      const others = [];
      while (others.length < 3) {
        const r = getRandomInt(1, 30);
        if (!divisors.includes(r) && !others.includes(r)) others.push(r);
      }
      return { question: `${n}의 약수인 것은?`, choices: shuffle([ans, ...others]), answer: ans, explanation: `${n} ÷ ${ans} = ${n / ans} (나머지 0)` };
    } else if (type === 2) {
      const n = getRandomInt(2, 9);
      const k = getRandomInt(2, 8);
      const ans = n * k;
      return { question: `${n}의 배수인 것은?`, choices: generateChoices(ans, 5), answer: ans, explanation: `${n} × ${k} = ${ans}` };
    } else {
      const a = getRandomInt(2, 6);
      const b = getRandomInt(2, 6);
      const gcd = getGCD(a, b);
      return { question: `${a}와 ${b}의 최대공약수는?`, choices: generateChoices(gcd, 3), answer: gcd, explanation: `${a}와 ${b}의 공약수 중 가장 큰 수는 ${gcd}` };
    }
  },

  'g5-m-1-3': () => { // 규칙과 대응
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const base = getRandomInt(2, 5);
      const mult = getRandomInt(2, 4);
      const x = getRandomInt(3, 8);
      const ans = base * x * mult / mult; // simplify — just linear
      const realAns = base + (x - 1) * getRandomInt(2, 4);
      const step = getRandomInt(2, 5);
      return {
        question: `사각형 수가 1개씩 늘 때 성냥개비 수가 ${4}개씩 늘어나요. 사각형 ${x}개일 때 성냥개비는?`,
        choices: generateChoices(3 + (x - 1) * 4, 5),
        answer: 3 + (x - 1) * 4,
        explanation: `처음 4개, 그 다음부터 3개씩 추가: 4 + (${x}-1)×3 = ${3 + (x - 1) * 4}... 아니면 간단히 ${x}×3+${x > 1 ? 1 : 0} = ${3 + (x - 1) * 4}`
      };
    } else {
      const step = getRandomInt(2, 5);
      const x = getRandomInt(3, 8);
      const ans = step * x;
      return {
        question: `꽃 한 송이에 꽃잎이 ${step}장이에요. 꽃 ${x}송이의 꽃잎은 모두 몇 장?`,
        choices: generateChoices(ans, 5),
        answer: ans,
        explanation: `${step} × ${x} = ${ans}장`
      };
    }
  },

  'g5-m-1-4': () => { // 약분과 통분
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const gcd = getRandomInt(2, 4);
      const n = getRandomInt(1, 5) * gcd;
      const d = getRandomInt(n / gcd + 1, 8) * gcd;
      const [sn, sd] = simplifyFraction(n, d);
      return {
        question: `${n}/${d}를 기약분수로 나타내면?`,
        choices: strChoices(`${sn}/${sd}`, [`${n / gcd}/${d}`, `${n}/${d / gcd}`, `${sn + 1}/${sd}`]),
        answer: `${sn}/${sd}`,
        explanation: `GCD(${n},${d})=${gcd}, ${n}÷${gcd}=${sn}, ${d}÷${gcd}=${sd} → ${sn}/${sd}`
      };
    } else if (type === 2) {
      const d1 = getRandomInt(2, 5);
      const d2 = getRandomInt(2, 5);
      const lcm = getLCM(d1, d2);
      return {
        question: `분모가 ${d1}인 분수와 ${d2}인 분수를 통분할 때 공통 분모로 알맞은 것은?`,
        choices: generateChoices(lcm, 5),
        answer: lcm,
        explanation: `LCM(${d1},${d2}) = ${lcm}`
      };
    } else {
      const d = getRandomInt(3, 6);
      const n1 = getRandomInt(1, d - 1);
      const n2 = getRandomInt(1, d - 1);
      const bigger = Math.max(n1, n2);
      return {
        question: `${n1}/${d}와 ${n2}/${d} 중 더 큰 분수는?`,
        choices: strChoices(`${bigger}/${d}`, [`${Math.min(n1, n2)}/${d}`, `${bigger + 1}/${d}`, `1/${d}`]),
        answer: `${bigger}/${d}`,
        explanation: `분모가 같으면 분자가 클수록 커요. ${bigger} > ${Math.min(n1, n2)}`
      };
    }
  },

  'g5-m-1-5': () => { // 분수의 덧셈 뺄셈 (이분모)
    const d1 = getRandomInt(2, 4);
    const d2 = getRandomInt(2, 4);
    const lcm = getLCM(d1, d2);
    const n1 = getRandomInt(1, d1 - 1);
    const n2 = getRandomInt(1, d2 - 1);
    const isAdd = Math.random() > 0.5;
    const an1 = n1 * (lcm / d1);
    const an2 = n2 * (lcm / d2);
    const rawNum = isAdd ? an1 + an2 : Math.abs(an1 - an2);
    const [rn, rd] = simplifyFraction(rawNum, lcm);
    const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
    const op = isAdd ? '+' : '-';
    const a = isAdd ? `${n1}/${d1}` : (an1 >= an2 ? `${n1}/${d1}` : `${n2}/${d2}`);
    const b = isAdd ? `${n2}/${d2}` : (an1 >= an2 ? `${n2}/${d2}` : `${n1}/${d1}`);
    return {
      question: `${a} ${op} ${b} = ?`,
      choices: strChoices(ans, [`${rawNum + 1}/${rd}`, `${rawNum - 1 < 0 ? 1 : rawNum - 1}/${rd}`, `${rawNum}/${lcm + 1}`]),
      answer: ans,
      explanation: `공통분모 ${lcm}으로 통분 후 계산 → ${ans}`
    };
  },

  'g5-m-1-6': () => { // 다각형의 둘레와 넓이
    const type = getRandomInt(1, 4);
    if (type === 1) {
      const w = getRandomInt(3, 12);
      const h = getRandomInt(3, 12);
      const ans = w * h;
      return { question: `가로 ${w}cm, 세로 ${h}cm인 직사각형의 넓이는?`, choices: generateChoices(ans, 15), answer: ans, explanation: `넓이 = 가로 × 세로 = ${w} × ${h} = ${ans}cm²` };
    } else if (type === 2) {
      const s = getRandomInt(3, 10);
      const ans = s * s;
      return { question: `한 변이 ${s}cm인 정사각형의 넓이는?`, choices: generateChoices(ans, 15), answer: ans, explanation: `넓이 = 변 × 변 = ${s} × ${s} = ${ans}cm²` };
    } else if (type === 3) {
      const b = getRandomInt(4, 12);
      const h = getRandomInt(3, 10);
      const ans = b * h / 2;
      return { question: `밑변 ${b}cm, 높이 ${h}cm인 삼각형의 넓이는?`, choices: generateChoices(ans, 10), answer: ans, explanation: `넓이 = 밑변 × 높이 ÷ 2 = ${b} × ${h} ÷ 2 = ${ans}cm²` };
    } else {
      const w = getRandomInt(3, 10);
      const h = getRandomInt(3, 10);
      const ans = (w + h) * 2;
      return { question: `가로 ${w}cm, 세로 ${h}cm인 직사각형의 둘레는?`, choices: generateChoices(ans, 8), answer: ans, explanation: `둘레 = (가로+세로) × 2 = (${w}+${h}) × 2 = ${ans}cm` };
    }
  },

  // ══════════════════════════════════════════
  // 5학년 2학기
  // ══════════════════════════════════════════

  'g5-m-2-1': () => { // 수의 범위와 어림하기
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const n = getRandomInt(10, 90);
      const rounded = Math.round(n / 10) * 10;
      return {
        question: `${n}을 십의 자리에서 반올림하면?`,
        choices: generateChoices(rounded, 10),
        answer: rounded,
        explanation: `${n}의 일의 자리가 ${n % 10} → ${n % 10 >= 5 ? '올림' : '내림'} → ${rounded}`
      };
    } else if (type === 2) {
      const n = getRandomInt(15, 95);
      return {
        question: `${n} 이상인 수 중 가장 작은 자연수는?`,
        choices: generateChoices(n, 3),
        answer: n,
        explanation: `이상은 같거나 큰 수. 가장 작은 것은 ${n} 자신이에요.`
      };
    } else {
      const n = getRandomInt(15, 95);
      return {
        question: `${n} 미만인 수 중 가장 큰 자연수는?`,
        choices: generateChoices(n - 1, 3),
        answer: n - 1,
        explanation: `미만은 ${n}보다 작은 수. 가장 큰 것은 ${n - 1}이에요.`
      };
    }
  },

  'g5-m-2-2': () => { // 분수의 곱셈
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const n = getRandomInt(1, 4);
      const d = getRandomInt(2, 6);
      const w = getRandomInt(2, 5);
      const [rn, rd] = simplifyFraction(n * w, d);
      const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
      return {
        question: `${n}/${d} × ${w} = ?`,
        choices: strChoices(ans, [`${n * w + 1}/${d}`, `${n}/${d * w}`, `${n * w}/${d + 1}`]),
        answer: ans,
        explanation: `분자에 자연수를 곱해요: ${n}×${w}/${d} = ${n * w}/${d} = ${ans}`
      };
    } else {
      const n1 = getRandomInt(1, 3);
      const d1 = getRandomInt(2, 5);
      const n2 = getRandomInt(1, 3);
      const d2 = getRandomInt(2, 5);
      const [rn, rd] = simplifyFraction(n1 * n2, d1 * d2);
      const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
      return {
        question: `${n1}/${d1} × ${n2}/${d2} = ?`,
        choices: strChoices(ans, [`${n1 + n2}/${d1 + d2}`, `${n1 * n2 + 1}/${d1 * d2}`, `${n1}/${d1 * d2}`]),
        answer: ans,
        explanation: `분자끼리, 분모끼리 곱해요: ${n1 * n2}/${d1 * d2} = ${ans}`
      };
    }
  },

  'g5-m-2-3': () => { // 합동과 대칭
    const items = [
      { q: '두 도형의 모양과 크기가 완전히 같을 때?', a: '합동', w: ['닮음', '대칭', '평행'] },
      { q: '한 직선을 기준으로 접었을 때 완전히 겹치는 도형은?', a: '선대칭도형', w: ['점대칭도형', '합동도형', '닮음도형'] },
      { q: '한 점을 중심으로 180° 돌렸을 때 완전히 겹치는 도형은?', a: '점대칭도형', w: ['선대칭도형', '합동도형', '닮음도형'] },
      { q: '합동인 두 삼각형에서 대응변의 길이는?', a: '같다', w: ['다르다', '2배', '절반'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g5-m-2-4': () => { // 소수의 곱셈
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const a = (getRandomInt(11, 59) / 10).toFixed(1);
      const b = getRandomInt(2, 5);
      const ans = (parseFloat(a) * b).toFixed(1);
      return {
        question: `${a} × ${b} = ?`,
        choices: [ans, (parseFloat(ans) + 0.1).toFixed(1), (parseFloat(ans) - 0.1).toFixed(1), (parseFloat(ans) + 1.0).toFixed(1)].sort(() => Math.random() - 0.5),
        answer: ans,
        explanation: `${a} × ${b} = ${ans}`
      };
    } else {
      const a = (getRandomInt(11, 40) / 10).toFixed(1);
      const b = (getRandomInt(11, 40) / 10).toFixed(1);
      const ans = (parseFloat(a) * parseFloat(b)).toFixed(2);
      return {
        question: `${a} × ${b} = ?`,
        choices: [ans, (parseFloat(ans) + 0.1).toFixed(2), (parseFloat(ans) - 0.1).toFixed(2), (parseFloat(ans) + 1.0).toFixed(2)].sort(() => Math.random() - 0.5),
        answer: ans,
        explanation: `${a} × ${b} = ${ans}`
      };
    }
  },

  'g5-m-2-5': () => { // 직육면체
    const items = [
      { q: '직육면체의 면의 수는?', a: '6', w: ['4', '8', '12'] },
      { q: '직육면체의 꼭짓점의 수는?', a: '8', w: ['6', '10', '12'] },
      { q: '직육면체의 모서리의 수는?', a: '12', w: ['8', '6', '10'] },
      { q: '정육면체의 모든 면의 모양은?', a: '정사각형', w: ['직사각형', '삼각형', '원'] },
      { q: '직육면체를 펼쳐 놓은 그림을 무엇이라 하나요?', a: '전개도', w: ['단면도', '평면도', '입면도'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g5-m-2-6': () => { // 평균과 가능성
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const count = getRandomInt(3, 5);
      const nums = Array.from({ length: count }, () => getRandomInt(5, 20));
      const total = nums.reduce((s, n) => s + n, 0);
      const avg = total / count;
      if (Number.isInteger(avg)) {
        return {
          question: `${nums.join(', ')}의 평균은?`,
          choices: generateChoices(avg, 5),
          answer: avg,
          explanation: `합계: ${total} ÷ 개수: ${count} = ${avg}`
        };
      } else {
        return {
          question: `${nums.join(', ')}의 합계는?`,
          choices: generateChoices(total, 8),
          answer: total,
          explanation: `${nums.join(' + ')} = ${total}`
        };
      }
    } else {
      const items = [
        { q: '동전을 던질 때 앞면이 나올 가능성은?', a: '반반', w: ['확실하다', '불가능하다', '거의 없다'] },
        { q: '주사위를 던질 때 7이 나올 가능성은?', a: '불가능하다', w: ['확실하다', '반반', '높다'] },
        { q: '해가 동쪽에서 뜰 가능성은?', a: '확실하다', w: ['반반', '불가능하다', '낮다'] },
      ];
      const item = items[getRandomInt(0, items.length - 1)];
      return {
        question: item.q,
        choices: strChoices(item.a, item.w),
        answer: item.a,
        explanation: `정답은 "${item.a}"이에요.`
      };
    }
  },

  // ══════════════════════════════════════════
  // 6학년 1학기
  // ══════════════════════════════════════════

  'g6-m-1-1': () => { // 분수의 나눗셈 (분수 ÷ 자연수)
    const n = getRandomInt(2, 8);
    const d = getRandomInt(2, 6);
    const w = getRandomInt(2, 4);
    const [rn, rd] = simplifyFraction(n, d * w);
    const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
    return {
      question: `${n}/${d} ÷ ${w} = ?`,
      choices: strChoices(ans, [`${n * w}/${d}`, `${n}/${d + w}`, `${rn + 1}/${rd}`]),
      answer: ans,
      explanation: `분자를 ${w}로 나누거나 분모에 ${w}를 곱해요: ${n}/${d * w} = ${ans}`
    };
  },

  'g6-m-1-2': () => { // 각기둥과 각뿔
    const n = getRandomInt(3, 6);
    const names = { 3: '삼각', 4: '사각', 5: '오각', 6: '육각' };
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const faces = n + 2;
      return {
        question: `${names[n]}기둥의 면의 수는?`,
        choices: generateChoices(faces, 2),
        answer: faces,
        explanation: `밑면 2개 + 옆면 ${n}개 = ${faces}개`
      };
    } else if (type === 2) {
      const pyramidFaces = n + 1;
      return {
        question: `${names[n]}뿔의 면의 수는?`,
        choices: generateChoices(pyramidFaces, 2),
        answer: pyramidFaces,
        explanation: `밑면 1개 + 옆면 ${n}개 = ${pyramidFaces}개`
      };
    } else {
      const edges = n * 3;
      return {
        question: `${names[n]}기둥의 모서리의 수는?`,
        choices: generateChoices(edges, 3),
        answer: edges,
        explanation: `${n}각기둥의 모서리 = ${n} × 3 = ${edges}개`
      };
    }
  },

  'g6-m-1-3': () => { // 소수의 나눗셈 (소수 ÷ 자연수)
    const b = getRandomInt(2, 5);
    const q = (getRandomInt(11, 50) / 10).toFixed(1);
    const a = (parseFloat(q) * b).toFixed(1);
    return {
      question: `${a} ÷ ${b} = ?`,
      choices: [q, (parseFloat(q) + 0.1).toFixed(1), (parseFloat(q) - 0.1).toFixed(1), (parseFloat(q) + 1).toFixed(1)].sort(() => Math.random() - 0.5),
      answer: q,
      explanation: `${a} ÷ ${b} = ${q}`
    };
  },

  'g6-m-1-4': () => { // 비와 비율
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const a = getRandomInt(2, 8);
      const b = getRandomInt(2, 8);
      return {
        question: `${a} : ${b}에서 기준량은?`,
        choices: strChoices(String(b), [String(a), String(a + b), String(a - b < 1 ? a + 1 : a - b)]),
        answer: String(b),
        explanation: `A : B에서 기준량은 뒤의 수 B = ${b}이에요.`
      };
    } else if (type === 2) {
      const a = getRandomInt(2, 5);
      const b = getRandomInt(a + 1, 10);
      const ratio = (a / b).toFixed(2);
      return {
        question: `${a} : ${b}의 비율(소수)은?`,
        choices: [ratio, (a / b + 0.1).toFixed(2), (a / b - 0.1).toFixed(2), (b / a).toFixed(2)].sort(() => Math.random() - 0.5),
        answer: ratio,
        explanation: `비율 = 비교하는 양 ÷ 기준량 = ${a} ÷ ${b} = ${ratio}`
      };
    } else {
      const pct = getRandomInt(10, 90);
      const ratio = (pct / 100).toFixed(2);
      return {
        question: `${pct}%를 소수로 나타내면?`,
        choices: [ratio, (pct / 10).toFixed(1), (pct * 10).toString(), (pct / 1000).toFixed(3)].sort(() => Math.random() - 0.5),
        answer: ratio,
        explanation: `${pct}% = ${pct} ÷ 100 = ${ratio}`
      };
    }
  },

  'g6-m-1-5': () => { // 여러 가지 그래프 (띠·원그래프)
    const items = [
      { q: '전체에 대한 각 항목의 비율을 띠 모양으로 나타낸 그래프는?', a: '띠그래프', w: ['원그래프', '막대그래프', '꺾은선그래프'] },
      { q: '전체에 대한 각 항목의 비율을 원 모양으로 나타낸 그래프는?', a: '원그래프', w: ['띠그래프', '막대그래프', '꺾은선그래프'] },
      { q: '시간에 따른 변화를 나타내기에 가장 좋은 그래프는?', a: '꺾은선그래프', w: ['원그래프', '띠그래프', '막대그래프'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },

  'g6-m-1-6': () => { // 직육면체 부피와 겉넓이
    const l = getRandomInt(2, 6);
    const w = getRandomInt(2, 6);
    const h = getRandomInt(2, 6);
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const vol = l * w * h;
      return {
        question: `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 부피는?`,
        choices: generateChoices(vol, 20),
        answer: vol,
        explanation: `부피 = 가로 × 세로 × 높이 = ${l} × ${w} × ${h} = ${vol}cm³`
      };
    } else {
      const sa = 2 * (l * w + w * h + h * l);
      return {
        question: `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 겉넓이는?`,
        choices: generateChoices(sa, 20),
        answer: sa,
        explanation: `겉넓이 = 2×(${l}×${w} + ${w}×${h} + ${h}×${l}) = ${sa}cm²`
      };
    }
  },

  // ══════════════════════════════════════════
  // 6학년 2학기
  // ══════════════════════════════════════════

  'g6-m-2-1': () => { // 분수의 나눗셈 (분수 ÷ 분수)
    const n1 = getRandomInt(1, 3);
    const d1 = getRandomInt(2, 5);
    const n2 = getRandomInt(1, 3);
    const d2 = getRandomInt(2, 5);
    const [resN, resD] = simplifyFraction(n1 * d2, d1 * n2);
    const ans = resD === 1 ? `${resN}` : `${resN}/${resD}`;
    return {
      question: `${n1}/${d1} ÷ ${n2}/${d2} = ?`,
      choices: shuffle([ans, `${n1 * n2}/${d1 * d2}`, `${n1 + d2}/${d1 + n2}`, `${n1 * d2 + 1}/${d1 * n2}`]),
      answer: ans,
      explanation: `뒤집어서 곱해요: ${n1}/${d1} × ${d2}/${n2} = ${n1 * d2}/${d1 * n2} = ${ans}`
    };
  },

  'g6-m-2-2': () => { // 소수의 나눗셈 (소수 ÷ 소수)
    const divisor = (getRandomInt(2, 5) / 10).toFixed(1);
    const quotient = getRandomInt(2, 8);
    const dividend = (parseFloat(divisor) * quotient).toFixed(2);
    return {
      question: `${dividend} ÷ ${divisor} = ?`,
      choices: generateChoices(quotient, 3),
      answer: quotient,
      explanation: `${dividend} ÷ ${divisor} = ${quotient} (나누는 수와 나뉘는 수를 같은 배수로 곱해서 계산)`
    };
  },

  'g6-m-2-3': () => { // 공간과 입체 (쌓기나무)
    const n = getRandomInt(4, 10);
    const type = getRandomInt(1, 2);
    if (type === 1) {
      return {
        question: `쌓기나무 ${n}개로 만든 모양에서 1층에 ${Math.ceil(n / 2)}개가 있다면 2층 이상에는 몇 개일까요?`,
        choices: generateChoices(n - Math.ceil(n / 2), 3),
        answer: n - Math.ceil(n / 2),
        explanation: `전체 ${n}개 - 1층 ${Math.ceil(n / 2)}개 = ${n - Math.ceil(n / 2)}개`
      };
    } else {
      const items = [
        { q: '앞에서 본 모양을 무엇이라고 하나요?', a: '정면도', w: ['측면도', '평면도', '전개도'] },
        { q: '위에서 본 모양을 무엇이라고 하나요?', a: '평면도', w: ['정면도', '측면도', '전개도'] },
        { q: '옆에서 본 모양을 무엇이라고 하나요?', a: '측면도', w: ['정면도', '평면도', '전개도'] },
      ];
      const item = items[getRandomInt(0, items.length - 1)];
      return {
        question: item.q,
        choices: strChoices(item.a, item.w),
        answer: item.a,
        explanation: `정답은 "${item.a}"이에요.`
      };
    }
  },

  'g6-m-2-4': () => { // 비례식과 비례배분
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const a = getRandomInt(2, 6);
      const b = getRandomInt(2, 6);
      const c = getRandomInt(2, 6);
      const d = (b * c) / a;
      if (Number.isInteger(d)) {
        return {
          question: `${a} : ${b} = ${c} : □ 에서 □는?`,
          choices: generateChoices(d, 4),
          answer: d,
          explanation: `내항의 곱 = 외항의 곱: ${b} × ${c} = ${a} × □ → □ = ${d}`
        };
      }
    }
    // fallback: 비례배분
    const total = getRandomInt(20, 60);
    const r1 = getRandomInt(1, 4);
    const r2 = getRandomInt(1, 4);
    const sum = r1 + r2;
    const part1 = Math.round(total * r1 / sum);
    return {
      question: `${total}을 ${r1} : ${r2}로 비례배분할 때 첫 번째 몫은?`,
      choices: generateChoices(part1, 5),
      answer: part1,
      explanation: `${total} × ${r1}/${sum} = ${part1}`
    };
  },

  'g6-m-2-5': () => { // 원의 넓이
    const r = getRandomInt(2, 7);
    const pi = 3.14;
    const type = getRandomInt(1, 2);
    if (type === 1) {
      const area = Math.round(pi * r * r * 100) / 100;
      return {
        question: `반지름 ${r}cm인 원의 넓이는? (π=3.14)`,
        choices: [area, Math.round(pi * r * 2 * 100) / 100, Math.round(pi * r * r * r * 100) / 100, area + 1].sort(() => Math.random() - 0.5).map(v => Math.round(v * 100) / 100),
        answer: area,
        explanation: `넓이 = π × 반지름² = 3.14 × ${r}² = ${area}cm²`
      };
    } else {
      const circ = Math.round(2 * pi * r * 100) / 100;
      return {
        question: `반지름 ${r}cm인 원의 원주는? (π=3.14)`,
        choices: [circ, Math.round(pi * r * r * 100) / 100, Math.round(pi * r * 100) / 100, circ + 1].sort(() => Math.random() - 0.5).map(v => Math.round(v * 100) / 100),
        answer: circ,
        explanation: `원주 = 2 × π × 반지름 = 2 × 3.14 × ${r} = ${circ}cm`
      };
    }
  },

  'g6-m-2-6': () => { // 원기둥, 원뿔, 구
    const items = [
      { q: '위아래 두 밑면이 서로 평행하고 합동인 원인 입체도형은?', a: '원기둥', w: ['원뿔', '구', '각기둥'] },
      { q: '꼭짓점이 한 개이고 밑면이 원인 입체도형은?', a: '원뿔', w: ['원기둥', '구', '각뿔'] },
      { q: '어느 방향으로 잘라도 단면이 원인 입체도형은?', a: '구', w: ['원기둥', '원뿔', '정육면체'] },
      { q: '원기둥의 옆면을 펼치면 어떤 모양이 되나요?', a: '직사각형', w: ['원', '삼각형', '사다리꼴'] },
      { q: '원뿔의 꼭짓점에서 밑면의 둘레까지의 거리는?', a: '모선', w: ['높이', '지름', '반지름'] },
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    return {
      question: item.q,
      choices: strChoices(item.a, item.w),
      answer: item.a,
      explanation: `정답은 "${item.a}"이에요.`
    };
  },
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
