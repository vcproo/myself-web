import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorMode = 'default' | 'link' | 'button' | 'text';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function InteractiveCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [pressed, setPressed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const modeRef = useRef<CursorMode>('default');
  modeRef.current = mode;

  const exactX = useMotionValue(-100);
  const exactY = useMotionValue(-100);
  const stretchX = useSpring(1, { stiffness: 300, damping: 24 });
  const stretchY = useSpring(1, { stiffness: 300, damping: 24 });
  const angleDeg = useMotionValue(0);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) return;

    setEnabled(true);
    const applyClass = () =>
      document.documentElement.classList.add('custom-cursor-active');
    applyClass();

    let lastX = 0;
    let lastY = 0;
    let resetStretchTimer = 0;

    const onMove = (e: MouseEvent) => {
      applyClass();
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = x;
      lastY = y;

      exactX.set(x);
      exactY.set(y);
      setVisible(true);

      // Push point for silky tapered calligraphy-ink ribbon
      if (speed > 1.5) {
        trailRef.current.push({ x, y, age: 0 });
        if (trailRef.current.length > 22) {
          trailRef.current.shift();
        }
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        angleDeg.set(ang);
        const factor = Math.min(0.42, speed * 0.012);
        stretchX.set(1 + factor);
        stretchY.set(1 - factor * 0.55);
      }

      window.clearTimeout(resetStretchTimer);
      resetStretchTimer = window.setTimeout(() => {
        stretchX.set(1);
        stretchY.set(1);
      }, 65);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setMode('default');
        return;
      }

      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setMode('text');
      } else if (target.closest('a[href]')) {
        setMode('link');
      } else if (target.closest('button, [role="tab"], [data-interactive]')) {
        setMode('button');
      } else {
        setMode('default');
      }
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      setVisible(false);
      trailRef.current = [];
    };
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('astro:after-swap', applyClass);

    return () => {
      window.clearTimeout(resetStretchTimer);
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('astro:after-swap', applyClass);
    };
  }, [exactX, exactY, stretchX, stretchY, angleDeg]);

  // 60fps Silky Tapered Calligraphy Ink Ribbon Trail
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const pts = trailRef.current;

      // Age & prune points so ribbon vanishes smoothly when mouse stops
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].age += 1;
        if (pts[i].age > 16) {
          pts.splice(i, 1);
        }
      }

      if (pts.length > 2 && modeRef.current !== 'text') {
        const isWarm = modeRef.current === 'button' || modeRef.current === 'link';
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const ratio = i / pts.length;
          const life = Math.max(0, 1 - p1.age / 16);
          const alpha = ratio * life * (isWarm ? 0.42 : 0.28);
          const width = Math.max(0.5, ratio * life * 4.2);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = isWarm
            ? `rgba(200, 75, 49, ${alpha.toFixed(3)})`
            : `rgba(34, 30, 28, ${alpha.toFixed(3)})`;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isLink = mode === 'link';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Silky Tapered Ink Ribbon Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full"
      />

      {/* Sculptural Liquid-Ink Droplet */}
      <motion.div
        style={{
          x: exactX,
          y: exactY,
          translateX: '-50%',
          translateY: '-50%',
          rotate: mode === 'default' ? angleDeg : 0,
          scaleX: mode === 'default' ? stretchX : 1,
          scaleY: mode === 'default' ? stretchY : 1,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          width:
            mode === 'text'
              ? 2
              : isLink
              ? 18
              : mode === 'button'
              ? 14
              : 10,
          height:
            mode === 'text'
              ? 18
              : isLink
              ? 18
              : mode === 'button'
              ? 14
              : 10,
          scale: pressed ? 0.78 : 1,
          backgroundColor:
            mode === 'text'
              ? '#C84B31'
              : isLink
              ? 'rgba(200, 75, 49, 0.16)'
              : mode === 'button'
              ? '#C84B31'
              : '#221E1C',
          borderWidth: isLink ? 1.5 : 0,
          borderColor: isLink ? '#C84B31' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border-solid"
      >
        {isLink && (
          <span className="h-1 w-1 rounded-full bg-[#C84B31]" />
        )}
      </motion.div>
    </div>
  );
}
