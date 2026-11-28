import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import MonochromeScanCanvas from './MonochromeScanCanvas';

interface OpeningProps {
  siteName: string;
}

export default function CreativeOpeningHero({ siteName }: OpeningProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [replaySeed, setReplaySeed] = useState(0);
  const [scanDone, setScanDone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const stageOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.3, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const handleReplay = () => {
    setScanDone(false);
    setReplaySeed((s) => s + 1);
  };

  const scrollToContent = () => {
    const target = document.getElementById('content-curtain');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={containerRef}
      aria-label={siteName}
      className="relative h-[108svh] w-full bg-[#F7F3EC] select-none"
    >
      <motion.div
        style={{ opacity: stageOpacity, scale: stageScale }}
        className="sticky top-0 flex h-[100svh] w-full flex-col justify-end overflow-hidden px-6 py-8 sm:px-12 sm:py-10"
      >
        {/* Full-viewport Monochrome Horizon-Line Scanner Sweep Canvas */}
        <div
          data-cursor="canvas"
          onClick={handleReplay}
          className="absolute inset-0"
        >
          <MonochromeScanCanvas
            replaySeed={replaySeed}
            onScanComplete={() => setScanDone(true)}
          />
        </div>

        {/* Minimal Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: scanDone ? 1 : 0, y: scanDone ? 0 : 8 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none relative z-10 flex flex-col items-center"
        >
          <button
            type="button"
            onClick={scrollToContent}
            aria-label="向下浏览内容"
            className="pointer-events-auto group flex flex-col items-center gap-1.5 text-[#645B55] hover:text-[#C84B31] transition-colors"
          >
            <span className="font-mono text-[10.5px] tracking-[0.3em]">
              SCROLL
            </span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
