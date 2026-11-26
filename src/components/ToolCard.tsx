import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Cpu,
  Film,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface ToolCardData {
  name: string;
  group: string;
  description: string;
  tags: string[];
  url: string;
  urlLabel: string;
  relatedArticleSlug?: string;
  relatedArticleTitle?: string;
}

const GROUP_VISUAL_THEME: Record<
  string,
  {
    bgFrom: string;
    accent: string;
    badgeBg: string;
    Icon: React.ComponentType<{ className?: string }>;
    tip: string;
  }
> = {
  自研与模板: {
    bgFrom: 'from-terracotta-100/80 via-ochre-50/60 to-transparent',
    accent: '#D95D39',
    badgeBg: 'bg-terracotta-50 text-terracotta-600 border-terracotta-200',
    Icon: Layers,
    tip: '开箱即用资源：下载或复制模板后，仅需替换你自己的文案或参数即可直接运行。',
  },
  'AI 视频与内容创作': {
    bgFrom: 'from-ochre-100/85 via-terracotta-50/50 to-transparent',
    accent: '#C88A2E',
    badgeBg: 'bg-ochre-50 text-ochre-600 border-ochre-100',
    Icon: Film,
    tip: '创作者实测建议：适合搭配固定分镜模板或批量音频脚本，大幅压缩重复剪辑时间。',
  },
  'AI 效率与日常工具': {
    bgFrom: 'from-sage-100/90 via-paper-100 to-transparent',
    accent: '#467352',
    badgeBg: 'bg-sage-50 text-sage-700 border-sage-200',
    Icon: Sparkles,
    tip: '零门槛上手：优先在项目右侧 Releases 下载对应系统的桌面安装包，双击即可使用。',
  },
  开发与进阶利器: {
    bgFrom: 'from-paper-300/70 via-sage-50/60 to-transparent',
    accent: '#352F2C',
    badgeBg: 'bg-paper-200 text-ink-800 border-paper-300',
    Icon: Cpu,
    tip: '进阶效率组合：支持本地离线运行或自动化节点编排，数据隐私与可控性更高。',
  },
};

export default function ToolCard({
  tool,
  index = 0,
}: {
  tool: ToolCardData;
  index?: number;
}) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [showTip, setShowTip] = useState(false);

  const theme =
    GROUP_VISUAL_THEME[tool.group] || GROUP_VISUAL_THEME['AI 效率与日常工具'];
  const Icon = theme.Icon;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--spot-x', `${x}px`);
    e.currentTarget.style.setProperty('--spot-y', `${y}px`);
    const nx = (x / rect.width - 0.5) * 14;
    const ny = (y / rect.height - 0.5) * 14;
    setParallax({ x: nx, y: ny });
  };

  const onLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="spotlight-card group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Multi-layer Parallax Corner Artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-28 w-36 overflow-hidden rounded-tr-2xl"
      >
        <div
          style={{
            transform: `translate3d(${(-parallax.x * 0.5).toFixed(1)}px, ${(-parallax.y * 0.5).toFixed(1)}px, 0)`,
          }}
          className={`absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-bl ${theme.bgFrom} blur-[2px] transition-transform duration-200 ease-out`}
        />
        {/* Drafting mini-card decoration */}
        <div
          style={{
            transform: `translate3d(${(parallax.x * 0.85).toFixed(1)}px, ${(parallax.y * 0.85).toFixed(1)}px, 0) rotate(-6deg)`,
          }}
          className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-paper-300/90 bg-paper-50/95 shadow-sm transition-transform duration-200 ease-out group-hover:border-terracotta-300"
        >
          <Icon className="h-5 w-5 text-terracotta-500 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <span className="absolute right-16 top-4 font-mono text-xs font-bold text-paper-400/80">
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative z-10">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pr-20">
          {tool.tags.map((tag) => {
            const isSelf = tag.includes('自研');
            const isFreeOrLocal = tag.includes('免费') || tag.includes('本地');
            const pillClass = isSelf
              ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200'
              : isFreeOrLocal
              ? 'bg-sage-50 text-sage-700 border-sage-200'
              : 'bg-paper-200/80 text-ink-600 border-paper-300';
            return (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${pillClass}`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Name */}
        <h4 className="mt-3.5 pr-14 text-[1.08rem] font-extrabold text-ink-900 group-hover:text-terracotta-600 transition-colors">
          {tool.name}
        </h4>

        {/* Plain-language Description */}
        <p className="mt-1.5 text-[0.89rem] leading-relaxed text-ink-600">
          {tool.description}
        </p>

        {/* Expandable Practical Tip Drawer */}
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-paper-300 bg-paper-100/90 px-3 py-2 text-xs leading-relaxed text-ink-800"
          >
            <span className="font-bold text-terracotta-700">实测上手提示：</span>
            {theme.tip}
          </motion.div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-paper-200 pt-3.5">
        <div className="flex items-center gap-1.5">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn inline-flex items-center gap-1 rounded-full border border-paper-300 bg-paper-50 px-3.5 py-1.5 text-xs font-bold text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-paper-50 transition-colors"
          >
            <span>{tool.urlLabel.replace(/\s*↗$/, '')}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setShowTip((v) => !v)}
            className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-ink-400 hover:bg-paper-200/70 hover:text-ink-800 transition-colors"
          >
            <span>上手提示</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                showTip ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {tool.relatedArticleSlug && (
          <a
            href={`/articles/${tool.relatedArticleSlug}`}
            title={
              tool.relatedArticleTitle
                ? `配套文章：${tool.relatedArticleTitle}`
                : '查看站内使用教程'
            }
            className="tactile-btn inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3.5 py-1.5 text-xs font-bold text-terracotta-700 border border-terracotta-200/80 hover:bg-terracotta-500 hover:text-paper-50 hover:border-terracotta-500 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>查看使用教程 →</span>
          </a>
        )}
      </div>
    </div>
  );
}
