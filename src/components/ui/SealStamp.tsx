// src/components/ui/SealStamp.tsx
// 水墨朱红印章组件 · 阶段 3 精修

import { useCallback, useId } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import styles from './SealStamp.module.css';

export type SealStampShape = 'square' | 'circle';
export type SealStampSize = 'small' | 'medium' | 'large';

export interface SealStampProps {
  /** 印章文字（2-4 字为宜） */
  text: string;
  /** 尺寸 */
  size?: SealStampSize;
  /** 形状 */
  shape?: SealStampShape;
  /** 是否可交互（点击 / 键盘触发盖章效果） */
  interactive?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 点击 / 键盘触发回调 */
  onActivate?: () => void;
  /** 标题（无障碍） */
  title?: string;
}

const SIZE_PX: Record<SealStampSize, number> = {
  small: 48,
  medium: 72,
  large: 96,
};

export function SealStamp({
  text,
  size = 'medium',
  shape = 'square',
  interactive = false,
  className,
  style,
  onActivate,
  title,
}: SealStampProps) {
  const sizePx = SIZE_PX[size];
  const filterId = useId();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const target = e.currentTarget;
      target.classList.remove(styles.stamping);
      // 强制 reflow 重启动画
      void target.offsetWidth;
      target.classList.add(styles.stamping);
      onActivate?.();
    },
    [interactive, onActivate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!interactive) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = e.currentTarget;
        target.classList.remove(styles.stamping);
        void target.offsetWidth;
        target.classList.add(styles.stamping);
        onActivate?.();
      }
    },
    [interactive, onActivate],
  );

  const classes = [
    styles.stamp,
    styles[`shape-${shape}`],
    styles[`size-${size}`],
    interactive ? styles.interactive : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle: CSSProperties = {
    width: `${sizePx}px`,
    height: `${sizePx}px`,
    fontSize: `${Math.round(sizePx * 0.28)}px`,
    ...style,
  };

  return (
    <div
      className={classes}
      style={inlineStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={title ?? text}
      aria-label={interactive ? title ?? `印章：${text}` : undefined}
    >
      {/* 颗粒感噪点 filter：仅定义一次 */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.95"
              numOctaves="2"
              seed="3"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.18 0"
            />
          </filter>
        </defs>
      </svg>
      <span className={styles.text}>{text}</span>
    </div>
  );
}