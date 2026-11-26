import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Film,
  Layers,
  PlayCircle,
  Sparkles,
  Tv,
  Wrench,
} from 'lucide-react';
import { handleSpotlightMove, type ArticleCardData } from './ArticleCard';
import type { ToolCardData } from './ToolCard';

interface HeaderLinkItem {
  label: string;
  url: string;
  platform: string;
}

interface HeroBentoProps {
  siteName: string;
  subtitle: string;
  description: string;
  featuredArticles: ArticleCardData[];
  featuredTools: ToolCardData[];
  totalToolCount: number;
  headerLinks: HeaderLinkItem[];
}

const PLATFORM_META: Record<
  string,
  { desc: string; badgeClass: string; hoverBorder: string }
> = {
  bilibili: {
    desc: '完整版实操演示与案例拆解视频',
    badgeClass: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200',
    hoverBorder: 'hover:border-terracotta-500',
  },
  douyin: {
    desc: '精炼版日常 AI 提效技巧短视频',
    badgeClass: 'bg-ochre-50 text-ochre-600 border-ochre-100',
    hoverBorder: 'hover:border-ochre-500',
  },
  github: {
    desc: '个人开源代码、视频模板与脚本',
    badgeClass: 'bg-sage-50 text-sage-700 border-sage-200',
    hoverBorder: 'hover:border-sage-600',
  },
};

export default function HeroStudio({
  siteName,
  subtitle,
  description,
  featuredArticles,
  featuredTools,
  totalToolCount,
  headerLinks,
}: HeroBentoProps) {
  const slides = featuredArticles.slice(0, 3);
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeToolIdx, setActiveToolIdx] = useState(0);

  const topTools = featuredTools.slice(0, 4);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlideIdx((i) => (i + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const activeArticle = slides[slideIdx] || featuredArticles[0];

  const jumpToTab = (tab: 'articles' | 'tools' | 'about' | 'contact') => {
    window.history.replaceState(null, '', `#${tab}`);
    window.dispatchEvent(new CustomEvent('switch-home-tab', { detail: tab }));
    const el = document.getElementById('showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section aria-label="个人看板概览" className="pt-6 pb-10 sm:pt-8 sm:pb-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* BENTO CARD 1 (7 cols): 个人简介主名片 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleSpotlightMove}
          className="spotlight-card group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 md:col-span-7"
        >
          {/* Subtle decorative Risograph corner rings */}
          <svg
            aria-hidden="true"
            viewBox="0 0 180 180"
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-45 transition-transform duration-700 ease-out group-hover:rotate-12 group-hover:scale-105"
          >
            <circle
              cx="90"
              cy="90"
              r="72"
              fill="none"
              stroke="#E5DCCF"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <circle
              cx="90"
              cy="90"
              r="46"
              fill="#FBE3D7"
              fillOpacity="0.45"
            />
            <circle cx="38" cy="140" r="5" fill="#D95D39" opacity="0.6" />
          </svg>

          <div className="relative z-10">
            {/* Top Status & Role Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-paper-300 bg-paper-100/90 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-600 opacity-65" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-600" />
              </span>
              <span className="font-mono text-xs font-semibold text-ink-800">
                {subtitle}
              </span>
            </div>

            {/* Creator Name & Signature */}
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900">
                {siteName}
              </h1>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-terracotta-600">
                DEV · AI · VIDEO
              </span>
            </div>

            {/* Clean Concise Bio */}
            <p className="mt-3.5 max-w-lg text-[0.98rem] leading-[1.82] text-ink-600">
              {description}
            </p>
          </div>

          {/* Bottom Interactive Focus Tags & About Link */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-paper-200/90 pt-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: 'AI 实战案例', Icon: Sparkles, tab: 'articles' as const },
                { label: 'Remotion 视频', Icon: Film, tab: 'articles' as const },
                { label: '精选开源好物', Icon: Layers, tab: 'tools' as const },
              ].map(({ label, Icon, tab }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => jumpToTab(tab)}
                  className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-paper-300 bg-paper-50 px-3 py-1 text-xs font-semibold text-ink-800 hover:border-terracotta-500 hover:text-terracotta-600 transition-colors"
                >
                  <Icon className="h-3 w-3 text-terracotta-500" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => jumpToTab('about')}
              className="inline-flex items-center gap-1 text-xs font-bold text-ink-600 hover:text-terracotta-600 transition-colors"
            >
              <span>了解关于我</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

        {/* BENTO CARD 2 (5 cols): 最新一期图文封面切换卡 */}
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleSpotlightMove}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="spotlight-card group flex flex-col justify-between rounded-3xl p-4 sm:p-5 md:col-span-5"
          >
            {/* Card Header + Slide Switcher */}
            <div className="relative z-10 mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-terracotta-500" />
                <span className="font-mono text-xs font-bold text-ink-800">
                  最新精选文章
                </span>
              </div>

              {slides.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="上一篇推荐"
                    onClick={() =>
                      setSlideIdx((i) => (i - 1 + slides.length) % slides.length)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-paper-300 bg-paper-50 text-ink-600 hover:border-terracotta-500 hover:text-terracotta-600 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-ink-400 px-1">
                    {slideIdx + 1}/{slides.length}
                  </span>
                  <button
                    type="button"
                    aria-label="下一篇推荐"
                    onClick={() =>
                      setSlideIdx((i) => (i + 1) % slides.length)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-paper-300 bg-paper-50 text-ink-600 hover:border-terracotta-500 hover:text-terracotta-600 transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Animated 16:9 Cover + Title Link */}
            <AnimatePresence mode="wait">
              <motion.a
                key={activeArticle.slug}
                href={`/articles/${activeArticle.slug}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22 }}
                className="relative z-10 block flex-1"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-paper-300 bg-paper-200">
                  {activeArticle.cover && (
                    <img
                      src={activeArticle.cover}
                      alt={activeArticle.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <span className="absolute left-2.5 top-2.5 rounded-full border border-paper-300/80 bg-paper-50/92 px-2.5 py-0.5 text-[10.5px] font-bold text-ink-900 backdrop-blur-sm">
                    {activeArticle.category}
                  </span>
                  {activeArticle.videoLinks &&
                    activeArticle.videoLinks.length > 0 && (
                      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink-900/85 px-2.5 py-0.5 text-[10.5px] font-semibold text-paper-50">
                        <PlayCircle className="h-3 w-3 text-terracotta-200" />
                        配套视频
                      </span>
                    )}
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <h2 className="line-clamp-2 text-[0.98rem] font-extrabold leading-snug text-ink-900 group-hover:text-terracotta-600 transition-colors">
                    {activeArticle.title}
                  </h2>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper-200 text-ink-800 transition-all group-hover:bg-terracotta-500 group-hover:text-paper-50">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.a>
            </AnimatePresence>
          </motion.div>
        )}

        {/* BENTO CARD 3 (5 cols): 精选开源工具交互速览卡 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleSpotlightMove}
          className="spotlight-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 md:col-span-5"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-sage-600" />
                <h2 className="text-sm font-extrabold text-ink-900">
                  实测精选开源与工具
                </h2>
              </div>
              <span className="rounded-full bg-sage-50 border border-sage-200 px-2 py-0.5 font-mono text-[11px] font-bold text-sage-700">
                {totalToolCount} 款收录
              </span>
            </div>

            {/* Interactive Selectable Tool Pills + Live Preview */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {topTools.map((tool, idx) => {
                const selected = idx === activeToolIdx;
                return (
                  <button
                    key={tool.name}
                    type="button"
                    onMouseEnter={() => setActiveToolIdx(idx)}
                    onClick={() => setActiveToolIdx(idx)}
                    className={`rounded-xl border px-2.5 py-1 text-xs font-bold transition-all ${
                      selected
                        ? 'border-ink-900 bg-ink-900 text-paper-50 shadow-sm'
                        : 'border-paper-300 bg-paper-100/90 text-ink-600 hover:border-paper-400 hover:text-ink-900'
                    }`}
                  >
                    {tool.name.replace(/（示例占位）$/, '')}
                  </button>
                );
              })}
            </div>

            {topTools[activeToolIdx] && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={topTools[activeToolIdx].name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="mt-3 rounded-2xl border border-paper-300/90 bg-paper-100/80 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-ink-900">
                      {topTools[activeToolIdx].name}
                    </span>
                    <a
                      href={topTools[activeToolIdx].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-0.5 font-mono text-[11px] font-bold text-terracotta-600 hover:underline"
                    >
                      <span>直达</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-600">
                    {topTools[activeToolIdx].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between border-t border-paper-200/90 pt-3.5">
            <span className="text-[11.5px] text-ink-400">
              悬停上方标签预览用途说明
            </span>
            <a
              href="/tools"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-sage-700 hover:text-terracotta-600 transition-colors"
            >
              <span>全部开源工具</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>

        {/* BENTO CARD 4 (7 cols): B站 / 抖音 / GitHub 与交流矩阵卡 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleSpotlightMove}
          className="spotlight-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 md:col-span-7"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-terracotta-500" />
                <h2 className="text-sm font-extrabold text-ink-900">
                  视频自媒体与开源主页
                </h2>
              </div>
              <button
                type="button"
                onClick={() => jumpToTab('contact')}
                className="font-mono text-xs font-semibold text-ink-400 hover:text-terracotta-600 transition-colors"
              >
                公众号 / 商务邮箱 →
              </button>
            </div>

            <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {headerLinks.map((item) => {
                const meta =
                  PLATFORM_META[item.platform] || PLATFORM_META.github;
                return (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`tactile-btn group/plat flex flex-col justify-between rounded-2xl border border-paper-300 bg-paper-50/95 p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm ${meta.hoverBorder}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${meta.badgeClass}`}
                      >
                        {item.platform === 'github' ? (
                          <Code2 className="h-3 w-3" />
                        ) : (
                          <PlayCircle className="h-3 w-3" />
                        )}
                        {item.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-ink-400 transition-transform group-hover/plat:translate-x-0.5 group-hover/plat:-translate-y-0.5 group-hover/plat:text-terracotta-600" />
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-ink-600">
                      {meta.desc}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-paper-200/90 pt-3.5 text-xs text-ink-600">
            <span>视频演示与图文教程同步更新，源码模板托管于 GitHub</span>
            <button
              type="button"
              onClick={() => jumpToTab('contact')}
              className="font-bold text-terracotta-600 hover:underline"
            >
              更多联系方式 →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
