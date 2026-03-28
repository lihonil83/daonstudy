import { Link } from 'react-router-dom';
import { ENGLISH_UNITS, MATH_UNITS } from '../../data/unitRegistry';
import { useProgress } from '../../hooks/useProgress';
import styles from './Progress.module.css';

const subjectSections = [
  { key: 'math', title: '수학', icon: '🔢', path: '/math', units: Object.values(MATH_UNITS) },
  { key: 'english', title: '영어', icon: '🔤', path: '/english', units: Object.values(ENGLISH_UNITS) },
];

function formatShortDate(dateString) {
  const [, month, day] = dateString.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function formatStars(stars) {
  return stars > 0 ? '⭐'.repeat(stars) : '도전 완료';
}

function getUnitState(unit, unitProgress) {
  if (unitProgress.attempts > 0) return 'played';
  if (unit.available) return 'ready';
  return 'locked';
}

function getUnitStateLabel(unit, unitProgress) {
  const state = getUnitState(unit, unitProgress);

  if (state === 'played') {
    return formatStars(unitProgress.bestStars);
  }

  if (state === 'ready') {
    return '바로 시작 가능';
  }

  return '준비 중';
}

export default function Progress() {
  const { currentStreak, getUnitProgress, recentScores, totalQuizCount, totalStudyDays } = useProgress();

  const stats = [
    {
      label: '공부한 날',
      value: `${totalStudyDays}일`,
      note: totalStudyDays === 0 ? '첫 퀴즈를 풀면 여기부터 차곡차곡 쌓여요.' : '기록이 남은 날짜만 세고 있어요.',
    },
    {
      label: '현재 연속 기록',
      value: currentStreak === 0 ? '0일' : `${currentStreak}일`,
      note: currentStreak === 0 ? '오늘 가볍게 한 번 시작해볼까요?' : `🔥 ${currentStreak}일째 이어가고 있어요.`,
    },
    {
      label: '푼 퀴즈 수',
      value: `${totalQuizCount}회`,
      note: totalQuizCount === 0 ? '아직 첫 기록이 없어요.' : '퀴즈를 끝까지 마치면 자동으로 더해집니다.',
    },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <span className={styles.tag}>기록</span>
        <h2 className={styles.title}>나의 학습 기록</h2>
        <p className={styles.copy}>
          퀴즈를 끝까지 풀면 점수와 진도가 자동으로 저장됩니다. 잘된 점을 중심으로 차분하게
          쌓이는 기록판이에요.
        </p>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.card}>
              <span className={styles.cardLabel}>{stat.label}</span>
              <strong className={styles.cardValue}>{stat.value}</strong>
              <span className={styles.cardNote}>{stat.note}</span>
            </div>
          ))}
        </div>

        <div className={styles.sectionGrid}>
          {subjectSections.map((section) => (
            <section key={section.key} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionKicker}>
                    {section.icon} {section.title}
                  </p>
                  <h3 className={styles.sectionTitle}>{section.title} 단원 진도</h3>
                </div>
                <div className={styles.sectionMeta}>
                  <span className={styles.summaryPill}>
                    시작 가능 {section.units.filter((unit) => unit.available).length}개
                  </span>
                  <span className={styles.summaryPill}>
                    새 단원 {section.units.filter((unit) => unit.available && getUnitProgress(section.key, unit.id).attempts === 0).length}개
                  </span>
                </div>
              </div>
              <div className={styles.unitList}>
                {section.units.map((unit) => {
                  const unitProgress = getUnitProgress(section.key, unit.id);
                  const hasAttempt = unitProgress.attempts > 0;
                  const unitState = getUnitState(unit, unitProgress);
                  const unitRowClassName = [
                    styles.unitRow,
                    unitState === 'ready' ? styles.unitRowReady : '',
                    unitState === 'locked' ? styles.unitRowLocked : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  const unitStatusClassName = [
                    styles.unitStatus,
                    unitState === 'played' ? styles.unitStatusPlayed : '',
                    unitState === 'ready' ? styles.unitStatusReady : '',
                    unitState === 'locked' ? styles.unitStatusLocked : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div key={unit.id} className={unitRowClassName}>
                      <div className={styles.unitTop}>
                        <strong>{unit.title}</strong>
                        <span className={unitStatusClassName}>
                          {getUnitStateLabel(unit, unitProgress)}
                        </span>
                      </div>
                      <p className={styles.unitDescription}>{unit.description}</p>
                      <div className={styles.unitMeta}>
                        <span>
                          {hasAttempt
                            ? `최고 점수 ${unitProgress.bestScore}점 · ${unitProgress.attempts}회 도전`
                            : unit.available
                              ? '첫 도전을 기다리고 있어요.'
                              : '다음 단계에서 열릴 예정이에요.'}
                        </span>
                        {unitProgress.firstClear ? (
                          <span>첫 기록 {formatShortDate(unitProgress.firstClear)}</span>
                        ) : null}
                      </div>
                      <div className={styles.unitActions}>
                        {unit.available ? (
                          <Link className={styles.unitAction} to={`${section.path}/${unit.id}`}>
                            {hasAttempt ? '다시 풀기' : '바로 시작하기'}
                          </Link>
                        ) : (
                          <span className={`${styles.unitAction} ${styles.unitActionDisabled}`}>
                            준비 중
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>📝 최근 기록</p>
              <h3 className={styles.sectionTitle}>최근 퀴즈 기록</h3>
            </div>
          </div>
          {recentScores.length > 0 ? (
            <div className={styles.recentList}>
              {recentScores.map((entry) => (
                <div key={entry.id} className={styles.recentRow}>
                  <div className={styles.recentMain}>
                    <strong>{formatShortDate(entry.date)}</strong>
                    <span>{entry.unitTitle}</span>
                  </div>
                  <div className={styles.recentMeta}>
                    <span>
                      {entry.score}/{entry.total}
                    </span>
                    <span>{formatStars(entry.stars)}</span>
                    {entry.improved ? (
                      <span className={styles.recentBadge}>📈 실력이 늘고 있어요</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              첫 퀴즈를 풀면 최근 기록이 여기부터 차곡차곡 쌓여요.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
