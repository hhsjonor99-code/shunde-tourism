// src/components/sections/ItineraryResult.tsx
// 推荐结果展示（阶段 6）

import type { GeneratedItinerary, Route } from '../../types';
import { routesById } from '../../data/routes';
import {
  formatDistance,
  formatDuration,
  formatDurationLabel,
} from '../../utils/format';
import { BrushDivider, InkButton, ScrollReveal, SealStamp } from '../ui';
import { RouteTimeline } from './RouteTimeline';
import styles from './ItineraryResult.module.css';

export interface ItineraryResultProps {
  result: GeneratedItinerary;
  /** 重新选择回调（清空表单与结果） */
  onReset?: () => void;
}

export function ItineraryResult({ result, onReset }: ItineraryResultProps) {
  const route: Route | undefined = result.matchedRouteId
    ? routesById[result.matchedRouteId]
    : undefined;

  // 核心停靠点
  const coreStops = result.stops
    .slice(0, 4)
    .map((s) => s.attractionId);

  return (
    <article
      className={styles.result}
      role="region"
      aria-label="推荐结果"
    >
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <ScrollReveal direction="up" duration={600}>
            <p className={`${styles.eyebrow} font-data`}>— 推荐结果 —</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100} duration={600}>
            <h3 className={`${styles.title} font-calligraphy-xing`}>
              {result.title}
            </h3>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200} duration={600}>
            <p className={`${styles.summary} font-body-kai`}>
              {result.summary}
            </p>
          </ScrollReveal>
        </div>
        {route && (
          <div className={styles.seal}>
            <SealStamp text={route.id} shape="square" size="medium" />
          </div>
        )}
      </header>

      {/* 第一层：核心数据 */}
      {route && (
        <ScrollReveal direction="up" delay={300} duration={600}>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>推荐分数</span>
              <span className={`${styles.dataValue} font-data`}>
                {result.score}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>游玩时长</span>
              <span className={`${styles.dataValue} font-data`}>
                {formatDurationLabel(route.duration)}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>总里程</span>
              <span className={`${styles.dataValue} font-data`}>
                {formatDistance(result.totalDistance)}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>已核验交通时间</span>
              <span className={`${styles.dataValue} font-data`}>
                {formatDuration(result.totalTransportTime)}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>主要交通</span>
              <span className={`${styles.dataValue} font-data`}>
                {route.transportModes.includes('walking') &&
                route.transportModes.includes('driving')
                  ? '步行 + 驾车'
                  : route.transportModes.includes('walking')
                    ? '步行'
                    : route.transportModes.includes('driving')
                      ? '驾车'
                      : route.transportModes.join(' / ')}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>节奏</span>
              <span className={`${styles.dataValue} font-data`}>
                {route.pace === 'relaxed'
                  ? '悠闲'
                  : route.pace === 'standard'
                    ? '经典适中'
                    : '尽量多玩'}
              </span>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 第二层：核心停靠点 */}
      {coreStops.length > 0 && (
        <ScrollReveal direction="up" delay={380} duration={600}>
          <div className={styles.stopsBlock}>
            <span className={`${styles.subLabel} font-data`}>核心停靠点</span>
            <div className={styles.stopsList}>
              {result.stops.slice(0, 4).map((s, i) => (
                <span key={s.attractionId + i} className={styles.stopChip}>
                  <span className={styles.stopDot} aria-hidden="true" />
                  <span className={styles.stopName}>{s.attractionId}</span>
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 第三层：推荐理由 */}
      {result.reasons.length > 0 && (
        <ScrollReveal direction="up" delay={440} duration={600}>
          <section className={styles.reasons}>
            <h4 className={`${styles.subhead} font-xing`}>推荐理由</h4>
            <ul className={styles.reasonList}>
              {result.reasons.map((r, i) => (
                <li key={i} className={styles.reasonItem}>
                  <span className={styles.reasonMark} aria-hidden="true">
                    ·
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      )}

      {/* 第四层：关键词命中 */}
      {result.matchedKeywordRules && result.matchedKeywordRules.length > 0 && (
        <ScrollReveal direction="up" delay={480} duration={600}>
          <section className={styles.keywords}>
            <h4 className={`${styles.subhead} font-xing`}>
              补充说明中识别到的关键词
            </h4>
            <p className={`${styles.kwNote} font-data`}>
              第一版仅进行关键词匹配（不调用大模型）。
            </p>
            <ul className={styles.kwList}>
              {result.matchedKeywordRules.map((r, i) => (
                <li key={i} className={styles.kwItem}>
                  <span className={styles.kwEffect}>{r.description}</span>
                </li>
              ))}
            </ul>
            {result.unmatchedText && result.unmatchedNotice && (
              <p className={`${styles.kwUnmatched} font-data`}>
                未识别原文：<span>{result.unmatchedText}</span>
                <br />
                {result.unmatchedNotice}
              </p>
            )}
          </section>
        </ScrollReveal>
      )}

      {/* 第五层：告示 */}
      {result.notices.length > 0 && (
        <ScrollReveal direction="up" delay={520} duration={600}>
          <section className={styles.notices}>
            {result.notices.map((n, i) => (
              <p key={i} className={styles.notice} role="note">
                {n}
              </p>
            ))}
          </section>
        </ScrollReveal>
      )}

      {/* 第六层：完整时间轴 */}
      {route && result.stops.length > 0 && (
        <>
          <ScrollReveal direction="none" duration={400}>
            <BrushDivider tone="ink" width={120} thickness={2} />
          </ScrollReveal>
          <ScrollReveal direction="up" duration={700}>
            <section className={styles.timelineSection}>
              <h4 className={`${styles.subhead} font-xing`}>完整路线时间轴</h4>
              <RouteTimeline route={route} />
            </section>
          </ScrollReveal>
        </>
      )}

      {/* 重置按钮 */}
      {onReset && (
        <ScrollReveal direction="up" delay={600} duration={500}>
          <div className={styles.actions}>
            <InkButton
              type="button"
              variant="secondary"
              size="medium"
              onClick={onReset}
            >
              重新选择
            </InkButton>
          </div>
        </ScrollReveal>
      )}
    </article>
  );
}