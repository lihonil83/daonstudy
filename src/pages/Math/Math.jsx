import { Link, useParams } from 'react-router-dom';
import QuizSession from '../../components/Quiz/QuizSession';
import { MATH_UNITS } from '../../data/unitRegistry';
import styles from './Math.module.css';

export default function Math() {
  const { unitId } = useParams();
  const units = Object.values(MATH_UNITS);

  if (unitId) {
    const unit = MATH_UNITS[unitId];

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.mathTag}`}>수학 단원</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <p className={styles.copy}>
              아직 등록되지 않은 수학 단원 경로예요. 아래 목록에 있는 단원으로 다시 들어가면
              바로 이어서 학습할 수 있어요.
            </p>
            <Link className={styles.linkButton} to="/math">
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
            <span className={`${styles.tag} ${styles.mathTag}`}>수학 단원</span>
            <h2 className={styles.title}>{unit.title}</h2>
            <p className={styles.copy}>
              {unit.description} 지금은 잠겨 있지만, 학습 길이 보이도록 자리를 먼저 만들어
              두었습니다.
            </p>
            <Link className={styles.linkButton} to="/math">
              단원 목록으로 돌아가기
            </Link>
          </div>
        </section>
      );
    }

    return <QuizSession unit={unit} accent="math" backTo="/math" />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <span className={`${styles.tag} ${styles.mathTag}`}>수학</span>
        <h2 className={styles.title}>수학 단원을 골라보세요</h2>
        <p className={styles.copy}>
          구구단, 시계 읽기, 길이·무게 단위, 덧셈·뺄셈 단원 가운데 오늘 풀고 싶은 문제부터
          시작해보세요. 아직 안 푼 단원과 이미 해본 단원이 함께 보여서 다음 걸음도 고르기 쉽습니다.
        </p>
        <div className={styles.unitList}>
          {units.map((unit) =>
            unit.available ? (
              <Link key={unit.id} to={`/math/${unit.id}`} className={styles.unitCard}>
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
      </div>
    </section>
  );
}
