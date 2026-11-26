import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, X } from 'lucide-react';
import ToolCard, { type ToolCardData } from './ToolCard';
import InteractiveToolShowcases from './InteractiveToolShowcases';
import { OpenSourceWorkbenchIllustration } from './EditorialIllustrations';

interface Props {
  tools: ToolCardData[];
  toolGroups: { name: string; description: string }[];
}

export default function ToolsArchiveView({ tools, toolGroups }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string>('全部');
  const [query, setQuery] = useState<string>('');
  const [showPlayground, setShowPlayground] = useState<boolean>(true);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return toolGroups
      .map((g) => ({
        ...g,
        items: tools.filter((t) => {
          if (t.group !== g.name) return false;
          if (selectedGroup !== '全部' && t.group !== selectedGroup) return false;
          if (!q) return true;
          return (
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
          );
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [tools, toolGroups, selectedGroup, query]);

  return (
    <div>
      {/* Illustrated Hero Banner Card for /tools */}
      <div className="group mb-9 overflow-hidden rounded-3xl border border-paper-300 bg-gradient-to-br from-paper-50 via-[#FAF4EB] to-sage-50/55 p-6 sm:p-8 shadow-paper">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-3 py-1 font-mono text-[11px] font-bold text-sage-700">
              <span>CURATED TOOLKIT · 实测收录</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-snug text-ink-900">
              不堆砌概念榜单，只收录我自己日常真正在用的开源好物与自研模板。
            </h2>
            <p className="text-sm leading-relaxed text-ink-600">
              每个条目均配有大白话用途说明；带有「查看使用教程 →」按钮的项目可直接跳转站内保姆级图文拆解。
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowPlayground((v) => !v)}
                className="tactile-btn inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-paper-50 hover:bg-terracotta-600 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-terracotta-200" />
                <span>{showPlayground ? '收起交互体验台' : '展开实时交互体验台'}</span>
              </button>
              <span className="font-mono text-xs text-ink-400">
                共 {toolGroups.length} 大分组 · {tools.length} 款精选工具
              </span>
            </div>
          </div>

          <div className="md:col-span-5">
            <OpenSourceWorkbenchIllustration className="w-full max-w-[320px] mx-auto" />
          </div>
        </div>
      </div>

      {/* Live Interactive Tool Sandboxes (01-03) */}
      {showPlayground && <InteractiveToolShowcases />}

      {/* Filter & Search Bar */}
      <div className="mb-8 flex flex-col gap-3.5 rounded-2xl border border-paper-300 bg-paper-50/90 p-3.5 shadow-paper">
        <div className="flex flex-wrap items-center gap-1.5">
          {['全部', ...toolGroups.map((g) => g.name)].map((groupName) => {
            const active = selectedGroup === groupName;
            return (
              <button
                key={groupName}
                type="button"
                onClick={() => setSelectedGroup(groupName)}
                className={`relative rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-colors ${
                  active ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="toolsArchiveActivePill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-paper-200 border border-paper-300 shadow-sm"
                  />
                )}
                <span className="relative z-10">{groupName}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索开源项目、工具名称、用途或标签（如：免费、本地可用、Remotion）..."
            className="w-full rounded-xl border border-paper-300 bg-paper-100/75 py-2.5 pl-10 pr-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-terracotta-500 focus:bg-paper-50 focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-400 hover:bg-paper-200 hover:text-ink-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <div className="space-y-10">
          {filteredGroups.map((group) => (
            <section key={group.name}>
              <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-paper-300 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3.5 w-1 rounded-full bg-terracotta-500" />
                  <h2 className="text-lg font-bold text-ink-900">{group.name}</h2>
                  <span className="font-mono text-xs text-ink-400">
                    {String(group.items.length).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-ink-600">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {group.items.map((tool, idx) => (
                  <ToolCard key={tool.name} tool={tool} index={idx} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-paper-300 bg-paper-50 p-12 text-center">
          <p className="text-base font-bold text-ink-800">暂无匹配的工具条目</p>
          <button
            type="button"
            onClick={() => {
              setSelectedGroup('全部');
              setQuery('');
            }}
            className="tactile-btn mt-4 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-paper-50 hover:bg-terracotta-600"
          >
            显示全部工具
          </button>
        </div>
      )}
    </div>
  );
}
