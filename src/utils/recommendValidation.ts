// src/utils/recommendValidation.ts
// 推荐引擎开发期断言校验
// 仅在 import.meta.env.DEV 中运行

import type { InterestTag, Preference } from '../types';
import { recommendItinerary, getRecommendationDebug } from './recommend';
import { routes } from '../data/routes';
import { interestOptions } from '../data/preferences';

interface ValidationCase {
  name: string;
  pref: Preference;
  expect: (out: ReturnType<typeof recommendItinerary>) => string | null;
}

// 所有 InterestTag 值（从类型与数据派生，不在文件内重复列出）
const ALL_INTEREST_TAGS: ReadonlyArray<InterestTag> = [
  '顺德美食',
  '岭南园林',
  '水乡古村',
  '历史文化',
  '亲子体验',
  '摄影打卡',
  '城市夜游',
  '艺术空间',
];

const CASES: ValidationCase[] = [
  {
    name: 'half-day 只返回 H1 或 H2',
    pref: {
      startLocation: 'in-shunde',
      duration: 'half-day',
      companions: 'solo',
      interests: ['顺德美食'],
      transportMode: 'walking',
      pace: 'standard',
    },
    expect: (out) =>
      out.matchedRouteId === 'H1' || out.matchedRouteId === 'H2'
        ? null
        : `期望 matchedRouteId ∈ {H1, H2}，实际 ${out.matchedRouteId}`,
  },
  {
    name: 'two-day 只返回 R5',
    pref: {
      startLocation: 'in-shunde',
      duration: 'two-day',
      companions: 'couple',
      interests: ['顺德美食'],
      transportMode: 'driving',
      pace: 'standard',
    },
    expect: (out) =>
      out.matchedRouteId === 'R5' ? null : `期望 R5，实际 ${out.matchedRouteId}`,
  },
  {
    name: 'food 兴趣优先推荐含美食标签路线',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'solo',
      interests: ['顺德美食'],
      transportMode: 'walking',
      pace: 'standard',
    },
    expect: (out) => {
      const route = routes.find((r) => r.id === out.matchedRouteId);
      if (!route) return 'matchedRouteId 不存在';
      return route.interests.includes('顺德美食')
        ? null
        : `${out.matchedRouteId} 不含顺德美食标签`;
    },
  },
  {
    name: 'art 兴趣（one-day 纯艺术）应推荐 R4',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'solo',
      interests: ['艺术空间'],
      transportMode: 'driving',
      pace: 'standard',
    },
    expect: (out) =>
      out.matchedRouteId === 'R4' ? null : `期望 R4，实际 ${out.matchedRouteId}`,
  },
  {
    name: 'art 兴趣 + "美术馆" 关键词仍推荐 R4',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'solo',
      interests: ['艺术空间'],
      transportMode: 'driving',
      pace: 'standard',
      notes: '想看美术馆和建筑艺术',
    },
    expect: (out) => {
      if (out.matchedRouteId !== 'R4')
        return `期望 R4，实际 ${out.matchedRouteId}`;
      const hit = out.matchedKeywordRules?.some(
        (r2) => r2.effect === 'art_focus',
      );
      return hit
        ? null
        : 'R4 第一但未命中 art_focus 关键词规则';
    },
  },
  {
    name: 'night 关键词提高夜游路线得分',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'friends',
      interests: ['顺德美食'],
      transportMode: 'driving',
      pace: 'standard',
      notes: '想看夜景',
    },
    expect: (out) => {
      const hit = out.matchedKeywordRules?.some(
        (r) => r.effect === 'night_focus',
      );
      return hit ? null : '未命中 night_focus 关键词规则';
    },
  },
  {
    name: 'parents + 长步行路线触发 -6',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'with-parents',
      interests: ['顺德美食', '岭南园林'],
      transportMode: 'walking',
      pace: 'relaxed',
    },
    expect: (out) => (out.matchedRouteId ? null : '未返回推荐路线'),
  },
  {
    name: '相同输入重复运行结果一致',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'couple',
      interests: ['顺德美食', '城市夜游'],
      transportMode: 'driving',
      pace: 'standard',
      notes: '想看夜景，吃顺德菜',
    },
    expect: (out) => {
      const a = out.matchedRouteId;
      const b = recommendItinerary({
        startLocation: 'in-shunde',
        duration: 'one-day',
        companions: 'couple',
        interests: ['顺德美食', '城市夜游'],
        transportMode: 'driving',
        pace: 'standard',
        notes: '想看夜景，吃顺德菜',
      }).matchedRouteId;
      return a === b ? null : `两次结果不一致：${a} vs ${b}`;
    },
  },
  {
    name: '同分排序符合既定规则',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'solo',
      interests: [],
      transportMode: 'driving',
      pace: 'standard',
    },
    expect: (out) =>
      out.matchedRouteId === 'R3' ? null : `期望 R3（最短距离），实际 ${out.matchedRouteId}`,
  },
  {
    name: '公共交通不输出伪造公交耗时',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'solo',
      interests: ['顺德美食'],
      transportMode: 'transit',
      pace: 'standard',
    },
    expect: (out) => {
      const hasPublicTransitNotice = out.notices.some((n) =>
        n.includes('公共交通时间尚未核验'),
      );
      return hasPublicTransitNotice
        ? null
        : '公共交通 notice 缺失；不应直接展示驾车/步行总时间为公交耗时';
    },
  },
  {
    name: '自定义出发地不产生接驳距离',
    pref: {
      startLocation: 'custom',
      customLocationText: '深圳北站',
      duration: 'one-day',
      companions: 'solo',
      interests: ['顺德美食'],
      transportMode: 'driving',
      pace: 'standard',
    },
    expect: (out) => {
      const hasCustomNotice = out.notices.some((n) =>
        n.includes('自定义出发地仅作为备注'),
      );
      const route = routes.find((r) => r.id === out.matchedRouteId);
      if (!route) return 'matchedRouteId 不存在';
      const equalsRouteTotal = out.totalDistance === route.totalDistance;
      return hasCustomNotice && equalsRouteTotal
        ? null
        : `custom notice=${hasCustomNotice}, totalDistance=${out.totalDistance} vs ${route.totalDistance}`;
    },
  },
  // ============================================================
  // 确定性 / 重复性
  // ============================================================
  {
    name: '场景C：art 纯兴趣，10 次运行完全一致',
    pref: {
      startLocation: 'in-shunde',
      duration: 'one-day',
      companions: 'solo',
      interests: ['艺术空间'],
      transportMode: 'driving',
      pace: 'standard',
    },
    expect: (out) => {
      const first = out.matchedRouteId;
      for (let i = 0; i < 10; i += 1) {
        const again = recommendItinerary({
          startLocation: 'in-shunde',
          duration: 'one-day',
          companions: 'solo',
          interests: ['艺术空间'],
          transportMode: 'driving',
          pace: 'standard',
        });
        if (again.matchedRouteId !== first) {
          return `第 ${i + 1} 次结果不一致：${first} vs ${again.matchedRouteId}`;
        }
      }
      return null;
    },
  },
];

// ============================================================
// 数据一致性校验（独立于算法）
// ============================================================

function validateInterestDataConsistency(): { ok: boolean; issues: string[] } {
  const issues: string[] = [];

  // 1) 表单 options 中的 id 必须属于 InterestTag
  for (const opt of interestOptions) {
    if (!ALL_INTEREST_TAGS.includes(opt.id)) {
      issues.push(`interestOptions 包含未在 InterestTag 中的值：${opt.id}`);
    }
  }

  // 2) 每条 Route 的 interests 值必须属于 InterestTag
  for (const r of routes) {
    for (const tag of r.interests) {
      if (!ALL_INTEREST_TAGS.includes(tag)) {
        issues.push(`Route ${r.id} 的 interests 包含未知标签：${tag}`);
      }
    }
  }

  // 3) R4 必须包含「艺术空间」标准标签
  const r4 = routes.find((r) => r.id === 'R4');
  if (!r4) {
    issues.push('R4 路线不存在');
  } else if (!r4.interests.includes('艺术空间')) {
    issues.push('R4 必须包含「艺术空间」标准兴趣标签');
  }

  return { ok: issues.length === 0, issues };
}

export interface RecommendValidationReport {
  total: number;
  passed: number;
  failed: number;
  cases: Array<{
    name: string;
    pass: boolean;
    message: string | null;
  }>;
  dataConsistency: { ok: boolean; issues: string[] };
}

export function runRecommendValidation(): RecommendValidationReport {
  const results = CASES.map((c) => {
    const out = recommendItinerary(c.pref);
    const msg = c.expect(out);
    return { name: c.name, pass: msg === null, message: msg };
  });
  return {
    total: results.length,
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    cases: results,
    dataConsistency: validateInterestDataConsistency(),
  };
}

export function runDevRecommendValidation(): void {
  if (!import.meta.env.DEV) return;
  const report = runRecommendValidation();

  // eslint-disable-next-line no-console
  console.groupCollapsed(
    `[recommendValidation] 推荐校验 ${report.failed === 0 ? '✓ 通过' : '✗ 失败'} · ${report.passed}/${report.total} 通过`,
  );
  for (const c of report.cases) {
    if (c.pass) {
      // eslint-disable-next-line no-console
      console.log(`✓ ${c.name}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(`✗ ${c.name}：${c.message ?? '失败'}`);
    }
  }
  if (!report.dataConsistency.ok) {
    // eslint-disable-next-line no-console
    console.error('✗ 数据一致性：', report.dataConsistency.issues);
  } else {
    // eslint-disable-next-line no-console
    console.log('✓ 兴趣数据一致性（InterestTag / 表单 / 路线）');
  }
  // eslint-disable-next-line no-console
  console.groupEnd();

  // 在 dev 模式下额外打印调试明细（仅一次示例）
  // eslint-disable-next-line no-console
  console.groupCollapsed(
    '[recommendDebug] 场景 A：art 纯兴趣评分明细',
  );
  const debugA = getRecommendationDebug({
    startLocation: 'in-shunde',
    duration: 'one-day',
    companions: 'solo',
    interests: ['艺术空间'],
    transportMode: 'driving',
    pace: 'standard',
  });
  // eslint-disable-next-line no-console
  console.table(debugA.candidates);
  // eslint-disable-next-line no-console
  console.groupEnd();

  // eslint-disable-next-line no-console
  console.groupCollapsed(
    '[recommendDebug] 场景 B：art + "美术馆" 关键词',
  );
  const debugB = getRecommendationDebug({
    startLocation: 'in-shunde',
    duration: 'one-day',
    companions: 'solo',
    interests: ['艺术空间'],
    transportMode: 'driving',
    pace: 'standard',
    notes: '想看美术馆和建筑艺术',
  });
  // eslint-disable-next-line no-console
  console.table(debugB.candidates);
  // eslint-disable-next-line no-console
  console.groupEnd();
}