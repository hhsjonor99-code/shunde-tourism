// src/components/sections/AttractionImageView.tsx
// 景点图片组件：图片不存在时自动回退到水墨 SVG；不会触发 404

import { useId, useState } from 'react';
import type { CSSProperties } from 'react';
import type { AttractionImage } from '../../types';
import styles from './AttractionImageView.module.css';

export interface AttractionImageViewProps {
  /** 图片对象；不传或 src 为空则显示 fallback */
  image?: AttractionImage;
  /** fallback 显示的标题（必填，用于可访问性） */
  fallbackTitle: string;
  /** 自定义 fallback 类型；不同 subCategory 显示不同图案 */
  fallbackVariant?: 'landmark' | 'garden' | 'water-town' | 'street' | 'park' | 'art' | 'museum';
  /** 容器宽高比 */
  aspectRatio?: string; // e.g. '4 / 3'
  /** 自定义类名 */
  className?: string;
  /** 强制显示 fallback（调试用） */
  forceFallback?: boolean;
}

export function AttractionImageView({
  image,
  fallbackTitle,
  fallbackVariant = 'landmark',
  aspectRatio = '4 / 3',
  className,
  forceFallback = false,
}: AttractionImageViewProps) {
  const fallbackId = useId();
  const [errored, setErrored] = useState(false);

  const hasImage = !!image?.src && !forceFallback;
  const showFallback = !hasImage || errored;

  const containerStyle: CSSProperties = {
    aspectRatio,
  };

  return (
    <figure
      className={`${styles.figure} ${className ?? ''}`}
      style={containerStyle}
      aria-label={image?.alt ?? fallbackTitle}
    >
      {/* 装饰水墨 SVG（始终作为背景遮罩存在） */}
      <svg
        className={styles.mask}
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* 宣纸纹理：双层渐变 + 噪点 */}
          <linearGradient id={`g-${fallbackId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF0E6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F8F5F0" stopOpacity="0.0" />
          </linearGradient>
          <filter id={`n-${fallbackId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.06 0"
            />
          </filter>
          {/* 边缘墨迹渐隐 mask */}
          <radialGradient id={`e-${fallbackId}`} cx="50%" cy="50%" r="65%">
            <stop offset="55%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`m-${fallbackId}`}>
            <rect width="400" height="300" fill={`url(#e-${fallbackId})`} />
          </mask>
        </defs>
        <rect width="400" height="300" fill={`url(#g-${fallbackId})`} />
        <rect width="400" height="300" filter={`url(#n-${fallbackId})`} />
      </svg>

      {hasImage && (
        <img
          src={image!.src}
          alt={image!.alt}
          loading="lazy"
          decoding="async"
          className={styles.img}
          onError={() => setErrored(true)}
        />
      )}

      {/* fallback：景点主题水墨 SVG */}
      {showFallback && (
        <div className={styles.fallback} aria-hidden={hasImage ? 'true' : undefined}>
          <FallbackIllustration variant={fallbackVariant} title={fallbackTitle} />
        </div>
      )}

      {/* 边缘墨迹遮罩：CSS mask 实现 */}
      <div className={styles.edgeMask} aria-hidden="true" />

      {/* 版权 / 来源（图片存在时显示） */}
      {image?.credit && hasImage && (
        <figcaption className={styles.credit}>
          {image.credit}
          {image.license ? ` · ${image.license}` : ''}
        </figcaption>
      )}
    </figure>
  );
}

// ============================================================
// FallbackIllustration
// 6 种主题水墨 SVG 插画；不依赖任何外部图片
// 阶段 5 精修：增加浓淡层次 + 青绿/朱红点染 + 边缘墨迹渐隐
// ============================================================

interface FallbackIllustrationProps {
  variant: NonNullable<AttractionImageViewProps['fallbackVariant']>;
  title: string;
}

function FallbackIllustration({ variant, title }: FallbackIllustrationProps) {
  switch (variant) {
    case 'garden':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F5F0" stopOpacity="1" />
              <stop offset="100%" stopColor="#FAF0E6" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-g)" />
          {/* 假山（一笔） */}
          <path d="M 60 240 Q 90 200, 120 220 Q 150 235, 175 215 Q 195 200, 210 230 L 220 270 L 50 270 Z" fill="#1a1a1a" opacity="0.18" />
          {/* 池塘 */}
          <ellipse cx="280" cy="240" rx="70" ry="20" fill="#1a1a1a" opacity="0.12" />
          <ellipse cx="280" cy="240" rx="70" ry="20" fill="#2E8B57" opacity="0.08" />
          {/* 水波 */}
          <path d="M 220 244 Q 250 240, 280 244" stroke="#1a1a1a" strokeOpacity="0.4" strokeWidth="0.8" fill="none" />
          <path d="M 290 250 Q 320 246, 350 250" stroke="#1a1a1a" strokeOpacity="0.4" strokeWidth="0.8" fill="none" />
          {/* 树（青绿一抹） */}
          <ellipse cx="120" cy="170" rx="22" ry="28" fill="#2E8B57" opacity="0.42" />
          <line x1="120" y1="195" x2="120" y2="240" stroke="#1a1a1a" strokeOpacity="0.6" strokeWidth="1.5" />
          {/* 小树 */}
          <ellipse cx="80" cy="200" rx="10" ry="14" fill="#2E8B57" opacity="0.30" />
          <line x1="80" y1="212" x2="80" y2="240" stroke="#1a1a1a" strokeOpacity="0.5" strokeWidth="1" />
          {/* 窗格（右上） */}
          <g stroke="#1a1a1a" strokeOpacity="0.45" strokeWidth="1.2" fill="none">
            <rect x="310" y="140" width="60" height="60" />
            <line x1="310" y1="170" x2="370" y2="170" />
            <line x1="340" y1="140" x2="340" y2="200" />
            <line x1="360" y1="140" x2="360" y2="200" />
          </g>
          {/* 远亭剪影 */}
          <g stroke="#1a1a1a" strokeOpacity="0.35" fill="none" strokeWidth="1">
            <path d="M 200 180 L 215 160 L 230 180 L 230 210 L 200 210 Z" />
            <line x1="205" y1="190" x2="225" y2="190" />
          </g>
          {/* 朱红一点（题字印章） */}
          <rect x="350" y="60" width="22" height="22" fill="#C41E3A" opacity="0.78" rx="1" />
          <text x="361" y="76" fontSize="11" fill="#F8F5F0" textAnchor="middle" fontFamily="serif">园</text>
        </svg>
      );
    case 'water-town':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-w" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F5F0" stopOpacity="1" />
              <stop offset="100%" stopColor="#FAF0E6" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-w)" />
          {/* 远山（极淡） */}
          <path d="M 0 130 C 80 105, 160 125, 240 110 C 320 95, 360 115, 400 108 L 400 200 L 0 200 Z" fill="#1a1a1a" opacity="0.16" />
          {/* 远山余光 */}
          <path d="M 0 140 C 100 120, 200 135, 400 125 L 400 175 L 0 175 Z" fill="#2E8B57" opacity="0.10" />
          {/* 民居轮廓（远景剪影） */}
          <g stroke="#1a1a1a" strokeOpacity="0.30" fill="none" strokeWidth="1">
            <path d="M 30 180 L 50 165 L 70 180 L 70 200 L 30 200 Z" />
            <path d="M 70 180 L 95 160 L 120 180 L 120 200 L 70 200 Z" />
            <path d="M 280 180 L 305 160 L 330 180 L 330 200 L 280 200 Z" />
            <path d="M 330 180 L 350 165 L 370 180 L 370 200 L 330 200 Z" />
          </g>
          {/* 拱桥 */}
          <path d="M 150 215 Q 200 175, 250 215" stroke="#1a1a1a" strokeWidth="2.2" fill="none" strokeOpacity="0.7" />
          {/* 桥栏 */}
          <line x1="152" y1="212" x2="248" y2="212" stroke="#1a1a1a" strokeOpacity="0.7" strokeWidth="1.2" />
          {/* 桥栏小柱 */}
          <line x1="170" y1="195" x2="170" y2="212" stroke="#1a1a1a" strokeOpacity="0.65" strokeWidth="1" />
          <line x1="200" y1="185" x2="200" y2="212" stroke="#1a1a1a" strokeOpacity="0.65" strokeWidth="1" />
          <line x1="230" y1="195" x2="230" y2="212" stroke="#1a1a1a" strokeOpacity="0.65" strokeWidth="1" />
          {/* 桥下倒影（青绿一点） */}
          <path d="M 150 215 Q 200 252, 250 215" stroke="#2E8B57" strokeOpacity="0.22" strokeWidth="1" fill="none" />
          {/* 乌篷船 */}
          <ellipse cx="320" cy="232" rx="22" ry="5" fill="#1a1a1a" opacity="0.55" />
          <path d="M 308 225 Q 320 213, 332 225" stroke="#1a1a1a" strokeOpacity="0.6" strokeWidth="1.5" fill="none" />
          {/* 船桨 */}
          <line x1="340" y1="235" x2="350" y2="245" stroke="#1a1a1a" strokeOpacity="0.5" strokeWidth="1.2" />
          {/* 水波多道 */}
          <path d="M 60 240 Q 100 236, 140 240" stroke="#1a1a1a" strokeOpacity="0.32" strokeWidth="1" fill="none" />
          <path d="M 220 245 Q 260 241, 300 245" stroke="#1a1a1a" strokeOpacity="0.28" strokeWidth="1" fill="none" />
          <path d="M 100 252 Q 140 248, 180 252" stroke="#666" strokeOpacity="0.30" strokeWidth="1" fill="none" />
          <path d="M 270 256 Q 310 252, 350 256" stroke="#666" strokeOpacity="0.25" strokeWidth="1" fill="none" />
          {/* 朱红鱼灯一盏（远处） */}
          <ellipse cx="55" cy="218" rx="6" ry="3" fill="#C41E3A" opacity="0.85" />
        </svg>
      );
    case 'street':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-s" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF0E6" stopOpacity="1" />
              <stop offset="100%" stopColor="#F8F5F0" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-s)" />
          {/* 远天一抹青绿 */}
          <rect x="0" y="0" width="400" height="80" fill="#2E8B57" opacity="0.06" />
          {/* 骑楼立面（主） */}
          <rect x="40" y="120" width="320" height="140" fill="#1a1a1a" opacity="0.12" />
          <rect x="40" y="120" width="320" height="140" fill="none" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1.5" />
          {/* 楼层分隔线 */}
          <line x1="40" y1="170" x2="360" y2="170" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1.5" />
          {/* 二层窗洞 */}
          {[70, 120, 170, 220, 270, 320].map((x) => (
            <rect key={`w1-${x}`} x={x - 12} y="130" width="24" height="32" fill="#F8F5F0" opacity="0.95" />
          ))}
          {/* 一层柱廊 */}
          {[70, 120, 170, 220, 270, 320].map((x) => (
            <rect key={`p1-${x}`} x={x - 4} y="180" width="8" height="80" fill="#1a1a1a" opacity="0.45" />
          ))}
          {/* 招牌 */}
          <rect x="80" y="200" width="240" height="3" fill="#1a1a1a" opacity="0.4" />
          {/* 招牌字 */}
          <text x="200" y="225" fontSize="9" fill="#1a1a1a" opacity="0.55" textAnchor="middle" fontFamily="serif">老 街 字 号</text>
          {/* 朱红灯笼串（三盏） */}
          {[
            { x: 100, y: 195 },
            { x: 200, y: 195 },
            { x: 300, y: 195 },
          ].map((p, i) => (
            <g key={`l-${i}`}>
              <line x1={p.x} y1="180" x2={p.x} y2={p.y - 6} stroke="#1a1a1a" strokeOpacity="0.5" strokeWidth="0.8" />
              <ellipse cx={p.x} cy={p.y} rx="8" ry="6" fill="#C41E3A" opacity="0.85" />
              <line x1={p.x - 4} y1={p.y + 4} x2={p.x - 4} y2={p.y + 8} stroke="#C41E3A" strokeOpacity="0.7" strokeWidth="0.8" />
              <line x1={p.x + 4} y1={p.y + 4} x2={p.x + 4} y2={p.y + 8} stroke="#C41E3A" strokeOpacity="0.7" strokeWidth="0.8" />
            </g>
          ))}
          {/* 地面线 */}
          <line x1="0" y1="265" x2="400" y2="265" stroke="#1a1a1a" strokeOpacity="0.45" strokeWidth="1" />
        </svg>
      );
    case 'park':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-p" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF0E6" stopOpacity="1" />
              <stop offset="100%" stopColor="#F8F5F0" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-p)" />
          {/* 远山（淡青绿） */}
          <path d="M 0 120 C 80 92, 160 115, 240 100 C 320 85, 360 110, 400 102 L 400 200 L 0 200 Z" fill="#2E8B57" opacity="0.18" />
          <path d="M 0 130 C 80 110, 160 130, 240 118 C 320 106, 360 125, 400 118 L 400 195 L 0 195 Z" fill="#1a1a1a" opacity="0.14" />
          {/* 塔 */}
          <rect x="290" y="92" width="14" height="80" fill="#1a1a1a" opacity="0.55" />
          <polygon points="288,92 297,68 306,92" fill="#1a1a1a" opacity="0.65" />
          {/* 塔基 */}
          <rect x="282" y="172" width="30" height="6" fill="#1a1a1a" opacity="0.55" />
          {/* 湖面 */}
          <ellipse cx="200" cy="245" rx="190" ry="42" fill="#2E8B57" opacity="0.12" />
          <ellipse cx="200" cy="245" rx="190" ry="42" fill="#1a1a1a" opacity="0.06" />
          {/* 水波 */}
          <path d="M 80 240 Q 120 236, 160 240" stroke="#1a1a1a" strokeOpacity="0.35" strokeWidth="1" fill="none" />
          <path d="M 240 250 Q 280 246, 320 250" stroke="#1a1a1a" strokeOpacity="0.30" strokeWidth="1" fill="none" />
          <path d="M 100 258 Q 140 254, 180 258" stroke="#666" strokeOpacity="0.28" strokeWidth="1" fill="none" />
          {/* 树（青绿） */}
          <circle cx="80" cy="190" r="22" fill="#2E8B57" opacity="0.50" />
          <line x1="80" y1="210" x2="80" y2="240" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="130" cy="200" r="16" fill="#2E8B57" opacity="0.42" />
          <line x1="130" y1="216" x2="130" y2="240" stroke="#1a1a1a" strokeOpacity="0.50" strokeWidth="1.2" />
          {/* 小径 */}
          <path d="M 0 280 Q 100 260, 200 275 Q 300 290, 400 270" stroke="#1a1a1a" strokeOpacity="0.20" strokeWidth="2" fill="none" strokeDasharray="2 4" />
          {/* 朱红小亭（远景） */}
          <g stroke="#C41E3A" strokeOpacity="0.7" strokeWidth="1.5" fill="none">
            <polygon points="350,170 360,158 370,170" fill="#C41E3A" opacity="0.6" />
            <rect x="352" y="170" width="16" height="14" />
          </g>
        </svg>
      );
    case 'art':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F5F0" stopOpacity="1" />
              <stop offset="100%" stopColor="#FAF0E6" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-a)" />
          {/* 安藤忠雄圆形中庭 + 一抹光（青绿） */}
          <circle cx="200" cy="150" r="100" fill="none" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="2" />
          <circle cx="200" cy="150" r="78" fill="none" stroke="#1a1a1a" strokeOpacity="0.40" strokeWidth="1.5" />
          <circle cx="200" cy="150" r="56" fill="none" stroke="#1a1a1a" strokeOpacity="0.28" strokeWidth="1.2" />
          <circle cx="200" cy="150" r="34" fill="#2E8B57" opacity="0.18" />
          {/* 光线（从中心放射） */}
          <line x1="200" y1="150" x2="80" y2="80" stroke="#D4AF37" strokeOpacity="0.18" strokeWidth="0.8" />
          <line x1="200" y1="150" x2="320" y2="80" stroke="#D4AF37" strokeOpacity="0.15" strokeWidth="0.8" />
          {/* 地面层（横线） */}
          <line x1="60" y1="250" x2="340" y2="250" stroke="#1a1a1a" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="60" y1="262" x2="340" y2="262" stroke="#1a1a1a" strokeOpacity="0.30" strokeWidth="1" />
          <line x1="60" y1="270" x2="340" y2="270" stroke="#1a1a1a" strokeOpacity="0.20" strokeWidth="1" />
          {/* 一道墙体阴影（左侧） */}
          <rect x="40" y="100" width="6" height="160" fill="#1a1a1a" opacity="0.25" />
          {/* 极小朱红标记（入口/编号） */}
          <rect x="120" y="200" width="14" height="14" fill="#C41E3A" opacity="0.85" />
        </svg>
      );
    case 'museum':
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-m" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF0E6" stopOpacity="1" />
              <stop offset="100%" stopColor="#F8F5F0" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-m)" />
          {/* 远天一抹青绿 */}
          <rect x="0" y="0" width="400" height="100" fill="#2E8B57" opacity="0.06" />
          {/* 博物馆柱廊（主立面） */}
          <rect x="40" y="155" width="320" height="105" fill="#1a1a1a" opacity="0.18" />
          {/* 柱廊 */}
          {[80, 130, 180, 230, 280, 320].map((x) => (
            <rect key={`c-${x}`} x={x} y="155" width="6" height="105" fill="#F8F5F0" opacity="0.95" />
          ))}
          {/* 顶部三角形山墙 */}
          <polygon points="40,155 200,100 360,155" fill="#1a1a1a" opacity="0.45" />
          {/* 山墙内青绿一抹（青瓦/琉璃感） */}
          <polygon points="80,140 200,108 320,140 200,128" fill="#2E8B57" opacity="0.30" />
          {/* 基座 */}
          <rect x="30" y="255" width="340" height="6" fill="#1a1a1a" opacity="0.55" />
          {/* 台阶 */}
          <line x1="20" y1="270" x2="380" y2="270" stroke="#1a1a1a" strokeOpacity="0.30" strokeWidth="1" />
          <line x1="20" y1="278" x2="380" y2="278" stroke="#1a1a1a" strokeOpacity="0.20" strokeWidth="1" />
          {/* 朱红匾额 */}
          <rect x="170" y="165" width="60" height="22" fill="#C41E3A" opacity="0.85" />
        </svg>
      );
    case 'landmark':
    default:
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-label={`${title} 水墨意象`}>
          <defs>
            <linearGradient id="gl-l" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F5F0" stopOpacity="1" />
              <stop offset="100%" stopColor="#FAF0E6" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#gl-l)" />
          {/* 远山 */}
          <path d="M 0 140 C 100 112, 200 135, 280 122 C 340 112, 380 128, 400 122 L 400 200 L 0 200 Z" fill="#1a1a1a" opacity="0.18" />
          {/* 远山余光 */}
          <path d="M 0 152 C 100 138, 220 148, 400 142 L 400 188 L 0 188 Z" fill="#2E8B57" opacity="0.10" />
          {/* 主建筑轮廓 */}
          <rect x="160" y="155" width="80" height="85" fill="none" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="2" />
          <rect x="172" y="170" width="56" height="60" fill="#1a1a1a" opacity="0.18" />
          {/* 横梁 */}
          <line x1="160" y1="195" x2="240" y2="195" stroke="#1a1a1a" strokeOpacity="0.55" strokeWidth="1" />
          {/* 朱红一点（楼牌） */}
          <rect x="186" y="180" width="28" height="14" fill="#C41E3A" opacity="0.85" />
          {/* 地面 */}
          <line x1="0" y1="245" x2="400" y2="245" stroke="#1a1a1a" strokeOpacity="0.30" strokeWidth="1" />
        </svg>
      );
  }
}