// src/data/routes.ts
// 7 条预定义路线（R1-R5 + H1/H2）
// 所有 totalDistance / totalTransportTime 严格由 legs 求和得到
// 数据来源：amap-maps MCP 核验，2026-07-18

import type { Route, RouteLeg } from '../types';

const DATA_NOTICE =
  '地点、营业时间和路线数据于 2026-07-18 通过高德地图 MCP 查询，仅供行程规划参考。实际开放时间、天气和交通情况请在出发前再次核验。';

const VERIFIED_AT = '2026-07-18';

/** 计算一条路线的总里程和总交通时间 */
export function calculateRouteTotals(legs: RouteLeg[]): {
  totalDistance: number;
  totalTransportTime: number;
} {
  let totalDistance = 0;
  let totalTransportTime = 0;
  for (const leg of legs) {
    totalDistance += leg.distanceMeters;
    totalTransportTime += leg.durationSeconds;
  }
  return { totalDistance, totalTransportTime };
}

// ============================================================
// R1 · 初见顺德 · 大良经典一日游
// 清晖园 → 华盖路 → 金榜上街 → 顺峰山公园 → 欢乐海岸PLUS
// 期望总和：17 118 m / 3 525 s
// ============================================================
const R1_LEGS: RouteLeg[] = [
  {
    fromAttractionId: 'A1',
    toAttractionId: 'A2',
    mode: 'walking',
    distanceMeters: 585,
    durationSeconds: 468,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A2',
    toAttractionId: 'A3',
    mode: 'walking',
    distanceMeters: 833,
    durationSeconds: 666,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A3',
    toAttractionId: 'A4',
    mode: 'driving',
    distanceMeters: 9890,
    durationSeconds: 1342,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A4',
    toAttractionId: 'A5',
    mode: 'driving',
    distanceMeters: 5810,
    durationSeconds: 1049,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const R1_TOTALS = calculateRouteTotals(R1_LEGS);

// ============================================================
// R2 · 水乡慢游 · 逢简寻味一日
// 逢简水乡 → 清晖园 → 华盖路 → 金榜上街
// 期望总和：16 731 m / 3 183 s
// ============================================================
const R2_LEGS: RouteLeg[] = [
  {
    fromAttractionId: 'A6',
    toAttractionId: 'A1',
    mode: 'driving',
    distanceMeters: 15313,
    durationSeconds: 2049,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A1',
    toAttractionId: 'A2',
    mode: 'walking',
    distanceMeters: 585,
    durationSeconds: 468,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A2',
    toAttractionId: 'A3',
    mode: 'walking',
    distanceMeters: 833,
    durationSeconds: 666,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const R2_TOTALS = calculateRouteTotals(R2_LEGS);

// ============================================================
// R3 · 园林烟火 · 顺德文化一日游
// 顺峰山公园 → 顺德博物馆 → 清晖园 → 华盖路 → 金榜上街
// 期望总和：13 019 m / 3 120 s
// ============================================================
const R3_LEGS: RouteLeg[] = [
  {
    fromAttractionId: 'A4',
    toAttractionId: 'A7',
    mode: 'driving',
    distanceMeters: 3862,
    durationSeconds: 764,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A7',
    toAttractionId: 'A1',
    mode: 'driving',
    distanceMeters: 7739,
    durationSeconds: 1222,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A1',
    toAttractionId: 'A2',
    mode: 'walking',
    distanceMeters: 585,
    durationSeconds: 468,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A2',
    toAttractionId: 'A3',
    mode: 'walking',
    distanceMeters: 833,
    durationSeconds: 666,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const R3_TOTALS = calculateRouteTotals(R3_LEGS);

// ============================================================
// R4 · 艺术与夜色 · 顺德城市一日游
// 和美术馆 → 欢乐海岸PLUS → 容桂渔人码头
// 期望总和：32 120 m / 3 669 s
// ============================================================
const R4_LEGS: RouteLeg[] = [
  {
    fromAttractionId: 'A9',
    toAttractionId: 'A5',
    mode: 'driving',
    distanceMeters: 22283,
    durationSeconds: 1719,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A5',
    toAttractionId: 'A10',
    mode: 'driving',
    distanceMeters: 9837,
    durationSeconds: 1950,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const R4_TOTALS = calculateRouteTotals(R4_LEGS);

// ============================================================
// R5 · 两日寻味顺德
// Day 1: 顺峰山公园 → 顺德博物馆 → 欢乐海岸PLUS
// Day 2: 逢简水乡 → 清晖园 → 华盖路 → 金榜上街
// 期望总和：26 363 m / 4 738 s
// ============================================================
const R5_LEGS: RouteLeg[] = [
  // Day 1
  {
    fromAttractionId: 'A4',
    toAttractionId: 'A7',
    mode: 'driving',
    distanceMeters: 3862,
    durationSeconds: 764,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A7',
    toAttractionId: 'A5',
    mode: 'driving',
    distanceMeters: 5770,
    durationSeconds: 791,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  // Day 2
  {
    fromAttractionId: 'A6',
    toAttractionId: 'A1',
    mode: 'driving',
    distanceMeters: 15313,
    durationSeconds: 2049,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A1',
    toAttractionId: 'A2',
    mode: 'walking',
    distanceMeters: 585,
    durationSeconds: 468,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A2',
    toAttractionId: 'A3',
    mode: 'walking',
    distanceMeters: 833,
    durationSeconds: 666,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const R5_TOTALS = calculateRouteTotals(R5_LEGS);

// ============================================================
// H1 · 大良老城 · 寻味半日
// 清晖园 → 华盖路 → 金榜上街
// 期望总和：1 418 m / 1 134 s
// ============================================================
const H1_LEGS: RouteLeg[] = [
  {
    fromAttractionId: 'A1',
    toAttractionId: 'A2',
    mode: 'walking',
    distanceMeters: 585,
    durationSeconds: 468,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
  {
    fromAttractionId: 'A2',
    toAttractionId: 'A3',
    mode: 'walking',
    distanceMeters: 833,
    durationSeconds: 666,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const H1_TOTALS = calculateRouteTotals(H1_LEGS);

// ============================================================
// H2 · 山水夜色 · 休闲半日
// 顺峰山公园 → 欢乐海岸PLUS
// 期望总和：5 810 m / 1 049 s
// ============================================================
const H2_LEGS: RouteLeg[] = [
  {
    fromAttractionId: 'A4',
    toAttractionId: 'A5',
    mode: 'driving',
    distanceMeters: 5810,
    durationSeconds: 1049,
    source: 'amap-mcp',
    verifiedAt: VERIFIED_AT,
    verificationStatus: 'verified',
  },
];
const H2_TOTALS = calculateRouteTotals(H2_LEGS);

// ============================================================
// 7 条路线汇总
// ============================================================
export const routes: Route[] = [
  // -------- R1 --------
  {
    id: 'R1',
    title: '初见顺德 · 大良经典一日游',
    subtitle: '园林入眼，烟火入心',
    description: '上午步行游老城清晖园、华盖路与金榜上街，下午打车至顺峰山公园，傍晚抵欢乐海岸 PLUS。',
    duration: 'one-day',
    suitableFor: ['solo', 'couple', 'friends'],
    interests: ['顺德美食', '岭南园林', '历史文化', '城市夜游'],
    transportModes: ['walking', 'driving', 'taxi'],
    pace: 'standard',
    totalDistance: R1_TOTALS.totalDistance,
    totalTransportTime: R1_TOTALS.totalTransportTime,
    startTime: '09:30',
    stops: [
      {
        attractionId: 'A1',
        sequence: 1,
        arrivalTime: '09:30',
        departureTime: '11:00',
        recommendedDuration: 90,
        activities: ['游览清晖园', '欣赏岭南园林', '午后光影最佳'],
        photoTips: '船厅、碧溪草堂、读云轩为经典取景。',
        transportTips: '大良钟楼地铁站 E 口步行约 390 米。',
      },
      {
        attractionId: 'A2',
        sequence: 2,
        arrivalTime: '11:00',
        departureTime: '12:00',
        recommendedDuration: 60,
        activities: ['沿街吃早茶', '逛骑楼老铺'],
        foodTips: '李禧记、公记等老字号可尝。',
        photoTips: '骑楼立面与朱红灯笼。',
      },
      {
        attractionId: 'A3',
        sequence: 3,
        arrivalTime: '12:00',
        departureTime: '12:45',
        recommendedDuration: 45,
        activities: ['品尝双皮奶', '逛牛乳老铺'],
        foodTips: '霞姐双皮奶、欢记牛乳、景松鱼皮等老铺。',
      },
      {
        attractionId: 'A4',
        sequence: 4,
        arrivalTime: '13:30',
        departureTime: '15:00',
        recommendedDuration: 90,
        activities: ['游青云公园', '观粤剧大观园', '湖边散步'],
        transportTips: '从金榜上街打车约 22 分钟。',
        photoTips: '青云塔与桂畔湖。',
      },
      {
        attractionId: 'A5',
        sequence: 5,
        arrivalTime: '15:30',
        departureTime: '18:00',
        recommendedDuration: 150,
        activities: ['曲水湾风情商业街', '夜景拍照', '晚餐'],
        transportTips: '从顺峰山公园驾车约 17 分钟。',
        photoTips: '曲水湾夜景与摩天轮。',
      },
    ],
    legs: R1_LEGS,
    highlights: [
      '园林 · 街巷 · 公园 · 夜游 四大主题一日串联',
      '前段步行紧凑，老城烟火气',
      '傍晚抵欢乐海岸看夜景',
    ],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'mixed-driving-walking',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
  },

  // -------- R2 --------
  {
    id: 'R2',
    title: '水乡慢游 · 逢简寻味一日',
    subtitle: '一水三村，千年烟火',
    description: '上午抵达逢简水乡游船、看祠堂、尝双皮奶，下午回大良老城步行三景点。',
    duration: 'one-day',
    suitableFor: ['solo', 'couple', 'friends', 'with-kids'],
    interests: ['水乡古村', '顺德美食', '摄影打卡'],
    transportModes: ['driving', 'walking', 'taxi'],
    pace: 'relaxed',
    totalDistance: R2_TOTALS.totalDistance,
    totalTransportTime: R2_TOTALS.totalTransportTime,
    startTime: '10:00',
    stops: [
      {
        attractionId: 'A6',
        sequence: 1,
        arrivalTime: '10:00',
        departureTime: '13:00',
        recommendedDuration: 180,
        activities: ['游水乡', '游船', '看祠堂', '品水乡双皮奶'],
        foodTips: '均安蒸猪、水乡私房菜。',
        photoTips: '小桥流水、乌篷船、古榕。',
      },
      {
        attractionId: 'A1',
        sequence: 2,
        arrivalTime: '14:00',
        departureTime: '15:30',
        recommendedDuration: 90,
        activities: ['游清晖园（下午段）'],
        transportTips: '从逢简水乡驾车约 34 分钟。',
      },
      {
        attractionId: 'A2',
        sequence: 3,
        arrivalTime: '15:30',
        departureTime: '16:30',
        recommendedDuration: 60,
        activities: ['沿街美食'],
        foodTips: '华盖路李禧记、公记等。',
      },
      {
        attractionId: 'A3',
        sequence: 4,
        arrivalTime: '16:30',
        departureTime: '17:15',
        recommendedDuration: 45,
        activities: ['尝双皮奶', '逛老铺'],
        foodTips: '霞姐双皮奶、欢记牛乳。',
      },
    ],
    legs: R2_LEGS,
    highlights: ['水乡游船 + 老城步行', '上午水乡避免下午炎热', '顺德本味一日寻'],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'mixed-driving-walking',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
  },

  // -------- R3 --------
  {
    id: 'R3',
    title: '园林烟火 · 顺德文化一日游',
    subtitle: '园里看山，山外见城',
    description: '上午顺峰山公园与顺德博物馆，下午清晖园 + 老城步行三景点。',
    duration: 'one-day',
    suitableFor: ['with-parents', 'with-kids', 'friends'],
    interests: ['岭南园林', '历史文化', '顺德美食'],
    transportModes: ['driving', 'walking', 'taxi'],
    pace: 'standard',
    totalDistance: R3_TOTALS.totalDistance,
    totalTransportTime: R3_TOTALS.totalTransportTime,
    startTime: '09:30',
    stops: [
      {
        attractionId: 'A4',
        sequence: 1,
        arrivalTime: '09:30',
        departureTime: '11:00',
        recommendedDuration: 90,
        activities: ['游青云公园', '观粤剧大观园'],
      },
      {
        attractionId: 'A7',
        sequence: 2,
        arrivalTime: '11:15',
        departureTime: '12:45',
        recommendedDuration: 90,
        activities: ['参观顺德博物馆'],
        transportTips: '从顺峰山公园驾车约 13 分钟。',
        notes: '周一闭馆，注意避开。',
      },
      {
        attractionId: 'A1',
        sequence: 3,
        arrivalTime: '13:30',
        departureTime: '15:00',
        recommendedDuration: 90,
        activities: ['游清晖园'],
        transportTips: '从顺德博物馆驾车约 20 分钟。',
      },
      {
        attractionId: 'A2',
        sequence: 4,
        arrivalTime: '15:00',
        departureTime: '16:00',
        recommendedDuration: 60,
        activities: ['沿街吃早茶', '逛骑楼老铺'],
      },
      {
        attractionId: 'A3',
        sequence: 5,
        arrivalTime: '16:00',
        departureTime: '16:45',
        recommendedDuration: 45,
        activities: ['尝双皮奶', '逛牛乳老铺'],
      },
    ],
    legs: R3_LEGS,
    highlights: ['公园 + 博物馆 + 老城园林 + 美食街一日串联', '适合带父母 / 亲子', '顺德博物馆周一闭馆'],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'mixed-driving-walking',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
  },

  // -------- R4 --------
  {
    id: 'R4',
    title: '艺术与夜色 · 顺德城市一日游',
    subtitle: '从安藤忠雄到德胜河夜色',
    description: '北滘和美术馆 → 大良欢乐海岸 PLUS → 容桂渔人码头。跨镇街自驾或打车。',
    duration: 'one-day',
    suitableFor: ['couple', 'friends', 'solo'],
    interests: ['艺术空间', '城市夜游', '摄影打卡'],
    transportModes: ['driving', 'taxi'],
    pace: 'standard',
    totalDistance: R4_TOTALS.totalDistance,
    totalTransportTime: R4_TOTALS.totalTransportTime,
    startTime: '10:00',
    stops: [
      {
        attractionId: 'A9',
        sequence: 1,
        arrivalTime: '10:00',
        departureTime: '12:30',
        recommendedDuration: 150,
        activities: ['参观和美术馆', '建筑取景'],
        photoTips: '安藤忠雄清水模与圆形中庭。',
      },
      {
        attractionId: 'A5',
        sequence: 2,
        arrivalTime: '13:30',
        departureTime: '16:30',
        recommendedDuration: 180,
        activities: ['曲水湾风情商业街', '午餐', '顺德美食博物馆'],
        transportTips: '从和美术馆驾车约 29 分钟（22 km）。',
        foodTips: '顺德美食博物馆与 A5 同址，可在欢乐海岸 PLUS 集中用餐。',
      },
      {
        attractionId: 'A10',
        sequence: 3,
        arrivalTime: '17:30',
        departureTime: '19:00',
        recommendedDuration: 90,
        activities: ['渔人码头夜景', '灯塔与咖啡馆'],
        transportTips: '从欢乐海岸 PLUS 驾车约 33 分钟。',
        photoTips: '灯塔日落 + 德胜河夜景。',
      },
    ],
    legs: R4_LEGS,
    highlights: ['跨镇街艺术 + 夜色主题', '不适合公共交通', '傍晚渔人码头灯光最佳'],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'amap-driving',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
    notes: '跨镇街路线，建议自驾或打车。',
  },

  // -------- R5 --------
  {
    id: 'R5',
    title: '两日寻味顺德',
    subtitle: '一日园林夜色，一日水乡古村',
    description: 'Day 1：顺峰山公园 + 顺德博物馆 + 欢乐海岸 PLUS；Day 2：逢简水乡 + 大良老城。',
    duration: 'two-day',
    suitableFor: ['solo', 'couple', 'friends', 'with-kids', 'with-parents'],
    interests: ['顺德美食', '岭南园林', '水乡古村', '历史文化', '城市夜游'],
    transportModes: ['driving', 'walking', 'taxi'],
    pace: 'standard',
    totalDistance: R5_TOTALS.totalDistance,
    totalTransportTime: R5_TOTALS.totalTransportTime,
    startTime: '09:30',
    stops: [
      // Day 1
      {
        attractionId: 'A4',
        sequence: 1,
        arrivalTime: '09:30',
        departureTime: '11:00',
        recommendedDuration: 90,
        activities: ['游青云公园', '观粤剧大观园'],
        day: 1,
      },
      {
        attractionId: 'A7',
        sequence: 2,
        arrivalTime: '11:15',
        departureTime: '12:45',
        recommendedDuration: 90,
        activities: ['参观顺德博物馆'],
        day: 1,
        notes: '周一闭馆。',
      },
      {
        attractionId: 'A5',
        sequence: 3,
        arrivalTime: '14:00',
        departureTime: '18:30',
        recommendedDuration: 270,
        activities: ['曲水湾风情商业街', '顺德美食博物馆', '夜景 + 晚餐'],
        day: 1,
        foodTips: '顺德美食博物馆与 A5 同址。',
      },
      // Day 2
      {
        attractionId: 'A6',
        sequence: 4,
        arrivalTime: '10:00',
        departureTime: '13:00',
        recommendedDuration: 180,
        activities: ['游水乡', '游船', '看祠堂', '品水乡双皮奶'],
        day: 2,
        foodTips: '均安蒸猪、水乡私房菜。',
      },
      {
        attractionId: 'A1',
        sequence: 5,
        arrivalTime: '14:00',
        departureTime: '15:30',
        recommendedDuration: 90,
        activities: ['游清晖园'],
        day: 2,
      },
      {
        attractionId: 'A2',
        sequence: 6,
        arrivalTime: '15:30',
        departureTime: '16:30',
        recommendedDuration: 60,
        activities: ['沿街美食'],
        day: 2,
      },
      {
        attractionId: 'A3',
        sequence: 7,
        arrivalTime: '16:30',
        departureTime: '17:15',
        recommendedDuration: 45,
        activities: ['尝双皮奶', '逛牛乳老铺'],
        day: 2,
      },
    ],
    legs: R5_LEGS,
    highlights: [
      '两日覆盖大良 + 逢简',
      'Day 1 看园林与夜色；Day 2 看水乡与美食',
      '路线 5 所有相邻路段均已通过 MCP 核验',
    ],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'mixed-driving-walking',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
    notes: '两日路线，可住宿大良钟楼地铁站附近。',
  },

  // -------- H1 --------
  {
    id: 'H1',
    title: '大良老城 · 寻味半日',
    subtitle: '三步之内，尝尽老城',
    description: '清晖园 + 华盖路 + 金榜上街，半天步行即可串联老城三景点。',
    duration: 'half-day',
    suitableFor: ['solo', 'couple', 'friends', 'with-parents', 'with-kids'],
    interests: ['岭南园林', '顺德美食', '历史文化'],
    transportModes: ['walking'],
    pace: 'standard',
    totalDistance: H1_TOTALS.totalDistance,
    totalTransportTime: H1_TOTALS.totalTransportTime,
    startTime: '09:30',
    stops: [
      {
        attractionId: 'A1',
        sequence: 1,
        arrivalTime: '09:30',
        departureTime: '11:00',
        recommendedDuration: 90,
        activities: ['游览清晖园'],
      },
      {
        attractionId: 'A2',
        sequence: 2,
        arrivalTime: '11:00',
        departureTime: '12:00',
        recommendedDuration: 60,
        activities: ['沿街吃早茶', '逛骑楼老铺'],
        foodTips: '李禧记、公记等老字号。',
      },
      {
        attractionId: 'A3',
        sequence: 3,
        arrivalTime: '12:00',
        departureTime: '12:45',
        recommendedDuration: 45,
        activities: ['尝双皮奶', '逛牛乳老铺'],
        foodTips: '霞姐双皮奶、欢记牛乳。',
      },
    ],
    legs: H1_LEGS,
    highlights: ['老城三景点步行 1.4 km', '半天时间最经典的老城组合', '无任何驾车'],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'amap-walking',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
  },

  // -------- H2 --------
  {
    id: 'H2',
    title: '山水夜色 · 休闲半日',
    subtitle: '一山一海一夜色',
    description: '下午抵达顺峰山公园散步，傍晚赴欢乐海岸 PLUS 看夜景与晚餐。',
    duration: 'half-day',
    suitableFor: ['solo', 'couple', 'friends', 'with-kids'],
    interests: ['岭南园林', '城市夜游', '顺德美食'],
    transportModes: ['driving', 'taxi'],
    pace: 'relaxed',
    totalDistance: H2_TOTALS.totalDistance,
    totalTransportTime: H2_TOTALS.totalTransportTime,
    startTime: '15:00',
    stops: [
      {
        attractionId: 'A4',
        sequence: 1,
        arrivalTime: '15:00',
        departureTime: '17:00',
        recommendedDuration: 120,
        activities: ['游顺峰山公园', '湖边散步'],
      },
      {
        attractionId: 'A5',
        sequence: 2,
        arrivalTime: '17:30',
        departureTime: '20:30',
        recommendedDuration: 180,
        activities: ['曲水湾风情商业街', '夜景', '晚餐'],
        transportTips: '从顺峰山公园驾车约 17 分钟（5.8 km）。',
      },
    ],
    legs: H2_LEGS,
    highlights: ['下午公园 + 傍晚夜景', '半天舒适，不赶时间'],
    mcpVerificationStatus: 'fully-verified',
    distanceScope: 'between-stops-only',
    timeBasis: 'amap-driving',
    verifiedAt: VERIFIED_AT,
    source: 'amap-mcp',
    dataNotice: DATA_NOTICE,
  },
];

/** 索引化：按 ID 快速查询 */
export const routesById: Record<string, Route> = Object.fromEntries(
  routes.map((r) => [r.id, r]),
);

/** 主路线（不含半天变体） */
export const mainRoutes: Route[] = routes.filter((r) => r.duration !== 'half-day');

/** 半天变体 */
export const routeVariants: Route[] = routes.filter((r) => r.duration === 'half-day');