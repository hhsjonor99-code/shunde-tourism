// src/types/index.ts
// 第一版类型定义
// 详细规则见 docs/development-record.md 第六节
// 数据时效：2026-07-18（amap-maps MCP 核验）

// ============================================================
// 基础类型
// ============================================================

/** 地理坐标（GCJ-02 / WGS-84，以 MCP 返回为准） */
export interface Coordinates {
  lng: number;
  lat: number;
}

/** 可能随时间变化的字段标记 */
export type DynamicField = 'openTime' | 'rating' | 'duration' | 'level' | 'closeDays';

/** 交通方式 */
export type TransportMode = 'walking' | 'driving' | 'taxi' | 'transit' | 'mixed';

/** 路线交通时间来源（§5.5） */
export type TimeBasis =
  | 'amap-driving'           // 全部为高德驾车实测
  | 'amap-walking'           // 全部为高德步行实测
  | 'mixed-driving-walking'  // 驾车与步行混合
  | 'not-available';         // 没有可展示的实测时间

/**
 * RouteLeg 核验状态（仅三种值）：
 * - verified:        高德 MCP 已核验
 * - unverified:      尚未通过 MCP 核验，包括用户自定义起点接驳路段
 * - not-applicable:  无需路线计算（同一景点内部活动或景区内自由参观）
 *
 * 用户自定义接驳路段必须标 unverified，不得标 not-applicable。
 * 第一版不允许 estimated。
 */
export type VerificationStatus = 'verified' | 'unverified' | 'not-applicable';

/** 路线整体核验状态 */
export type McpVerificationStatus =
  | 'fully-verified'        // 所有相邻路段均已核验
  | 'partially-verified'    // 部分路段核验
  | 'unverified';           // 未核验

/** 行程天数 */
export type RouteDuration = 'half-day' | 'one-day' | 'two-day';

/** 游玩节奏 */
export type Pace = 'relaxed' | 'standard' | 'compact';

/** 景点室内/室外属性 */
export type IndoorOutdoor = 'indoor' | 'outdoor' | 'mixed';

/** 景点子分类 */
export type AttractionSubCategory =
  | 'museum'
  | 'park'
  | 'street'
  | 'water-town'
  | 'art'
  | 'transport'
  | 'landmark';

/** 出发地点选项 */
export type StartLocationId =
  | 'guangzhou-south'
  | 'foshan-west'
  | 'shunde-college'
  | 'shunde-station'
  | 'in-shunde'
  | 'custom';

/** 同行人 */
export type Companions = 'solo' | 'couple' | 'friends' | 'with-kids' | 'with-parents';

/** 兴趣标签 */
export type InterestTag =
  | '顺德美食'
  | '岭南园林'
  | '水乡古村'
  | '历史文化'
  | '亲子体验'
  | '摄影打卡'
  | '城市夜游'
  | '艺术空间';

/** 推荐引擎 modifier 类型 */
export type ModifierEffect =
  | 'reduce_walking'     // 减少步行
  | 'kid_friendly'       // 亲子友好
  | 'indoor_prefer'      // 偏室内
  | 'night_focus'        // 夜景优先
  | 'food_focus'         // 美食主题
  | 'water_town_focus'   // 水乡主题
  | 'photo_focus'        // 摄影主题
  | 'art_focus';         // 艺术主题

// ============================================================
// 偏好选项字典项
// ============================================================

/** 单个偏好选项 */
export interface PreferenceOption<T extends string> {
  id: T;
  label: string;
  description?: string;
  /** 是否需要用户补充文本（如自定义） */
  requiresText?: boolean;
  /** 备注（用于 UI 提示） */
  note?: string;
}

// ============================================================
// 关键词规则
// ============================================================

/** 单条关键词规则 */
export interface KeywordRule {
  /** 触发该规则的关键词（任一命中即触发） */
  keywords: string[];
  /** 推荐引擎 modifier */
  effect: ModifierEffect;
  /** 权重 -5 ~ +5 */
  weight: number;
  /** UI 显示的中文说明 */
  description: string;
}

/** matchKeywords 函数返回值 */
export interface KeywordMatchResult {
  /** 命中的规则 */
  matchedRules: KeywordRule[];
  /** 命中的关键词（含重复检测） */
  matchedKeywords: string[];
  /** 原始输入文本（不修改） */
  originalText: string;
  /** 原文是否包含未识别的内容（去空白后非空） */
  hasUnmatchedContent: boolean;
}

// ============================================================
// 景点
// ============================================================

/**
 * 景点图片（含授权信息）
 * - 第一版所有 attraction.image 暂未填入真实 src（无授权图片）
 * - 仅在 src 为本地 public 资源且文件真实存在时才会被引用
 * - 否则组件自动回退到水墨 SVG
 */
export interface AttractionImage {
  /** 资源路径（如 '/assets/attractions/qinghui-garden.webp'） */
  src: string;
  alt: string;
  credit?: string;
  sourceUrl?: string;
  license?: string;
}

export interface Attraction {
  id: string;                  // 'A1'
  name: string;                // 用户查询名称
  standardName: string;        // 高德返回标准名
  aliases: string[];
  category: string;            // '风景名胜' / '公园' / '博物馆' / '美术馆' 等
  subCategory?: AttractionSubCategory;
  themes: string[];            // 主题标签
  suitableFor: Companions[];   // 适合的同行人
  address: string;
  district: string;            // 区
  town: string;                // 镇/街道
  location: Coordinates;
  poiId: string;               // 高德 POI ID
  description: string;         // 简短水墨风描述（人工撰写）
  recommendedDuration: number;  // 分钟
  indoorOutdoor: IndoorOutdoor;
  tags: string[];
  openTime?: string;
  closeDays?: string;
  rating?: string;
  level?: string;              // AAAA / AAA 等
  dynamicFields: DynamicField[];
  mcpVerified: boolean;
  verifiedAt: string;          // ISO date
  source: string;              // 'amap-mcp'
  dataNotice: string;
  notes?: string;
  /** 第一版暂无授权图片；不填入不会触发任何远程请求 */
  image?: AttractionImage;
}

// ============================================================
// 路线
// ============================================================

/** 路线途经景点 */
export interface RouteStop {
  attractionId: string;
  sequence: number;             // 1, 2, 3, ...
  arrivalTime: string;         // '10:00'
  departureTime: string;       // '11:30'
  recommendedDuration: number; // 分钟（推荐停留时长）
  activities: string[];        // 该站主要活动描述
  foodTips?: string;
  photoTips?: string;
  transportTips?: string;
  notes?: string;
  /** 所属天数（多日路线使用，单日路线可不填） */
  day?: number;
}

/** 路线相邻路段 */
export interface RouteLeg {
  fromAttractionId: string;
  toAttractionId: string;
  mode: TransportMode;
  distanceMeters: number;
  durationSeconds: number;
  source: 'amap-mcp';
  verifiedAt: string;
  /** 第一版只允许三种值；用户自定义接驳必须标 unverified */
  verificationStatus: VerificationStatus;
}

export interface Route {
  id: string;                  // 'R1' / 'H1'
  title: string;
  subtitle: string;
  description: string;
  duration: RouteDuration;
  suitableFor: Companions[];
  interests: InterestTag[];
  transportModes: TransportMode[];
  pace: Pace;
  /** 总里程（米）—— 第一版由 legs 求和得到 */
  totalDistance: number;
  /** 总交通时间（秒）—— 第一版由 legs 求和得到 */
  totalTransportTime: number;
  startTime: string;           // '09:30'
  stops: RouteStop[];
  legs: RouteLeg[];
  highlights: string[];
  mcpVerificationStatus: McpVerificationStatus;
  /** 第一版统一：'between-stops-only' */
  distanceScope: 'between-stops-only';
  /** 交通时间来源（§5.5） */
  timeBasis: TimeBasis;
  verifiedAt: string;
  source: string;
  dataNotice: string;
  notes?: string;
}

// ============================================================
// 偏好
// ============================================================

export interface Preference {
  startLocation: StartLocationId;
  customLocationText?: string;
  duration: RouteDuration;
  companions: Companions;
  interests: InterestTag[];
  transportMode: TransportMode;
  pace: Pace;
  notes?: string;
}

// ============================================================
// 推荐结果
// ============================================================

export interface GeneratedItinerary {
  title: string;
  summary: string;
  matchedRouteId?: string;
  matchedKeywordRules?: KeywordRule[];
  unmatchedText?: string;
  unmatchedNotice: string;
  /** 推荐评分（§九） */
  score: number;
  /** 推荐理由 */
  reasons: string[];
  stops: RouteStop[];
  totalDistance: number;
  totalTransportTime: number;
  notices: string[];
}

// ============================================================
// MCP 核验日志（开发期可保留）
// ============================================================

export interface McpVerification {
  id: string;
  queryType: 'text-search' | 'detail' | 'direction' | 'distance';
  queryKeyword: string;
  city: string;
  toolName: string;
  requestedAt: string;
  responseSummary: string;
  standardName?: string;
  address?: string;
  location?: Coordinates;
  success: boolean;
  ambiguity: boolean;
  notes?: string;
}