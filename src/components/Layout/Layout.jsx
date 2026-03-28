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
          <p className={styles.eyebrow}>Daon Study</p>
          <h1 className={styles.title}>다온 학습 놀이터</h1>
          <p className={styles.subtitle}>
            오늘의 퀴즈, 복습, 기록을 한곳에서 이어갈 수 있는 우리 학습 홈이에요. 수학과 영어를
            오가며 차분하게 쌓아가면 됩니다.
          </p>
        </div>
        <div className={styles.statusCard}>
          <span className={styles.statusLabel}>오늘의 학습 준비</span>
          <strong className={styles.statusValue}>바로 시작할 수 있어요</strong>
          <span className={styles.statusHint}>수학, 영어, 복습, 기록이 서로 연결되어 자동으로 이어집니다</span>
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
