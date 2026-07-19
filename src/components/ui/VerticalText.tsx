// src/components/ui/VerticalText.tsx
// 竖排文字组件

import type { CSSProperties, ReactNode } from 'react';
import styles from './VerticalText.module.css';

export type VerticalDirection = 'rtl' | 'ltr';

export interface VerticalTextProps {
  children: ReactNode;
  /** 排列方向：rtl（从右到左）/ ltr（从左到右） */
  direction?: VerticalDirection;
  /** 是否纯装饰；true 时添加 aria-hidden */
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 字体类名（如 font-calligraphy-xingcao） */
  fontClass?: string;
}

export function VerticalText({
  children,
  direction = 'rtl',
  decorative = false,
  className,
  style,
  fontClass,
}: VerticalTextProps) {
  const classes = [
    styles.vertical,
    styles[`direction-${direction}`],
    fontClass ?? '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={style}
      aria-hidden={decorative ? true : undefined}
    >
      {children}
    </div>
  );
}