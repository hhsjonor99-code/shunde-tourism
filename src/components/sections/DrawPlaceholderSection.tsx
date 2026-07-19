// src/components/sections/DrawPlaceholderSection.tsx
// 阶段 5 占位 · 阶段 6 实现表单

import { BrushDivider, InkTitle, ScrollReveal } from '../ui';
import styles from './DrawPlaceholderSection.module.css';

export function DrawPlaceholderSection() {
  return (
    <section id="draw" className={styles.draw}>
      <div className={styles.inner}>
        <ScrollReveal direction="up" duration={700}>
          <p className={`${styles.eyebrow} font-data`}>— 下一段 · 为我画一卷 —</p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={120} duration={700}>
          <InkTitle
            title="此卷由你落笔"
            subtitle="个性化顺德行程将在下一阶段展开。"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={220} duration={700}>
          <p className={styles.body}>
            告诉我们天数、同行人、兴趣与节奏，
            从园林、水乡、寻味、烟火与夜色中，
            选一段最合适你的顺德。
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={320} duration={700}>
          <div className={styles.divider}>
            <BrushDivider tone="ink" width={120} thickness={2} />
            <span className={`${styles.signature} font-calligraphy-xingcao`}>
              留白待笔
            </span>
            <BrushDivider tone="ink" width={120} thickness={2} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}