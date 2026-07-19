// src/utils/recommend.ts
// 第一版本地路线推荐引擎
// 严格遵守：仅在 7 条已核验路线（R1-R5 + H1/H2）内评分匹配
// 禁止：动态生成新顺序 / 拼接路线 / 修改已核验数据 / 编造新 leg

import type {
  Companions,
  GeneratedItinerary,
  InterestTag,
  KeywordRule,
  Pace,
  Preference,
  Route,
  TransportMode,
} from '../types';
import { routes } from '../data/routes';
import { matchKeywords } from '../data/keywordRules';

// ============================================================
// 兴趣枚举单一来源（与 types InterestTag + routes data + 表单一致）
// ============================================================
export const INTEREST_TYPES = [
  '顺德美食',
  '岭南园林',
  '水乡古村',
  '历史文化',
  '亲子体验',
  '摄影打卡',
  '城市夜游',
  '艺术空间',
] as const satisfies readonly InterestTag[];

const SCOPE_NOTICE =
  '里程与交通时间仅统计相邻景点之间的已核验路段，不含出发地接驳、住宿、候车、停车及景区内部游览时间。';

const CUSTOM_LOCATION_NOTICE =
  '自定义出发地仅作为备注，第一版不计算接驳距离与时间；按"已到达顺德"参与推荐。';

const PUBLIC_TRANSIT_NOTICE =
  '该路线的公共交通时间尚未核验，页面所列路线数据不代表实际公交耗时。请在出发前通过高德地图 APP 或网页实时查询。';

const GUANGZHOU_FOSHAN_NOTICE =
  '广州南站 / 佛山西站到顺德各景点的接驳时间和里程可能因交通方式与时段大幅变化，第一版不展示。建议优先使用城际列车 / 地铁到顺德站或顺德学院站，再进入顺德本地路线。';

const KEYWORD_PARTIAL_NOTICE =
  '补充说明仅进行了关键词匹配，未识别内容不会影响基础偏好推荐。';

// 公共交通：跨镇街 / 主要驾车 → 排除
// half-day: H1, H2
// one-day: R1, R2, R3, R4
// two-day: R5
const TRANSIT_DENY_IDS_BY_DURATION: Record<string, ReadonlyArray<string>> = {
  'half-day': [],                       // 半天都是地点集中，不排除
  'one-day': ['R4'],                     // R4 跨北滘/容桂，公共交通不友好
  'two-day': [],                         // R5 含跨镇街但有市内段；此处保守保留
};

const CUSTOM_LOCATIONS: ReadonlyArray<string> = ['custom'];
const TRANSIT_LOCATIONS: ReadonlyArray<string> = [
  'guangzhou-south',
  'foshan-west',
];

export interface ScoredRoute {
  route: Route;
  score: number;
  matchedInterestCount: number;
}

/**
 * 主推荐入口
 */
// ============================================================
// 评分明细（开发期）
// 返回每条候选路线的各项得分，便于诊断"为什么 R4 没有排第一"等问题
// ============================================================
export interface RouteScoreDetail {
  routeId: string;
  passedHardFilter: boolean;
  rejectReason?: string;
  matchedInterests: InterestTag[];
  interestScore: number;
  companionScore: number;
  transportScore: number;
  paceScore: number;
  keywordScore: number;
  walkingPenalty: number;
  totalScore: number;
  totalDistance: number;
  finalRank: number;
}

export interface RecommendationDebug {
  pref: Preference;
  keywordRules: KeywordRule[];
  candidates: RouteScoreDetail[];
}

export function getRecommendationDebug(pref: Preference): RecommendationDebug {
  const kw = matchKeywords(pref.notes ?? '');

  // 硬过滤
  const afterDuration = filterByDuration(pref.duration, routes);
  const afterTransit =
    pref.transportMode === 'transit'
      ? filterByTransit(pref.duration, afterDuration)
      : afterDuration;

  const passedIds = new Set(afterTransit.map((r) => r.id));
  const interestSet = new Set<InterestTag>(pref.interests);

  // 全 7 条都列出，便于查看哪些被过滤
  const details: RouteScoreDetail[] = routes.map((r) => {
    const passed = passedIds.has(r.id);
    if (!passed) {
      // 计算"为什么被过滤"
      const reason = !afterDuration.find((x) => x.id === r.id)
        ? `天数过滤（${pref.duration}）`
        : `公共交通过滤（排除 ${r.id}）`;
      return {
        routeId: r.id,
        passedHardFilter: false,
        rejectReason: reason,
        matchedInterests: [],
        interestScore: 0,
        companionScore: 0,
        transportScore: 0,
        paceScore: 0,
        keywordScore: 0,
        walkingPenalty: 0,
        totalScore: 0,
        totalDistance: r.totalDistance,
        finalRank: -1,
      };
    }

    const matchedInterests = r.interests.filter((t) => interestSet.has(t));
    const interestScore = matchedInterests.length * 5;
    const companionScore = r.suitableFor.includes(pref.companions) ? 4 : 0;
    const transportScore = routeTransportMatch(r, pref.transportMode) ? 4 : 0;
    const paceScore = r.pace === pref.pace ? 3 : 0;
    const keywordScore = kw.matchedRules.reduce(
      (s, r2) => s + r2.weight,
      0,
    );
    const walkingMeters = routeWalkingMeters(r);
    const walkingPenalty =
      pref.companions === 'with-parents' && walkingMeters > 1500 ? -6 : 0;
    const totalScore =
      interestScore +
      companionScore +
      transportScore +
      paceScore +
      keywordScore +
      walkingPenalty;
    return {
      routeId: r.id,
      passedHardFilter: true,
      matchedInterests,
      interestScore,
      companionScore,
      transportScore,
      paceScore,
      keywordScore,
      walkingPenalty,
      totalScore,
      totalDistance: r.totalDistance,
      finalRank: -1,
    };
  });

  // 排序（与主函数一致）
  const sorted = [...details]
    .filter((d) => d.passedHardFilter)
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.matchedInterests.length !== a.matchedInterests.length)
        return b.matchedInterests.length - a.matchedInterests.length;
      if (a.totalDistance !== b.totalDistance)
        return a.totalDistance - b.totalDistance;
      return a.routeId.localeCompare(b.routeId);
    });
  sorted.forEach((d, i) => (d.finalRank = i + 1));

  // 把未通过的放后面
  const rejected = details.filter((d) => !d.passedHardFilter);
  return {
    pref,
    keywordRules: kw.matchedRules,
    candidates: [...sorted, ...rejected],
  };
}

export function recommendItinerary(preference: Preference): GeneratedItinerary {
  try {
    // 关键词处理
    const kwResult = matchKeywords(preference.notes ?? '');

    // 1) 硬过滤：天数
    let candidates = filterByDuration(preference.duration, routes);

    // 2) 硬过滤：公共交通 + 跨镇街
    if (preference.transportMode === 'transit') {
      candidates = filterByTransit(preference.duration, candidates);
    }

    // 3) 评分
    const scored: ScoredRoute[] = candidates.map((r) =>
      scoreRoute(r, preference, kwResult.matchedRules),
    );

    // 4) 同分排序
    scored.sort(compareScoredRoutes);

    // 5) 选择 Top 1
    if (scored.length === 0) {
      return buildEmpty(preference, kwResult);
    }

    const top = scored[0];
    return buildResult(top, preference, kwResult);
  } catch (err) {
    return buildError(preference, err);
  }
}

// ============================================================
// 硬过滤
// ============================================================

function filterByDuration(d: Preference['duration'], pool: Route[]): Route[] {
  switch (d) {
    case 'half-day':
      return pool.filter((r) => r.id === 'H1' || r.id === 'H2');
    case 'one-day':
      return pool.filter((r) => ['R1', 'R2', 'R3', 'R4'].includes(r.id));
    case 'two-day':
      return pool.filter((r) => r.id === 'R5');
    default:
      return [];
  }
}

function filterByTransit(d: Preference['duration'], pool: Route[]): Route[] {
  const deny = new Set(TRANSIT_DENY_IDS_BY_DURATION[d] ?? []);
  return pool.filter((r) => !deny.has(r.id));
}

// ============================================================
// 评分
// ============================================================

function scoreRoute(
  route: Route,
  pref: Preference,
  matchedRules: KeywordRule[],
): ScoredRoute {
  const interestSet = new Set<InterestTag>(pref.interests);
  let score = 0;
  let matchedInterestCount = 0;

  // 兴趣：每匹配一项 +5
  for (const tag of route.interests) {
    if (interestSet.has(tag)) {
      score += 5;
      matchedInterestCount += 1;
    }
  }

  // 同行人：匹配 +4
  if (route.suitableFor.includes(pref.companions)) {
    score += 4;
  }

  // 交通方式：匹配 +4
  if (routeTransportMatch(route, pref.transportMode)) {
    score += 4;
  }

  // 节奏：匹配 +3
  if (route.pace === pref.pace) {
    score += 3;
  }

  // 关键词：按 weight 累加
  for (const rule of matchedRules) {
    score += rule.weight;
  }

  // 带父母 + 路线步行 > 1.5km：-6
  if (pref.companions === 'with-parents' && routeWalkingMeters(route) > 1500) {
    score -= 6;
  }

  return { route, score, matchedInterestCount };
}

function routeTransportMatch(
  route: Route,
  mode: TransportMode,
): boolean {
  switch (mode) {
    case 'driving':
    case 'taxi':
      // 全部 7 条都可（自驾/打车）
      return true;
    case 'walking':
      return route.id === 'H1' || route.id === 'H2' || route.id === 'R3';
    case 'transit':
      // 公共交通：H1/H2 步行不依赖公交；R1/R3 大良老城相对友好
      return ['H1', 'H2', 'R1', 'R3'].includes(route.id);
    case 'mixed':
      return true;
    default:
      return false;
  }
}

function routeWalkingMeters(route: Route): number {
  let m = 0;
  for (const leg of route.legs) {
    if (leg.mode === 'walking') m += leg.distanceMeters;
  }
  return m;
}

// ============================================================
// 排序
// ============================================================

function compareScoredRoutes(a: ScoredRoute, b: ScoredRoute): number {
  // 1) 分数
  if (b.score !== a.score) return b.score - a.score;
  // 2) 兴趣匹配数
  if (b.matchedInterestCount !== a.matchedInterestCount)
    return b.matchedInterestCount - a.matchedInterestCount;
  // 3) 总距离更短
  if (a.route.totalDistance !== b.route.totalDistance)
    return a.route.totalDistance - b.route.totalDistance;
  // 4) ID 字典序
  return a.route.id.localeCompare(b.route.id);
}

// ============================================================
// 结果构造
// ============================================================

function buildResult(
  top: ScoredRoute,
  pref: Preference,
  kwResult: ReturnType<typeof matchKeywords>,
): GeneratedItinerary {
  const { route, score } = top;
  const reasons = buildReasons(top, pref, kwResult.matchedRules);
  const notices = buildNotices(pref, route);

  return {
    title: route.title,
    summary: route.subtitle,
    matchedRouteId: route.id,
    matchedKeywordRules: kwResult.matchedRules,
    unmatchedText: kwResult.hasUnmatchedContent ? kwResult.originalText : undefined,
    unmatchedNotice: kwResult.hasUnmatchedContent
      ? KEYWORD_PARTIAL_NOTICE
      : '',
    score,
    reasons,
    stops: route.stops,
    totalDistance: route.totalDistance,
    totalTransportTime: route.totalTransportTime,
    notices: [
      SCOPE_NOTICE,
      ...notices,
    ],
  };
}

function buildEmpty(
  _pref: Preference,
  kwResult: ReturnType<typeof matchKeywords>,
): GeneratedItinerary {
  return {
    title: '暂无可推荐的路线',
    summary: '根据当前条件未匹配到已核验的路线；可调整天数或交通方式后重试。',
    matchedKeywordRules: kwResult.matchedRules,
    unmatchedText: kwResult.hasUnmatchedContent ? kwResult.originalText : undefined,
    unmatchedNotice: kwResult.hasUnmatchedContent
      ? KEYWORD_PARTIAL_NOTICE
      : '',
    score: 0,
    reasons: [
      '当前天数与交通方式组合下，没有匹配到 7 条已核验路线中的任何一条。',
    ],
    stops: [],
    totalDistance: 0,
    totalTransportTime: 0,
    notices: [
      SCOPE_NOTICE,
      '建议：把交通方式改为"自驾"或"打车"以扩大候选范围。',
    ],
  };
}

function buildError(
  _pref: Preference,
  err: unknown,
): GeneratedItinerary {
  // eslint-disable-next-line no-console
  console.error('[recommend] 推荐异常：', err);
  return {
    title: '推荐暂不可用',
    summary: '推荐引擎出现异常，请稍后重试。',
    score: 0,
    reasons: ['推荐过程中出现异常，未输出具体推荐。'],
    unmatchedNotice: '',
    stops: [],
    totalDistance: 0,
    totalTransportTime: 0,
    notices: [
      SCOPE_NOTICE,
      '本工具为第一版静态匹配，未连接在线大模型。',
    ],
  };
}

function buildReasons(
  scored: ScoredRoute,
  pref: Preference,
  matchedRules: KeywordRule[],
): string[] {
  const reasons: string[] = [];
  const { route, matchedInterestCount } = scored;

  // 兴趣
  if (matchedInterestCount > 0) {
    const matched = route.interests.filter((t) => pref.interests.includes(t));
    if (matched.length > 0) {
      reasons.push(
        `你选择了 ${matched.join('、')}，这条路线同时覆盖：${route.interests
          .filter((t) => pref.interests.includes(t))
          .join('、')}。`,
      );
    }
  }

  // 同行人
  if (route.suitableFor.includes(pref.companions)) {
    const compLabel = labelCompanions(pref.companions);
    reasons.push(
      `同行人为${compLabel}，该路线节奏${labelPace(route.pace)}，节奏匹配。`,
    );
  }

  // 节奏
  if (route.pace === pref.pace) {
    reasons.push(`节奏选择"${labelPace(pref.pace)}"，与该路线节奏一致。`);
  }

  // 交通
  if (routeTransportMatch(route, pref.transportMode)) {
    reasons.push(
      `交通方式为"${labelTransport(pref.transportMode)}"，与该路线匹配。`,
    );
  }

  // 关键词
  for (const rule of matchedRules) {
    reasons.push(`补充说明中提到"${rule.description.split('；')[0]}"，提高该路线匹配度。`);
  }

  // 兜底
  if (reasons.length === 0) {
    reasons.push('根据当前偏好与已核验路线数据综合匹配。');
  }

  return reasons;
}

function buildNotices(pref: Preference, _route: Route): string[] {
  const out: string[] = [];

  // 公共交通
  if (pref.transportMode === 'transit') {
    out.push(PUBLIC_TRANSIT_NOTICE);
  }

  // 自定义出发地
  if (CUSTOM_LOCATIONS.includes(pref.startLocation)) {
    out.push(CUSTOM_LOCATION_NOTICE);
  }

  // 跨城车站
  if (TRANSIT_LOCATIONS.includes(pref.startLocation)) {
    out.push(GUANGZHOU_FOSHAN_NOTICE);
  }

  return out;
}

// ============================================================
// 中文标签（轻量）
// ============================================================

function labelCompanions(c: Companions): string {
  switch (c) {
    case 'solo':
      return '独自';
    case 'couple':
      return '情侣';
    case 'friends':
      return '朋友';
    case 'with-kids':
      return '带孩子';
    case 'with-parents':
      return '带父母';
  }
}

function labelPace(p: Pace): string {
  switch (p) {
    case 'relaxed':
      return '悠闲';
    case 'standard':
      return '经典适中';
    case 'compact':
      return '尽量多玩';
  }
}

function labelTransport(t: TransportMode): string {
  switch (t) {
    case 'driving':
      return '自驾';
    case 'taxi':
      return '打车';
    case 'walking':
      return '步行优先';
    case 'transit':
      return '公共交通';
    case 'mixed':
      return '混合';
  }
}