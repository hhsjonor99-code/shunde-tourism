// src/components/layout/Footer.tsx
// 页脚（阶段 4）

import { SealStamp } from '../ui';
import styles from './Footer.module.css';

export interface FooterProps {
  /** 顶部主文字 */
  welcomeText?: string;
}

export function Footer({ welcomeText = '欢迎来到顺德' }: FooterProps) {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        {/* 顶部主文字 + 小印章 */}
        <div className={styles.top}>
          <h2 className={`${styles.welcome} font-calligraphy-xing`}>
            {welcomeText}
          </h2>
          <SealStamp text="顺德" shape="square" size="small" />
        </div>

        {/* 说明区 */}
        <div className={styles.body}>
          <section className={styles.block}>
            <h3 className={styles.heading}>关于项目</h3>
            <p className={styles.text}>
              本项目为 Claude Code 与高德地图 MCP 的学习实践。
            </p>
          </section>

          <section className={styles.block}>
            <h3 className={styles.heading}>数据声明</h3>
            <p className={styles.text}>
              地点、营业时间和路线数据于 <strong>2026-07-18</strong> 通过高德地图 MCP 查询，仅供行程规划参考。实际开放时间、天气和交通情况请在出发前再次核验。
            </p>
          </section>

          <section className={styles.block}>
            <h3 className={styles.heading}>范围说明</h3>
            <p className={styles.text}>
              路线里程与交通时间仅统计相邻景点之间的已核验路段，不含出发地接驳、住宿、候车、停车及景区内部游览时间。
            </p>
          </section>

          <section className={styles.block}>
            <h3 className={styles.heading}>技术边界</h3>
            <p className={styles.text}>
              第一版为静态展示与本地路线匹配，不在浏览器中直接调用高德 MCP 或大模型。
            </p>
          </section>
        </div>

        {/* 版权 */}
        <div className={styles.bottom}>
          <p className={`${styles.copy} font-data`}>
            © 2026 一卷顺德 · shundetourism
          </p>
        </div>
      </div>
    </footer>
  );
}