// src/components/sections/HeroSection.tsx
// 水墨长卷首屏（阶段 5 精修）

import { useCallback } from 'react';
import { BrushDivider, InkButton, ScrollReveal, SealStamp, VerticalText } from '../ui';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  /** 自定义主标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 欢迎文案 */
  welcome?: string;
  /** 印章文字 */
  sealText?: string;
  /** 锚点：展开顺德 → 默认 #intro */
  expandAnchor?: string;
  /** 锚点：为我画一卷 → 默认 #draw */
  drawAnchor?: string;
  /** 备用安全滚动目标（#intro / #draw 尚未存在时） */
  fallbackExpandId?: string;
  fallbackDrawId?: string;
}

export function HeroSection({
  title = '一卷顺德',
  subtitle = '水乡入画，寻味成诗',
  welcome = '一方水土，十镇烟火。\n沿着园林、水乡与美食，展开一卷顺德生活。',
  sealText = '顺德',
  expandAnchor = '#intro',
  drawAnchor = '#draw',
  fallbackExpandId = 'next-stage-placeholder-intro',
  fallbackDrawId = 'next-stage-placeholder-draw',
}: HeroSectionProps) {
  // 安全滚动：目标存在才滚；否则尝试备用 ID；都没有则不报错
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, anchor: string, fallbackId: string) => {
      e.preventDefault();
      const id = anchor.replace(/^#/, '');
      const target = document.getElementById(id) ?? document.getElementById(fallbackId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [],
  );

  return (
    <section id="hero" className={styles.hero}>
      {/* 装饰层（aria-hidden） */}
      <div className={styles.decoration} aria-hidden="true">
        <svg
          className={styles.landscape}
          viewBox="0 0 800 700"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 三层山体渐变（极淡） */}
            <linearGradient id="m-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="m-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#333333" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#333333" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="m-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.08" />
            </linearGradient>
            {/* 一抹极淡青绿点染：远山余光 */}
            <linearGradient id="m-glaze" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2E8B57" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#2E8B57" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 最远一层：极淡连绵（非对称起伏） */}
          <path
            d="M0,250 C 70,228 130,245 200,222 C 280,198 340,232 420,215 C 500,198 560,228 640,218 C 700,210 760,228 800,222 L 800,400 L 0,400 Z"
            fill="url(#m-far)"
          />
          {/* 远山余光一抹青绿 */}
          <path
            d="M 0 270 C 80 250, 200 260, 320 245 C 440 232, 560 250, 800 240 L 800 360 L 0 360 Z"
            fill="url(#m-glaze)"
          />

          {/* 中景山：不规则起伏（非周期波） */}
          <path
            d="M0,320 C 60,288 140,308 220,290 C 290,275 360,308 440,295 C 520,282 600,302 680,292 C 740,285 780,300 800,295 L 800,400 L 0,400 Z"
            fill="url(#m-mid)"
          />

          {/* 近景山：更低、更缓的轮廓（不占大面积深色） */}
          <path
            d="M0,395 C 100,372 200,386 280,378 C 360,370 440,388 520,380 C 600,372 680,388 800,378 L 800,460 L 0,460 Z"
            fill="url(#m-near)"
          />

          {/* 水面：极轻盈的三条横线（不再画更多） */}
          <g strokeLinecap="round" fill="none">
            <path d="M 120 470 Q 200 466, 280 470" stroke="#666" strokeWidth="0.8" strokeOpacity="0.18" />
            <path d="M 360 478 Q 440 474, 520 478" stroke="#666" strokeWidth="0.8" strokeOpacity="0.16" />
            <path d="M 200 488 Q 280 484, 360 488" stroke="#999" strokeWidth="0.7" strokeOpacity="0.14" />
          </g>

          {/* 一座抽象岭南小桥：简化为一笔弧线 */}
          <path
            d="M 500 502 Q 535 478, 570 502"
            stroke="#1a1a1a"
            strokeWidth="1.2"
            fill="none"
            strokeOpacity="0.40"
          />
          <line
            x1="500"
            y1="500"
            x2="570"
            y2="500"
            stroke="#1a1a1a"
            strokeWidth="0.7"
            strokeOpacity="0.40"
          />
          {/* 桥下倒影（极淡） */}
          <path
            d="M 500 502 Q 535 522, 570 502"
            stroke="#666"
            strokeWidth="0.6"
            fill="none"
            strokeOpacity="0.16"
          />

          {/* 岭南窗格（左上，小而克制） */}
          <g stroke="#1a1a1a" strokeOpacity="0.25" fill="none" strokeWidth="0.8">
            <rect x="80" y="200" width="36" height="36" />
            <line x1="80" y1="218" x2="116" y2="218" />
            <line x1="98" y1="200" x2="98" y2="236" />
          </g>

          {/* 一盏鱼灯（极简） */}
          <ellipse cx="690" cy="468" rx="9" ry="4" stroke="#C41E3A" strokeOpacity="0.45" strokeWidth="1" fill="none" />
          <line x1="699" y1="468" x2="703" y2="464" stroke="#C41E3A" strokeOpacity="0.45" strokeWidth="1" />
          <line x1="699" y1="468" x2="703" y2="472" stroke="#C41E3A" strokeOpacity="0.45" strokeWidth="1" />

          {/* 远处墨点（一只鸟，0.45 → 0.32） */}
          <circle cx="240" cy="285" r="1.6" fill="#1a1a1a" opacity="0.32" />
        </svg>
      </div>

      {/* 文字内容层 */}
      <div className={styles.content}>
        <div className={styles.text}>
          {/* 印章（左侧靠标题） */}
          <div className={styles.sealSlot}>
            <ScrollReveal direction="none" duration={400}>
              <SealStamp text={sealText} shape="square" size="medium" />
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up" delay={80} duration={700}>
            <h1 className={`${styles.title} font-calligraphy-cao`}>{title}</h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={700}>
            <p className={`${styles.subtitle} font-calligraphy-xingcao`}>{subtitle}</p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={320} duration={700}>
            <p className={styles.welcome}>
              {welcome.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={440} duration={700}>
            <div className={styles.actions}>
              <InkButton
                variant="primary"
                size="large"
                onClick={(e) => handleClick(e, expandAnchor, fallbackExpandId)}
              >
                展开顺德
              </InkButton>
              <InkButton
                variant="secondary"
                size="large"
                onClick={(e) => handleClick(e, drawAnchor, fallbackDrawId)}
              >
                为我画一卷行程
              </InkButton>
            </div>
          </ScrollReveal>
        </div>

        {/* 右侧竖排题字 */}
        <aside className={styles.vertical} aria-hidden="true">
          <VerticalText decorative fontClass="font-calligraphy-xingcao">
            水乡入画
          </VerticalText>
          <VerticalText decorative fontClass="font-calligraphy-xingcao">
            寻味成诗
          </VerticalText>
        </aside>
      </div>

      {/* 底部毛笔衔接线 */}
      <div className={styles.bottomDivider}>
        <BrushDivider tone="ink" width="100%" thickness={2} animated />
      </div>
    </section>
  );
}