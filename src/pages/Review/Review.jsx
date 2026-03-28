import { useEffect, useMemo, useRef, useState } from 'react';
import QuizSession from '../../components/Quiz/QuizSession';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import { splitWrongAnswers } from '../../models/wrongAnswerModel';
import styles from './Review.module.css';

function buildReviewQuestions(items) {
  return items.map((item) => ({
    id: item.originalQuestionId,
    originalQuestionId: item.originalQuestionId,
    wrongId: item.id,
    subject: item.subject,
    unit: item.unit,
    unitTitle: item.unitTitle,
    question: item.question,
    choices: item.choices,
    answer: item.correctAnswer,
    hints: item.hints,
    visual: item.visual ?? null,
  }));
}

export default function Review({
  overrideWrongAnswers = null,
  autoStartAll = false,
  persistReviewResult = true,
  reviewAutomation,
  onReviewComplete,
}) {
  const wrongAnswerStore = useWrongAnswers();
  const hasAutoStartedRef = useRef(false);
  const overrideLists = useMemo(
    () => (overrideWrongAnswers ? splitWrongAnswers(overrideWrongAnswers) : null),
    [overrideWrongAnswers],
  );
  const clearReviewed = overrideLists ? () => {} : wrongAnswerStore.clearReviewed;
  const reviewedList = overrideLists?.reviewedList ?? wrongAnswerStore.reviewedList;
  const unreviewedList = overrideLists?.unreviewedList ?? wrongAnswerStore.unreviewedList;
  const unreviewedCount = overrideLists?.unreviewedList.length ?? wrongAnswerStore.unreviewedCount;
  const [activeReviewIds, setActiveReviewIds] = useState([]);
  const activeReviewItems = useMemo(
    () => unreviewedList.filter((item) => activeReviewIds.includes(item.id)),
    [activeReviewIds, unreviewedList],
  );
  const activeReviewQuestions = useMemo(
    () => buildReviewQuestions(activeReviewItems),
    [activeReviewItems],
  );

  useEffect(() => {
    if (!autoStartAll || hasAutoStartedRef.current || unreviewedList.length === 0) {
      return;
    }

    hasAutoStartedRef.current = true;
    setActiveReviewIds(unreviewedList.map((item) => item.id));
  }, [autoStartAll, unreviewedList]);

  if (activeReviewQuestions.length > 0) {
    return (
      <section className={styles.page}>
        <QuizSession
          unit={{
            id: 'wrong-review',
            title: '📖 오답 복습',
            subject: 'review',
            data: { questions: activeReviewQuestions },
          }}
          accent="review"
          backTo="/review"
          mode="review"
          quizOptions={{
            questions: activeReviewQuestions,
            questionCount: activeReviewQuestions.length,
            completionBonus: 30,
            perfectBonus: 0,
          }}
          automation={reviewAutomation}
          persistResult={persistReviewResult}
          onComplete={onReviewComplete}
          onRequestBack={() => setActiveReviewIds([])}
        />
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <span className={styles.tag}>복습</span>
        <h2 className={styles.title}>오답 노트</h2>
        <p className={styles.copy}>
          틀린 문제는 나쁜 게 아니라 다시 배울 기회예요. 부담 없이 하나씩 다시 풀어보면
          복습 XP도 받을 수 있어요.
        </p>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <strong>미복습 {unreviewedCount}개</strong>
            <span>아직 다시 보지 않은 문제예요.</span>
          </div>
          <div className={styles.summaryCard}>
            <strong>복습 완료 {reviewedList.length}개</strong>
            <span>맞혀서 정리된 문제는 아래에 모아둘게요.</span>
          </div>
        </div>

        {unreviewedList.length > 0 ? (
          <>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>미복습 문제</h3>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setActiveReviewIds(unreviewedList.map((item) => item.id))}
              >
                전체 복습 시작 ({unreviewedList.length}문제)
              </button>
            </div>
            <div className={styles.list}>
              {unreviewedList.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemTop}>
                    <div>
                      <strong>{item.question}</strong>
                      <span className={styles.itemMeta}>
                        {item.subject === 'math' ? '🔢 수학' : '🔤 영어'} · {item.unitTitle} · {item.date}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setActiveReviewIds([item.id])}
                    >
                      복습
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            ✨ 미복습 문제가 없어요. 지금까지 나온 문제는 잘 정리되고 있어요.
          </div>
        )}

        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>복습 완료</h3>
          {reviewedList.length > 0 ? (
            <button type="button" className={styles.ghostButton} onClick={clearReviewed}>
              완료 기록 비우기
            </button>
          ) : null}
        </div>
        {reviewedList.length > 0 ? (
          <div className={styles.list}>
            {reviewedList.map((item) => (
              <div key={item.id} className={`${styles.item} ${styles.itemDone}`}>
                <div className={styles.itemTop}>
                  <div>
                    <strong>{item.question}</strong>
                    <span className={styles.itemMeta}>
                      {item.subject === 'math' ? '🔢 수학' : '🔤 영어'} · {item.unitTitle} · {item.reviewedDate}
                    </span>
                  </div>
                  <span className={styles.doneBadge}>✅ 정답</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>아직 복습을 완료한 문제는 없어요.</div>
        )}
      </div>
    </section>
  );
}
