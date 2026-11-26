# 蜘蛛侦探 · 个人静态网站

基于 **Astro + React + Tailwind CSS + Framer Motion** 构建的 100% 纯静态个人网站，无需数据库与后台系统，日常内容更新只需编辑 `content/` 目录下的静态文件。

## 本地运行与构建命令

```bash
# 安装依赖
npm install

# 启动本地开发预览（默认 http://localhost:4321）
npm run dev

# 生成纯静态生产包（输出至 dist/ 目录，可直接部署至 Vercel / Cloudflare Pages / Netlify / GitHub Pages）
npm run build
```

## 日常内容维护指南（无需改代码）

### 1. 发布或修改文章：`content/articles/*.md`
在 `content/articles/` 目录下新建 `.md` 文件，文件名即文章访问路径 `/articles/[文件名]`：

```markdown
---
title: "文章标题"
date: "2026-11-24"
summary: "列表卡片显示的简短摘要（1~2句话）"
category: "AI 实战案例" # 可选：AI 实战案例 | 实操教程 | 视频创作与 Remotion | 经验与实测
cover: "/covers/your-cover.png" # 选填，16:9 图片放于 public/covers/ 下；不填自动显示排版占位封面
featured: true # 选填，是否在首页优先展示
videoLinks: # 选填，配套视频链接，不填则自动隐藏视频提示框
  - platform: "B站"
    url: "https://space.bilibili.com/..."
---

这里是 Markdown 正文内容...

代码块使用 ```prompt 包裹时，会自动渲染为带一键复制按钮的「AI 提示词模板卡片」：

```prompt
这里写给读者直接复制复用的 AI 提示词...
```
```

### 2. 更新开源项目与工具：`content/tools.json`
编辑 `content/tools.json` 数组即可增删工具卡片；填写 `relatedArticleSlug` 后会自动生成跳转至对应教程文章的 `查看使用教程 →` 按钮，同时在对应文章底部自动展示关联工具卡片。

### 3. 修改个人简介与社交外链：`content/site.json`
顶部快捷外链（B站 / 抖音 / GitHub）、首屏文案、「关于我」介绍、「交流联系」平台链接、公众号二维码路径（图片放入 `public/images/`）与联系邮箱均集中在 `content/site.json` 中统一配置。
