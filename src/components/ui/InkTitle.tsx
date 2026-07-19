// src/components/ui/InkTitle.tsx
// 统一章节标题

import type { CSSProperties, ReactNode } from 'react';
import { SealStamp } from './SealStamp';
import { VerticalText } from './VerticalText';
import styles from './InkTitle.module.css';

export interface InkTitleProps {
  /** 上方小字（如分类、序号） */
  eyebrow?: ReactNode;
  /** 主标题 */
  title: ReactNode;
  /** 副标题 */
  subtitle?: ReactNode;
  /** 可选印章文字；提供则渲染印章 */
  sealText?: string;
  /** 可选印章位置 */
  sealPosition?: 'right' | 'left';
  /** 可选竖排题字；提供则渲染右侧竖排 */
  verticalText?: ReactNode;
  /** 主标题级别，默认 h2 */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  /** 文本对齐 */
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: CSSProperties;
}

export function InkTitle({
  eyebrow,
  title,
  subtitle,
  sealText,
  sealPosition = 'right',
  verticalText,
  as: HeadingTag = 'h2',
  align = 'left',
  className,
  style,
}: InkTitleProps) {
  const wrapClasses = [
    styles.wrap,
    styles[`align-${align}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={wrapClasses} style={style}>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}

      <div className={styles.titleRow}>
        {sealText && sealPosition === 'left' && (
          <SealStamp text={sealText} size="small" shape="square" />
        )}

        <HeadingTag className={styles.title}>{title}</HeadingTag>

        {sealText && sealPosition === 'right' && (
          <SealStamp text={sealText} size="small" shape="square" />
        )}

        {verticalText && (
          <VerticalText
            decorative
            fontClass="font-calligraphy-xingcao"
            className={styles.vertical}
          >
            {verticalText}
          </VerticalText>
        )}
      </div>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}