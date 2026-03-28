const STARTER_SEQUENCE = [
  ['math', 'addition-up-to-20'],
  ['english', 'alphabet-upper'],
  ['math', 'multiplication-2'],
  ['english', 'alphabet-lower'],
  ['math', 'clock-reading'],
  ['english', 'phonics-a'],
];

function buildUnitLookup(mathUnits, englishUnits) {
  return new Map(
    [...mathUnits, ...englishUnits].map((unit) => [
      `${unit.subject}:${unit.id}`,
      unit,
    ]),
  );
}

function getAttempts(getUnitProgress, unit) {
  return getUnitProgress(unit.subject, unit.id)?.attempts ?? 0;
}

function pickStarterUnit(getUnitProgress, mathUnits, englishUnits) {
  const unitLookup = buildUnitLookup(mathUnits, englishUnits);

  for (const [subject, unitId] of STARTER_SEQUENCE) {
    const unit = unitLookup.get(`${subject}:${unitId}`);

    if (unit?.available && getAttempts(getUnitProgress, unit) === 0) {
      return unit;
    }
  }

  return [...mathUnits, ...englishUnits].find(
    (unit) => unit.available && getAttempts(getUnitProgress, unit) === 0,
  );
}

function pickPracticeUnit(getUnitProgress, mathUnits, englishUnits) {
  return [...mathUnits, ...englishUnits]
    .filter((unit) => unit.available)
    .sort((left, right) => {
      const attemptDiff = getAttempts(getUnitProgress, left) - getAttempts(getUnitProgress, right);

      if (attemptDiff !== 0) {
        return attemptDiff;
      }

      if (left.subject !== right.subject) {
        return left.subject.localeCompare(right.subject);
      }

      return left.title.localeCompare(right.title);
    })[0] ?? null;
}

export function getRecommendedMission({
  unreviewedCount,
  totalQuizCount,
  getUnitProgress,
  mathUnits,
  englishUnits,
}) {
  if (unreviewedCount > 0) {
    return {
      badge: '복습 추천',
      title: `복습 ${unreviewedCount}문제부터 가볍게`,
      description: '틀린 문제를 다시 보면 오늘 배운 것이 더 또렷하게 남아요.',
      cta: '복습 시작하기',
      to: '/review',
    };
  }

  const starterUnit = pickStarterUnit(getUnitProgress, mathUnits, englishUnits);

  if (starterUnit && totalQuizCount === 0) {
    return {
      badge: '첫 시작 추천',
      title: `${starterUnit.title}부터 시작해요`,
      description: '처음에는 자신감이 붙는 단원부터 가볍게 시작하면 흐름이 잘 이어져요.',
      cta: '첫 퀴즈 시작하기',
      to: `/${starterUnit.subject}/${starterUnit.id}`,
    };
  }

  if (starterUnit) {
    return {
      badge: '다음 추천',
      title: `다음은 ${starterUnit.title}`,
      description: '아직 안 풀어본 단원을 하나 열어두면 학습 지도가 더 넓어져요.',
      cta: '새 단원 시작하기',
      to: `/${starterUnit.subject}/${starterUnit.id}`,
    };
  }

  const practiceUnit = pickPracticeUnit(getUnitProgress, mathUnits, englishUnits);

  if (practiceUnit) {
    return {
      badge: '다시 풀기',
      title: `${practiceUnit.title} 다시 풀어볼까요?`,
      description: '이미 해본 단원을 다시 풀면 점수와 별을 더 단단하게 만들 수 있어요.',
      cta: '다시 시작하기',
      to: `/${practiceUnit.subject}/${practiceUnit.id}`,
    };
  }

  return {
    badge: '둘러보기',
    title: '단원 목록부터 둘러봐요',
    description: '지금 시작할 수 있는 수학과 영어 단원이 준비되어 있어요.',
    cta: '단원 보러 가기',
    to: '/math',
  };
}
