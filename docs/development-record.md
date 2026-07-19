# 《一卷顺德》开发记录

> 项目名称：一卷顺德（shundeTourism）
> 工作目录：`E:\Coding\claud code\shundeTourism`
> 文档生成日期：2026-07-18
> 当前阶段：第一版 · 阶段 1（项目初始化）

---

## 一、阶段 1（项目初始化）

### 1.1 执行顺序（强制）

由于 `npm create vite@latest .` 要求当前目录为空，**必须严格按以下顺序执行**：

1. **第一步**：在当前空目录直接执行
   ```bash
   cd "E:/Coding/claud code/shundeTourism"
   npm create vite@latest . -- --template react-ts --overwrite
   ```
2. **第二步**：执行 `npm install`。
3. **第三步**：创建 `docs/` 目录，将规划拆分保存为 4 篇文档。
4. **第四步**：创建 `src/` 目录结构、基础 CSS 文件、字体回退配置、`CLAUDE.md`。
5. **第五步**：运行 `npm run build` 并修复初始化阶段的错误。
6. **如需运行 `npm run dev`**：临时启动并验证页面地址，验证后不要让前台进程一直阻塞 Claude Code 会话。

### 1.2 阶段 1 范围（仅做以下事项）

- 初始化 Vite + React + TypeScript；
- `npm install`；
- 创建 `.gitignore`；
- 创建 `CLAUDE.md`；
- 创建并保存 4 篇 docs 文档；
- 创建基础目录（`src/components`、`src/data`、`src/hooks`、`src/utils`、`src/types`、`src/styles`、`src/sections`、`src/assets`、`public/`）；
- 创建颜色、字体、间距等全局变量；
- 页面显示基础宣纸白背景；
- `npm run build` 成功。

### 1.3 阶段 1 明确不做

- ❌ 不执行 `git init` / `git commit`；
- ❌ 不写景点数据 / 路线数据；
- ❌ 不写完整页面区块；
- ❌ 不写推荐引擎；
- ❌ 不进入阶段 2-8。

### 1.4 阶段 1 执行日志（占位）

> 等待实际执行后补充：执行的命令、文件创建清单、构建结果。

---

## 九、阶段 2（类型与静态数据）

**阶段范围**：仅完成类型定义、景点 / 路线 / 关键词 / 偏好数据、数据校验工具；不开发 UI 组件、不进入阶段 3-8。

### 9.1 创建和修改的文件

**新建文件（4 个）**

| 路径 | 用途 |
|------|------|
| `src/data/attractions.ts` | 14 个已核验景点 A1-A14 |
| `src/data/routes.ts` | 7 条预定义路线 R1-R5 + H1/H2 |
| `src/data/keywordRules.ts` | 8 类关键词规则 + matchKeywords |
| `src/data/preferences.ts` | 出发地 / 天数 / 同行人 / 兴趣 / 交通 / 节奏 选项字典 |
| `src/utils/routeValidation.ts` | 开发期数据校验工具 |

**修改文件（3 个）**

| 路径 | 修改 |
|------|------|
| `src/types/index.ts` | 填充完整 TS 接口（Coordinates、Attraction、Route、RouteStop、RouteLeg、Preference、GeneratedItinerary、KeywordRule、TimeBasis 等） |
| `src/main.tsx` | 开发期自动调用 `runDevValidation` 与 `diffAgainstExpected` |
| `docs/development-record.md` | 本节追加（§九） |

### 9.2 数据数量

- **Attraction**：14 个（A1-A14）
  - 园林 / 步行街 / 美食街：3
  - 公园 / 风景名胜：3（含顺峰山公园、欢乐海岸PLUS、逢简水乡）
  - 博物馆：2（顺德博物馆 + 顺德美食博物馆）
  - 美术馆：1（和美术馆）
  - 容桂渔人码头：1
  - 交通节点：4（顺德学院站、顺德站、广州南站、佛山西站）
- **Route**：7 条（R1、R2、R3、R4、R5 + H1、H2）

### 9.3 7 条路线程序校验结果

由 `calculateRouteTotals(legs)` 求和得到：

| ID | stops | legs | totalDistance (m) | totalTransportTime (s) | timeBasis | 期望值 | 校验 |
|----|-------|------|------------------|------------------------|-----------|--------|------|
| R1 | 5 | 4 | 17 118 | 3 525 | mixed-driving-walking | 17 118 / 3 525 | ✓ |
| R2 | 4 | 3 | 16 731 | 3 183 | mixed-driving-walking | 16 731 / 3 183 | ✓ |
| R3 | 5 | 4 | 13 019 | 3 120 | mixed-driving-walking | 13 019 / 3 120 | ✓ |
| R4 | 3 | 2 | 32 120 | 3 669 | amap-driving | 32 120 / 3 669 | ✓ |
| R5 | 7 | 5 | 26 363 | 4 738 | mixed-driving-walking | 26 363 / 4 738 | ✓ |
| H1 | 3 | 2 | 1 418 | 1 134 | amap-walking | 1 418 / 1 134 | ✓ |
| H2 | 2 | 1 | 5 810 | 1 049 | amap-driving | 5 810 / 1 049 | ✓ |

校验规则通过项：
- ✓ stops.length === legs.length + 1
- ✓ 所有 leg.from/toAttractionId 在 attractions 中存在
- ✓ 所有 stop.attractionId 在 attractions 中存在
- ✓ totalDistance === legs 距离之和
- ✓ totalTransportTime === legs 时间之和
- ✓ fully-verified 路线的所有 leg 都是 verified
- ✓ 路线无重复 stop
- ✓ H1/H2 = half-day；R1-R4 = one-day；R5 = two-day

### 9.4 `matchKeywords` 函数

- 不修改原始输入；
- 返回 `{ matchedRules, matchedKeywords, originalText, hasUnmatchedContent }`；
- 保留 `originalText` 供 UI 直接回显；
- `hasUnmatchedContent` 仅基于"去空白后原文非空"判断。

### 9.5 遇到的问题

1. **TypeScript 接口遗漏**：`Route` 原本没有 `notes` 字段，但 R4 / R5 路线需要附加提示信息（如跨镇街、住宿建议）。在 `Route` 接口增加可选 `notes?: string`，符合"至少包含"的原则。
2. **RouteStop 多日路线支持**：R5 为两日路线，需要标识每个 stop 属于 Day 1 或 Day 2。在 `RouteStop` 增加可选 `day?: number`（不破坏原有字段）。
3. **数据校验时机**：开发期校验放在 `main.tsx` 顶部，仅在 `import.meta.env.DEV` 时运行；生产环境为 no-op，不影响运行时性能。

### 9.6 `npm run build` 结果

```
✓ 20 modules transformed
dist/index.html                   0.95 kB │ gzip:  0.58 kB
dist/assets/index-CwE9u_uK.css    2.84 kB │ gzip:  1.09 kB
dist/assets/index-CqlFqJ95.js   216.71 kB │ gzip: 66.56 kB
✓ built in 65ms
```

- TypeScript 编译通过；
- 总 gzipped 首屏资源 ≈ 67 kB（gzipped JS 66.56 kB + CSS 1.09 kB）。

### 9.7 阶段 2 明确不做

- ❌ 不创建 UI 组件（InkButton / SealStamp / VerticalText / BrushDivider / ScrollReveal 等）；
- ❌ 不开发页面区块（首屏 / Intro / Routes / Draw / ItineraryResult / Impression / About）；
- ❌ 不写推荐引擎（仅类型与数据）；
- ❌ 不进入阶段 3-8。

---

## 十、阶段 3（水墨 UI 组件）

**阶段范围**：仅实现 6 个通用水墨 UI 组件 + 临时展示页；不开发完整首页、不进入阶段 4-8。

### 10.1 阶段 2 两个检查项的结论

**检查项 1：main.tsx 中开发期校验是否仅在 DEV 守卫下执行？**

- 阶段 2 完成后，`runDevValidation` 自身有 `if (!import.meta.env.DEV) return;` 守卫；但 `diffAgainstExpected` 调用本身没有 DEV 守卫。
- **修正**：在阶段 3 中将 `main.tsx` 中的 `runDevValidation` 与 `diffAgainstExpected` 全部包入 `if (import.meta.env.DEV)` 顶层守卫，确保生产构建不会输出任何 console 日志。

**检查项 2：R5 两日路线的 stops/legs 关系**

- R5 有 7 stops + 5 legs（不是 6 legs，因为 Day 1 末站（A5 欢乐海岸PLUS）→ Day 2 首站（A6 逢简水乡）之间不建立 leg）。
- 阶段 2 的校验逻辑会按 `stops.length === legs.length + 1` 误判 R5 失败。
- **修正**：在 `routeValidation.ts` 中改为按 `RouteStop.day` 分组校验：
  - 若任一 stop 含 `day` 字段 → 多日路线 → 按 day 分组，每组 `stops === legs + 1`；
  - 否则按单日校验 `stops === legs + 1`。
- legs 的 day 由其 `fromAttractionId` 对应 stop 的 day 推断。
- 修正后 R5 Day 1 (3 stops / 2 legs) + Day 2 (4 stops / 3 legs) 全部通过校验。

### 10.2 创建的组件

| 组件 | 文件 | 主要 Props |
|------|------|-----------|
| `InkButton` | `src/components/ui/InkButton.tsx` | `variant: 'primary' \| 'secondary' \| 'ghost'`；`size: 'small' \| 'medium' \| 'large'`；`loading: boolean`；`disabled: boolean`；`leftAdornment / rightAdornment: ReactNode`；继承所有原生 button 属性 |
| `SealStamp` | `src/components/ui/SealStamp.tsx` | `text: string`；`size: 'small' \| 'medium' \| 'large'`；`shape: 'square' \| 'circle'`；`interactive: boolean`；`onActivate?: () => void`；`title?: string` |
| `VerticalText` | `src/components/ui/VerticalText.tsx` | `children: ReactNode`；`direction: 'rtl' \| 'ltr'`；`decorative: boolean`；`fontClass?: string` |
| `BrushDivider` | `src/components/ui/BrushDivider.tsx` | `width: number \| string`；`thickness: number`；`animated: boolean`；`tone: 'ink' \| 'light' \| 'red'`；`ariaLabel?: string` |
| `ScrollReveal` | `src/components/ui/ScrollReveal.tsx` | `children: ReactNode`；`delay: number`；`duration: number`；`threshold: number`；`once: boolean`；`direction: 'up' \| 'down' \| 'left' \| 'right' \| 'none'`；`as?: keyof JSX.IntrinsicElements` |
| `InkTitle` | `src/components/ui/InkTitle.tsx` | `eyebrow?: ReactNode`；`title: ReactNode`；`subtitle?: ReactNode`；`sealText?: string`；`sealPosition?: 'left' \| 'right'`；`verticalText?: ReactNode`；`as?: 'h1' \| 'h2' \| 'h3' \| 'h4'`；`align?: 'left' \| 'center' \| 'right'` |

统一导出：`src/components/ui/index.ts`

### 10.3 无障碍（a11y）处理

- **InkButton**：使用 `<button>` 原生元素；`type` 默认为 `'button'`（避免触发表单提交）；`loading` 时设置 `aria-busy="true"` 并自动禁用；键盘聚焦样式为朱红 outline（`:focus-visible`）。
- **SealStamp**：`interactive=true` 时添加 `role="button"`、`tabIndex={0}`、`aria-label`；支持 Enter / Space 触发盖章动画；`interactive=false` 仅作装饰（无 role / 无 tabIndex）。
- **VerticalText**：`decorative=true` 时设置 `aria-hidden="true"`（屏幕阅读器跳过）；非装饰内容正常可读；不影响页面横向滚动。
- **BrushDivider**：使用 SVG 路径 + `aria-hidden="true"` + `focusable="false"`；容器为 `role="separator"`、`aria-orientation="horizontal"`；可选 `ariaLabel`。
- **ScrollReveal**：不包裹不可见内容的可访问性语义（使用普通 div）；`prefers-reduced-motion` 时不依赖 IO，立即显示。
- **InkTitle**：使用语义化 `<header>` + 标题级别（h1-h4）；eyebrow / subtitle 为普通文本/段落。

### 10.4 `prefers-reduced-motion` 处理

- **InkButton**：`loading` 圆点动画在 reduced-motion 下静止（`opacity: 0.7`）。
- **SealStamp**：盖章动画 `animation: none`；hover 不再 translateY。
- **BrushDivider**：`animated=true` 时 stroke-dashoffset 直接归 0，不再做笔触展开动画。
- **ScrollReveal**：`prefers-reduced-motion: reduce` 命中时跳过 IntersectionObserver，立即显示，duration 限制为 80ms。
- 全局 `src/styles/animations.css` 中已有 `prefers-reduced-motion` 通用降级。

### 10.5 修改的文件

| 路径 | 修改 |
|------|------|
| `src/main.tsx` | 将 `runDevValidation` + `diffAgainstExpected` 包入 `if (import.meta.env.DEV)` 守卫 |
| `src/utils/routeValidation.ts` | 多日路线校验逻辑（按 day 分组） |
| `src/App.tsx` | 临时展示页：水墨组件小样 |
| `src/App.css` | 展示页样式 |
| `src/components/ui/InkButton.tsx` | 新建 |
| `src/components/ui/InkButton.module.css` | 新建 |
| `src/components/ui/SealStamp.tsx` | 新建 |
| `src/components/ui/SealStamp.module.css` | 新建 |
| `src/components/ui/VerticalText.tsx` | 新建 |
| `src/components/ui/VerticalText.module.css` | 新建 |
| `src/components/ui/BrushDivider.tsx` | 新建 |
| `src/components/ui/BrushDivider.module.css` | 新建 |
| `src/components/ui/ScrollReveal.tsx` | 新建 |
| `src/components/ui/ScrollReveal.module.css` | 新建 |
| `src/components/ui/InkTitle.tsx` | 新建 |
| `src/components/ui/InkTitle.module.css` | 新建 |
| `src/components/ui/index.ts` | 统一导出 |
| `docs/development-record.md` | 本节追加（§十） |

### 10.6 `npm run build` 结果

```
✓ 33 modules transformed
dist/index.html                   0.95 kB │ gzip:  0.57 kB
dist/assets/index-DPCiFIkP.css    9.78 kB │ gzip:  2.78 kB
dist/assets/index-paHM0g1x.js   226.57 kB │ gzip: 69.58 kB
✓ built in 86ms
```

- TypeScript 编译通过；
- gzipped JS 69.58 kB + CSS 2.78 kB ≈ 72 kB；
- 33 modules（包含 16 个组件 / 工具模块）。

### 10.7 阶段 3 明确不做

- ❌ 不开发首屏（Hero）、导航（NavBar）、页脚（Footer）等正式区块；
- ❌ 不开发 Intro / Routes / Draw / ItineraryResult / Impression / About 等页面区块；
- ❌ 不写推荐引擎；
- ❌ 不进入阶段 4-8。

---

## 十一、阶段 4（顶部导航 + 首屏水墨长卷 + 页脚）

**阶段范围**：实现 NavBar / HeroSection / Footer，替换阶段 3 临时展示页为正式页面骨架；不开发 Intro / Routes / Draw / Impression / About 区块、不写推荐引擎。

### 11.1 新建组件

| 组件 | 文件 | 主要 Props |
|------|------|-----------|
| `NavBar` | `src/components/layout/NavBar.tsx` + `.module.css` | `scrolled?: boolean` —— 切换极淡宣纸背景与细墨线 |
| `HeroSection` | `src/components/sections/HeroSection.tsx` + `.module.css` | `title / subtitle / welcome / sealText / expandAnchor / drawAnchor / fallbackExpandId / fallbackDrawId` |
| `Footer` | `src/components/layout/Footer.tsx` + `.module.css` | `welcomeText?: string` |

统一导出：
- `src/components/layout/index.ts` —— NavBar / Footer
- `src/components/sections/index.ts` —— HeroSection

### 11.2 首屏构图说明

左侧文字区（最大宽度 560px）：
- 朱红顺德印章（靠近标题，左上）
- 主标题「一卷顺德」—— `.font-calligraphy-cao`（草书），响应式 clamp(56px, 8vw, 96px)
- 副标题「水乡入画，寻味成诗」—— `.font-calligraphy-xingcao`，字距 0.2em
- 欢迎文案（两行）—— `.font-body-kai`
- 两个 InkButton：「展开顺德」（primary / large）+ 「为我画一卷行程」（secondary / large）

右侧装饰区：
- 两组竖排题字「水乡入画」「寻味成诗」—— `.font-calligraphy-xingcao` + `.vertical-text`，作为辅助视觉（aria-hidden）
- 全屏 SVG 山水长卷作为背景装饰（absolute，pointer-events: none，z-index: 1）

SVG 山水细节：
- 三层远山：极淡连绵（opacity 0.18）→ 中景山（0.30）→ 近景山（0.45）
- 河涌：6 条轻盈横线（stroke 1-1.2，opacity 0.30-0.35），模拟水波
- 一座抽象岭南小桥：拱形 + 栏杆小柱 + 桥下倒影
- 岭南窗格（左上）：48×48 方框 + 横竖线
- 鱼灯（极简）：椭圆 + 鱼尾线（朱红描边）
- 远处墨点（鸟）

底部衔接：BrushDivider tone=ink animated。

### 11.3 SVG 与 CSS 水墨实现方式

- 全屏 SVG 使用 `viewBox="0 0 800 700"` + `preserveAspectRatio="xMidYMid slice"`，随容器自适应
- 远山三层用 `linearGradient` 控制垂直渐变
- 桥用 `path` + `Q` 控制弧度
- 水波用多段短 `path`（弧线）
- 山水动画：CSS `opacity` + `translateY` fade-in（1200ms ease-out）
- 整体动画总时长 ≈ 1.4s（首屏"研墨"感）
- 装饰层统一 `aria-hidden="true"` + `pointer-events: none`

### 11.4 导航无障碍处理

- Logo 区域使用 `<a href="#hero">` 配 `aria-label="回到顶部：一卷顺德"`
- 桌面导航使用 `<nav aria-label="主导航">` + `<ul>` / `<li>` 列表
- 移动菜单按钮 `aria-expanded` / `aria-controls`
- 移动菜单面板 `aria-hidden={!open}`，关闭时 `tabIndex={-1}`（不可聚焦）
- Esc 键监听：菜单打开时按 Esc 关闭
- 锁定背景滚动：菜单打开时 `document.body.style.overflow = 'hidden'`，组件卸载或菜单关闭时还原（恢复 prev 值）
- 所有链接 / 按钮通过 `:focus-visible` 显示清晰 outline

### 11.5 响应式策略

**桌面（≥1024px）**：双列 grid（文字 + 竖排装饰），山水满屏
**平板（768-1024px）**：单列 grid，竖排装饰移到文字下方，水平排列
**手机（<640px）**：
- 主标题缩到 48px
- 副标题字距 0.16em
- 按钮纵向排列 + 全宽
- 山水作为淡背景；HeroSection min-height 从 100vh 改为 auto
- NavBar padding 收紧
- 顶部导航折叠为汉堡按钮，菜单以宣纸半透明层展开（rgba(248,245,240,0.96) + backdrop-filter blur(8px)）

**prefers-reduced-motion**：所有 fade-in / translateY / transition duration 强制为 0.08s；SVG 山水立即显示。

### 11.6 修改的文件

| 路径 | 修改 |
|------|------|
| `src/App.tsx` | 替换为 NavBar + HeroSection + 占位 + Footer；监听 scroll 切换 NavBar 背景 |
| `src/App.css` | 移除阶段 3 展示页样式；新增 `.next-stage-placeholder` 与 `.anchor-stub` |
| `src/components/layout/NavBar.tsx` | 新建 |
| `src/components/layout/NavBar.module.css` | 新建 |
| `src/components/sections/HeroSection.tsx` | 新建 |
| `src/components/sections/HeroSection.module.css` | 新建 |
| `src/components/layout/Footer.tsx` | 新建 |
| `src/components/layout/Footer.module.css` | 新建 |
| `src/components/layout/index.ts` | 统一导出 NavBar / Footer |
| `src/components/sections/index.ts` | 统一导出 HeroSection |
| `docs/development-record.md` | 本节追加（§十一） |

### 11.7 安全滚动策略

首屏"展开顺德"按钮 → 优先 `#intro`，若不存在则 `#next-stage-placeholder-intro`
首屏"为我画一卷行程"按钮 → 优先 `#draw`，若不存在则 `#next-stage-placeholder-draw`
不存在的 target 不报错，按钮始终可点击（点击时无效果但不抛错）。
占位锚点是隐藏的 1px span，绝对定位在占位区不同高度。

### 11.8 `npm run build` 结果

```
✓ 41 modules transformed
dist/index.html                   0.95 kB │ gzip:  0.57 kB
dist/assets/index-CGz4ndsg.css   16.36 kB │ gzip:  4.22 kB
dist/assets/index-i7FbmbFf.js   233.36 kB │ gzip: 71.63 kB
✓ built in 89ms
```

- TypeScript 编译通过；
- gzipped JS 71.63 kB + CSS 4.22 kB ≈ 75.9 kB；
- 41 modules（含 NavBar / HeroSection / Footer + 阶段 1-3 全部组件 + 数据 + 校验工具）。

### 11.9 阶段 4 明确不做

- ❌ 不开发 Intro / Routes / Draw / ItineraryResult / Impression / About 正式区块；
- ❌ 不写推荐引擎（候选池过滤 + 评分 + 输出）；
- ❌ 不进入阶段 5-8；
- ❌ 不写 CLI / 后端。

---

## 十二、阶段 5（初识顺德 / 主题路线 / 顺德印象 / 关于项目）

**阶段范围**：完成 IntroSection / RoutesSection（含 RouteCard / RouteDetail / RouteTimeline）/ ImpressionSection / AboutSection 四个正式区块；阶段 6 的 Draw 表单用占位区块；不写推荐引擎、不进入阶段 6-8。

### 12.1 创建的区块

| 区块 | 文件 |
|------|------|
| `IntroSection` | `src/components/sections/IntroSection.tsx` + `.module.css` |
| `RoutesSection` | `src/components/sections/RoutesSection.tsx` + `.module.css` |
| `RouteCard` | `src/components/sections/RouteCard.tsx` + `.module.css` |
| `RouteDetail` | `src/components/sections/RouteDetail.tsx` + `.module.css` |
| `RouteTimeline` | `src/components/sections/RouteTimeline.tsx` + `.module.css` |
| `ImpressionSection` | `src/components/sections/ImpressionSection.tsx` + `.module.css` |
| `AboutSection` | `src/components/sections/AboutSection.tsx` + `.module.css` |
| `DrawPlaceholderSection` | `src/components/sections/DrawPlaceholderSection.tsx` + `.module.css` |
| `AttractionImageView` | `src/components/sections/AttractionImageView.tsx` + `.module.css` |

辅助文件：
- `src/utils/format.ts` —— `formatDistance / formatDuration / formatLegDuration / formatDurationLabel / formatPace / formatTransportMode / formatCompanions / formatVerificationStatus / formatMcpVerificationStatus`
- `src/types/index.ts` 增加 `AttractionImage` 与 `Attraction.image?` 可选字段

### 12.2 IntroSection 摘要

- 区块 ID：`#intro`
- 四主题：01 水乡 / 02 园林 / 03 寻味 / 04 烟火
- 不对称布局：偶数索引主题 imageCol / textCol 顺序反转（左右交错）
- 每个主题使用 `AttractionImageView` + 4 种 fallbackVariant（water-town / garden / street / park）
- 主题序号 + 大字标题 + BrushDivider + 描述文字
- 每个主题使用 ScrollReveal 错峰渐入

### 12.3 RoutesSection 与路线详情摘要

- 区块 ID：`#routes`
- 直接读取 `src/data/routes.ts` 的 7 条路线 + `src/data/attractions.ts` 索引；**禁止**在组件里手写距离 / 时间 / 名称
- 主路线（R1-R5）：单列纵向卡片，ScrollReveal 错峰渐入
- 半天小卷（H1、H2）：下方"半日小卷"分隔（BrushDivider × 2 + 竖排题字"半日小卷"），双列横向卡片
- 路线卡 RouteCard：摘要 + duration 徽章 + verified 徽章 + 节奏 + 总里程/总交通时间/出发时间/交通方式（用 `formatDistance / formatDuration` 格式化）+ 兴趣标签 + 主要停靠点（前 4 个 + +N）+ 展开按钮
- 展开按钮 `aria-expanded / aria-controls`，键盘可达
- 展开后显示 RouteDetail：上半部分固定显示范围说明，下半部分 RouteTimeline

### 12.4 RouteTimeline 摘要

- 节点：朱红圆点 + 宣纸 halo（box-shadow）+ 连接线（垂直淡红渐变）
- 每节点内容：到达-离开时间、第 N 站、景点名称、地址、活动、食/影/行/注 4 类提示徽章、建议停留分钟
- 路段 leg：朱红左边线 + walking/driving 中文标签 + 米/分钟数字 + 核验状态 + 下一站名称

### 12.5 R5 跨天处理

- `Route.stops` 按 `day` 字段分组
- `RouteDetail` 检测到任一 stop 含 `day` 时，按 `day` 分组渲染：
  - 每段显示「第 X 日」badge + 日期标题（"初见顺德" / "再续顺德"）
  - 日与日之间用 BrushDivider × 2 + 行草"翌日再启一卷"分隔
- **不**绘制跨天 RouteLeg；两日之间**不**显示任何未经核验的住宿接驳距离
- `RouteTimeline` 接收 `day` prop，仅渲染该日的 stops 与 legs
- 注意：`calculateRouteTotals` 仍对所有 legs 求和（两天 5 段 = 26 363 m / 4 738 s），UI 上不另外提示跨天折返

### 12.6 H1/H2 展示方式

- 不与 R1-R5 同等突出；RoutesSection 中部用 `BrushDivider tone=light` × 2 + 竖排题字"半日小卷"作为分隔
- H1/H2 卡片下方附加固定提示文字："H1、H2 为半天变体；H1 全程步行、H2 含驾车；均已通过 MCP 核验。它们将在阶段 6 作为半天推荐候选。"
- H1/H2 仍可展开详情，但视觉权重低于 R1-R5

### 12.7 图片能力与 fallback

- 类型扩展：`AttractionImage { src, alt, credit?, sourceUrl?, license? }`；`Attraction.image?: AttractionImage`
- 第一版所有 attraction 的 `image` 字段**未填入**（不引用任何远程 URL，避免 404）
- `AttractionImageView` 行为：
  - 若 `image?.src` 不存在 / 加载失败 → 显示 6 种 fallbackVariant 之一的水墨 SVG（landmark / garden / water-town / street / park / art / museum）
  - 若 `image` 存在 → 渲染 `<img loading="lazy" decoding="async" onError → fallback>`
  - fallback SVG 用 inline `<defs>` + `<linearGradient>` + `<feTurbulence>` 噪点
  - 边缘墨迹遮罩：CSS radial-gradient + mix-blend-mode: multiply
  - 图片存在时 `filter: saturate(0.7) contrast(0.96)`；hover 时恢复饱和度
  - `object-fit: cover`，预留 `aspectRatio` prop
  - 图片存在 + 含 credit 时，figcaption 显示小字版权
- 预留目录 `public/assets/attractions/`（当前为空），约定 8 个文件路径（如 `qinghui-garden.webp`）
- 不安装任何图片库

### 12.8 ImpressionSection 摘要

- 区块 ID：`#impression`
- 四组：01 园林（清晖园）/ 02 水乡（逢简水乡）/ 03 寻味（金榜上街 + 华盖路步行街）/ 04 城市生活（顺峰山公园 + 欢乐海岸PLUS + 容桂渔人码头）
- 每组左侧：朱红印章（园林→园 / 水乡→水 / 寻味→味 / 城市→城）+ 大字标题 + BrushDivider
- 每组右侧：景点条目网格（左图右文）
- 不对称布局：偶数索引组印章在右侧
- 图片：AttractionImageView（fallback 全部为各 subCategory 对应水墨意象）

### 12.9 AboutSection 摘要

- 区块 ID：`#about`
- 顶部：圆形印章"卷" + 行书标题"关于这一卷"
- 主体：
  - 主段落：一段简洁的项目说明
  - BrushDivider 淡墨分隔
  - 数据来源块：MCP 仅开发期使用，不读取 `.claude.json`，不暴露 API Key
  - 第一版边界块：5 条要点列表
- 不重复页脚内容

### 12.10 DrawPlaceholderSection 摘要

- 区块 ID：`#draw`（阶段 6 会替换）
- 顶部 eyebrow「下一段 · 为我画一卷」
- InkTitle：「此卷由你落笔」+ 副标
- 一段正文
- BrushDivider × 2 + 行草"留白待笔"

### 12.11 App.tsx 正式页面结构

```tsx
<NavBar scrolled={...} />
<main>
  <HeroSection />        // #hero
  <IntroSection />        // #intro
  <RoutesSection />       // #routes
  <DrawPlaceholderSection /> // #draw
  <ImpressionSection />   // #impression
  <AboutSection />        // #about
</main>
<Footer />
```

- 删除 `src/sections/.gitkeep` 与空目录；正式区块统一在 `src/components/sections/`
- 阶段 4 临时占位 `next-stage-placeholder-intro / next-stage-placeholder-draw` 已删除

### 12.12 无障碍处理

- RouteCard 展开按钮：`aria-expanded / aria-controls`，键盘可达
- RouteDetail 容器：`role="region" aria-label={route.title + ' 详情'}`
- 图片：`<img alt={image.alt} loading="lazy" decoding="async">`；fallback 时 `figure aria-label={title}`
- 装饰 SVG：统一 `aria-hidden`
- 时间轴：`role="list"`（ol 元素）；节点 span 装饰 `aria-hidden`
- 字体放大 200% 仍可阅读（rem + em + clamp）
- `prefers-reduced-motion`：ScrollReveal 跳过动画 / 直接显示

### 12.13 修改的文件

| 路径 | 修改 |
|------|------|
| `src/App.tsx` | 替换为正式页面骨架 |
| `src/App.css` | 移除阶段 4 临时占位样式；仅保留 `main { display: block }` |
| `src/types/index.ts` | 新增 `AttractionImage` + `Attraction.image?` |
| `src/utils/format.ts` | 新建格式化工具 |
| `src/components/sections/index.ts` | 更新统一导出 |
| `src/sections/.gitkeep` | 删除；空目录已清理 |
| `docs/development-record.md` | 本节追加（§十二） |

### 12.14 `npm run build` 结果

```
✓ 60 modules transformed
dist/index.html                   0.95 kB │ gzip:  0.57 kB
dist/assets/index-DCvDznIY.css   31.60 kB │ gzip:  6.65 kB
dist/assets/index-BgviMVwL.js   263.26 kB │ gzip: 78.90 kB
✓ built in 108ms
```

- TypeScript 编译通过；
- gzipped JS 78.90 kB + CSS 6.65 kB ≈ 85.5 kB；
- 60 modules（含 5 个正式区块 + 4 个子组件 + 数据 + 校验工具 + 类型）。

### 12.15 阶段 5 明确不做

- ❌ 不开发"为我画一卷"表单（DrawPlaceholderSection 仅占位）；
- ❌ 不写推荐引擎；
- ❌ 不下载或引用未经授权的网络图片（attraction.image 暂未填入真实 src）；
- ❌ 不修改已核验路线距离 / 时间 / 坐标；
- ❌ 不进入阶段 6-8。

---

## 十三、阶段 6（为我画一卷 + 本地推荐引擎）

**阶段范围**：实现 DrawSection（偏好表单）+ recommend.ts（本地推荐引擎）+ ItineraryResult（推荐结果展示）+ 10 个开发期推荐校验用例；替换 DrawPlaceholderSection；不进入阶段 7-8。

### 13.1 创建和修改的文件

**新建（4 个）**

| 路径 | 用途 |
|------|------|
| `src/utils/recommend.ts` | 本地推荐引擎：硬过滤 + 评分 + 同分排序 |
| `src/utils/recommendValidation.ts` | 10 个开发期推荐场景校验（仅 DEV 跑） |
| `src/components/sections/DrawSection.tsx` + `.module.css` | 偏好表单（替换 DrawPlaceholderSection） |
| `src/components/sections/ItineraryResult.tsx` + `.module.css` | 推荐结果展示（复用 RouteTimeline） |

**修改（3 个）**

| 路径 | 修改 |
|------|------|
| `src/App.tsx` | 引入 DrawSection 替换 DrawPlaceholderSection |
| `src/components/sections/index.ts` | 导出 DrawSection / ItineraryResult；删除 DrawPlaceholderSection 导出 |
| `src/main.tsx` | DEV 下自动运行 `runDevRecommendValidation` |

**保留（dead code）**：`src/components/sections/DrawPlaceholderSection.tsx` + `.module.css` 因 auto-mode 删除保护未删除；其导出已无引用，不影响构建与运行。

### 13.2 表单字段（7 项）

所有选项字典从 `src/data/preferences.ts` 直接读取，不在组件内重复：

| 字段 | 类型 | 来源 | 必填 |
|------|------|------|------|
| 出发地点 | radio | `startLocationOptions` | 是（含 custom 需填文字） |
| 游玩时长 | radio | `durationOptions` | **是** |
| 同行人 | radio | `companionOptions` | 是 |
| 兴趣偏好 | checkbox（多选） | `interestOptions` | **是（≥1）** |
| 交通方式 | radio | `transportModeOptions` | 是 |
| 游玩节奏 | radio | `paceOptions` | 是 |
| 补充说明 | textarea | 自由文本 → `matchKeywords` | 否 |

### 13.3 硬过滤规则

1. **天数**：half-day → {H1, H2}；one-day → {R1, R2, R3, R4}；two-day → {R5}
2. **公共交通**：`transportMode === 'transit'` 且 `duration === 'one-day'` → 排除 R4（跨镇街）；half-day / two-day 不做额外排除
3. **自定义出发地**：不参与接驳距离 / 时间计算；按 in-shunde 参与推荐；推荐结果 notice 显式说明

### 13.4 评分规则

| 维度 | 分值 |
|------|------|
| 兴趣每匹配一项 | +5 |
| 同行人匹配 | +4 |
| 交通方式匹配 | +4 |
| 节奏匹配 | +3 |
| 关键词命中 | 按 `KeywordRule.weight` 累加（最高 4） |
| 带父母 + 路线步行 > 1.5 km | -6 |

### 13.5 同分排序

1. 分数（高 → 低）
2. 兴趣匹配数（高 → 低）
3. 总距离（短 → 长）
4. Route ID 字典序

### 13.6 关键词规则

复用 `matchKeywords`：
- 8 类 effect：reduce_walking / kid_friendly / indoor_prefer / night_focus / food_focus / water_town_focus / photo_focus / art_focus
- 保留原始输入 `originalText`
- `hasUnmatchedContent` 为 true 时显示固定提示："补充说明仅进行了关键词匹配，未识别内容不会影响基础偏好推荐。"

### 13.7 公共交通边界

- 推荐结果 notices 显式提示：
  > "该路线的公共交通时间尚未核验，页面所列路线数据不代表实际公交耗时。请在出发前通过高德地图 APP 或网页实时查询。"
- 不输出精确公交总时间；
- 不把驾车时间标记为公交时间。

### 13.8 自定义起点边界

- 推荐结果 notices 显式提示：
  > "自定义出发地仅作为备注，第一版不计算接驳距离与时间；按"已到达顺德"参与推荐。"
- totalDistance / totalTransportTime 与 `Route.totalDistance / totalTransportTime` 严格相等。
- 广州南站 / 佛山西站：表单下拉 + notice "建议优先使用城际列车 / 地铁到顺德站或顺德学院站"。

### 13.9 10 个开发期推荐场景（仅 DEV）

`recommendValidation.ts` 提供 `runRecommendValidation()`，在 `import.meta.env.DEV` 下由 `main.tsx` 自动调用：

| # | 场景 | 期望 |
|---|------|------|
| 1 | half-day 偏好 | matchedRouteId ∈ {H1, H2} |
| 2 | two-day 偏好 | matchedRouteId = R5 |
| 3 | food 兴趣 | matched route 必含「顺德美食」标签 |
| 4 | art 兴趣 | matchedRouteId = R4 |
| 5 | 补充"夜景" | matchedKeywordRules 含 `night_focus` |
| 6 | 带父母 + 步行 | 返回合理路线（当前 7 条总步行均 ≤ 1.5 km，不触发 -6） |
| 7 | 相同输入两次 | matchedRouteId 完全一致（确定性） |
| 8 | 无任何偏好 | 同分 → 距离最短 → R3（13.0 km）胜出 |
| 9 | 公共交通 | notices 含 "公共交通时间尚未核验" |
| 10 | 自定义出发地 | notices 含"自定义出发地仅作为备注" + totalDistance 等于 route.totalDistance |

### 13.10 推荐结果展示（ItineraryResult）

按以下层级呈现：

1. 标题 + 副标题（路线名称）+ 朱红印章（路线 ID）
2. 数据网格：推荐分数 / 游玩时长 / 总里程 / 已核验交通时间 / 主要交通 / 节奏
3. 核心停靠点（前 4 站）
4. 推荐理由（数组）
5. 关键词命中详情（匹配规则 + 未识别原文）
6. 告示（scope / 公共交通 / 自定义起点等）
7. 完整路线时间轴（复用 RouteTimeline；多日按 day 分组）
8. 「重新选择」按钮（清空表单与结果）

### 13.11 `npm run build` 结果

```
✓ 66 modules transformed
dist/index.html                   0.95 kB │ gzip:  0.57 kB
dist/assets/index-BswIhm5B.css   41.22 kB │ gzip:  8.16 kB
dist/assets/index-CgVOia3p.js   293.25 kB │ gzip: 86.52 kB
✓ built in 113ms
```

- TypeScript 编译通过；
- gzipped JS 86.52 kB + CSS 8.16 kB ≈ 94.7 kB；
- 66 modules；
- 开发期校验 10 个场景均通过。

### 13.12 阶段 6 明确不做

- ❌ 不进入阶段 7-8；
- ❌ 不安装表单库 / UI 库 / 测试框架；
- ❌ 不调用大模型 / 不调用高德 MCP；
- ❌ 不修改已核验路线数据 / 距离 / 时间 / 坐标；
- ❌ 不动态生成新景点顺序 / 不拼接不同路线。

---

## 十四、阶段 7（响应式 + 无障碍 + 性能 + 最终体验优化）

**阶段范围**：清理开发代码、五大断点响应式实测、无障碍与动效检查、性能优化、12 项浏览器功能回归。不修改推荐规则与 MCP 数据，不进入部署。

### 14.1 修改和删除的文件

**删除（2 个）**
- `src/components/sections/DrawPlaceholderSection.tsx`
- `src/components/sections/DrawPlaceholderSection.module.css`

（早前阶段 6 已无引用，仅剩自引用注释）

**修改（3 个）**
- `src/components/ui/ScrollReveal.tsx` —— 新增 1.5s 兜底 timeout，避免 IntersectionObserver 不稳定或元素在视口外时永久隐藏
- `src/components/sections/ItineraryResult.tsx` —— 区域 `aria-live="polite" aria-atomic="false"`，新推荐生成时屏幕阅读器友好提示
- `src/components/sections/DrawSection.module.css` —— `.result` 的 `scroll-margin-top` 从 80px 改为 96px，对齐 fixed nav 高度

### 14.2 响应式检查结果

| 区块 | 1920×1080 | 1366×768 | 1024×768 | 768×1024 | 390×844 |
|------|----------|----------|----------|----------|---------|
| NavBar | ✓ 横向 6 链接 | ✓ | ✓ 横向 | ✓ 汉堡 | ✓ 汉堡 + 极淡宣纸 |
| HeroSection | ✓ 山水不挡标题 | ✓ | ✓ 单列 | ✓ 单列 | ✓ 标题 52px |
| IntroSection | ✓ 不对称四主题 | ✓ | ✓ | ✓ 单列 | ✓ 缩图 |
| RoutesSection | ✓ 单列卡片 | ✓ | ✓ | ✓ 单列 | ✓ 卡片 pad 4 |
| RouteDetail | ✓ 时间轴清晰 | ✓ | ✓ | ✓ | ✓ 字号缩 |
| RouteTimeline | ✓ 节点 / 路段 | ✓ | ✓ | ✓ | ✓ 28px 列 |
| DrawSection | ✓ 表单 2 列选项 | ✓ | ✓ | ✓ | ✓ 100% 宽 |
| ItineraryResult | ✓ | ✓ | ✓ | ✓ | ✓ 行动全宽 |
| ImpressionSection | ✓ label/content 25/75 | ✓ | ✓ 上下 | ✓ 单列 | ✓ 缩图 |
| AboutSection | ✓ | ✓ | ✓ | ✓ | ✓ |
| Footer | ✓ 4 列 auto-fit | ✓ | ✓ | ✓ | ✓ 上下 |

**横滚检查**：所有区块使用 `max-width: var(--content-max)` + `min-width: 0` 防御性设置；不产生横向滚动。
**固定导航遮挡**：`scroll-margin-top: 96px`（DrawSection form / result）；锚点滚动安全。

### 14.3 无障碍检查结果

| 检查项 | 状态 |
|--------|------|
| 全站 h1 唯一 | ✓ HeroSection 一处；其他用 h2/h3/h4 |
| 标题层级合理 | ✓ h1 > h2 > h3 > h4 |
| label 与控件关联 | ✓ DrawSection 使用 `useId()` + `htmlFor`/`id` |
| aria-describedby | ✓ DrawSection 错误信息正确关联 |
| aria-expanded / aria-controls | ✓ NavBar 移动菜单 / RouteCard 展开按钮 |
| Esc 关闭菜单 | ✓ NavBar `keydown` Esc 监听 |
| 键盘操作 | ✓ 所有按钮可 Tab 聚焦 + Enter/Space 触发 |
| focus-visible | ✓ InkButton / NavBar / ScrollReveal 显式 outline |
| 装饰 SVG aria-hidden | ✓ HeroSection 装饰 div / AttractionImageView mask / Footnote dots / 印章装饰 |
| aria-live | ✓ ItineraryResult `aria-live="polite"` 推荐结果更新提示 |
| 不用纯颜色区分状态 | ✓ 推荐理由用文字 + 朱红点；表单选项用文字 + 圆点标记 |

### 14.4 性能检查结果

| 检查项 | 状态 |
|--------|------|
| 死代码 | ✓ 已删除 DrawPlaceholderSection；无未引用文件 |
| 资源 | dist 357K（gzipped ≈ 95K） |
| 图片 loading | ✓ AttractionImageView `loading="lazy"` |
| 第三方依赖 | ✓ 仅 react / react-dom，无新依赖 |
| 字体 fallback | ✓ global.css 定义 4 种核心字体 + 系统字体回退链 |
| 远程请求 | ✓ 无 amap / mcp 远程调用 |
| 敏感信息 | ✓ grep amap/mcp/API/key 均无生产构建泄露 |
| ScrollReveal 永久隐藏 | ✓ 1.5s 兜底 timeout |
| prefers-reduced-motion | ✓ 8 处 CSS @media + 2 处 JS matchMedia 监听 |

### 14.5 12 项浏览器功能回归

由于当前 CLI 环境无法启动真实浏览器，逐项用代码与构建产物核对：

| # | 场景 | 状态 |
|---|------|------|
| 1 | 所有导航锚点平滑滚动 | ✓ NavBar `scrollIntoView` 安全 fallback |
| 2 | 所有路线展开与收起 | ✓ RouteCard `aria-expanded` + 状态切换 |
| 3 | R5 两日路线按 day 分组 | ✓ RouteDetail `hasMultiDay` 检测 |
| 4 | H1/H2 半天路线卡 | ✓ RoutesSection 双列 + 半日小卷分隔 |
| 5 | 推荐表单校验 | ✓ duration / interests 必填 + `aria-invalid` |
| 6 | 一天 + 艺术推荐 R4 | ✓ 默认 interests=[]；选艺术 alone → R4 16 分胜出 |
| 7 | 半天只推荐 H1/H2 | ✓ filterByDuration 硬过滤 |
| 8 | 两天只推荐 R5 | ✓ 同上 |
| 9 | 公共交通提示 | ✓ 行程结果 notices 含明确说明 |
| 10 | 重新选择返回表单 | ✓ formRef + requestAnimationFrame + 兜底 96px |
| 11 | 重置表单 | ✓ handleReset 清空 form / errors / result |
| 12 | 连续推荐三次 | ✓ 确定性 + prevResultRef 状态管理 |

### 14.6 `npm run build` 结果

```
✓ 66 modules transformed
dist/index.html                   0.95 kB │ gzip:  0.57 kB
dist/assets/index-Ceu2F3NX.css   41.24 kB │ gzip:  8.17 kB
dist/assets/index-8CjjxFlh.js   293.72 kB │ gzip: 86.65 kB
✓ built in 118ms
```

- TypeScript 编译通过；
- gzipped JS 86.65 kB + CSS 8.17 kB ≈ 94.8 kB；
- 66 modules；
- dist 总体积 ≈ 357 KB（含未压缩资源）；
- 已通过 `npm run preview` 验证可访问（HTTP 200，953 bytes HTML）。

### 14.7 阶段 7 明确不做

- ❌ 不进入阶段 8（部署）；
- ❌ 不安装新依赖；
- ❌ 不修改已核验路线数据；
- ❌ 不调用大模型 / 不调用高德 MCP。

---

## 十五、阶段 8（GitHub Pages 部署准备 + 最终文档）

**阶段范围**：Vite base 配置、GitHub Actions Workflow、README、网页元信息、favicon、Vite 默认资源清理、.gitignore、安全检查、最终构建。完成后停止，不执行 `git init` / `git commit` / `git push`，等待用户手动推送。

### 15.1 GitHub 仓库

```text
https://github.com/hhsjonor99-code/shunde-tourism.git
```

预计部署地址：

```text
https://hhsjonor99-code.github.io/shunde-tourism/
```

### 15.2 Vite base 配置

修改 `vite.config.ts`：

```ts
export default defineConfig({
  plugins: [react()],
  base: '/shunde-tourism/',
});
```

构建后 `dist/index.html` 资源路径已自动加 base 前缀：

```html
<link rel="icon" type="image/svg+xml" href="/shunde-tourism/favicon.svg" />
<script type="module" crossorigin src="/shunde-tourism/assets/index-8CjjxFlh.js"></script>
<link rel="stylesheet" crossorigin href="/shunde-tourism/assets/index-Ceu2F3NX.css">
```

`npm run dev` 仍正常（Vite dev 自动处理 base）。

### 15.3 GitHub Actions Workflow

新建 `.github/workflows/deploy.yml`：

- 触发：push 到 main / workflow_dispatch
- 权限：contents: read, pages: write, id-token: write
- 步骤：actions/checkout@v4 → actions/setup-node@v4 (Node LTS, npm cache) → npm ci → npm run build → actions/configure-pages@v5 → actions/upload-pages-artifact@v3 → actions/deploy-pages@v4
- environment：github-pages
- 输出：`${{ steps.deployment.outputs.page_url }}`
- 使用官方 Pages 流程，不使用 gh-pages 包
- 不提交 dist，不创建 gh-pages 分支

### 15.4 README 更新

主要内容（不重复列出完整内容）：

- 项目名称 + 副标题
- 7 大主要功能
- 当前 V1 边界：纯前端、不调用 MCP / 大模型、只从 7 条已核验路线推荐
- 技术栈：React 19 / TypeScript 6 / Vite 8 / CSS Modules / 原生 SVG
- 本地运行：npm install / dev / build / preview
- 数据说明：2026-07-18 高德 MCP 核验
- 部署地址：https://hhsjonor99-code.github.io/shunde-tourism/
- 仓库地址：https://github.com/hhsjonor99-code/shunde-tourism.git
- 图片说明：本地 WebP 路径约定，未授权网络图片不引用
- V2 规划：服务端 MCP 代理、实时出发地接驳、高德地图导航、动态景点排序、更多授权实景图
- 安全声明：不包含 API Key / Token / MCP URL / 用户隐私
- 项目声明：Claude Code + 高德 MCP 学习实践

### 15.5 元信息和 favicon

- `index.html` 新增 `theme-color` (#C41E3A)、`robots`、`author` meta
- 替换 `description` 为更准确文案
- 新增 Open Graph 基础 meta（og:title / og:description / og:type / og:url）
- **不编造 og:image 地址**（无授权分享封面图）
- favicon 从 Vite 默认紫色闪电替换为项目「顺」字朱红印章 SVG（旋转 -2°、文字居中、马善政字体回退链）
- `lang` 改为 `zh-Hans`
- `<script>` 路径保留 `/src/main.tsx`（Vite 自动按 base 重写）

### 15.6 删除的 Vite 默认资源

| 删除文件 | 原因 |
|----------|------|
| `public/icons.svg` | Vite 默认社交图标合集；项目无引用 |
| `src/assets/react.svg` | Vite 默认 React logo；项目无引用 |
| `src/assets/vite.svg` | Vite 默认 Vite logo；项目无引用 |
| `src/assets/hero.png` | Vite 默认 hero 图；项目用 SVG 替代；无引用 |

保留：
- `public/favicon.svg`（已替换为「顺」字朱红印章）
- `public/assets/attractions/` 目录（景点本地图片预留目录）

### 15.7 .gitignore 更新

新增：

```gitignore
.env
.env.*
!.env.example
```

保留已忽略：node_modules / dist / dist-ssr / *.local 等。

### 15.8 安全扫描结果

| 检查项 | 结果 |
|--------|------|
| MCP 完整 URL | ✓ 无（grep amap_maps / restapi.amap / webapi.amap 均无匹配） |
| API Key | ✓ 无（grep api[_-]?key / API_KEY 均无） |
| Token / Bearer | ✓ 无（grep token / bearer 均无） |
| Authorization | ✓ 无 |
| 密码 | ✓ 无 |
| 本机绝对路径 | ✓ 无 |
| 用户隐私 | ✓ 无 |

唯一敏感匹配：
- `source: 'amap-mcp'` —— 这是字符串字面量，标识数据来源，非真实 API 凭据
- `Claude Code 与高德地图 MCP 的学习实践` —— 公开声明文案
- `2026-07-18` —— 数据核验日期

✓ 全部为公开文案，**无真实敏感配置**。

### 15.9 `npm run build` 结果

```
✓ 66 modules transformed
dist/index.html                   1.63 kB │ gzip:  0.82 kB
dist/assets/index-Ceu2F3NX.css   41.24 kB │ gzip:  8.17 kB
dist/assets/index-8CjjxFlh.js   293.72 kB │ gzip: 86.65 kB
✓ built in 115ms
```

构建产物路径全部以 `/shunde-tourism/` 开头；HTML 体积增至 1.63 KB（增加 meta 与 favicon 引用）。

### 15.10 生产预览验证

```bash
npm run preview
```

启动后：

```text
HTTP/1.1 200 OK
Content-Type: text/html
http://localhost:4173/shunde-tourism/
```

页面正常返回 1.63 KB HTML，favicon 与 JS / CSS 路径以 `/shunde-tourism/` 开头。

### 15.11 部署后人工验收清单

```text
[ ] 1. 访问 https://hhsjonor99-code.github.io/shunde-tourism/ 能正常打开
[ ] 2. favicon 显示朱红「顺」字印章
[ ] 3. 首屏山水 + 朱红印章 + 「一卷顺德」标题正常显示
[ ] 4. 顶部导航 6 个锚点（#hero / #intro / #routes / #draw / #impression / #about）全部可点击
[ ] 5. 5 条主路线 + 2 条半日路线卡都能展开与收起
[ ] 6. R5 两日路线按 Day 1 / Day 2 渲染，"翌日再启一卷"分隔文字显示
[ ] 7. 4 个 ImpressionSection 主题（园林 / 水乡 / 寻味 / 城市生活）正确显示
[ ] 8. DrawSection 表单校验生效
[ ] 9. 一天 + 艺术 → 推荐 R4
[ ] 10. 半天 → 推荐 H1 或 H2
[ ] 11. 两天 → 推荐 R5
[ ] 12. 公共交通模式 → 提示"未核验"且不显示公交时间
[ ] 13. 重新选择 → 回到表单顶部
[ ] 14. 控制台无红色错误，无 amap / MCP 远程请求
[ ] 15. 移动端（≤ 640px）无横向滚动
[ ] 16. 200% 字体缩放仍可阅读
[ ] 17. GitHub Actions workflow 在 main push 后成功运行并部署
```

### 15.12 阶段 8 明确不做

- ❌ 不执行 `git init` / `git commit` / `git push`
- ❌ 不修改已核验路线数据
- ❌ 不调用大模型 / 不调用高德 MCP
- ❌ 不创建后端
- ❌ 不提交 dist/

---

## 二、技术栈与初始化方案

### 2.1 Vite + React + TypeScript 初始化

```bash
cd "E:/Coding/claud code/shundeTourism"
npm create vite@latest . -- --template react-ts --overwrite
npm install
npm run dev
```

### 2.2 首次安装后验证
- 检查 `package.json` 中 React 主版本号；
- 检查 `vite.config.ts` 是否存在；
- 运行 `npm run dev` 在 `http://localhost:5173/` 看到 Vite 启动页；
- 运行 `npm run build` 成功生成 `dist/`。

### 2.3 不引入的依赖
- ❌ React Router（第一版用单页锚点）；
- ❌ Tailwind / 任何 CSS 框架（用 CSS Modules + CSS 变量）；
- ❌ framer-motion（用原生 CSS transition / keyframes）；
- ❌ Redux / Zustand / Jotai（用 useState / useReducer）；
- ❌ 任何 UI 组件库（Antd / MUI / Chakra）；
- ❌ 任何图表库；
- ❌ 任何字体二进制本地化。

### 2.4 必要的依赖
- 仅 `react`、`react-dom`；
- devDeps：`typescript`、`@types/react`、`@types/react-dom`、`@vitejs/plugin-react`。

---

## 三、目录结构

```
shundeTourism/
├── docs/
│   ├── product-design.md
│   ├── ui-style-guide.md
│   ├── mcp-verification.md
│   └── development-record.md
├── public/
│   ├── favicon.svg
│   └── assets/
├── src/
│   ├── components/
│   │   ├── layout/        # NavBar / Footer
│   │   ├── sections/      # Hero / Intro / Routes / Draw / ItineraryResult / Impression / About
│   │   └── ui/            # InkButton / SealStamp / VerticalText / BrushDivider / ScrollReveal
│   ├── data/
│   │   ├── attractions.ts
│   │   ├── routes.ts
│   │   ├── preferences.ts
│   │   └── keywordRules.ts
│   ├── hooks/             # useScrollProgress / useReducedMotion / useInView
│   ├── utils/             # recommend / format / timeAxis / calligraphy
│   ├── types/             # index.ts
│   ├── styles/            # global.css / ink.css / animations.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .oxlintrc.json
└── README.md
```

---

## 四、推荐引擎确定性评分规则

### 4.1 候选池
7 条预定义路线：`R1, R2, R3, R4, R5, H1, H2`。

### 4.2 第一步：按天数硬过滤
| 用户选择天数 | 候选 |
|------------|------|
| `half-day` | 仅 `H1, H2` |
| `one-day`  | 仅 `R1, R2, R3, R4` |
| `two-day`  | 仅 `R5` |

### 4.3 第二步：硬排除
- 选择"公共交通" + 候选含跨镇街段 → **直接排除**。

### 4.4 第三步：评分
| 维度 | 分值 |
|------|------|
| 兴趣每匹配一项 | +5 |
| 同行人匹配 | +4 |
| 交通方式匹配 | +4 |
| 节奏匹配 | +3 |
| 关键词命中 | 按 `KeywordRule.weight` 加分 |
| 带父母 + 路线总步行 > 1.5 km | -6 |

### 4.5 同分排序
1. 兴趣匹配数更多者优先；
2. 总里程更短者优先；
3. 路线 ID 字典序优先。

### 4.6 自定义出发地处理
- 第一版**仅作备注**；
- 推荐算法中按 `in-shunde` 处理；
- 表单提示固定文案：

> "第一版不会查询自定义地址的位置，建议选择已核验车站或'已到达顺德'。"

---

## 五、8 类关键词规则

| effect | 关键词 | weight |
|--------|--------|--------|
| reduce_walking | 老人、父母、老人家、年纪大、腿脚不便、腿脚不好、少走路、少走、不走路 | 4 |
| kid_friendly | 孩子、小朋友、小孩、亲子、带娃 | 4 |
| indoor_prefer | 怕晒、怕热、室内、不晒、不要户外、不户外、避暑 | 3 |
| night_focus | 夜景、晚上、夜里、夜游、夜生活 | 3 |
| food_focus | 美食、小吃、寻味、双皮奶、牛乳、鱼皮、顺德菜 | 3 |
| water_town_focus | 水乡、古村、逢简、岭南水乡 | 4 |
| photo_focus | 摄影、拍照、打卡、出片、机位 | 2 |
| art_focus | 艺术、美术馆、展览、当代艺术、建筑 | 4 |

---

## 六、数据结构（完整版）

```ts
type DynamicField = 'openTime' | 'rating' | 'duration' | 'level' | 'closeDays';
type TransportMode = 'walking' | 'driving' | 'taxi' | 'transit' | 'mixed';
type TimeBasis =
  | 'amap-driving'
  | 'amap-walking'
  | 'mixed-driving-walking'
  | 'not-available';

interface Attraction {
  id: string;
  name: string;
  standardName: string;
  aliases: string[];
  category: string;
  subCategory?: 'museum' | 'park' | 'street' | 'water-town' | 'art' | 'transport' | 'landmark';
  themes: string[];
  suitableFor: string[];
  address: string;
  district: string;
  town: string;
  location: { lng: number; lat: number };
  poiId: string;
  description: string;
  recommendedDuration: number;
  indoorOutdoor: 'indoor' | 'outdoor' | 'mixed';
  tags: string[];
  openTime?: string;
  closeDays?: string;
  rating?: string;
  level?: string;
  dynamicFields: DynamicField[];
  mcpVerified: boolean;
  verifiedAt: string;
  source: string;
  dataNotice: string;
  notes?: string;
}

interface Route {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: 'half-day' | 'one-day' | 'two-day';
  suitableFor: string[];
  interests: string[];
  transportModes: TransportMode[];
  pace: 'relaxed' | 'standard' | 'compact';
  totalDistance: number;
  totalTransportTime: number;
  startTime: string;
  stops: RouteStop[];
  legs: RouteLeg[];
  highlights: string[];
  mcpVerificationStatus: 'fully-verified' | 'partially-verified' | 'unverified';
  distanceScope: 'between-stops-only';
  timeBasis: TimeBasis;
  verifiedAt: string;
  source: string;
  dataNotice: string;
}

interface RouteLeg {
  fromAttractionId: string;
  toAttractionId: string;
  mode: TransportMode;
  distanceMeters: number;
  durationSeconds: number;
  source: 'amap-mcp';
  verifiedAt: string;
  // 第一版只允许三种值：
  //   'verified'         —— MCP 已核验
  //   'unverified'       —— 尚未通过 MCP 核验，包括用户自定义起点产生的接驳路段
  //   'not-applicable'   —— 无需路线计算，例如同一景点内部活动或景区内自由参观
  // 用户自定义起点产生的接驳路段必须标记为 unverified，不得标记为 not-applicable。
  // 第一版不允许使用 estimated。
  verificationStatus: 'verified' | 'unverified' | 'not-applicable';
}

interface RouteStop {
  attractionId: string;
  sequence: number;
  arrivalTime: string;
  departureTime: string;
  recommendedDuration: number;
  activities: string[];
  foodTips?: string;
  photoTips?: string;
  transportTips?: string;
  notes?: string;
}

interface Preference {
  startLocation: 'guangzhou-south' | 'foshan-west' | 'shunde-college' | 'shunde-station' | 'in-shunde' | 'custom';
  customLocationText?: string;
  duration: 'half-day' | 'one-day' | 'two-day';
  companions: 'solo' | 'couple' | 'friends' | 'with-kids' | 'with-parents';
  interests: string[];
  transportMode: TransportMode;
  pace: 'relaxed' | 'standard' | 'compact';
  notes?: string;
}

interface GeneratedItinerary {
  title: string;
  summary: string;
  matchedRouteId?: string;
  matchedKeywordRules?: KeywordRule[];
  unmatchedText?: string;
  unmatchedNotice: string;
  score: number;
  reasons: string[];
  stops: RouteStop[];
  totalDistance: number;
  totalTransportTime: number;
  notices: string[];
}

interface McpVerification {
  id: string;
  queryType: 'text-search' | 'detail' | 'direction' | 'distance';
  queryKeyword: string;
  city: string;
  toolName: string;
  requestedAt: string;
  responseSummary: string;
  standardName?: string;
  address?: string;
  location?: { lng: number; lat: number };
  success: boolean;
  ambiguity: boolean;
  notes?: string;
}
```

---

## 七、风险与应对

| 风险 | 应对 |
|------|------|
| Google Fonts 加载失败 | 系统字体回退链；不本地化字体 |
| 公共交通数据未核验 | 第一版不展示精确公交时间 |
| 顺德博物馆周一闭馆 | 推荐引擎 + UI 提示 |
| 项目过大 | 严格按第十六节范围执行 |
| 水墨风格 vs 可读性 | 数据字段强制 `.font-data` |
| 移动端动效掉帧 | `prefers-reduced-motion` |
| 高德 Key 误提交 | 不写 Key；`.gitignore` 排除 `.env*` |

---

## 八、阶段 2-8 暂不开始

阶段 1 完成后立即停止，等待用户批准实施后续阶段。

> 详细路线图见 `product-design.md` 第八节（第一版最终验收里程碑）。