import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Command, Mail, Search, Wrench, X, Check } from 'lucide-react';

interface SearchEntry {
  id: string;
  type: 'article' | 'tool' | 'action';
  title: string;
  subtitle: string;
  href?: string;
  external?: boolean;
  copyValue?: string;
}

interface Props {
  articles: { slug: string; title: string; category: string }[];
  tools: { name: string; group: string; url: string }[];
  email: string;
}

export default function CommandPalette({ articles, tools, email }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries: SearchEntry[] = useMemo(() => {
    const list: SearchEntry[] = [
      ...articles.map((a) => ({
        id: `art-${a.slug}`,
        type: 'article' as const,
        title: a.title,
        subtitle: `文章 · ${a.category}`,
        href: `/articles/${a.slug}`,
      })),
      ...tools.map((t) => ({
        id: `tool-${t.name}`,
        type: 'tool' as const,
        title: t.name,
        subtitle: `开源工具 · ${t.group}`,
        href: t.url,
        external: true,
      })),
      {
        id: 'act-all-articles',
        type: 'action',
        title: '浏览全部教程与文章归档',
        subtitle: '站内跳转 · /articles',
        href: '/articles',
      },
      {
        id: 'act-all-tools',
        type: 'action',
        title: '前往开源项目与实用工具汇总页',
        subtitle: '站内跳转 · /tools',
        href: '/tools',
      },
      {
        id: 'act-copy-email',
        type: 'action',
        title: `复制合作联系邮箱 (${email})`,
        subtitle: '快捷动作 · 一键复制到剪贴板',
        copyValue: email,
      },
    ];
    return list;
  }, [articles, tools, email]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 8);
    return entries.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );
  }, [entries, query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query, open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    const onOpenTrigger = () => setOpen(true);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('open-command-palette', onOpenTrigger);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('open-command-palette', onOpenTrigger);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [open]);

  const triggerItem = async (item: SearchEntry) => {
    if (item.copyValue) {
      try {
        await navigator.clipboard.writeText(item.copyValue);
        setCopiedToast(true);
        setTimeout(() => {
          setCopiedToast(false);
          setOpen(false);
        }, 900);
      } catch {
        setOpen(false);
      }
      return;
    }
    if (item.href) {
      setOpen(false);
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) =>
        filtered.length ? (i - 1 + filtered.length) % filtered.length : 0
      );
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      e.preventDefault();
      triggerItem(filtered[selectedIdx]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="全站快速搜索 (Ctrl+K / ⌘K)"
        className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-paper-300 bg-paper-100/90 px-3 py-1 text-xs font-semibold text-ink-600 hover:border-terracotta-500 hover:bg-paper-50 hover:text-ink-900 transition-colors"
      >
        <Search className="h-3.5 w-3.5 text-terracotta-500" />
        <span className="hidden md:inline">搜索</span>
        <kbd className="rounded border border-paper-300 bg-paper-50 px-1.5 py-0.2 font-mono text-[10px] text-ink-400">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 sm:pt-28">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-ink-900/25 backdrop-blur-[2px]"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="全站快捷检索面板"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-paper-300 bg-paper-50 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-paper-200 px-4 py-3.5">
                <Search className="h-4 w-4 shrink-0 text-terracotta-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="搜索教程文章、开源工具或快捷操作..."
                  className="w-full bg-transparent text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
                {copiedToast && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-bold text-sage-700">
                    <Check className="h-3 w-3" /> 已复制
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-ink-400 hover:bg-paper-200 hover:text-ink-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length > 0 ? (
                  filtered.map((item, idx) => {
                    const active = idx === selectedIdx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setSelectedIdx(idx)}
                        onClick={() => triggerItem(item)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                          active
                            ? 'bg-terracotta-50 text-ink-900'
                            : 'text-ink-800 hover:bg-paper-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                              active
                                ? 'border-terracotta-200 bg-paper-50 text-terracotta-600'
                                : 'border-paper-300 bg-paper-100 text-ink-600'
                            }`}
                          >
                            {item.type === 'article' ? (
                              <BookOpen className="h-4 w-4" />
                            ) : item.type === 'tool' ? (
                              <Wrench className="h-4 w-4" />
                            ) : item.copyValue ? (
                              <Mail className="h-4 w-4" />
                            ) : (
                              <Command className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold">
                              {item.title}
                            </div>
                            <div className="truncate text-xs text-ink-400">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight
                          className={`h-4 w-4 shrink-0 ${
                            active ? 'text-terracotta-600' : 'text-ink-300'
                          }`}
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-sm text-ink-400">
                    未找到相关文章或工具，换个词试试？
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-paper-200 bg-paper-100/80 px-4 py-2 font-mono text-[11px] text-ink-400">
                <span>↑↓ 移动选择 · Enter 确认打开</span>
                <span>ESC 关闭</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
