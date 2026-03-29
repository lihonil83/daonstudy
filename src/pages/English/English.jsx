import { Link, useParams } from 'react-router-dom';
import QuizSession from '../../components/Quiz/QuizSession';
import { ENGLISH_UNITS } from '../../data/unitRegistry';
import { useProgress } from '../../hooks/useProgress';
import styles from './English.module.css';

export default function English() {
  const { unitId } = useParams();
  const { suggestedUnits } = useProgress();
  const englishSuggested = suggestedUnits.filter(u => u.subject === 'english');
  const units = Object.values(ENGLISH_UNITS);

  if (unitId) {
    const unit = ENGLISH_UNITS[unitId] || englishSuggested.find(u => u.id === unitId);

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>영어 단원</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <p className={styles.copy}>
              아직 등록되지 않은 영어 단원 경로예요. 아래 목록에 있는 단원으로 다시 들어가면
              바로 이어서 학습할 수 있어요.
            </p>
            <Link className={styles.linkButton} to="/english">
              단원 목록으로 돌아가기
            </Link>
          </div>
        </section>
      );
    }

    if (!unit.available) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>영어 단원</span>
            <h2 className={styles.title}>{unit.title}</h2>
            <p className={styles.copy}>
              {unit.description} 지금은 잠겨 있지만, 학습 순서가 보이도록 자리를 먼저 만들어
              두었습니다.
            </p>
            <Link className={styles.linkButton} to="/english">
              단원 목록으로 돌아가기
            </Link>
          </div>
        </section>
      );
    }

    return <QuizSession unit={unit} accent="english" backTo="/english" />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <span className={`${styles.tag} ${styles.englishTag}`}>영어</span>
        <h2 className={styles.title}>영어 단원을 골라보세요</h2>
        <p className={styles.copy}>
          알파벳, 기초 단어, 파닉스 A·B·C 단원 가운데 오늘 듣고 보고 싶은 문제부터 골라보세요.
          이미 해본 단원과 다음에 열어볼 단원이 함께 보여서 이어서 공부하기 편합니다.
        </p>
        <div className={styles.unitList}>
          {units.map((unit) =>
            unit.available ? (
              <Link key={unit.id} to={`/english/${unit.id}`} className={styles.unitCard}>
                <div className={styles.unitMeta}>
                  <strong>{unit.title}</strong>
                  <span className={styles.tag}>시작 가능</span>
                </div>
                <span className={styles.unitNote}>{unit.description}</span>
              </Link>
            ) : (
              <div
                key={unit.id}
                className={`${styles.unitCard} ${styles.unitCardDisabled}`}
                aria-disabled="true"
              >
                <div className={styles.unitMeta}>
                  <strong>{unit.title}</strong>
                  <span className={styles.tag}>잠김</span>
                </div>
                <span className={styles.unitNote}>{unit.description}</span>
              </div>
            ),
          )}
        </div>

        {englishSuggested.length > 0 ? (
          <>
            <h3 className={styles.sectionTitle}>✨ 특별 챌린지 (생성형)</h3>
            <div className={styles.unitList}>
              {englishSuggested.map((unit) => (
                <Link key={unit.id} to={`/english/${unit.id}`} className={`${styles.unitCard} ${styles.dynamicCard}`}>
                  <div className={styles.unitMeta}>
                    <strong>{unit.title}</strong>
                    <span className={styles.tag}>새로운 도전</span>
                  </div>
                  <span className={styles.unitNote}>{unit.description}</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
