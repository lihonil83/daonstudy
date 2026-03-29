import { useLocation, NavLink, Outlet } from 'react-router-dom';
import { useSound } from '../../hooks/useSound';
import styles from './Layout.module.css';

const navItems = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/roadmap', label: '로드맵', icon: '🗺️' },
  { to: '/review', label: '복습', icon: '📖' },
  { to: '/progress', label: '기록', icon: '📊' },
];

export default function Layout() {
  const { playClick } = useSound();
  const location = useLocation();
  // 홈 페이지일 때만 스크롤 잠금 (overflow: hidden)
  const isHome = location.pathname === '/';

  const handleGlobalClick = (e) => {
    // 버튼이나 링크(A 태그)를 클릭했을 때만 소리를 재생합니다.
    const isClickable = e.target.closest('button') || e.target.closest('a');
    if (isClickable) playClick();
  };

  return (
    <div className={styles.frame} onClick={handleGlobalClick}>
      <div className={styles.orbMint} />
      <div className={styles.orbGold} />

      {/* 상단 네비게이션 바 (헤더 제거, 탭만 표시) */}
      <nav className={styles.nav}>
        <span className={styles.navBrand}>✨ 다온</span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
          }
          style={{ marginLeft: 'auto' }}
        >
          <span className={styles.navIcon}>⚙️</span>
          <span className={styles.navLabel}>설정</span>
        </NavLink>
      </nav>

      {/* 메인 콘텐츠: 홈은 overflow hidden, 나머지는 스크롤 가능 */}
      <main className={isHome ? `${styles.main} ${styles.mainHome}` : `${styles.main} ${styles.mainScroll}`}>
        <Outlet />
      </main>
    </div>
  );
}
