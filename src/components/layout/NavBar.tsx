// src/components/layout/NavBar.tsx
// 顶部导航（阶段 4）

import { useCallback, useEffect, useId, useState } from 'react';
import styles from './NavBar.module.css';

interface NavItem {
  label: string;
  anchor: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: '初识顺德', anchor: '#intro' },
  { label: '主题路线', anchor: '#routes' },
  { label: '为我画一卷', anchor: '#draw' },
  { label: '顺德印象', anchor: '#impression' },
  { label: '关于项目', anchor: '#about' },
];

export interface NavBarProps {
  /** 当前 hero 是否已离开视口（用于切换背景） */
  scrolled?: boolean;
}

export function NavBar({ scrolled = false }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // 平滑滚动到锚点；若元素不存在则不报错
  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
      e.preventDefault();
      const id = anchor.replace(/^#/, '');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // 始终关闭移动菜单
      setOpen(false);
    },
    [],
  );

  // Esc 关闭菜单
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 锁定背景滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.inner}>
        {/* Logo */}
        <a
          href="#hero"
          className={`${styles.logo} font-calligraphy-xing`}
          onClick={(e) => handleAnchorClick(e, '#hero')}
          aria-label="回到顶部：一卷顺德"
        >
          一卷顺德
        </a>

        {/* 桌面端横向导航 */}
        <nav className={styles.desktop} aria-label="主导航">
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.anchor}>
                <a
                  href={item.anchor}
                  className={styles.link}
                  onClick={(e) => handleAnchorClick(e, item.anchor)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 手机菜单按钮 */}
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bars} ${open ? styles.barsOpen : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* 手机菜单 */}
      <div
        id={menuId}
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ''}`}
        aria-hidden={!open}
      >
        <nav aria-label="移动端导航">
          <ul className={styles.mobileList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.anchor}>
                <a
                  href={item.anchor}
                  className={styles.mobileLink}
                  onClick={(e) => handleAnchorClick(e, item.anchor)}
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}