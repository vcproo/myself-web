import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, LayoutGrid, List, PlayCircle, Search, X } from 'lucide-react';
import ArticleCard, { type ArticleCardData, handleSpotlightMove } from './ArticleCard';

interface Props {
  articles: ArticleCardData[];
  categories: string[];
}

export default function ArticlesArchiveView({ articles, categories }: Props) {
  const allCategories = useMemo(() => ['全部', ...categories], [categories]);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [query, setQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && allCategories.includes(cat)) {
      setActiveCategory(cat);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [allCategories]);

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    const url = new URL(window.location.href);
    if (cat === '全部') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', cat);
    }
    window.history.replaceState(null, '', url.toString());
  };

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchCat =
        activeCategory === '全部' || a.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [articles, activeCategory, query]);

  const countForCategory = (cat: string) =>
    cat === '全部'
      ? articles.length
      : articles.filter((a) => a.category === cat).length;

  const topFeatured =
    activeCategory === '全部' && !query.trim() ? filteredArticles[0] : null;
  const remainingArticles = topFeatured
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div>
      {/* Filter, Search & View Mode Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-paper-300 bg-paper-50/90 p-3.5 shadow-paper backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="文章分类筛选"
          >
            {allCategories.map((cat) => {
              const active = activeCategory === cat;
              const count = countForCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectCategory(cat)}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-colors ${
                    active ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="archiveCategoryActivePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-paper-200 border border-paper-300 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                  <span
                    className={`relative z-10 font-mono text-[11px] px-1.5 rounded-full ${
                      active
                        ? 'bg-terracotta-500 text-paper-50'
                        : 'bg-paper-200 text-ink-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:inline-flex items-center rounded-xl border border-paper-300 bg-paper-100 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="画廊卡片视图"
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-paper-50 text-terracotta-600 shadow-sm'
                  : 'text-ink-400 hover:text-ink-800'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="时间轴紧凑视图"
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-paper-50 text-terracotta-600 shadow-sm'
                  : 'text-ink-400 hover:text-ink-800'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Keyword quick filter */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题或关键词..."
            className="w-full rounded-xl border border-paper-300 bg-paper-100/75 py-2.5 pl-10 pr-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-terracotta-500 focus:bg-paper-50 focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="清空搜索词"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-400 hover:bg-paper-200 hover:text-ink-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Magazine Featured Wide Card (when viewing All) */}
      {topFeatured && viewMode === 'grid' && (
        <a
          href={`/articles/${topFeatured.slug}`}
          onMouseMove={handleSpotlightMove}
          className="spotlight-card group mb-6 grid grid-cols-1 gap-5 rounded-3xl p-4 sm:p-5 md:grid-cols-12 md:items-center hover:-translate-y-1"
        >
          <div className="relative z-10 overflow-hidden rounded-2xl border border-paper-300 bg-paper-200 aspect-video md:col-span-7">
            {topFeatured.cover && (
              <img
                src={topFeatured.cover}
                alt={topFeatured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-ink-900/90 px-3 py-1 font-mono text-[10.5px] font-bold text-paper-50">
              FEATURED · 最新重点拆解
            </span>
          </div>

          <div className="relative z-10 flex flex-col justify-between md:col-span-5 px-1">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-terracotta-200 bg-terracotta-50 px-2.5 py-0.5 font-bold text-terracotta-700">
                  {topFeatured.category}
                </span>
                <time className="font-mono text-ink-400">
                  {topFeatured.formattedDate}
                </time>
              </div>
              <h2 className="mt-3 text-xl font-extrabold leading-snug text-ink-900 group-hover:text-terracotta-600 transition-colors">
                {topFeatured.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                {topFeatured.summary}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-paper-200 pt-3.5 text-xs font-bold text-terracotta-600">
              <span className="inline-flex items-center gap-1.5">
                {topFeatured.videoLinks && topFeatured.videoLinks.length > 0 && (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    <span>含配套视频演示 · </span>
                  </>
                )}
                立即阅读全文
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-500 text-paper-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </a>
      )}

      {/* Filtered Grid or Timeline List */}
      {filteredArticles.length > 0 ? (
        viewMode === 'grid' ? (
          <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {remainingArticles.map((article, idx) => (
                <motion.div
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ArticleCard article={article} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <a
                key={article.slug}
                href={`/articles/${article.slug}`}
                onMouseMove={handleSpotlightMove}
                className="spotlight-card group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-4 hover:-translate-y-0.5"
              >
                <div className="relative z-10 flex items-center gap-4 min-w-0">
                  {article.cover && (
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="hidden sm:block h-16 w-28 shrink-0 rounded-xl border border-paper-300 object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-ink-400">
                        {article.formattedDate}
                      </span>
                      <span className="rounded-full bg-paper-200 px-2 py-0.5 text-[11px] font-semibold text-ink-800">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="mt-1 truncate text-base font-extrabold text-ink-900 group-hover:text-terracotta-600">
                      {article.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-600">
                      {article.summary}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="relative z-10 hidden sm:block h-4 w-4 shrink-0 text-ink-400 group-hover:text-terracotta-600" />
              </a>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-paper-300 bg-paper-50 p-12 text-center">
          <p className="text-base font-bold text-ink-800">
            没有找到匹配当前筛选条件的文章
          </p>
          <p className="mt-1.5 text-sm text-ink-600">
            可以尝试切换上方分类或清空关键词重新查看。
          </p>
          <button
            type="button"
            onClick={() => {
              selectCategory('全部');
              setQuery('');
            }}
            className="tactile-btn mt-4 inline-flex items-center rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-paper-50 hover:bg-terracotta-600"
          >
            重置筛选条件
          </button>
        </div>
      )}
    </div>
  );
}
