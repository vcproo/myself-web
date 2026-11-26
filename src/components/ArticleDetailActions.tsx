import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ArticleHeading } from '../lib/content';

export function CopyMarkdownButton({ rawMarkdown }: { rawMarkdown: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback textarea
      const area = document.createElement('textarea');
      area.value = rawMarkdown;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`tactile-btn inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
        copied
          ? 'border-sage-600 bg-sage-100 text-sage-700'
          : 'border-paper-300 bg-paper-50 text-ink-800 hover:border-terracotta-500 hover:text-terracotta-600 shadow-sm'
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-sage-600" />
          <span>已复制全文 Markdown</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>复制全文 Markdown</span>
        </>
      )}
    </button>
  );
}

export function ArticleFloatingToc({
  headings,
}: {
  headings: ArticleHeading[];
}) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || '');

  useEffect(() => {
    // Wire up code/prompt block copy buttons inside .editorial-prose
    const onProseClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest('[data-copy-trigger]') as HTMLButtonElement | null;
      if (!btn) return;
      const card = btn.closest('[data-raw]') as HTMLElement | null;
      if (!card) return;
      const rawEncoded = card.getAttribute('data-raw') || '';
      const rawText = decodeURIComponent(rawEncoded);
      const defaultLabel = btn.getAttribute('data-default-label') || '复制';

      try {
        await navigator.clipboard.writeText(rawText);
      } catch {
        const area = document.createElement('textarea');
        area.value = rawText;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }

      btn.classList.add('is-copied');
      btn.innerHTML = '<span>✓ 已复制</span>';
      window.setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.innerHTML = `<span>${defaultLabel}</span>`;
      }, 1800);
    };

    document.addEventListener('click', onProseClick);
    return () => document.removeEventListener('click', onProseClick);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="文章章节目录"
      className="hidden 2xl:block fixed right-8 top-32 w-56 rounded-2xl border border-paper-300/90 bg-paper-50/85 p-4 backdrop-blur-sm shadow-sm"
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-terracotta-500" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-600">
          本文目录
        </span>
      </div>
      <ul className="space-y-1.5 text-xs">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                onClick={() => setActiveId(h.id)}
                className={`block line-clamp-2 rounded-lg px-2 py-1 transition-colors ${
                  active
                    ? 'bg-terracotta-50 font-bold text-terracotta-700'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
