import React, { useState } from 'react';
import { ArrowUpRight, Clock, PlayCircle } from 'lucide-react';

export interface ArticleCardData {
  slug: string;
  title: string;
  formattedDate: string;
  summary: string;
  category: string;
  cover?: string;
  readingMinutes?: number;
  videoLinks?: { platform: string; url: string }[];
}

const CATEGORY_STYLES: Record<
  string,
  { pill: string; fallbackBg: string; accent: string; code: string }
> = {
  '视频创作与 Remotion': {
    pill: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200',
    fallbackBg: 'from-[#FAF1EA] via-[#F6E8DC] to-[#EFE5D8]',
    accent: '#D95D39',
    code: 'VIDEO · CODE',
  },
  'AI 实战案例': {
    pill: 'bg-ochre-50 text-ochre-600 border-ochre-100',
    fallbackBg: 'from-[#FBF6EA] via-[#F5ECD6] to-[#EFE6D5]',
    accent: '#C88A2E',
    code: 'PRACTICAL · AI',
  },
  '实操教程': {
    pill: 'bg-sage-50 text-sage-700 border-sage-200',
    fallbackBg: 'from-[#F1F6F2] via-[#E4EFE6] to-[#EFECE4]',
    accent: '#467352',
    code: 'STEP · GUIDE',
  },
  '经验与实测': {
    pill: 'bg-paper-200 text-ink-800 border-paper-300',
    fallbackBg: 'from-[#F6F2EA] via-[#EDE5D7] to-[#E6DDD0]',
    accent: '#645B55',
    code: 'BENCHMARK · NOTE',
  },
};

export function handleSpotlightMove(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty('--spot-x', `${x}px`);
  e.currentTarget.style.setProperty('--spot-y', `${y}px`);
}

export default function ArticleCard({
  article,
  index = 0,
}: {
  article: ArticleCardData;
  index?: number;
}) {
  const style = CATEGORY_STYLES[article.category] || CATEGORY_STYLES['实操教程'];
  const hasVideo = article.videoLinks && article.videoLinks.length > 0;
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleSpotlightMove(e);
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 4.5, ry: nx * 4.5 });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <a
      href={`/articles/${article.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform:
          tilt.rx !== 0 || tilt.ry !== 0
            ? `perspective(900px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-4px)`
            : undefined,
      }}
      className="spotlight-card group flex flex-col rounded-2xl p-3.5 transition-all duration-300"
    >
      {/* 16:9 Illustrated Cover */}
      <div className="relative z-10 aspect-video w-full overflow-hidden rounded-xl border border-paper-300/80 bg-paper-200">
        {article.cover ? (
          <img
            src={article.cover}
            alt={article.title}
            loading={index < 4 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className={`relative flex h-full w-full flex-col justify-between bg-gradient-to-br ${style.fallbackBg} p-5 transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold tracking-widest text-ink-600/80">
                {style.code}
              </span>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: style.accent }}
              />
            </div>
            <div className="my-auto pr-3">
              <p className="line-clamp-2 font-serif text-base font-semibold leading-snug text-ink-900/90">
                {article.title}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-8 rounded-full bg-ink-900/20" />
              <span
                className="h-1 w-3 rounded-full"
                style={{ backgroundColor: style.accent }}
              />
            </div>
          </div>
        )}

        {/* Top-left subtle reading time pill */}
        {article.readingMinutes && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-paper-300/80 bg-paper-50/90 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-600 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 backdrop-blur-sm">
            <Clock className="h-3 w-3 text-terracotta-500" />
            约 {article.readingMinutes} 分钟
          </span>
        )}

        {hasVideo && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full border border-paper-300/90 bg-paper-50/95 px-2.5 py-0.5 text-[11px] font-semibold text-ink-800 shadow-sm backdrop-blur-sm">
            <PlayCircle className="h-3.5 w-3.5 text-terracotta-500" />
            配套视频
          </span>
        )}
      </div>

      {/* Meta & Text */}
      <div className="relative z-10 flex flex-1 flex-col pt-3.5 px-1 pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style.pill}`}
          >
            {article.category}
          </span>
          <time className="font-mono text-[11.5px] text-ink-400">
            {article.formattedDate}
          </time>
        </div>

        <h3 className="mt-2.5 line-clamp-2 text-[1.06rem] font-extrabold leading-snug text-ink-900 transition-colors group-hover:text-terracotta-600">
          {article.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[0.88rem] leading-relaxed text-ink-600">
          {article.summary}
        </p>

        <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-paper-200/80 text-xs font-semibold text-ink-600">
          <span className="group-hover:text-terracotta-600 transition-colors">
            阅读完整教程
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-paper-200/80 text-ink-800 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-terracotta-500 group-hover:text-paper-50">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
