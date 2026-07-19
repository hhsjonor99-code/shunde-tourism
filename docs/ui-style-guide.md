# 《一卷顺德》UI 视觉规范

> 水墨风设计规范
> 文档生成日期：2026-07-18
> 工作目录：`E:\Coding\claud code\shundeTourism`

---

## 一、设计哲学

1. **留白**：空白不是没有内容，而是意境的延伸。
2. **墨分五色**：通过焦、浓、重、淡、清形成视觉层级。
3. **气韵生动**：追求东方意境和页面韵律，而不是堆叠水墨素材。
4. **虚实相生**：核心信息清晰，装饰山水若隐若现。

---

## 二、色彩体系（CSS 变量）

```css
:root {
  /* 墨分五色 */
  --ink-burnt:  #1A1A1A;   /* 焦墨 */
  --ink-deep:   #333333;   /* 浓墨 */
  --ink-medium: #666666;   /* 淡墨 */
  --ink-light:  #999999;   /* 清墨 */

  /* 宣纸 */
  --paper:       #F8F5F0;  /* 宣纸白 */
  --paper-rice:  #FAF0E6;  /* 米色 */
  --paper-ivory: #FFFFF0;  /* 象牙白 */

  /* 点缀色 */
  --seal-red:    #C41E3A;  /* 朱红印章 */
  --mountain:    #2E8B57;  /* 青绿山水 */
  --gold:        #D4AF37;  /* 金色点缀 */

  /* 圆角（几乎为方） */
  --radius-sm: 2px;
  --radius-md: 4px;

  /* 间距 */
  --space-1: 4px;  --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-8: 48px; --space-10: 64px; --space-12: 96px;
}
```

### 2.1 色彩使用规则
- 宣纸白作为页面主背景；
- 墨色作为文字和山水主体；
- 朱红只用于印章、路线节点和核心操作；
- 青绿只用于河流、山水和少量状态提示；
- 金色只用于极少量精致装饰；
- 禁止大面积蓝紫渐变；
- 禁止高饱和荧光色；
- 禁止普通 SaaS 后台风格。

---

## 三、字体规范

### 3.1 字体分层（性能优化）

| 字体 | CSS 类 | 加载级别 | 用途 |
|------|--------|---------|------|
| Liu Jian Mao Cao | `.font-calligraphy-cao` | **核心** | 主标题"一卷顺德" |
| Ma Shan Zheng | `.font-calligraphy-xing` | **核心** | 副标题 / 路线名 / 章节标题 |
| ZCOOL XiaoWei | `.font-body-kai` | **核心** | 正文 / 景点介绍 |
| Noto Serif SC | `.font-data` | **核心** | 数据 / 距离 / 时间 / 地址 |
| Zhi Mang Xing | `.font-calligraphy-xingcao` | 装饰 | 诗句 / 竖排题字 |
| ZCOOL KuaiLe | `.font-seal` | 装饰 | 印章文字 |

### 3.2 字体加载（Google Fonts + 系统字体回退）

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&family=Noto+Serif+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
```

> 装饰字体（Zhi Mang Xing、ZCOOL KuaiLe）首版按需引入或延后加载，若性能不达标则回退到系统字体。

### 3.3 字体回退链

```css
.font-calligraphy-cao { font-family: 'Liu Jian Mao Cao', 'STKaiti', 'KaiTi', cursive; }
.font-calligraphy-xing { font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive; }
.font-calligraphy-xingcao { font-family: 'Zhi Mang Xing', 'STKaiti', 'KaiTi', cursive; }
.font-body-kai { font-family: 'ZCOOL XiaoWei', 'STKaiti', 'KaiTi', 'FangSong', serif; }
.font-seal { font-family: 'ZCOOL KuaiLe', 'STKaiti', cursive; }
.font-data { font-family: 'Noto Serif SC', 'Microsoft YaHei', 'SimSun', serif; }
```

### 3.4 竖排文字
```css
.vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
```

### 3.5 数据强制可读字体
数据 / 距离 / 时间 / 地址必须使用 `.font-data`（Noto Serif SC），保证可读性。

---

## 四、视觉元素

- 水墨远山（CSS gradient + SVG filter feTurbulence）
- 河涌和水波（SVG path + opacity 叠加）
- 毛笔笔触（CSS clip-path / pseudo-elements）
- 不规则墨迹边缘（SVG mask）
- 朱红印章（SVG rect + 篆体字 + filter drop-shadow）
- 岭南窗格（SVG pattern + CSS mask）
- 干笔线条、墨晕、晕染
- 宣纸纹理（低透明度 SVG noise）

---

## 五、布局要求

1. 大量留白（模块间距 ≥ 96px）；
2. 不对称构图（左右栏 7:5 或 5:7）；
3. 视觉动线自然；
4. 模块之间距离疏朗；
5. 局部使用竖排文字；
6. 内容区最大宽度合理（桌面 max-width 1180px）；
7. 桌面端具有长卷感；
8. 手机端改为纵向卷轴阅读；
9. 不得为水墨效果牺牲可读性；
10. 不要到处使用圆角白卡片和强阴影。

---

## 六、动效规范

| 元素 | 动效 | 时长 | 缓动 |
|------|------|------|------|
| 首屏山水 | opacity 0→1 + translateY 12px→0 | 1200ms | ease-out |
| 首屏题字 | 笔画逐字 fade | 每字 80ms | linear |
| 路线线条 | stroke-dashoffset 100%→0 像毛笔 | 1500ms | ease-in-out |
| 印章盖下 | scale 1.4→1 + opacity | 300ms | cubic-bezier(.2,.8,.2,1) |
| 卡片 hover | 周围淡墨晕 opacity 0→.2 | 200ms | ease |
| 滚动进入 | translateY 20px→0 + opacity 0→1 | 600ms | ease-out |
| 生成行程 | 三段状态切换："研墨"→"寻路"→"成卷" | 每段 600ms | — |

### 6.1 限制
- 不使用快速旋转 / 大幅弹跳 / 粒子背景 / 大量视差；
- 必须支持 `prefers-reduced-motion`；
- 不影响手机性能；
- 文字可读性优先。

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.08s !important;
    transition-duration: 0.08s !important;
  }
}
```

---

## 七、响应式

| 断点 | 布局 |
|------|------|
| ≥ 1024 px | 桌面横卷，内容居中 max-width 1180 px |
| 640-1024 px | 平板，居中单栏 |
| < 640 px | 手机纵卷，单栏流式 |

---

## 八、无障碍

- 所有图片有 `alt`；
- 按钮 / 表单 `aria-label`；
- 颜色对比度 ≥ 4.5:1（正文）/ ≥ 3:1（大字号）；
- 键盘可达；
- 支持 `prefers-reduced-motion`；
- 字体可放大至 200% 不破坏布局。

---

## 九、性能

- 首屏 < 200KB gzipped JS；
- 字体按需加载，仅引入必要字重；
- 图片用 SVG / CSS 渐变代替位图；
- Lighthouse 性能 ≥ 85；
- 4 种核心字体必须加载；2 种装饰字体若性能不达标可延后或回退。

---

## 十、安全

- 不出现任何 Key / Token；
- `.gitignore` 排除 `node_modules` / `dist` / `.env*`；
- 外部链接 `target="_blank" rel="noopener noreferrer"`；
- 不执行 `git init` / `git commit`（除非用户明确要求）。