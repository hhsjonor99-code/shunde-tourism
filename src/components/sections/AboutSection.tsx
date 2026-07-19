// src/components/sections/AboutSection.tsx
// 关于这一卷

import { BrushDivider, ScrollReveal, SealStamp } from '../ui';
import styles from './AboutSection.module.css';

export function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <ScrollReveal direction="up" duration={700}>
        <div className={styles.titleRow}>
          <SealStamp text="卷" shape="circle" size="medium" />
          <h2 className={`${styles.title} font-calligraphy-xing`}>
            关于这一卷
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={120} duration={700}>
        <div className={styles.body}>
          <p className={styles.lead}>
            《一卷顺德》是一项 Claude Code 与高德地图 MCP 的学习实践。
            项目以顺德为主题，通过真实地点、路线距离和交通时间，结合水墨长卷式设计，
            展示顺德的园林、水乡、美食与城市生活。
          </p>

          <BrushDivider tone="light" width={120} thickness={2} />

          <div className={styles.block}>
            <h3 className={styles.heading}>数据来源</h3>
            <p className={styles.text}>
              高德地图 MCP 仅在开发阶段用于地点和路线核验；部署后的第一版网站不直接连接 MCP，
              不读取本地 <code>.claude.json</code>，也不在浏览器中暴露 API Key。
            </p>
          </div>

          <div className={styles.block}>
            <h3 className={styles.heading}>第一版边界</h3>
            <ul className={styles.list}>
              <li>静态地点数据</li>
              <li>本地路线匹配</li>
              <li>不调用在线大模型</li>
              <li>不提供实时天气、路况和公交</li>
              <li>实际出行前需要再次核验</li>
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}