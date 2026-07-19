// src/utils/routeValidation.ts
// 第一版开发期数据校验
// 仅在 import.meta.env.DEV 时自动运行，生产环境不执行

import type { Attraction, Route, RouteLeg } from '../types';
import { calculateRouteTotals } from '../data/routes';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  routeId: string;
  rule: string;
  message: string;
}

export interface ValidationReport {
  ok: boolean;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
  routeSummaries: Array<{
    routeId: string;
    duration: string;
    stopCount: number;
    legCount: number;
    totalDistance: number;
    totalTransportTime: number;
    mcpVerificationStatus: string;
  }>;
}

/**
 * 校验规则：
 * 1. 单日路线（无 day 字段）：stops.length === legs.length + 1
 * 2. 多日路线（任一 stop 含 day 字段）：按 day 分组，
 *    每组 stops 数量 === legs 数量 + 1；
 *    首日末站 → 次日首站 之间不建立 leg
 * 3. legs 中所有 attractionId 在 attractions 中存在
 * 4. stops 中所有 attractionId 在 attractions 中存在
 * 5. totalDistance === legs 距离之和
 * 6. totalTransportTime === legs 时间之和
 * 7. fully-verified 路线的所有 leg 必须 verified
 * 8. stops 不重复
 * 9. H1、H2 只能是 half-day
 * 10. R1-R4 只能是 one-day
 * 11. R5 只能是 two-day
 */
export function validateRoutes(
  routes: Route[],
  attractions: Attraction[],
): ValidationReport {
  const issues: ValidationIssue[] = [];
  const attractionIds = new Set(attractions.map((a) => a.id));
  const routeSummaries: ValidationReport['routeSummaries'] = [];

  for (const route of routes) {
    const { id: routeId, legs, stops } = route;

    // 判断是否多日路线
    const hasMultiDayStops = stops.some((s) => s.day !== undefined);

    // ---------- 1 & 2. stops vs legs 关系 ----------
    if (hasMultiDayStops) {
      // 多日：按 day 分组分别校验
      const stopsByDay = new Map<number, number>();
      for (const s of stops) {
        const d = s.day ?? 1;
        stopsByDay.set(d, (stopsByDay.get(d) ?? 0) + 1);
      }

      // legs 的 day 由其 fromAttractionId 在 stops 中所属 day 决定
      const dayByAttractionId = new Map<string, number>();
      for (const s of stops) {
        if (s.day !== undefined) {
          dayByAttractionId.set(s.attractionId, s.day);
        }
      }
      const legsByDay = new Map<number, number>();
      for (const leg of legs) {
        const d = dayByAttractionId.get(leg.fromAttractionId) ?? 1;
        legsByDay.set(d, (legsByDay.get(d) ?? 0) + 1);
      }

      // 对每一天校验 stops === legs + 1
      const allDays = new Set<number>([
        ...stopsByDay.keys(),
        ...legsByDay.keys(),
      ]);
      for (const d of Array.from(allDays).sort((a, b) => a - b)) {
        const sCount = stopsByDay.get(d) ?? 0;
        const lCount = legsByDay.get(d) ?? 0;
        if (sCount !== lCount + 1) {
          issues.push({
            severity: 'error',
            routeId,
            rule: 'day-stops-vs-legs',
            message: `Day ${d}：stops (${sCount}) 应等于 legs + 1 (${lCount + 1})`,
          });
        }
      }
    } else {
      // 单日：stops === legs + 1
      if (stops.length !== legs.length + 1) {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'stops-vs-legs',
          message: `stops.length (${stops.length}) 应等于 legs.length + 1 (${legs.length + 1})`,
        });
      }
    }

    // ---------- 3. legs 中所有 attractionId 在 attractions 中存在 ----------
    for (const leg of legs) {
      if (!attractionIds.has(leg.fromAttractionId)) {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'leg-attraction-exists',
          message: `leg.fromAttractionId "${leg.fromAttractionId}" 在 attractions 中不存在`,
        });
      }
      if (!attractionIds.has(leg.toAttractionId)) {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'leg-attraction-exists',
          message: `leg.toAttractionId "${leg.toAttractionId}" 在 attractions 中不存在`,
        });
      }
    }

    // ---------- 4. stops 中所有 attractionId 在 attractions 中存在 ----------
    for (const stop of stops) {
      if (!attractionIds.has(stop.attractionId)) {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'stop-attraction-exists',
          message: `stop.attractionId "${stop.attractionId}" 在 attractions 中不存在`,
        });
      }
    }

    // ---------- 5 & 6. totalDistance / totalTransportTime 与 legs 求和一致 ----------
    const { totalDistance: sumDist, totalTransportTime: sumTime } =
      calculateRouteTotals(legs);
    if (sumDist !== route.totalDistance) {
      issues.push({
        severity: 'error',
        routeId,
        rule: 'total-distance-consistent',
        message: `totalDistance ${route.totalDistance} ≠ legs 求和 ${sumDist}`,
      });
    }
    if (sumTime !== route.totalTransportTime) {
      issues.push({
        severity: 'error',
        routeId,
        rule: 'total-time-consistent',
        message: `totalTransportTime ${route.totalTransportTime} ≠ legs 求和 ${sumTime}`,
      });
    }

    // ---------- 7. fully-verified 路线的所有 leg 必须 verified ----------
    if (route.mcpVerificationStatus === 'fully-verified') {
      for (const leg of legs) {
        if (leg.verificationStatus !== 'verified') {
          issues.push({
            severity: 'error',
            routeId,
            rule: 'fully-verified-legs',
            message: `fully-verified 路线的 leg 必须 verified；当前 leg ${leg.fromAttractionId}→${leg.toAttractionId} = ${leg.verificationStatus}`,
          });
        }
      }
    }

    // ---------- 8. stops 不重复 ----------
    const seen = new Set<string>();
    for (const stop of stops) {
      if (seen.has(stop.attractionId)) {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'no-duplicate-stops',
          message: `重复 stop: ${stop.attractionId}`,
        });
      }
      seen.add(stop.attractionId);
    }

    // ---------- 9-11. duration 约束 ----------
    if (routeId === 'H1' || routeId === 'H2') {
      if (route.duration !== 'half-day') {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'half-day-id',
          message: `${routeId} 必须是 half-day；当前 ${route.duration}`,
        });
      }
    } else if (
      routeId === 'R1' ||
      routeId === 'R2' ||
      routeId === 'R3' ||
      routeId === 'R4'
    ) {
      if (route.duration !== 'one-day') {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'one-day-id',
          message: `${routeId} 必须是 one-day；当前 ${route.duration}`,
        });
      }
    } else if (routeId === 'R5') {
      if (route.duration !== 'two-day') {
        issues.push({
          severity: 'error',
          routeId,
          rule: 'two-day-id',
          message: `R5 必须是 two-day；当前 ${route.duration}`,
        });
      }
    }

    routeSummaries.push({
      routeId,
      duration: route.duration,
      stopCount: stops.length,
      legCount: legs.length,
      totalDistance: route.totalDistance,
      totalTransportTime: route.totalTransportTime,
      mcpVerificationStatus: route.mcpVerificationStatus,
    });
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  return {
    ok: errorCount === 0,
    errorCount,
    warningCount,
    issues,
    routeSummaries,
  };
}

/**
 * 开发期自动运行入口；生产环境不执行。
 * 用法：在 main.tsx 顶部调用 runDevValidation(routes, attractions)。
 */
export function runDevValidation(
  routes: Route[],
  attractions: Attraction[],
): void {
  if (!import.meta.env.DEV) return; // 生产环境不运行

  const report = validateRoutes(routes, attractions);

  // eslint-disable-next-line no-console
  console.groupCollapsed(
    `[routeValidation] 路线校验 ${report.ok ? '✓ 通过' : '✗ 失败'} · 错误 ${report.errorCount} 警告 ${report.warningCount}`,
  );

  // eslint-disable-next-line no-console
  console.table(report.routeSummaries);

  if (report.issues.length > 0) {
    // eslint-disable-next-line no-console
    console.group('Issues');
    for (const issue of report.issues) {
      // eslint-disable-next-line no-console
      console.error(`[${issue.severity.toUpperCase()}] ${issue.routeId} · ${issue.rule}: ${issue.message}`);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  // eslint-disable-next-line no-console
  console.groupEnd();
}

/**
 * 期望值（来自 docs/mcp-verification.md 与规划 §5）
 * 用于人工对照；与 calculateRouteTotals 计算结果应完全一致。
 */
export const EXPECTED_ROUTE_TOTALS: Record<
  string,
  { totalDistance: number; totalTransportTime: number }
> = {
  R1: { totalDistance: 17118, totalTransportTime: 3525 },
  R2: { totalDistance: 16731, totalTransportTime: 3183 },
  R3: { totalDistance: 13019, totalTransportTime: 3120 },
  R4: { totalDistance: 32120, totalTransportTime: 3669 },
  R5: { totalDistance: 26363, totalTransportTime: 4738 },
  H1: { totalDistance: 1418, totalTransportTime: 1134 },
  H2: { totalDistance: 5810, totalTransportTime: 1049 },
};

export interface ExpectedTotalMismatch {
  routeId: string;
  expectedDistance: number;
  actualDistance: number;
  expectedTime: number;
  actualTime: number;
}

/**
 * 与期望值对照；如有差异，返回差异列表。
 * 第一版要求：若与规划不一致，立即停止并报告，不要自行修改 MCP 数据。
 */
export function diffAgainstExpected(
  routes: Route[],
): ExpectedTotalMismatch[] {
  const mismatches: ExpectedTotalMismatch[] = [];
  for (const r of routes) {
    const expected = EXPECTED_ROUTE_TOTALS[r.id];
    if (!expected) continue;
    if (
      expected.totalDistance !== r.totalDistance ||
      expected.totalTransportTime !== r.totalTransportTime
    ) {
      mismatches.push({
        routeId: r.id,
        expectedDistance: expected.totalDistance,
        actualDistance: r.totalDistance,
        expectedTime: expected.totalTransportTime,
        actualTime: r.totalTransportTime,
      });
    }
  }
  return mismatches;
}

/**
 * 便捷：直接断言某条腿的核验状态为 verified。
 * 用于校验脚本中。
 */
export function assertLegVerified(leg: RouteLeg): boolean {
  return leg.verificationStatus === 'verified';
}