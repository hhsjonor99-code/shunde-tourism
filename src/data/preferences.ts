// src/data/preferences.ts
// 第一版偏好选项字典
// 选项值必须与 src/types/index.ts 中的 Preference 字段类型一致

import type {
  Companions,
  InterestTag,
  Pace,
  PreferenceOption,
  StartLocationId,
  TransportMode,
} from '../types';

// ============================================================
// 出发地点
// ============================================================
export const startLocationOptions: PreferenceOption<StartLocationId>[] = [
  {
    id: 'in-shunde',
    label: '已到达顺德',
    description: '默认选项；已抵达顺德本地，不需要接驳。',
  },
  {
    id: 'shunde-college',
    label: '顺德学院站',
    description: '顺德东部主要门户；可显示已核验接驳数据。',
  },
  {
    id: 'shunde-station',
    label: '顺德站',
    description: '顺德北部主要门户；可显示已核验接驳数据。',
  },
  {
    id: 'guangzhou-south',
    label: '广州南站',
    description: '第一版不展示接驳时间；表单下方显示提示。',
    note: '广州南站 / 佛山西站到顺德各景点的接驳时间和里程可能因交通方式与时段大幅变化，第一版不展示。建议优先使用城际列车 / 地铁到顺德站或顺德学院站，再进入顺德本地路线。',
  },
  {
    id: 'foshan-west',
    label: '佛山西站',
    description: '第一版不展示接驳时间；表单下方显示提示。',
    note: '广州南站 / 佛山西站到顺德各景点的接驳时间和里程可能因交通方式与时段大幅变化，第一版不展示。建议优先使用城际列车 / 地铁到顺德站或顺德学院站，再进入顺德本地路线。',
  },
  {
    id: 'custom',
    label: '自定义',
    description: '第一版仅作备注；按"已到达顺德"参与推荐。',
    requiresText: true,
    note: '第一版不会查询自定义地址的位置，建议选择已核验车站或"已到达顺德"。',
  },
];

// ============================================================
// 行程天数
// ============================================================
export type DurationId = 'half-day' | 'one-day' | 'two-day';

export const durationOptions: PreferenceOption<DurationId>[] = [
  { id: 'half-day', label: '半天', description: '仅匹配 H1、H2' },
  { id: 'one-day', label: '一天', description: '匹配 R1、R2、R3、R4' },
  { id: 'two-day', label: '两天', description: '匹配 R5' },
];

// ============================================================
// 同行人
// ============================================================
export const companionOptions: PreferenceOption<Companions>[] = [
  { id: 'solo', label: '一个人' },
  { id: 'couple', label: '情侣' },
  { id: 'friends', label: '朋友' },
  { id: 'with-kids', label: '带孩子' },
  { id: 'with-parents', label: '带父母' },
];

// ============================================================
// 兴趣标签
// ============================================================
export const interestOptions: PreferenceOption<InterestTag>[] = [
  { id: '顺德美食', label: '顺德美食' },
  { id: '岭南园林', label: '岭南园林' },
  { id: '水乡古村', label: '水乡古村' },
  { id: '历史文化', label: '历史文化' },
  { id: '亲子体验', label: '亲子体验' },
  { id: '摄影打卡', label: '摄影打卡' },
  { id: '城市夜游', label: '城市夜游' },
  { id: '艺术空间', label: '艺术空间' },
];

// ============================================================
// 交通方式
// ============================================================
export const transportModeOptions: PreferenceOption<TransportMode>[] = [
  {
    id: 'driving',
    label: '自驾',
    description: '显示高德驾车时间；可访问全部 7 条路线。',
  },
  {
    id: 'taxi',
    label: '打车',
    description: '显示"驾车路线参考时间，不含候车"；可访问全部 7 条路线。',
  },
  {
    id: 'walking',
    label: '步行优先',
    description: '优先步行可达的路线（如 H1）。',
  },
  {
    id: 'transit',
    label: '公共交通',
    description:
      '第一版只推荐地点集中的路线 + 固定文字提示，不展示公交时间。',
    note: '根据地点集中程度推荐，未核验具体公交线路。本路线未含精确公交信息，请在出发前通过高德地图 APP 或网页实时查询。',
  },
  {
    id: 'mixed',
    label: '混合',
    description: '默认混合模式。',
  },
];

// ============================================================
// 游玩节奏
// ============================================================
export const paceOptions: PreferenceOption<Pace>[] = [
  {
    id: 'relaxed',
    label: '悠闲慢游',
    description: '半天最多 2 景点；推荐 H1 / H2 / R2。',
  },
  {
    id: 'standard',
    label: '经典适中',
    description: '半天最多 3 景点；适合大多数 R1-R4。',
  },
  {
    id: 'compact',
    label: '尽量多玩',
    description: '半天最多 4 景点；优先步行。',
  },
];