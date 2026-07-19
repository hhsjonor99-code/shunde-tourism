// src/components/sections/ImpressionSection.tsx
// 顺德印象 · 四组图文（阶段 5 布局精修 v2：取消偶数组交错，使用 grid-area）

import { BrushDivider, ScrollReveal, SealStamp } from '../ui';
import { AttractionImageView } from './AttractionImageView';
import styles from './ImpressionSection.module.css';

interface ImpressionGroup {
  id: string;
  title: string;
  sealText: string;
  attractions: Array<{
    name: string;
    description: string;
    variant: 'landmark' | 'garden' | 'water-town' | 'street' | 'park' | 'art' | 'museum';
  }>;
}

const IMPRESSION_GROUPS: ImpressionGroup[] = [
  {
    id: 'garden',
    title: '园林',
    sealText: '园',
    attractions: [
      {
        name: '清晖园',
        description: '广东四大名园之一，岭南园林典范；明式建筑与水石庭院相映，午后光影最宜。',
        variant: 'garden',
      },
    ],
  },
  {
    id: 'water',
    title: '水乡',
    sealText: '水',
    attractions: [
      {
        name: '逢简水乡',
        description: '岭南水乡典型代表；小桥流水、古祠堂、乌篷船与水乡双皮奶并存。',
        variant: 'water-town',
      },
    ],
  },
  {
    id: 'taste',
    title: '寻味',
    sealText: '味',
    attractions: [
      {
        name: '金榜上街',
        description: '老字号牛乳与双皮奶一条街；霞姐双皮奶、欢记牛乳、景松鱼皮等老铺。',
        variant: 'street',
      },
      {
        name: '大良华盖路商业步行街',
        description: '大良老城商业步行街；沿街小吃与岭南骑楼并存，紧邻清晖园。',
        variant: 'street',
      },
    ],
  },
  {
    id: 'city',
    title: '城市生活',
    sealText: '城',
    attractions: [
      {
        name: '顺峰山公园',
        description: '顺德大型城市公园；含青云公园、汀芷园、雅正园、粤剧大观园等。',
        variant: 'park',
      },
      {
        name: '顺德欢乐海岸PLUS',
        description: '顺德大型文商旅综合体；曲水湾风情商业街、夜景、顺德美食博物馆。',
        variant: 'landmark',
      },
      {
        name: '容桂渔人码头',
        description: '容桂老工业码头改造的文商旅空间；含灯塔、咖啡馆与夜景。',
        variant: 'landmark',
      },
    ],
  },
];

export function ImpressionSection() {
  return (
    <section id="impression" className={styles.impression}>
      <header className={styles.head}>
        <ScrollReveal direction="up" duration={600}>
          <p className={`${styles.eyebrow} font-data`}>— 顺德印象 —</p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={120} duration={600}>
          <h2 className={`${styles.sectionTitle} font-calligraphy-xing`}>
            四方四时
          </h2>
          <p className={styles.sectionSubtitle}>
            园林 / 水乡 / 寻味 / 城市生活 —— 四种笔墨。
          </p>
        </ScrollReveal>
      </header>

      <div className={styles.groups}>
        {IMPRESSION_GROUPS.map((group) => (
          <ScrollReveal
            key={group.id}
            direction="up"
            duration={700}
          >
            <article className={styles.group}>
              {/* 左侧：印章 + 标题（约 25%） */}
              <div className={styles.labelCol}>
                <div className={styles.sealSlot}>
                  <SealStamp
                    text={group.sealText}
                    shape="square"
                    size="medium"
                  />
                </div>
                <h3 className={`${styles.groupTitle} font-calligraphy-xing`}>
                  {group.title}
                </h3>
                <BrushDivider tone="ink" width={56} thickness={2} />
              </div>

              {/* 右侧：景点内容（约 75%） */}
              <div className={styles.contentCol}>
                <div className={styles.attractions}>
                  {group.attractions.map((a, aIdx) => (
                    <article key={aIdx} className={styles.attractionItem}>
                      <div className={styles.imageSlot}>
                        <AttractionImageView
                          fallbackTitle={a.name}
                          fallbackVariant={a.variant}
                          aspectRatio="3 / 2"
                        />
                      </div>
                      <div className={styles.attractionBody}>
                        <h4 className={`${styles.attrName} font-calligraphy-xing`}>
                          {a.name}
                        </h4>
                        <p className={styles.attrDesc}>{a.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}