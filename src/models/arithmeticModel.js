function calculateAnswer(operation, left, right) {
  if (operation === 'addition') {
    return left + right;
  }

  if (operation === 'subtraction') {
    return left - right;
  }

  throw new Error(`Unsupported arithmetic operation: ${operation}`);
}

function buildDistractors(answer, minValue, maxValue, targetCount = 3) {
  const candidates = [
    answer - 1,
    answer + 1,
    answer - 2,
    answer + 2,
    answer - 3,
    answer + 3,
    answer - 5,
    answer + 5,
    answer - 10,
    answer + 10,
  ];
  const distractors = [];

  for (const candidate of candidates) {
    if (candidate < minValue || candidate > maxValue) {
      continue;
    }

    if (candidate === answer || distractors.includes(candidate)) {
      continue;
    }

    distractors.push(candidate);

    if (distractors.length >= targetCount) {
      return distractors;
    }
  }

  for (let candidate = minValue; candidate <= maxValue; candidate += 1) {
    if (candidate === answer || distractors.includes(candidate)) {
      continue;
    }

    distractors.push(candidate);

    if (distractors.length >= targetCount) {
      return distractors;
    }
  }

  return distractors;
}

export function buildArithmeticQuestion({
  operation,
  left,
  right,
  minChoice = 0,
  maxChoice = 20,
}) {
  const answer = calculateAnswer(operation, left, right);
  const symbol = operation === 'addition' ? '+' : '-';
  const title = `${left} ${symbol} ${right}`;
  const distractors = buildDistractors(answer, minChoice, maxChoice);

  return {
    id: `${operation}-${left}-${right}`,
    type: 'multiple-choice',
    question: `${title} = ?`,
    choices: [answer, ...distractors],
    answer,
    hints:
      operation === 'addition'
        ? [`${left}에 ${right}를 더해보세요.`, `${title} = ${answer}`]
        : [`${left}에서 ${right}를 빼보세요.`, `${title} = ${answer}`],
    visual: {
      type: 'equation-card',
      category: operation,
      expression: title,
      label: operation === 'addition' ? '덧셈 카드' : '뺄셈 카드',
      guide:
        operation === 'addition'
          ? '두 수를 합치면 얼마가 되는지 떠올려보세요.'
          : '앞 수에서 뒤 수만큼 빼면 얼마가 남는지 생각해보세요.',
    },
  };
}

export function buildArithmeticQuestionBank({
  operation,
  minLeft = 1,
  maxLeft = 10,
  minRight = 1,
  maxRight = 10,
  minAnswer = 0,
  maxAnswer = 20,
}) {
  const questions = [];

  for (let left = minLeft; left <= maxLeft; left += 1) {
    for (let right = minRight; right <= maxRight; right += 1) {
      const answer = calculateAnswer(operation, left, right);

      if (answer < minAnswer || answer > maxAnswer) {
        continue;
      }

      questions.push(
        buildArithmeticQuestion({
          operation,
          left,
          right,
          minChoice: minAnswer,
          maxChoice: maxAnswer,
        }),
      );
    }
  }

  return questions;
}
