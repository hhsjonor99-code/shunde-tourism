// src/data/keywordRules.ts
// 8 类关键词规则 + matchKeywords 函数
// 第一版仅用于辅助推荐匹配，不声称具备大模型自然语言理解

import type { KeywordMatchResult, KeywordRule } from '../types';

/** 8 类关键词规则 */
export const keywordRules: KeywordRule[] = [
  {
    keywords: ['老人', '父母', '老人家', '年纪大', '腿脚不便', '腿脚不好', '少走路', '少走', '不走路'],
    effect: 'reduce_walking',
    weight: 4,
    description: '减少步行距离，优先打车/驾车衔接；景点停留时间延长',
  },
  {
    keywords: ['孩子', '小朋友', '小孩', '亲子', '带娃'],
    effect: 'kid_friendly',
    weight: 4,
    description: '推荐亲子友好景点和体验；控制单站停留时长',
  },
  {
    keywords: ['怕晒', '怕热', '室内', '不晒', '不要户外', '不户外', '避暑'],
    effect: 'indoor_prefer',
    weight: 3,
    description: '优先室内或半室内景点；下午高温段尽量安排博物馆或美食街',
  },
  {
    keywords: ['夜景', '晚上', '夜里', '夜游', '夜生活'],
    effect: 'night_focus',
    weight: 3,
    description: '增加夜景主题景点（如欢乐海岸PLUS、渔人码头）',
  },
  {
    keywords: ['美食', '小吃', '寻味', '双皮奶', '牛乳', '鱼皮', '顺德菜'],
    effect: 'food_focus',
    weight: 3,
    description: '增加美食街/老字号比重（金榜上街、华盖路、顺德美食博物馆）',
  },
  {
    keywords: ['水乡', '古村', '逢简', '岭南水乡'],
    effect: 'water_town_focus',
    weight: 4,
    description: '优先逢简水乡等水乡类景点',
  },
  {
    keywords: ['摄影', '拍照', '打卡', '出片', '机位'],
    effect: 'photo_focus',
    weight: 2,
    description: '增加摄影友好景点（清晖园、逢简水乡、渔人码头、和美术馆）',
  },
  {
    keywords: ['艺术', '美术馆', '展览', '当代艺术', '建筑'],
    effect: 'art_focus',
    weight: 4,
    description: '增加和美术馆等艺术空间',
  },
];

/**
 * 第一版固定提示文字
 * 用于 UI 在展示未识别文本时附带
 */
export const UNMATCHED_NOTICE =
  '第一版仅支持部分关键词识别，其他要求已记录，请结合实际情况调整。';

/**
 * 匹配关键词。
 *
 * 设计原则：
 * - 不修改 / 删除原始文本；
 * - 仅识别与统计；保留原始 originalText 供 UI 直接回显；
 * - matchedKeywords 列出命中关键词（含重复）；
 * - hasUnmatchedContent 仅基于"去空白后原文非空"做粗判断（用于决定是否提示）。
 */
export function matchKeywords(text: string): KeywordMatchResult {
  const originalText = text ?? '';
  const matchedRules: KeywordRule[] = [];
  const matchedKeywords: string[] = [];

  if (!originalText) {
    return {
      matchedRules,
      matchedKeywords,
      originalText,
      hasUnmatchedContent: false,
    };
  }

  for (const rule of keywordRules) {
    let hit = false;
    for (const kw of rule.keywords) {
      if (originalText.includes(kw)) {
        matchedKeywords.push(kw);
        hit = true;
      }
    }
    if (hit && !matchedRules.includes(rule)) {
      matchedRules.push(rule);
    }
  }

  const hasUnmatchedContent = originalText.replace(/\s+/g, '').length > 0;

  return {
    matchedRules,
    matchedKeywords,
    originalText,
    hasUnmatchedContent,
  };
}