// src/components/sections/RouteTimeline.tsx
// 路线时间轴（阶段 5 精修：视觉层级与分组提示）

import type { Route, RouteLeg } from '../../types';
import { attractionsById } from '../../data/attractions';
import { formatLegDuration, formatTransportMode } from '../../utils/format';
import styles from './RouteTimeline.module.css';

export interface RouteTimelineProps {
  /** 路线（包含 stops 与 legs） */
  route: Route;
  /** 可选：仅显示指定天数（多日路线使用） */
  day?: number;
  /** 自定义类名 */
  className?: string;
}

export function RouteTimeline({ route, day, className }: RouteTimelineProps) {
  const stops = day
    ? route.stops.filter((s) => (s.day ?? 1) === day)
    : route.stops;

  const dayAttractionIds = new Set(stops.map((s) => s.attractionId));
  const legs = day
    ? route.legs.filter((l) => dayAttractionIds.has(l.fromAttractionId))
    : route.legs;

  return (
    <ol className={`${styles.timeline} ${className ?? ''}`} aria-label="路线时间轴">
      {stops.map((stop, i) => {
        const attraction = attractionsById[stop.attractionId];
        const leg = legs.find((l) => l.fromAttractionId === stop.attractionId);
        // 把 tips 分为两组
        const visitTips = [stop.foodTips, stop.photoTips, stop.notes].filter(
          (t): t is string => !!t,
        );
        const transportTips = [stop.transportTips].filter(
          (t): t is string => !!t,
        );

        return (
          <li key={stop.attractionId + i} className={styles.item}>
            {/* 节点印章 / 墨点 */}
            <div className={styles.node} aria-hidden="true">
              <span className={styles.dot}>
                <span className={styles.dotInner} />
              </span>
            </div>

            <div className={styles.body}>
              {/* 次级信息：时间 + 序 */}
              <div className={styles.meta}>
                <span className={`${styles.metaTime} font-data`}>
                  {stop.arrivalTime} – {stop.departureTime}
                </span>
                <span className={`${styles.metaDot} font-data`}>·</span>
                <span className={`${styles.metaDuration} font-data`}>
                  停留 {stop.recommendedDuration} 分钟
                </span>
                <span className={`${styles.metaDot} font-data`}>·</span>
                <span className={`${styles.metaSeq} font-data`}>
                  第 {stop.sequence} 站
                </span>
              </div>

              {/* 主标题：景点名称 */}
              <h4 className={`${styles.stopTitle} font-calligraphy-xing`}>
                {attraction?.standardName ?? attraction?.name ?? stop.attractionId}
              </h4>

              {attraction?.address && (
                <p className={`${styles.address} font-data`}>
                  {attraction.address}
                </p>
              )}

              {/* 活动建议（完整短句） */}
              {stop.activities.length > 0 && (
                <p className={styles.activities}>
                  {stop.activities.join('；')}。
                </p>
              )}

              {/* 游览建议：食/影/注 合并为一组 */}
              {visitTips.length > 0 && (
                <div className={styles.tipGroup}>
                  <span className={`${styles.tipGroupLabel} font-xing`}>
                    游览建议
                  </span>
                  <ul className={styles.tipList}>
                    {stop.foodTips && (
                      <li>
                        <span className={`${styles.tipTag} font-xing`}>食</span>
                        <span>{stop.foodTips}</span>
                      </li>
                    )}
                    {stop.photoTips && (
                      <li>
                        <span className={`${styles.tipTag} font-xing`}>影</span>
                        <span>{stop.photoTips}</span>
                      </li>
                    )}
                    {stop.notes && (
                      <li>
                        <span className={`${styles.tipTag} font-xing`}>注</span>
                        <span>{stop.notes}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* 交通提示：单组 */}
              {transportTips.length > 0 && (
                <div className={styles.tipGroup}>
                  <span className={`${styles.tipGroupLabel} font-xing`}>
                    交通提示
                  </span>
                  <ul className={styles.tipList}>
                    {stop.transportTips && (
                      <li>
                        <span className={`${styles.tipTag} font-xing`}>行</span>
                        <span>{stop.transportTips}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* 路段连接线 */}
            {leg && <LegSegment leg={leg} />}
          </li>
        );
      })}
    </ol>
  );
}

function LegSegment({ leg }: { leg: RouteLeg }) {
  const next = attractionsById[leg.toAttractionId];
  return (
    <div className={styles.leg} aria-hidden="false">
      <div className={styles.legLine} aria-hidden="true">
        <span className={styles.legDash} />
      </div>
      <div className={styles.legInfo}>
        <span className={`${styles.legMode} font-data`}>
          {formatTransportMode(leg.mode)}
        </span>
        <span className={`${styles.legDistance} font-data`}>
          {Math.round(leg.distanceMeters)} 米 · {formatLegDuration(leg.durationSeconds)}
        </span>
        <span
          className={`${styles.legStatus} font-data`}
          data-status={leg.verificationStatus}
        >
          {leg.verificationStatus === 'verified' ? '· 已核验' : '· 未核验'}
        </span>
      </div>
      {next && (
        <p className={`${styles.legNext} font-data`}>
          → {next.standardName}
        </p>
      )}
    </div>
  );
}