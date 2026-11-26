---
title: "用 Remotion 结合 AI 制作高质量知识视频：我的完整实战流程"
date: "2026-11-24"
summary: "拆解如何用代码驱动的 Remotion 框架配合 AI 能力，高效生成风格统一、节奏丝滑的讲解视频，附核心配置思路。"
category: "视频创作与 Remotion"
cover: "/covers/remotion-workflow.svg"
featured: true
videoLinks:
  - platform: "B站"
    url: "https://space.bilibili.com/"
  - platform: "抖音"
    url: "https://www.douyin.com/"
---

做知识类视频最耗精力的环节，往往不是写文案本身，而是**把一段清晰的逻辑做成节奏舒服、排版统一的动态画面**。在传统剪辑软件里调关键帧、对齐字号和间距，一期十分钟的视频常常要花掉两三天。

过去一段时间，我把整套视频制作流程迁移到了 **Remotion + AI 辅助编码** 上：口播结构确定后，由 AI 协助把文案拆成结构化分镜 JSON，再交给预设好的 React 视频组件自动渲染出片。这篇文章把我的完整工作流拆开讲清楚。

## 为什么选择用代码做知识视频？

很多人听到“用代码写视频”第一反应是门槛高，但结合现在的 AI 编程工具之后，这件事反而比手动拉时间轴轻松得多：

1. **视觉高度统一**：字号、配色、圆角、弹性动画写成组件后，每一期视频都自带一致的视觉规范，不用重复调样式。
2. **改稿成本极低**：哪怕成片出来后发现某一页数据写错了，只需改一行文本重新渲染，不需要重新对齐音轨与贴纸。
3. **AI 天然擅长写结构化代码**：大模型没法直接帮你鼠标拖拽剪映时间轴，但它非常擅长生成 React 组件和分镜配置数据。

## 四步标准制作流程

| 阶段 | 核心动作 | 使用工具 | 平均耗时 |
| :--- | :--- | :--- | :--- |
| 第一步：文稿定稿 | 口语化梳理核心观点与案例步骤 | 文本编辑器 + AI 润色 | 40 分钟 |
| 第二步：分镜拆解 | 将逐字稿转为带时间节点的结构化数据 | 结构化分镜提示词 | 10 分钟 |
| 第三步：画面预览 | 套用预设图文卡片、流程图与高亮组件 | Remotion Studio | 30 分钟 |
| 第四步：配音合成 | 匹配语音音频时长并命令行批量导出 MP4 | Remotion CLI | 15 分钟 |

## 分镜脚本拆解提示词（可直接复制）

拿到定稿的口播文案后，我会先用下面这段提示词让 AI 把文字拆成标准分镜数据，避免画面信息过载：

```prompt
你是一位经验丰富的知识视频编导。请将我接下来提供的口播逐字稿，拆解为适合 16:9 横屏演示的分镜 JSON 数组。

请严格遵守以下规则：
1. 每个分镜只传达 1 个核心信息点，画面主标题不超过 14 个字。
2. 根据内容类型从以下组件模板中选择最合适的一种：
   - "hero-title"：章节开场大标题
   - "step-cards"：3 到 4 步并列流程卡片
   - "comparison"：左右对比（常见误区 vs 推荐做法）
   - "code-spotlight"：命令或关键配置高亮展示
3. 输出格式要求为合法 JSON，包含 id、template、headline、bulletPoints（最多3条）、spokenText 字段。

以下是我的口播稿内容：
[在此粘贴你的口播文稿]
```

## 核心弹性动画配置思路

Remotion 的画面质感很大程度取决于动画曲线。相比生硬的线性匀速运动（`interpolate` 线性插值），我几乎所有卡片进场都会统一使用 `spring` 物理弹簧函数，把阻尼调到自然不晃眼的区间：

```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const StepCard: React.FC<{ title: string; index: number }> = ({
  title,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 按序号错峰 6 帧进场，阻尼设为 18 保证干脆利落不乱弹
  const entrance = spring({
    frame: frame - index * 6,
    fps,
    config: {
      damping: 18,
      stiffness: 140,
      mass: 0.8,
    },
  });

  const translateY = interpolate(entrance, [0, 1], [28, 0]);

  return (
    <div
      style={{
        opacity: entrance,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <h3>{title}</h3>
    </div>
  );
};
```

## 给新手的起步建议

> 如果你之前完全没写过前端代码，不用先去啃厚厚的 React 教程。先把官方示例跑起来，只保留 3 个最常用的画面模板（大标题页、要点列表页、左右对比页），就已经能覆盖 80% 的知识讲解场景了。

后续我也会把整理好的基础图文卡片组件放到「开源与工具」板块，改改里面的文字就能直接在本地预览出片。
