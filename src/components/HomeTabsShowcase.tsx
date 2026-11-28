import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  QrCode,
  Code2,
  Sparkles,
  Video,
  Compass,
} from 'lucide-react';
import ArticleCard, { type ArticleCardData, handleSpotlightMove } from './ArticleCard';
import ToolCard, { type ToolCardData } from './ToolCard';
import InteractiveToolShowcases from './InteractiveToolShowcases';
import {
  CommunityCafeIllustration,
  OpenSourceWorkbenchIllustration,
  VideoStudioIllustration,
} from './EditorialIllustrations';

type TabKey = 'articles' | 'tools' | 'about' | 'contact';

interface ToolGroupInfo {
  name: string;
  description: string;
}

interface HomeTabsProps {
  articles: ArticleCardData[];
  totalArticleCount: number;
  tools: ToolCardData[];
  toolGroups: ToolGroupInfo[];
  about: {
    introLead: string;
    paragraphs: string[];
    capabilities: { title: string; description: string }[];
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

const VALID_TABS: TabKey[] = ['articles', 'tools', 'about', 'contact'];

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: '真实场景踩坑',
    summary: '从日常编码、文档处理与内容制作的真实痛点出发，拒绝为了追热点而硬凑概念。',
    deliverable: '筛选标准：普通电脑能不能跑？能不能省下至少一半时间？',
  },
  {
    num: '02',
    title: '工具实测对比',
    summary: '把同类型的多款开源方案装到本地逐一对比，记录环境配置门槛与常见报错解法。',
    deliverable: '产出物：客观优缺点横评表 + 避坑清单',
  },
  {
    num: '03',
    title: 'Remotion 视频拆解',
    summary: '用代码驱动的分镜画面把操作逻辑一步步可视化呈现，配合简洁口播讲透原理。',
    deliverable: '产出物：B站长视频演示 + 抖音精炼技巧短视频',
  },
  {
    num: '04',
    title: '图文与开源沉淀',
    summary: '将视频里的提示词、命令与配置模板整理成可一键复制的静态文章与 GitHub 仓库。',
    deliverable: '产出物：本站图文教程 + 开箱即用开源模板',
  },
];

function renderInlineBold(text: string) {
  const segments = text.split(/(\*\*.*?\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong
          key={i}
          className="font-bold text-ink-900 bg-terracotta-100/65 px-1 rounded"
        >
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>;
  });
}

export default function HomeTabsShowcase({
  articles,
  totalArticleCount,
  tools,
  toolGroups,
  about,
  contact,
}: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('articles');
  const [selectedGroup, setSelectedGroup] = useState<string>('全部');
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [qrExpanded, setQrExpanded] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '') as TabKey;
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
      }
    };
    syncFromHash();

    const onCustomSwitch = (e: Event) => {
      const detail = (e as CustomEvent<TabKey>).detail;
      if (VALID_TABS.includes(detail)) {
        setActiveTab(detail);
      }
    };

    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('switch-home-tab', onCustomSwitch);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('switch-home-tab', onCustomSwitch);
    };
  }, []);

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    const nextHash = `#${tab}`;
    window.history.replaceState(null, '', nextHash);
    window.dispatchEvent(new CustomEvent('home-tab-changed', { detail: tab }));
  };

  const groupedTools = useMemo(() => {
    const knownNames = new Set(toolGroups.map((g) => g.name));
    const extraNames = Array.from(
      new Set(tools.map((t) => t.group).filter((g) => !knownNames.has(g)))
    );
    const orderedGroups: ToolGroupInfo[] = [
      ...toolGroups,
      ...extraNames.map((name) => ({ name, description: '' })),
    ];

    return orderedGroups
      .map((g) => ({
        ...g,
        items: tools.filter((t) => t.group === g.name),
      }))
      .filter(
        (g) =>
          g.items.length > 0 &&
          (selectedGroup === '全部' || selectedGroup === g.name)
      );
  }, [tools, toolGroups, selectedGroup]);

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // ignore
    }
  };

  const capabilityIcons = [Code2, Sparkles, Video, Compass];

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'articles', label: '文章', count: totalArticleCount },
    { key: 'tools', label: '开源工具', count: tools.length },
    { key: 'about', label: '关于' },
    { key: 'contact', label: '交流联系' },
  ];

  return (
    <section id="showcase" className="scroll-mt-20 pb-16">
      {/* Inline Section Tab Switcher (synced with Top Header) */}
      <div className="mb-8">
        <div
          role="tablist"
          aria-label="网站核心内容板块"
          className="inline-flex w-full sm:w-auto flex-wrap items-center gap-1 rounded-2xl border border-paper-300/95 bg-paper-50/92 p-1.5 shadow-paper backdrop-blur-md"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => selectTab(tab.key)}
                className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  isActive ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="homeActiveTabPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-paper-200/95 border border-paper-300 shadow-sm"
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="homeActiveTabDot"
                    className="relative z-10 h-1.5 w-1.5 rounded-full bg-terracotta-500"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`relative z-10 font-mono text-[11px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-terracotta-500 text-paper-50'
                        : 'bg-paper-200 text-ink-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {/* TAB 1: 教程文章 */}
        {activeTab === 'articles' && (
          <motion.div
            key="panel-articles"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <p className="text-sm text-ink-600">
                沉淀实用性文章、AI 具体使用案例拆解与分步实操教程（部分内容附带视频演示）。
              </p>
              <a
                href="/articles"
                className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-600 hover:text-terracotta-700"
              >
                <span>按分类筛选全部 ({totalArticleCount})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {articles.map((article, idx) => (
                <ArticleCard key={article.slug} article={article} index={idx} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href="/articles"
                className="tactile-btn group inline-flex items-center gap-2 rounded-full border border-paper-300 bg-paper-50 px-6 py-3 text-sm font-bold text-ink-900 shadow-paper hover:border-terracotta-500 hover:bg-terracotta-500 hover:text-paper-50 transition-all"
              >
                <span>查看全部文章 →</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* TAB 2: 开源与工具 */}
        {activeTab === 'tools' && (
          <motion.div
            key="panel-tools"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Interactive Live Sandboxes (01-03) */}
            <InteractiveToolShowcases />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-paper-300 pt-8">
              <h3 className="text-base font-extrabold text-ink-900">
                全部分组工具清单
              </h3>
              <a
                href="/tools"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-terracotta-600 hover:text-terracotta-700"
              >
                <span>打开独立工具检索页</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Group Quick Filter Pills */}
            <div className="mb-7 flex flex-wrap items-center gap-2">
              {['全部', ...toolGroups.map((g) => g.name)].map((groupName) => {
                const active = selectedGroup === groupName;
                return (
                  <button
                    key={groupName}
                    type="button"
                    onClick={() => setSelectedGroup(groupName)}
                    className={`tactile-btn rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-ink-900 bg-ink-900 text-paper-50'
                        : 'border-paper-300 bg-paper-50 text-ink-600 hover:border-terracotta-500 hover:text-terracotta-600'
                    }`}
                  >
                    {groupName}
                  </button>
                );
              })}
            </div>

            <div className="space-y-9">
              {groupedTools.map((group) => (
                <div key={group.name}>
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-paper-300/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-3.5 w-1 rounded-full bg-terracotta-500" />
                      <h3 className="text-base font-bold text-ink-900">
                        {group.name}
                      </h3>
                      <span className="font-mono text-xs text-ink-400">
                        {String(group.items.length).padStart(2, '0')}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-xs text-ink-600">{group.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {group.items.map((tool, idx) => (
                      <ToolCard key={tool.name} tool={tool} index={idx} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: 关于我 */}
        {activeTab === 'about' && (
          <motion.div
            key="panel-about"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Illustrated Bio Letter Card */}
            <div
              onMouseMove={handleSpotlightMove}
              className="spotlight-card group rounded-3xl p-6 sm:p-8"
            >
              <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-4 text-[1rem] leading-[1.88] text-ink-800">
                  <p className="text-lg">{renderInlineBold(about.introLead)}</p>
                  {about.paragraphs.map((para, idx) => (
                    <p key={idx}>{renderInlineBold(para)}</p>
                  ))}
                </div>
                <div className="lg:col-span-5">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-paper-300/80 bg-[#F3EBDD]/55 p-5">
                    <img
                      src="/ip/ip-pose-think.png"
                      alt="蜘蛛侦探思考形象"
                      className="h-52 w-52 object-contain transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-2"
                    />
                    <p className="mt-2 text-center font-mono text-[11px] font-semibold tracking-wider text-[#49414F]">
                      ENGINEER · AI PRACTITIONER · VIDEO CREATOR
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 4-Step Content & Tool Craft Workflow */}
            <div className="rounded-3xl border border-paper-300 bg-paper-50/90 p-6 shadow-paper">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-terracotta-500" />
                  <h3 className="text-base font-extrabold text-ink-900">
                    我的内容打磨与工具实测流程
                  </h3>
                </div>
                <span className="font-mono text-xs text-ink-400">
                  STEP 0{activeWorkflowIdx + 1} / 04
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const active = idx === activeWorkflowIdx;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => setActiveWorkflowIdx(idx)}
                      className={`relative rounded-2xl border p-3.5 text-left transition-all ${
                        active
                          ? 'border-terracotta-500 bg-terracotta-50/75 shadow-sm -translate-y-0.5'
                          : 'border-paper-300 bg-paper-100/70 hover:border-paper-400'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-extrabold ${
                          active ? 'text-terracotta-600' : 'text-ink-400'
                        }`}
                      >
                        {step.num}
                      </span>
                      <div className="mt-1 text-sm font-extrabold text-ink-900">
                        {step.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorkflowIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 rounded-2xl border border-paper-300 bg-paper-100/90 p-4"
                >
                  <p className="text-sm leading-relaxed text-ink-800">
                    {WORKFLOW_STEPS[activeWorkflowIdx].summary}
                  </p>
                  <p className="mt-2 font-mono text-xs font-semibold text-sage-700">
                    → {WORKFLOW_STEPS[activeWorkflowIdx].deliverable}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Capabilities 2x2 Grid */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-sage-600" />
                <h3 className="text-base font-extrabold text-ink-900">
                  能力与关注方向
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {about.capabilities.map((cap, idx) => {
                  const Icon = capabilityIcons[idx % capabilityIcons.length];
                  return (
                    <div
                      key={cap.title}
                      onMouseMove={handleSpotlightMove}
                      className="spotlight-card group rounded-2xl p-5"
                    >
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-paper-300 bg-paper-100 text-terracotta-600 transition-colors group-hover:bg-terracotta-500 group-hover:text-paper-50 group-hover:border-terracotta-500">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-2xl font-extrabold text-paper-300">
                          0{idx + 1}
                        </span>
                      </div>
                      <h4 className="relative z-10 mt-3.5 text-base font-extrabold text-ink-900">
                        {cap.title}
                      </h4>
                      <p className="relative z-10 mt-1.5 text-sm leading-relaxed text-ink-600">
                        {cap.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: 交流联系 */}
        {activeTab === 'contact' && (
          <motion.div
            key="panel-contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Wide Illustrated Showcase Card 01: 视频自媒体平台 */}
            <div
              onMouseMove={handleSpotlightMove}
              className="spotlight-card group rounded-3xl p-6 sm:p-7"
            >
              <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-terracotta-50 border border-terracotta-200 px-2.5 py-0.5 font-mono text-[11px] font-bold text-terracotta-700">
                      VIDEO CHANNELS // 视频自媒体
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-ink-900">
                    看实操演示视频，跟着画面一步步上手
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
                    {contact.videoPlatforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col justify-between rounded-2xl border border-paper-300 bg-paper-50/90 p-3.5 hover:border-terracotta-500 hover:-translate-y-0.5 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-sm font-extrabold text-ink-900">
                              {platform.name}
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-terracotta-500 shrink-0" />
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                            {platform.description}
                          </p>
                        </div>
                        <span className="mt-3 font-mono text-[11px] font-bold text-terracotta-600">
                          {platform.actionLabel}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <VideoStudioIllustration className="w-full max-w-[330px] mx-auto" />
                </div>
              </div>
            </div>

            {/* Wide Illustrated Showcase Card 02: GitHub 代码与开源主页 */}
            {contact.codePlatforms.map((code) => (
              <a
                key={code.name}
                href={code.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={handleSpotlightMove}
                className="spotlight-card group block rounded-3xl p-6 sm:p-7 hover:-translate-y-0.5"
              >
                <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-7 space-y-2.5">
                    <span className="inline-block rounded-full border border-sage-200 bg-sage-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-sage-700">
                      OPEN SOURCE // 代码与模板仓库
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl font-extrabold text-ink-900 group-hover:text-terracotta-600 transition-colors">
                        {code.name}
                      </h3>
                      <span className="rounded-full bg-paper-200 px-3 py-0.5 font-mono text-xs text-ink-600">
                        {code.account}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600">
                      {code.description}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-paper-50 group-hover:bg-terracotta-600 transition-colors">
                        <span>{code.actionLabel}</span>
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <OpenSourceWorkbenchIllustration className="w-full max-w-[290px] mx-auto" />
                  </div>
                </div>
              </a>
            ))}

            {/* Wide Illustrated Showcase Card 03: 公众号交流 & 合作邮箱 */}
            <div
              onMouseMove={handleSpotlightMove}
              className="spotlight-card group rounded-3xl p-6 sm:p-7"
            >
              <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <span className="inline-block rounded-full border border-ochre-100 bg-ochre-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-ochre-600">
                      COMMUNITY & CONTACT // 读者交流与合作
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold text-ink-900">
                      随时欢迎交流想法、反馈需求或洽谈合作
                    </h3>
                  </div>

                  {/* WeChat Sub-card */}
                  <div className="rounded-2xl border border-paper-300 bg-paper-50/90 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-ink-900">
                          {contact.community.wechat.name}
                        </h4>
                        <p className="font-mono text-xs text-terracotta-700 mt-0.5">
                          {contact.community.wechat.accountName}
                        </p>
                      </div>
                      <QrCode className="h-4 w-4 text-terracotta-500" />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                      {contact.community.wechat.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            contact.community.wechat.accountName,
                            setCopiedWechat
                          )
                        }
                        className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:border-terracotta-500 hover:text-terracotta-600"
                      >
                        {copiedWechat ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-sage-600" />
                            <span className="text-sage-700">已复制名称</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>复制公众号名称</span>
                          </>
                        )}
                      </button>

                      {contact.community.wechat.qrCode && (
                        <button
                          type="button"
                          onClick={() => setQrExpanded((v) => !v)}
                          className="tactile-btn inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 px-3 py-1.5 text-xs font-semibold text-terracotta-700 hover:bg-terracotta-500 hover:text-paper-50 transition-colors"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>{qrExpanded ? '收起二维码' : '展开二维码'}</span>
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {qrExpanded && contact.community.wechat.qrCode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex items-center gap-3.5 rounded-xl border border-paper-300 bg-paper-100 p-3">
                            <img
                              src={contact.community.wechat.qrCode}
                              alt="公众号二维码"
                              className="h-20 w-20 rounded-lg border border-paper-300 bg-paper-50 p-1"
                            />
                            <p className="text-xs leading-relaxed text-ink-600">
                              微信扫码关注，及时获取最新图文教程与开源好物更新。
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Business Email Sub-card */}
                  <div className="rounded-2xl border border-paper-300 bg-paper-50/90 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-ink-900">
                          {contact.community.email.name}
                        </h4>
                        <p className="font-mono text-xs text-ink-800 mt-0.5">
                          {contact.community.email.address}
                        </p>
                      </div>
                      <Mail className="h-4 w-4 text-sage-600" />
                    </div>
                    <p className="mt-1.5 text-xs text-ink-600">
                      {contact.community.email.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            contact.community.email.address,
                            setCopiedEmail
                          )
                        }
                        className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:border-terracotta-500 hover:text-terracotta-600"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-sage-600" />
                            <span className="text-sage-700">已复制邮箱</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>复制邮箱地址</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:${contact.community.email.address}`}
                        className="tactile-btn inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-paper-50 hover:bg-terracotta-600 transition-colors"
                      >
                        <span>发送邮件 ↗</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <CommunityCafeIllustration className="w-full max-w-[320px] mx-auto" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
