import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  GripVertical,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from 'lucide-react';

export default function InteractiveToolShowcases() {
  // --- Sandbox 01: Remotion Physics & Scene Switcher ---
  const [remotionPreset, setRemotionPreset] = useState<'spring' | 'caption' | 'bars'>('spring');
  const [damping, setDamping] = useState(14);
  const [replayKey, setReplayKey] = useState(0);

  // --- Sandbox 02: Draggable Prompt X-Ray Split Slider ---
  const [splitPct, setSplitPct] = useState(64);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Sandbox 03: Tactile Keycaps & Local Model Stream ---
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [streamStep, setStreamStep] = useState(4);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const streamLines = [
    '✓ 已加载本地模型 qwen2.5:7b (离线零流量)',
    '→ 提炼要点 1：优先从 Releases 下载现成安装包',
    '→ 提炼要点 2：敏感文档仅在本地内存完成向量检索',
    '→ 提炼要点 3：平均响应速度 48 tokens/s，耗时 0.6s',
  ];

  useEffect(() => {
    if (!isStreaming) return;
    setStreamStep(0);
    const id = window.setInterval(() => {
      setStreamStep((prev) => {
        if (prev >= streamLines.length) {
          window.clearInterval(id);
          setIsStreaming(false);
          return streamLines.length;
        }
        return prev + 1;
      });
    }, 340);
    return () => window.clearInterval(id);
  }, [isStreaming]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (clientX: number) => {
      const el = splitContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(92, Math.max(8, Math.round(raw))));
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  const triggerShortcut = (keyLabel: string) => {
    setPressedKey(keyLabel);
    setTimeout(() => setPressedKey(null), 220);
    setIsStreaming(true);
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText('ollama run qwen2.5');
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mb-10 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-500 text-[11px] font-bold text-paper-50">
            ✦
          </span>
          <h3 className="text-base font-extrabold text-ink-900">
            精选工具 · 实时交互体验台
          </h3>
        </div>
        <span className="font-mono text-xs text-ink-400">
          直接在卡片内点击、拖拽即可体验核心工作流
        </span>
      </div>

      {/* SHOWCASE 01: Remotion Interactive Motion Lab */}
      <div className="spotlight-card relative overflow-hidden rounded-3xl p-5 sm:p-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 bottom-3 font-mono text-5xl font-extrabold tracking-tighter text-paper-200/90 select-none"
        >
          01
        </span>

        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-terracotta-200 bg-terracotta-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-terracotta-700">
                VIDEO · CODE
              </span>
              <span className="font-mono text-xs text-ink-400">01 / 03</span>
            </div>
            <h4 className="text-xl font-extrabold text-ink-900">
              Remotion 编程化视频引擎
            </h4>
            <p className="text-sm leading-relaxed text-ink-600">
              用 React 组件代替繁琐的手动拉关键帧。右侧可直接切换三种常用分镜模板，并拖动**物理弹簧阻尼滑块**感受不同动画手感。
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="https://www.remotion.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn inline-flex items-center gap-1 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-paper-50 hover:bg-terracotta-600 transition-colors"
              >
                <span>访问官网</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="/articles/remotion-ai-knowledge-video"
                className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-terracotta-200 bg-terracotta-50 px-4 py-2 text-xs font-bold text-terracotta-700 hover:bg-terracotta-500 hover:text-paper-50 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>查看实战教程 →</span>
              </a>
            </div>
          </div>

          {/* Right Live Interactive Motion Sandbox */}
          <div className="lg:col-span-7 rounded-2xl border border-paper-300 bg-gradient-to-br from-paper-100 via-paper-50 to-terracotta-50/40 p-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-200 pb-3">
              <div className="flex items-center gap-1 rounded-full bg-paper-200/90 p-0.5">
                {[
                  { id: 'spring' as const, label: '01 弹簧卡片' },
                  { id: 'caption' as const, label: '02 逐词字幕' },
                  { id: 'bars' as const, label: '03 数据对比' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setRemotionPreset(tab.id);
                      setReplayKey((k) => k + 1);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      remotionPreset === tab.id
                        ? 'bg-paper-50 text-terracotta-700 shadow-sm'
                        : 'text-ink-600 hover:text-ink-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="tactile-btn inline-flex items-center gap-1 rounded-full border border-paper-300 bg-paper-50 px-3 py-1 text-xs font-bold text-ink-800 hover:border-terracotta-500 hover:text-terracotta-600"
              >
                <RotateCcw className="h-3 w-3" />
                <span>重播动画</span>
              </button>
            </div>

            {/* Stage Canvas */}
            <div className="relative my-3.5 flex h-36 items-center justify-center overflow-hidden rounded-xl border border-paper-300/90 bg-paper-50 px-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(#D5C7AE 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              <AnimatePresence mode="wait">
                {remotionPreset === 'spring' && (
                  <motion.div
                    key={`spring-${replayKey}-${damping}`}
                    initial={{ scale: 0.55, y: 36, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping,
                    }}
                    className="relative z-10 flex items-center gap-3.5 rounded-2xl border-2 border-ink-900 bg-paper-50 px-5 py-3 shadow-tactile"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-500 text-paper-50">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                    <div>
                      <div className="text-sm font-extrabold text-ink-900">
                        知识分镜组件自动渲染
                      </div>
                      <div className="font-mono text-[11px] text-ink-600">
                        spring(&#123; stiffness: 220, damping: {damping} &#125;)
                      </div>
                    </div>
                  </motion.div>
                )}

                {remotionPreset === 'caption' && (
                  <motion.div
                    key={`caption-${replayKey}`}
                    className="relative z-10 flex flex-wrap justify-center gap-2 px-2"
                  >
                    {['把复杂概念', '拆解成', '节奏丝滑的', '动态画面'].map(
                      (word, idx) => (
                        <motion.span
                          key={word}
                          initial={{ opacity: 0.15, y: 12, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: idx * 0.16,
                            type: 'spring',
                            stiffness: 280,
                            damping: 16,
                          }}
                          className={`rounded-xl px-3 py-1.5 text-sm font-extrabold border ${
                            idx === 2
                              ? 'border-terracotta-500 bg-terracotta-500 text-paper-50 shadow-sm'
                              : 'border-paper-300 bg-paper-100 text-ink-900'
                          }`}
                        >
                          {word}
                        </motion.span>
                      )
                    )}
                  </motion.div>
                )}

                {remotionPreset === 'bars' && (
                  <div
                    key={`bars-${replayKey}`}
                    className="relative z-10 w-full max-w-sm space-y-2.5"
                  >
                    {[
                      { label: '传统手动对齐字幕关键帧', pct: '92%', color: 'bg-paper-300', time: '耗时 3.5h' },
                      { label: 'AI 拆解 + Remotion 渲染', pct: '28%', color: 'bg-sage-600', time: '耗时 45m' },
                    ].map((row, idx) => (
                      <div key={row.label} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-ink-800">
                          <span>{row.label}</span>
                          <span className="font-mono text-terracotta-600">{row.time}</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-paper-200">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: row.pct }}
                            transition={{
                              delay: idx * 0.15,
                              type: 'spring',
                              stiffness: 140,
                              damping,
                            }}
                            className={`h-full rounded-full ${row.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Physics Slider */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="shrink-0 font-mono text-[11px] font-semibold text-ink-600">
                阻尼调节 ({damping < 11 ? 'Q弹回跃' : damping > 20 ? '稳重顺滑' : '自然干脆'}):
              </span>
              <input
                type="range"
                min={6}
                max={28}
                value={damping}
                onChange={(e) => {
                  setDamping(Number(e.target.value));
                  setReplayKey((k) => k + 1);
                }}
                aria-label="调整弹簧阻尼系数"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-paper-300 accent-terracotta-500"
              />
              <span className="w-7 text-right font-mono text-[11px] font-bold text-terracotta-600">
                {damping}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWCASE 02: Draggable Prompt X-Ray Split Slider (Alternating Left Sandbox / Right Copy) */}
      <div className="spotlight-card relative overflow-hidden rounded-3xl p-5 sm:p-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 bottom-3 font-mono text-5xl font-extrabold tracking-tighter text-paper-200/90 select-none"
        >
          02
        </span>

        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left Draggable Split X-Ray */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div
              ref={splitContainerRef}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              className="relative h-52 cursor-ew-resize select-none overflow-hidden rounded-2xl border border-paper-300 bg-paper-100 shadow-inner"
            >
              {/* Base Layer (Right side: Ordinary Vague Prompt) */}
              <div className="absolute inset-0 flex flex-col justify-between bg-paper-200/85 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-paper-300/90 px-2.5 py-0.5 text-[11px] font-bold text-ink-600">
                    普通随口提问
                  </span>
                  <span className="font-mono text-[11px] text-ink-400">修改前</span>
                </div>
                <div className="my-auto space-y-2 pl-2">
                  <p className="text-sm font-semibold text-ink-600">
                    “帮我总结一下刚才发你的那篇会议记录，越快越好。”
                  </p>
                  <p className="text-xs text-ink-400">
                    ✗ 缺少输出结构，容易漏掉负责人与截止节点
                    <br />✗ 模型容易自行脑补原文没有的结论
                  </p>
                </div>
                <div className="text-right font-mono text-[10.5px] text-ink-400">
                  ← 向左拖动滑杆查看普通问法
                </div>
              </div>

              {/* Clipped Top Layer (Left side: Structured High-Precision Prompt) */}
              <div
                style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
                className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-terracotta-50 via-[#FFFDF9] to-sage-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-sage-200 bg-sage-100 px-2.5 py-0.5 text-[11px] font-bold text-sage-700">
                    <Sparkles className="h-3 w-3" />
                    结构化提示词模板
                  </span>
                  <span className="font-mono text-[11px] font-bold text-terracotta-600">
                    实战套用版
                  </span>
                </div>

                <div className="my-auto space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-terracotta-200 bg-paper-50 px-2 py-0.5 text-[11px] font-bold text-terracotta-700">
                      1. 严禁脑补未提及数据
                    </span>
                    <span className="rounded-md border border-sage-200 bg-paper-50 px-2 py-0.5 text-[11px] font-bold text-sage-700">
                      2. 待办项含负责人+日期
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-ink-800 pt-1">
                    输出自动拆为【核心结论 3 条】+【可执行清单表格】+【待确认疑问】，复制即可直接发群推进。
                  </p>
                </div>

                <div className="font-mono text-[10.5px] text-terracotta-600 font-semibold">
                  拖动中间分割线实时透视对比 ({splitPct}%) →
                </div>
              </div>

              {/* Draggable Divider Handle */}
              <div
                style={{ left: `${splitPct}%` }}
                className="absolute bottom-0 top-0 z-20 w-0.5 -translate-x-1/2 bg-terracotta-500 shadow-[0_0_12px_rgba(217,93,57,0.45)]"
              >
                <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-terracotta-500 bg-paper-50 text-terracotta-600 shadow-md transition-transform hover:scale-110">
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Copy */}
          <div className="order-1 lg:order-2 lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-ochre-100 bg-ochre-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-ochre-600">
                PROMPT · CRAFT
              </span>
              <span className="font-mono text-xs text-ink-400">02 / 03</span>
            </div>
            <h4 className="text-xl font-extrabold text-ink-900">
              日常高频 AI 结构化提示词模板集
            </h4>
            <p className="text-sm leading-relaxed text-ink-600">
              把经过上百次实测验证的文档提炼、方案反问、排错指令沉淀成填空即用的现成卡片。左右拖动左侧透视滑杆，直观对比提问前后的颗粒度差异。
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="/articles/structured-prompt-templates-for-creators"
                className="tactile-btn inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-paper-50 hover:bg-terracotta-600 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>获取完整提示词模板 →</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWCASE 03: Tactile 3D Keycaps & Local Open-Source Runner */}
      <div className="spotlight-card relative overflow-hidden rounded-3xl p-5 sm:p-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 bottom-3 font-mono text-5xl font-extrabold tracking-tighter text-paper-200/90 select-none"
        >
          03
        </span>

        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left Copy */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-sage-200 bg-sage-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-sage-700">
                LOCAL · OPEN SOURCE
              </span>
              <span className="font-mono text-xs text-ink-400">03 / 03</span>
            </div>
            <h4 className="text-xl font-extrabold text-ink-900">
              Ollama + 开源 AI 桌面端组合
            </h4>
            <p className="text-sm leading-relaxed text-ink-600">
              无需复杂环境配置，一行命令在个人电脑离线运行开源模型，配合桌面客户端全局快捷键随时呼出。点击右侧机械按键体验即时响应流。
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="https://ollama.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn inline-flex items-center gap-1 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-paper-50 hover:bg-terracotta-600 transition-colors"
              >
                <span>访问 Ollama 官网</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="/articles/zero-basis-github-ai-guide"
                className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-sage-50 px-4 py-2 text-xs font-bold text-sage-700 hover:bg-sage-600 hover:text-paper-50 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>零基础本地跑通指南 →</span>
              </a>
            </div>
          </div>

          {/* Right Tactile Keycaps + Stream Output */}
          <div className="lg:col-span-7 rounded-2xl border border-paper-300 bg-gradient-to-br from-paper-100 to-sage-50/45 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[
                  { id: 'Alt', label: 'Alt' },
                  { id: 'Space', label: 'Space 呼出' },
                  { id: 'Run', label: '↵ 运行实测' },
                ].map((keyItem, idx) => {
                  const isDown = pressedKey === keyItem.id;
                  return (
                    <React.Fragment key={keyItem.id}>
                      {idx > 0 && (
                        <span className="font-mono text-xs font-bold text-ink-400">
                          +
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => triggerShortcut(keyItem.id)}
                        className={`rounded-xl border-2 border-ink-900 bg-paper-50 px-3.5 py-2 font-mono text-xs font-extrabold text-ink-900 transition-all ${
                          isDown
                            ? 'translate-y-1 shadow-none bg-terracotta-50 border-terracotta-600 text-terracotta-700'
                            : 'shadow-[0_4px_0_0_#221E1C] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none'
                        }`}
                      >
                        {keyItem.label}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={copyCommand}
                className="tactile-btn inline-flex items-center gap-1.5 rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 font-mono text-[11px] font-semibold text-ink-800 hover:border-terracotta-500 hover:text-terracotta-600"
              >
                {copiedCmd ? (
                  <>
                    <Check className="h-3 w-3 text-sage-600" />
                    <span className="text-sage-700">已复制命令</span>
                  </>
                ) : (
                  <>
                    <Terminal className="h-3 w-3 text-terracotta-500" />
                    <span>ollama run qwen2.5</span>
                    <Copy className="h-3 w-3 opacity-60" />
                  </>
                )}
              </button>
            </div>

            {/* Warm Terminal Stream Box */}
            <div className="mt-4 rounded-xl border border-paper-300 bg-paper-50/95 p-3.5 font-mono text-xs space-y-1.5 min-h-[112px]">
              {streamLines.slice(0, streamStep).map((line, i) => (
                <motion.div
                  key={`${i}-${line}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    i === 0
                      ? 'font-bold text-sage-700'
                      : 'text-ink-800'
                  }
                >
                  {line}
                </motion.div>
              ))}
              {isStreaming && (
                <span className="inline-block h-3.5 w-2 animate-pulse bg-terracotta-500 align-middle" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
