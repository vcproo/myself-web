import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

export interface VideoLink {
  platform: string;
  url: string;
}

export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

export interface ArticleItem {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  summary: string;
  category: string;
  cover?: string;
  featured: boolean;
  videoLinks: VideoLink[];
  rawMarkdown: string;
  htmlContent: string;
  headings: ArticleHeading[];
  readingMinutes: number;
}

export interface ToolItem {
  name: string;
  group: string;
  description: string;
  tags: string[];
  url: string;
  urlLabel: string;
  relatedArticleSlug?: string;
  relatedArticleTitle?: string;
}

export interface SiteConfig {
  siteName: string;
  copyright: string;
  headerLinks: {
    label: string;
    url: string;
    platform: string;
  }[];
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  toolGroups: {
    name: string;
    description: string;
  }[];
  articleCategories: string[];
  about: {
    introLead: string;
    paragraphs: string[];
    capabilities: {
      title: string;
      description: string;
    }[];
  };
  contact: {
    videoPlatforms: {
      name: string;
      account: string;
      description: string;
      url: string;
      actionLabel: string;
    }[];
    codePlatforms: {
      name: string;
      account: string;
      description: string;
      url: string;
      actionLabel: string;
    }[];
    community: {
      wechat: {
        name: string;
        accountName: string;
        description: string;
        qrCode?: string;
      };
      email: {
        name: string;
        address: string;
        description: string;
      };
    };
  };
}

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

let highlighterPromise: Promise<Highlighter> | null = null;

function getWarmHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vitesse-light'],
      langs: [
        'tsx',
        'typescript',
        'javascript',
        'bash',
        'shell',
        'json',
        'markdown',
        'yaml',
        'python',
        'html',
        'css',
      ],
    });
  }
  return highlighterPromise;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatDotDate(dateStr: string): string {
  const clean = String(dateStr).trim();
  const parts = clean.split(/[-/]/);
  if (parts.length === 3) {
    return `${parts[0]}.${parts[1].padStart(2, '0')}.${parts[2].padStart(2, '0')}`;
  }
  return clean;
}

function slugifyHeading(text: string, index: number): string {
  const cleaned = text
    .replace(/<[^>]+>/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned ? `sec-${index}-${cleaned}` : `sec-${index}`;
}

export function getSiteConfig(): SiteConfig {
  const sitePath = path.join(CONTENT_DIR, 'site.json');
  const raw = fs.readFileSync(sitePath, 'utf-8');
  return JSON.parse(raw) as SiteConfig;
}

export async function getAllArticles(): Promise<ArticleItem[]> {
  const articlesDir = path.join(CONTENT_DIR, 'articles');
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  const highlighter = await getWarmHighlighter();
  const loadedLangs = new Set(highlighter.getLoadedLanguages());

  const articles: ArticleItem[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, '');
    const fullPath = path.join(articlesDir, file);
    const fileRaw = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileRaw);

    const headings: ArticleHeading[] = [];
    let headingIdx = 0;

    const markedInstance = new Marked({
      gfm: true,
      breaks: false,
    });

    markedInstance.use({
      renderer: {
        heading({ tokens, depth }) {
          const text = this.parser.parseInline(tokens);
          const plainText = text.replace(/<[^>]+>/g, '');
          if (depth === 2 || depth === 3) {
            const id = slugifyHeading(plainText, headingIdx++);
            headings.push({ id, text: plainText, level: depth });
            return `<h${depth} id="${id}">${text}</h${depth}>\n`;
          }
          return `<h${depth}>${text}</h${depth}>\n`;
        },
        code({ text, lang }) {
          const normalizedLang = (lang || '').trim().toLowerCase();
          const encodedForAttr = encodeURIComponent(text);

          if (normalizedLang === 'prompt' || normalizedLang === '提示词') {
            return `
              <div class="code-card prompt-card" data-raw="${encodedForAttr}">
                <div class="code-card-header">
                  <div class="flex items-center gap-2">
                    <span class="inline-block w-2 h-2 rounded-full bg-terracotta-500"></span>
                    <span class="text-xs font-semibold tracking-wide text-terracotta-700">AI 提示词模板 · 可直接复制使用</span>
                  </div>
                  <button type="button" class="copy-snippet-btn" data-copy-trigger data-default-label="复制提示词">
                    <span>复制提示词</span>
                  </button>
                </div>
                <pre>${escapeHtml(text)}</pre>
              </div>
            `;
          }

          const displayLang = normalizedLang ? normalizedLang.toUpperCase() : 'TEXT';
          let highlightedHtml = `<pre><code>${escapeHtml(text)}</code></pre>`;

          if (normalizedLang && loadedLangs.has(normalizedLang)) {
            highlightedHtml = highlighter.codeToHtml(text, {
              lang: normalizedLang,
              theme: 'vitesse-light',
            });
          }

          return `
            <div class="code-card" data-raw="${encodedForAttr}">
              <div class="code-card-header">
                <div class="flex items-center gap-2">
                  <span class="inline-flex gap-1.5 mr-1">
                    <span class="w-2.5 h-2.5 rounded-full bg-terracotta-200 border border-terracotta-500/30"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-ochre-100 border border-ochre-500/30"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-sage-100 border border-sage-600/30"></span>
                  </span>
                  <span class="font-mono text-[11px] font-semibold text-ink-600">${escapeHtml(displayLang)}</span>
                </div>
                <button type="button" class="copy-snippet-btn" data-copy-trigger data-default-label="复制代码">
                  <span>复制代码</span>
                </button>
              </div>
              ${highlightedHtml}
            </div>
          `;
        },
      },
    });

    const htmlContent = await markedInstance.parse(content);
    const title = String(data.title || slug);
    const date = String(data.date || '2026-01-01');
    const charCount = content.replace(/\s+/g, '').length;
    const readingMinutes = Math.max(2, Math.round(charCount / 360));
    const exportableMarkdown = `# ${title}\n\n> 发布日期：${formatDotDate(date)} | 分类：${data.category || '未分类'}\n\n${content.trim()}\n`;

    articles.push({
      slug,
      title,
      date,
      formattedDate: formatDotDate(date),
      summary: String(data.summary || ''),
      category: String(data.category || '实操教程'),
      cover: data.cover ? String(data.cover) : undefined,
      featured: Boolean(data.featured),
      videoLinks: Array.isArray(data.videoLinks) ? data.videoLinks : [],
      rawMarkdown: exportableMarkdown,
      htmlContent,
      headings,
      readingMinutes,
    });
  }

  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return articles;
}

export async function getAllTools(): Promise<ToolItem[]> {
  const toolsPath = path.join(CONTENT_DIR, 'tools.json');
  if (!fs.existsSync(toolsPath)) return [];

  const raw = fs.readFileSync(toolsPath, 'utf-8');
  const parsed = JSON.parse(raw) as ToolItem[];
  const articles = await getAllArticles();
  const titleBySlug = new Map(articles.map((a) => [a.slug, a.title]));

  return parsed.map((tool) => ({
    ...tool,
    urlLabel:
      tool.urlLabel ||
      (tool.url.includes('github.com') ? 'GitHub ↗' : '访问官网 ↗'),
    relatedArticleTitle: tool.relatedArticleSlug
      ? titleBySlug.get(tool.relatedArticleSlug)
      : undefined,
  }));
}
