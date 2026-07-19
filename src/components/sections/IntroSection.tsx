// src/components/sections/IntroSection.tsx
// 初识顺德 · 四主题（水乡 / 园林 / 寻味 / 烟火）

import { BrushDivider, InkTitle, ScrollReveal } from '../ui';
import { AttractionImageView } from './AttractionImageView';
import styles from './IntroSection.module.css';

interface IntroTheme {
  id: string;
  title: string;
  description: string;
  variant: 'water-town' | 'garden' | 'street' | 'park';
}

const INTRO_THEMES: IntroTheme[] = [
  {
    id: 'water',
    title: '水乡',
    description: '河涌穿村，古桥卧波。顺德的生活，从水边缓缓展开。',
    variant: 'water-town',
  },
  {
    id: 'garden',
    title: '园林',
    description: '窗棂、池水、古树与亭台，在岭南园林中虚实相生。',
    variant: 'garden',
  },
  {
    id: 'taste',
    title: '寻味',
    description: '双皮奶、牛乳、鱼皮与顺德菜，让一段旅程从味觉开始。',
    variant: 'street',
  },
  {
    id: 'smoke',
    title: '烟火',
    description: '老街、市场、村落与夜色，构成顺德真实而鲜活的日常。',
    variant: 'park',
  },
];

export function IntroSection() {
  return (
    <section id="intro" className={styles.intro}>
      <header className={styles.head}>
        <ScrollReveal direction="up" duration={600}>
          <p className={`${styles.eyebrow} font-data`}>— 初识顺德 —</p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={120} duration={600}>
          <InkTitle
            title="四时四象"
            subtitle="水乡、园林、寻味、烟火 —— 一卷顺德的四道折痕。"
          />
        </ScrollReveal>
      </header>

      <div className={styles.list}>
        {INTRO_THEMES.map((theme, i) => {
          // 偶数索引反向（左右交错的不对称布局）
          const reversed = i % 2 === 1;
          return (
            <ScrollReveal
              key={theme.id}
              direction={reversed ? 'left' : 'right'}
              delay={i * 80}
              duration={700}
            >
              <article
                className={`${styles.theme} ${
                  reversed ? styles.themeReversed : ''
                }`}
              >
                <div className={styles.imageCol}>
                  <AttractionImageView
                    fallbackTitle={`${theme.title} 水墨意象`}
                    fallbackVariant={theme.variant}
                    aspectRatio="4 / 3"
                  />
                </div>

                <div className={styles.textCol}>
                  <span className={styles.number}>0{i + 1}</span>
                  <h3 className={`${styles.themeTitle} font-calligraphy-xing`}>
                    {theme.title}
                  </h3>
                  <BrushDivider tone="ink" width={64} thickness={2} />
                  <p className={styles.themeDesc}>{theme.description}</p>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}