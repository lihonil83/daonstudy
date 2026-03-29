import { Link, useParams } from 'react-router-dom';
import FlashcardSession from '../../components/English/FlashcardSession';
import { ENGLISH_STAGE_1, findEnglishUnit } from '../../data/englishCurriculum';
import { useProgress } from '../../hooks/useProgress';
import styles from './English.module.css';

// 단원 완료 여부 표시용
function UnitStatusTag({ unitId, getUnitProgress }) {
  const prog = getUnitProgress(unitId);
  if (!prog) return <span className={styles.tagNew}>처음 도전</span>;
  if (prog.stars === 3) return <span className={styles.tagDone}>⭐⭐⭐ 완료</span>;
  return <span className={styles.tagTried}>도전 중</span>;
}

export default function English() {
  const { unitId } = useParams();
  const { getUnitProgress } = useProgress();

  // ─── 단원 내부 학습 화면 ────────────────────────────────────────
  if (unitId) {
    const unit = findEnglishUnit(unitId);

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>영어 단원</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <p className={styles.copy}>아직 등록되지 않은 단원이에요.</p>
            <Link className={styles.linkButton} to="/english">단원 목록으로</Link>
          </div>
        </section>
      );
    }

    if (unit.type === 'coming-soon') {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>준비 중</span>
            <h2 className={styles.title}>{unit.icon} {unit.title}</h2>
            <p className={styles.copy}>{unit.description}<br />곧 열릴 예정이에요. 조금만 기다려 주세요! 🛠️</p>
            <Link className={styles.linkButton} to="/english">단원 목록으로</Link>
          </div>
        </section>
      );
    }

    // flashcard 타입 → FlashcardSession
    return <FlashcardSession unit={unit} backTo="/english" />;
  }

  // ─── 단원 목록 화면 ─────────────────────────────────────────────
  const stage = ENGLISH_STAGE_1;

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        {/* 스테이지 헤더 */}
        <div className={styles.stageHeader}>
          <span className={`${styles.tag} ${styles.englishTag}`}>{stage.icon} {stage.subtitle}</span>
          <h2 className={styles.title}>{stage.title}</h2>
          <p className={styles.copy}>
            알파벳부터 기초 단어까지 차근차근 배워요.<br />
            각 단원은 <strong>플래시카드 → 퀴즈</strong> 순서로 진행됩니다.
          </p>
        </div>

        {/* 단원 목록 */}
        <div className={styles.unitList}>
          {stage.units.map((unit) => {
            const isComingSoon = unit.type === 'coming-soon';
            const cardClass = isComingSoon
              ? `${styles.unitCard} ${styles.unitCardDisabled}`
              : styles.unitCard;

            const content = (
              <>
                <div className={styles.unitMeta}>
                  <div className={styles.unitLeft}>
                    <span className={styles.unitIcon}>{unit.icon}</span>
                    <div>
                      <strong className={styles.unitTitle}>{unit.unit}. {unit.title}</strong>
                      <span className={styles.unitDesc}>{unit.description}</span>
                    </div>
                  </div>
                  <div className={styles.unitRight}>
                    {isComingSoon
                      ? <span className={styles.tagLocked}>🔒 준비 중</span>
                      : <UnitStatusTag unitId={unit.id} getUnitProgress={getUnitProgress} />
                    }
                    {!isComingSoon && (
                      <span className={styles.unitCount}>{unit.cards.length}장</span>
                    )}
                  </div>
                </div>
              </>
            );

            return isComingSoon ? (
              <div key={unit.id} className={cardClass} aria-disabled="true">
                {content}
              </div>
            ) : (
              <Link key={unit.id} to={`/english/${unit.id}`} className={cardClass}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
