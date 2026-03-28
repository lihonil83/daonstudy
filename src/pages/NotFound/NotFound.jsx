import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const quickLinks = [
  { to: '/', label: '홈으로 가기' },
  { to: '/math', label: '수학 단원 보기' },
  { to: '/english', label: '영어 단원 보기' },
];

export default function NotFound() {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>경로 안내</p>
      <h2 className={styles.title}>이 화면은 아직 준비되지 않았어요</h2>
      <p className={styles.description}>
        주소가 잘못되었거나 아직 연결되지 않은 화면일 수 있어요. 아래에서 학습 공간으로 바로 이동할 수
        있어요.
      </p>

      <div className={styles.actions}>
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className={styles.linkButton}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
