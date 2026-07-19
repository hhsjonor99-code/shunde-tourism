// src/components/ui/ScrollReveal.tsx
// 滚动进入渐显组件（IntersectionObserver）

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './ScrollReveal.module.css';

export type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface ScrollRevealProps {
  children: ReactNode;
  /** 延迟（ms），默认 0 */
  delay?: number;
  /** 时长（ms），默认 600 */
  duration?: number;
  /** 触发阈值，0-1，默认 0.15 */
  threshold?: number;
  /** 是否只触发一次（默认 true） */
  once?: boolean;
  /** 进入方向 */
  direction?: ScrollRevealDirection;
  className?: string;
  style?: CSSProperties;
  /** 自定义容器元素类型，默认 div */
  as?: keyof React.JSX.IntrinsicElements;
}

const DIRECTION_OFFSET: Record<Exclude<ScrollRevealDirection, 'none'>, string> =
  {
    up: '0, 20px',
    down: '0, -20px',
    left: '20px, 0',
    right: '-20px, 0',
  };

export function ScrollReveal({
  children,
  delay = 0,
  duration = 600,
  threshold = 0.15,
  once = true,
  direction = 'up',
  className,
  style,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 检测 prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver：不可用时直接显示内容
  // 兜底：1.5s 后仍未触发则强制显示（避免 IntersectionObserver 不稳定或元素不在视口时永久隐藏）
  useEffect(() => {
    if (reducedMotion) {
      // 减少动效：直接显示
      setVisible(true);
      return;
    }
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // 兜底 timeout：避免永久隐藏
    const fallback = window.setTimeout(() => {
      setVisible((v) => v || true);
    }, 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
            window.clearTimeout(fallback);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold, once, reducedMotion]);

  const offset =
    direction === 'none' ? '0, 0' : DIRECTION_OFFSET[direction as Exclude<ScrollRevealDirection, 'none'>];

  const baseStyle: CSSProperties = {
    transitionDuration: `${Math.min(duration, reducedMotion ? 80 : duration)}ms`,
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0, 0)' : `translate(${offset})`,
  };

  const classes = [
    styles.reveal,
    reducedMotion ? styles.reduced : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // 用 createElement 动态渲染（避免 TS 对 as 属性的复杂性）
  const Component = Tag as unknown as React.ElementType;

  return (
    <Component
      ref={ref as React.Ref<unknown>}
      className={classes}
      style={{ ...baseStyle, ...style }}
    >
      {children}
    </Component>
  );
}