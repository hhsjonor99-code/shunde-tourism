// src/components/sections/RouteDetail.tsx
// 路线详情（多日按 day 分组）

import type { Route } from '../../types';
import { BrushDivider } from '../ui';
import { RouteTimeline } from './RouteTimeline';
import styles from './RouteDetail.module.css';

export interface RouteDetailProps {
  route: Route;
  /** 自定义类名 */
  className?: string;
}

export function RouteDetail({ route, className }: RouteDetailProps) {
  // 判断是否多日路线
  const hasMultiDay = route.stops.some((s) => s.day !== undefined);

  if (hasMultiDay) {
    const days = Array.from(
      new Set(route.stops.map((s) => s.day ?? 1)),
    ).sort((a, b) => a - b);
    return (
      <div className={`${styles.detail} ${className ?? ''}`}>
        <div className={styles.days}>
          {days.map((d, i) => (
            <section key={d} className={styles.day}>
              <header className={styles.dayHeader}>
                <span className={`${styles.dayBadge} font-data`}>
                  第 {d} 日
                </span>
                <h3 className={`${styles.dayTitle} font-calligraphy-xing`}>
                  {d === 1 ? '初见顺德' : '再续顺德'}
                </h3>
              </header>
              <RouteTimeline route={route} day={d} />
              {/* 翌日分隔 */}
              {i < days.length - 1 && (
                <div className={styles.dayBreak}>
                  <BrushDivider tone="light" width={120} thickness={2} />
                  <span className={`${styles.dayBreakText} font-calligraphy-xingcao`}>
                    翌日再启一卷
                  </span>
                  <BrushDivider tone="light" width={120} thickness={2} />
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.detail} ${className ?? ''}`}>
      <RouteTimeline route={route} />
    </div>
  );
}