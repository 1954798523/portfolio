# 王梓宇 · AI 应用工程师作品集

[![GitHub Pages](https://img.shields.io/badge/在线预览-https://1954798523.github.io/portfolio/-8a2be2)](https://1954798523.github.io/portfolio/)

AI 应用 · 工具开发 · 模型工程。9 个已交付、正在生产环境使用的项目，从需求到交付全流程覆盖。

## 内容

- **首页** — 叙事式进场 + 动态数据 + 技术栈跑马灯 + 项目入口
- **项目** — 9 个生产项目卡片（每个含痛点 / 方案 / 量化指标 / 关键决策）
- **能力** — 技术能力分布 + 工程方法论
- **联系** — 关于我 + 商务合作联系方式

## 技术栈

- React 19 + Vite 8 + Tailwind CSS 4
- motion (framer-motion) — 页面转场 / 卡片倾斜 / 数字滚动动画
- 自研组件：BorderGlow（卡片光晕边框）、GlassIcons（毛玻璃图标导航）
- Canvas 特效：粒子网络、漂浮火星、光标光晕、滚动进度条

## 本地运行

```bash
npm install
npm run dev      # 开发模式
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

## 部署

构建产物复制到 `docs/` 后提交，两个远端同时更新：

| 平台 | 地址 | 说明 |
|------|------|------|
| GitHub Pages | https://1954798523.github.io/portfolio/ | 自动生效 |
| Gitee Pages | https://yorkwins.gitee.io/portfolio/ | 需在 gitee.com 手动点部署 |

```bash
git push github master
git push origin master
```
