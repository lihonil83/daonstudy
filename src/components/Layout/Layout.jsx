import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const navItems = [
  { to: '/', label: '홈', icon: '홈' },
  { to: '/math', label: '수학', icon: '수' },
  { to: '/english', label: '영어', icon: '영' },
  { to: '/review', label: '복습', icon: '복' },
  { to: '/progress', label: '기록', icon: '기' },
];

export default function Layout() {
  return (
    <div className={styles.frame}>
      <div className={styles.orbMint} />
      <div className={styles.orbGold} />

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>다온스터디 2단계</p>
          <h1 className={styles.title}>다온 학습 놀이터</h1>
          <p className={styles.subtitle}>
            윈도우 로컬 브라우저와 HashRouter 환경에서 퀴즈, 복습, 보상이 함께 이어지는 현재 빌드입니다.
          </p>
        </div>
        <div className={styles.statusCard}>
          <span className={styles.statusLabel}>현재 집중 단계</span>
          <strong className={styles.statusValue}>콘텐츠 확장 + 자동 검증</strong>
          <span className={styles.statusHint}>전용 단원과 테스트 하네스가 함께 자라고 있어요</span>
        </div>
      </header>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
