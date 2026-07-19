// src/components/sections/RoutesSection.tsx
// 主题路线（R1-R5 主路线 + H1/H2 半日小卷）

import { mainRoutes, routeVariants } from '../../data/routes';
import { BrushDivider, InkTitle, ScrollReveal } from '../ui';
import { RouteCard } from './RouteCard';
import styles from './RoutesSection.module.css';

export function RoutesSection() {
  return (
    <section id="routes" className={styles.routes}>
      <header className={styles.head}>
        <ScrollReveal direction="up" duration={600}>
          <p className={`${styles.eyebrow} font-data`}>— 主题路线 —</p>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={120} duration={600}>
          <InkTitle
            title="五卷主路线"
            subtitle="R1 至 R5 —— 由 MCP 实测的相邻景点距离与时间组成。"
          />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={200} duration={600}>
          <p className={`${styles.scope} font-data`}>
            以下里程与时间为相邻景点之间的实测数据，不含出发地接驳、住宿、候车、停车和景区内部游览时间。
          </p>
        </ScrollReveal>
      </header>

      {/* 主路线：单列长卷 */}
      <div className={styles.list}>
        {mainRoutes.map((route, i) => (
          <ScrollReveal
            key={route.id}
            direction="up"
            delay={i * 60}
            duration={600}
          >
            <RouteCard route={route} />
          </ScrollReveal>
        ))}
      </div>

      {/* 分隔：半日小卷 */}
      <div className={styles.variantsDivider}>
        <BrushDivider tone="light" width={120} thickness={2} />
        <span className={`${styles.variantsLabel} font-calligraphy-xing`}>
          半日小卷
        </span>
        <BrushDivider tone="light" width={120} thickness={2} />
      </div>

      <p className={`${styles.variantsHint} font-data`}>
        H1、H2 为半天变体；H1 全程步行、H2 含驾车；均已通过 MCP 核验。
        它们将在阶段 6 作为半天推荐候选。
      </p>

      {/* 半天变体：双列横向条目 */}
      <div className={styles.variants}>
        {routeVariants.map((route, i) => (
          <ScrollReveal
            key={route.id}
            direction={i % 2 === 0 ? 'left' : 'right'}
            delay={i * 60}
            duration={600}
          >
            <RouteCard route={route} showSeal />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}