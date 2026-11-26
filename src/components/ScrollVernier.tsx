import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollVernier() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;
      setProgress(pct);
      setVisible(scrollTop > 180);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="阅读滚动进度"
      className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:flex flex-col items-center gap-2.5 select-none"
    >
      <span className="font-mono text-[10px] font-semibold tracking-wider text-ink-400">
        {String(progress).padStart(2, '0')}%
      </span>

      <div className="relative h-28 w-[3px] rounded-full bg-paper-300/80 overflow-hidden">
        <motion.div
          className="w-full rounded-full bg-gradient-to-b from-terracotta-500 to-ochre-500"
          style={{ height: `${progress}%` }}
          transition={{ type: 'tween', duration: 0.1 }}
        />
      </div>

      {/*Vernier calibration ticks*/}
      <div className="flex flex-col gap-1 opacity-55">
        <span className="block h-[1px] w-2 bg-ink-400" />
        <span className="block h-[1px] w-1.5 bg-ink-300" />
        <span className="block h-[1px] w-2 bg-ink-400" />
      </div>

      <motion.button
        type="button"
        onClick={scrollToTop}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0.25,
          y: visible ? 0 : 4,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title="回到顶部"
        className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 bg-paper-50 text-ink-600 shadow-sm hover:border-terracotta-500 hover:text-terracotta-600 transition-colors"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </motion.button>
    </aside>
  );
}
