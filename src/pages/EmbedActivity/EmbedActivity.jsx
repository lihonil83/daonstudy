import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmbedActivity.module.css';

/**
 * PhET 시뮬레이션 등 외부 콘텐츠를 iframe으로 임베드하는 페이지입니다.
 * sessionStorage에서 url, title 정보를 읽어옵니다.
 */
export default function EmbedActivity() {
  const navigate = useNavigate();

  const activityData = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('embedActivityData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!activityData) navigate('/roadmap');
  }, [activityData, navigate]);

  if (!activityData) return null;

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate('/roadmap')}
        >
          ← 로드맵으로
        </button>
        <div className={styles.titleArea}>
          <span className={styles.provider}>{activityData.providerLabel}</span>
          <h2 className={styles.title}>{activityData.title}</h2>
        </div>
        <a
          href={activityData.url}
          target="_blank"
          rel="noreferrer"
          className={styles.openBtn}
        >
          새 탭에서 열기 ↗
        </a>
      </div>

      <div className={styles.frame}>
        <iframe
          src={activityData.url}
          title={activityData.title}
          className={styles.iframe}
          allowFullScreen
        />
      </div>
    </section>
  );
}
