// src/components/sections/RouteCard.tsx
// 路线卡片（阶段 5 精修：视觉层级）

import { useId, useState } from 'react';
import type { Route } from '../../types';
import { attractionsById } from '../../data/attractions';
import {
  formatCompanions,
  formatDistance,
  formatDuration,
  formatDurationLabel,
  formatMcpVerificationStatus,
  formatPace,
} from '../../utils/format';
import { InkButton, InkTitle, ScrollReveal, SealStamp } from '../ui';
import { RouteDetail } from './RouteDetail';
import styles from './RouteCard.module.css';

export interface RouteCardProps {
  route: Route;
  /** 是否默认展开 */
  defaultOpen?: boolean;
  /** 是否显示印章 */
  showSeal?: boolean;
  /** 印章文字（默认取 route.id） */
  sealText?: string;
  /** 自定义类名 */
  className?: string;
}

export function RouteCard({
  route,
  defaultOpen = false,
  showSeal = true,
  sealText,
  className,
}: RouteCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  const stopsPreview = route.stops.slice(0, 4);
  const moreCount = route.stops.length - stopsPreview.length;

  return (
    <article className={`${styles.card} ${className ?? ''}`}>
      {/* 顶部装饰线：朱红卷轴边 */}
      <span className={styles.topEdge} aria-hidden="true" />

      <div className={styles.body}>
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <InkTitle
              title={route.title}
              subtitle={route.subtitle}
              align="left"
            />
          </div>

          {showSeal && (
            <div className={styles.seal}>
              <SealStamp
                text={sealText ?? route.id}
                shape="square"
                size="small"
              />
            </div>
          )}
        </header>

        {/* 第一层：核心摘要 + 关键数据 + 适合人群 */}
        <div className={styles.heroRow}>
          <p className={styles.desc}>{route.description}</p>
          <div className={styles.heroMeta}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>总里程</span>
              <span className={`${styles.heroStatValue} font-data`}>
                {formatDistance(route.totalDistance)}
              </span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>总交通时间</span>
              <span className={`${styles.heroStatValue} font-data`}>
                {formatDuration(route.totalTransportTime)}
              </span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatLabel}>适合</span>
              <span className={`${styles.heroStatValue} font-data`}>
                {route.suitableFor.map(formatCompanions).join(' · ')}
              </span>
            </div>
          </div>
        </div>

        {/* 第二层：核心停靠点（显眼） */}
        <div className={styles.stopsBlock}>
          <span className={`${styles.stopsLabel} font-data`}>核心停靠</span>
          <div className={styles.stopsList}>
            {stopsPreview.map((s, i) => {
              const attraction = attractionsById[s.attractionId];
              return (
                <span key={s.attractionId + i} className={styles.stopChip}>
                  <span className={styles.stopDot} aria-hidden="true" />
                  <span className={styles.stopName}>
                    {attraction?.standardName ?? s.attractionId}
                  </span>
                </span>
              );
            })}
            {moreCount > 0 && (
              <span className={styles.stopMore}>+{moreCount}</span>
            )}
          </div>
        </div>

        {/* 第三层：低优先级的技术信息（小字灰墨） */}
        <div className={styles.metaRow}>
          <span className={`${styles.metaItem} font-data`}>
            {formatDurationLabel(route.duration)}
          </span>
          <span className={styles.metaDivider} aria-hidden="true" />
          <span className={`${styles.metaItem} font-data`}>
            节奏 {formatPace(route.pace)}
          </span>
          <span className={styles.metaDivider} aria-hidden="true" />
          <span className={`${styles.metaItem} font-data`}>
            {formatMcpVerificationStatus(route.mcpVerificationStatus)}
          </span>
        </div>

        {/* 第四层：操作 */}
        <div className={styles.actions}>
          <InkButton
            variant={open ? 'secondary' : 'primary'}
            size="medium"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '收起此卷' : '展开此卷'}
          </InkButton>
        </div>

        {/* 详情区 */}
        <ScrollReveal
          direction="none"
          duration={280}
          once
          threshold={0}
          className={styles.detailSlot}
        >
          {open && (
            <div
              id={panelId}
              className={styles.panel}
              role="region"
              aria-label={`${route.title} 详情`}
            >
              <p className={`${styles.scopeNotice} font-data`}>
                以下里程与时间为相邻景点之间的实测数据，不含出发地接驳、住宿、候车、停车和景区内部游览时间。
              </p>
              <RouteDetail route={route} />
            </div>
          )}
        </ScrollReveal>
      </div>
    </article>
  );
}