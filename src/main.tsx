import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { attractions } from './data/attractions'
import { routes } from './data/routes'
import {
  diffAgainstExpected,
  runDevValidation,
} from './utils/routeValidation'
import { runDevRecommendValidation } from './utils/recommendValidation'

// 开发期自动运行数据校验；生产环境为 no-op
// 全部用 import.meta.env.DEV 守卫，确保生产构建不会输出任何 console 日志
if (import.meta.env.DEV) {
  // 路线数据校验
  runDevValidation(routes, attractions)
  const mismatches = diffAgainstExpected(routes)
  if (mismatches.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[routeValidation] 期望值不一致：', mismatches)
  }

  // 推荐引擎校验
  runDevRecommendValidation()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)