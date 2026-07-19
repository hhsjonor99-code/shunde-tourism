// src/utils/format.ts
// 第一版格式化工具

/**
 * 米 → 公里，保留 1 位小数。
 * 例：17118 → "17.1 km"
 */
export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return '— km';
  const km = meters / 1000;
  // < 1 km 时保留米
  if (km < 1) return `${Math.round(meters)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * 秒 → 分钟，向上取整。
 * 例：3525 → "59 分钟"，60 → "1 分钟"，< 60 → "< 1 分钟"
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '— 分钟';
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 1) return '< 1 分钟';
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} 小时`;
  return `${hours} 小时 ${rest} 分钟`;
}

/**
 * 短时长格式化（用于腿段展示）。
 * < 1 分钟 → '< 1 分钟'；≥ 1 分钟显示 N 分钟。
 */
export function formatLegDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 1) return '< 1 分钟';
  return `${minutes} 分钟`;
}

/**
 * 天数描述
 */
export function formatDurationLabel(d: 'half-day' | 'one-day' | 'two-day'): string {
  switch (d) {
    case 'half-day':
      return '半天';
    case 'one-day':
      return '一天';
    case 'two-day':
      return '两天';
  }
}

/**
 * 节奏描述
 */
export function formatPace(p: 'relaxed' | 'standard' | 'compact'): string {
  switch (p) {
    case 'relaxed':
      return '悠闲慢游';
    case 'standard':
      return '经典适中';
    case 'compact':
      return '尽量多玩';
  }
}

/**
 * 交通方式中文
 */
export function formatTransportMode(m: string): string {
  switch (m) {
    case 'walking':
      return '步行';
    case 'driving':
      return '驾车';
    case 'taxi':
      return '打车';
    case 'transit':
      return '公共交通';
    case 'mixed':
      return '混合';
    default:
      return m;
  }
}

/**
 * 同行人中文
 */
export function formatCompanions(c: string): string {
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
    default:
      return c;
  }
}

/**
 * 核验状态中文
 */
export function formatVerificationStatus(s: string): string {
  switch (s) {
    case 'verified':
      return 'MCP 已核验';
    case 'unverified':
      return '未核验';
    case 'not-applicable':
      return '无需路线计算';
    default:
      return s;
  }
}

/**
 * 路线整体核验状态中文
 */
export function formatMcpVerificationStatus(s: string): string {
  switch (s) {
    case 'fully-verified':
      return 'MCP 已核验';
    case 'partially-verified':
      return '部分核验';
    case 'unverified':
      return '未核验';
    default:
      return s;
  }
}