# 一卷顺德

> 水乡入画，寻味成诗。

**一卷顺德**是一个以顺德为主题的水墨长卷式旅游展示与行程推荐网站。项目使用 React、TypeScript 与 Vite 构建，通过高德地图 MCP 在开发阶段核验景点、坐标、路线距离和交通时间，并在浏览器中基于本地静态数据完成确定性路线推荐。

## 项目简介

项目围绕顺德的园林、水乡、美食与城市生活展开，提供：

- 水墨长卷式首页与顺德主题介绍
- 5 条一日/两日主题路线
- 2 条半日路线
- 景点、路段、距离与交通时间展示
- “为我画一卷”偏好表单
- 基于游玩时长、同行人、兴趣、交通方式、节奏和关键词的本地推荐
- 公共交通、自定义出发地和数据范围说明
- 桌面端、平板和手机端响应式适配

## 当前版本

当前版本为 **V1 静态版**。

浏览器端不会：

- 实时调用高德地图 MCP
- 调用在线大模型
- 读取本地 `.claude.json`
- 暴露 API Key 或 MCP 服务地址
- 根据用户输入动态生成新的景点顺序

用户提交偏好后，网站只会从 7 条已核验路线中选择最合适的一条。

## 主要功能

### 水墨长卷视觉

网站使用宣纸白、淡墨、青绿点染和朱红印章构建视觉体系，主要包括：

- 水墨山水首屏
- 书法标题与竖排题字
- 印章、毛笔分隔线和卷轴式路线卡片
- 水墨景点占位图
- 克制的滚动渐入和盖章动效
- `prefers-reduced-motion` 动画降级

### 主题路线

网站内置 7 条路线：

| 类型 | 路线 |
|---|---|
| 一日路线 | R1、R2、R3、R4 |
| 两日路线 | R5 |
| 半日路线 | H1、H2 |

路线总里程和交通时间只统计相邻景点之间已核验的路段，不包含：

- 出发地接驳
- 住宿接驳
- 候车和停车
- 景区内部游览时间
- 未核验的公共交通时间

### 个性化推荐

“为我画一卷”支持以下偏好：

- 出发地点
- 游玩时长
- 同行人
- 兴趣偏好
- 交通方式
- 游玩节奏
- 补充说明

推荐流程：

1. 按游玩时长硬过滤路线
2. 按交通方式排除不适合的候选
3. 根据兴趣、同行人、交通方式、节奏和关键词评分
4. 对长距离步行路线应用特定惩罚
5. 按匹配兴趣数量、总距离和路线 ID 进行稳定排序
6. 输出推荐路线、推荐理由、关键词匹配结果和数据提示

相同输入会得到相同结果。

## 技术栈

- React 19
- TypeScript 6
- Vite 8
- CSS Modules
- 原生 CSS 变量与 SVG
- IntersectionObserver
- 高德地图 MCP（仅开发阶段核验数据）
- Claude Code（项目规划与开发协作）

项目未引入 UI 组件库、动画库、表单库或测试框架。

## 项目结构

```text
shundeTourism/
├─ public/
│  └─ assets/
│     └─ attractions/          # 景点本地图片预留目录
├─ src/
│  ├─ components/
│  │  ├─ layout/               # NavBar、Footer
│  │  ├─ sections/             # 首页区块、路线、推荐结果
│  │  └─ ui/                   # 水墨通用组件
│  ├─ data/
│  │  ├─ attractions.ts        # 景点与交通节点
│  │  ├─ routes.ts             # 7 条预定义路线
│  │  ├─ preferences.ts        # 表单选项字典
│  │  └─ keywordRules.ts       # 关键词规则
│  ├─ styles/                  # 全局、水墨、动画样式
│  ├─ types/                   # TypeScript 类型
│  ├─ utils/                   # 推荐、格式化和数据校验
│  ├─ App.tsx
│  └─ main.tsx
├─ docs/
│  ├─ product-design.md
│  ├─ mcp-verification.md
│  ├─ ui-style-guide.md
│  └─ development-record.md
├─ CLAUDE.md
├─ package.json
├─ vite.config.ts
└─ README.md
```

## 本地运行

### 环境要求

- Node.js
- npm

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认访问：

```text
http://localhost:5173/
```

### 构建生产版本

```bash
npm run build
```

构建产物位于：

```text
dist/
```

### 本地预览生产产物

```bash
npm run preview
```

默认访问：

```text
http://localhost:4173/
```

## 数据来源与边界

地点、坐标、路线距离和交通时间于 **2026-07-18** 通过高德地图 MCP 在开发阶段查询和核验。

需要注意：

- 数据只作为行程规划参考
- 实际开放时间、天气、交通和路况可能发生变化
- 公共交通实际耗时没有在当前版本中实时核验
- 网站展示的驾车或步行时间不能替代实时导航
- 出发前应再次通过地图应用和景点官方渠道核验

相关核验记录见：

```text
docs/mcp-verification.md
```

## 图片说明

当前版本支持景点本地图片和水墨 SVG 回退。

建议将经过授权的 WebP 图片放入：

```text
public/assets/attractions/
```

可使用的文件命名示例：

```text
qinghui-garden.webp
fengjian-water-town.webp
shunfeng-park.webp
happy-coast.webp
he-art-museum.webp
ronggui-wharf.webp
huagai-jinbang.webp
shunde-food.webp
```

使用图片时应保留来源、作者和授权信息。不要直接使用来源不明或未经授权的网络图片。

## GitHub Pages 部署

本项目为纯前端静态网站，适合部署到 GitHub Pages。

假设仓库名为：

```text
shunde-tourism
```

在 `vite.config.ts` 中设置：

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/shunde-tourism/',
})
```

然后通过 GitHub Actions 构建并发布 `dist/`。

如果部署到：

```text
https://<username>.github.io/
```

或自定义域名，则 `base` 应调整为：

```ts
base: '/'
```

实际部署地址（本项目）：

```text
https://hhsjonor99-code.github.io/shunde-tourism/
```

仓库：

```text
https://github.com/hhsjonor99-code/shunde-tourism.git
```

## 开发文档

项目的规划、设计和实施记录位于：

- `docs/product-design.md`：产品设计、路线和推荐规则
- `docs/mcp-verification.md`：高德地图 MCP 核验记录
- `docs/ui-style-guide.md`：水墨视觉和响应式规范
- `docs/development-record.md`：阶段实施记录和构建结果
- `CLAUDE.md`：Claude Code 项目规则与开发红线

## 已完成

- [x] Vite + React + TypeScript 初始化
- [x] 景点与路线静态数据
- [x] 数据与路线校验
- [x] 水墨 UI 组件
- [x] 导航、首屏和页脚
- [x] 顺德介绍、路线、印象和项目说明
- [x] 本地个性化推荐
- [x] 响应式、无障碍和性能优化
- [x] 生产构建与本地预览

## 后续方向

V2 可考虑：

- 高德地图实时路线查询
- 出发地到首个景点的实时接驳
- 一键打开高德地图导航
- 服务端 MCP 代理
- 实时天气、路况和公交
- 动态景点筛选与排序
- 在线大模型自然语言理解
- 行程收藏和本地持久化
- URL 参数分享行程
- 更多经过授权的顺德实景图片

## 项目声明

本项目为 Claude Code 与高德地图 MCP 的学习实践，不构成商业旅游服务或实时导航服务。

景点名称、品牌名称及相关标识归其权利人所有。

## 安全与隐私

- 项目不包含任何 API Key、Token、MCP 服务地址或用户隐私信息
- `dist/` 不提交到仓库；部署产物由 GitHub Actions 自动构建
- 浏览器不直接连接高德 MCP 或在线大模型
- 第一版不创建 `.env` 文件
