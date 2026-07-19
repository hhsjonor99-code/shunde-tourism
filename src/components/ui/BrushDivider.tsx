// src/components/ui/BrushDivider.tsx
// 毛笔笔触分隔线组件 · 阶段 3 精修
// - 三种 tone 形状略不同（不仅颜色不同）
// - 线条粗细变化 + 两端渐细渐淡 + 飞白
// - 动画用 stroke-dashoffset

import { useId } from 'react';
import type { CSSProperties } from 'react';
import styles from './BrushDivider.module.css';

export type BrushDividerTone = 'ink' | 'light' | 'red';

export interface BrushDividerProps {
  /** 宽度：默认 '100%'，可用像素值 */
  width?: number | string;
  /** 笔触基础粗细：px，默认 2 */
  thickness?: number;
  /** 是否播放动画（毛笔展开） */
  animated?: boolean;
  /** 色调 */
  tone?: BrushDividerTone;
  className?: string;
  style?: CSSProperties;
  /** 无障碍标题 */
  ariaLabel?: string;
  /** 形状变体：'wave' | 'sweep' | 'stroke'；默认 'wave' */
  variant?: 'wave' | 'sweep' | 'stroke';
}

const TONE_COLOR: Record<BrushDividerTone, string> = {
  ink: 'var(--ink-deep)',
  light: 'var(--ink-light)',
  red: 'var(--seal-red)',
};

/**
 * 每种 tone 的主路径（带粗细变化与飞白）
 * 使用 cubic Bezier 让中段自然起伏，两端逐渐变细；
 * 飞白以额外短 path 模拟局部断续。
 */
const TONE_PATHS: Record<
  BrushDividerTone,
  { main: string; flying: string[]; thicknessScale: number }
> = {
  // 墨色：稳重的弧线 + 中段飞白
  ink: {
    main: 'M 2 8 Q 30 4, 60 8 T 120 7 T 198 6',
    flying: ['M 80 6 Q 92 9, 100 6'],
    thicknessScale: 1,
  },
  // 浅墨：更轻更细的曲线
  light: {
    main: 'M 2 7 C 24 5, 50 9, 80 6 S 150 8, 198 7',
    flying: [],
    thicknessScale: 0.7,
  },
  // 朱红：略粗、更短促的笔触
  red: {
    main: 'M 2 8 L 40 5 L 80 8 L 120 5 L 198 8',
    flying: ['M 60 7 L 70 9'],
    thicknessScale: 1.3,
  },
};

export function BrushDivider({
  width = '100%',
  thickness = 2,
  animated = false,
  tone = 'ink',
  className,
  style,
  ariaLabel,
  variant: _variant = 'wave', // 占位：未来扩展
}: BrushDividerProps) {
  const widthStr = typeof width === 'number' ? `${width}px` : width;
  const color = TONE_COLOR[tone];
  const tonePaths = TONE_PATHS[tone];
  const baseStroke = thickness * tonePaths.thicknessScale;

  // viewBox 长度固定 200
  const mainPathLength = 240;
  const flyingPathLength = 60;

  const classes = [
    styles.divider,
    animated ? styles.animated : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle: CSSProperties = {
    width: widthStr,
    height: `${baseStroke * 4 + 4}px`,
    ...style,
  };

  // 用 useId 生成唯一 id 用于 SVG gradient
  const uid = useId();

  // 公共动画样式（统一 class，无须为每实例生成唯一 class）
  const mainPathStyle: CSSProperties = animated
    ? {
        animation: `brush-draw 1500ms ease-in-out forwards`,
        strokeDasharray: mainPathLength,
        strokeDashoffset: mainPathLength,
        ['--brush-length' as string]: `${mainPathLength}`,
      }
    : {};

  return (
    <div
      className={classes}
      style={inlineStyle}
      role="separator"
      aria-orientation="horizontal"
      aria-label={ariaLabel ?? '分隔线'}
    >
      <svg
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* 两端线性渐变：左淡中深右淡 */}
          <linearGradient id={`g-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="8%" stopColor={color} stopOpacity="0.45" />
            <stop offset="20%" stopColor={color} stopOpacity="0.95" />
            <stop offset="80%" stopColor={color} stopOpacity="0.95" />
            <stop offset="92%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 主线条 */}
        <path
          d={tonePaths.main}
          fill="none"
          stroke={`url(#g-${uid})`}
          strokeWidth={baseStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={mainPathStyle}
        />

        {/* 飞白：第二段曲线短促断续，模拟干笔 */}
        {tonePaths.flying.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={baseStroke * 0.55}
            strokeLinecap="round"
            strokeOpacity="0.55"
            style={
              animated
                ? {
                    animation: `brush-draw 1200ms ease-out forwards`,
                    animationDelay: `${500 + i * 100}ms`,
                    strokeDasharray: flyingPathLength,
                    strokeDashoffset: flyingPathLength,
                    ['--brush-length' as string]: `${flyingPathLength}`,
                  }
                : {
                    strokeDasharray: flyingPathLength,
                    strokeDashoffset: 0,
                  }
            }
          />
        ))}

        {/* 端点墨点（仅墨色和浅墨，避免红色端点过于突兀） */}
        {tone !== 'red' && (
          <>
            <circle
              cx="2"
              cy="7"
              r={baseStroke * 0.55}
              fill={color}
              opacity="0.55"
            />
            <circle
              cx="198"
              cy="6"
              r={baseStroke * 0.55}
              fill={color}
              opacity="0.55"
            />
          </>
        )}
      </svg>
    </div>
  );
}