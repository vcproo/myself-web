import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  lineX: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
  phase: number;
}

export interface MonochromeScanProps {
  replaySeed?: number;
  /** 0 = crisp calm, 1 = acoustic wave, 2 = gentle wind scatter */
  dialMode?: number;
  onScanComplete?: () => void;
  interactiveBrush?: boolean;
}

const CHARS = ['蜘', '蛛', '侦', '探'];

export default function MonochromeScanCanvas({
  replaySeed = 0,
  dialMode = 0,
  onScanComplete,
  interactiveBrush = true,
}: MonochromeScanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const startTimeRef = useRef<number>(performance.now());
  const boundsRef = useRef({ minX: 0, maxX: 1 });
  const dialModeRef = useRef(dialMode);
  const onCompleteRef = useRef(onScanComplete);

  dialModeRef.current = dialMode;
  onCompleteRef.current = onScanComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const buildParticles = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');
      if (!octx) return;

      const fontSize = Math.min(width * 0.16, height * 0.3, 182);
      const totalSpan = Math.min(width * 0.76, fontSize * 4.5);
      const startX = (width - totalSpan) / 2;
      const stepX = totalSpan / 4;
      const gap = width < 640 ? 4 : 5;
      const horizonY = height * 0.47;

      octx.clearRect(0, 0, width, height);
      octx.fillStyle = '#000000';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.font = `700 ${Math.round(fontSize)}px "Ma Shan Zheng", "ZCOOL XiaoWei", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", serif`;

      CHARS.forEach((ch, idx) => {
        const cx = startX + stepX * idx + stepX * 0.5;
        const cy = horizonY + (idx % 2 === 0 ? -4 : 4);
        octx.fillText(ch, cx, cy);
      });

      const img = octx.getImageData(0, 0, width, height).data;
      const list: Particle[] = [];
      let minX = width;
      let maxX = 0;

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (img[(y * width + x) * 4 + 3] > 115) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            list.push({
              x,
              y: horizonY,
              tx: x,
              ty: y,
              lineX: x,
              vx: 0,
              vy: 0,
              size: gap * 0.36,
              energy: 0,
              phase: x * 0.018 + Math.random() * 0.5,
            });
          }
        }
      }

      boundsRef.current = {
        minX: Math.max(40, minX - 36),
        maxX: Math.min(width - 40, maxX + 36),
      };
      particlesRef.current = list;
      startTimeRef.current = performance.now();
    };

    const init = async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      buildParticles();
    };

    init();
    window.addEventListener('resize', buildParticles);

    const onWindowMove = (e: MouseEvent) => {
      if (!interactiveBrush) return;
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onWindowLeave = () => {
      pointerRef.current.active = false;
    };
    window.addEventListener('mousemove', onWindowMove, { passive: true });
    window.addEventListener('mouseleave', onWindowLeave);

    const HOLD_MS = 420;
    const SCAN_MS = 1280;
    let notified = false;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = now - startTimeRef.current;
      const tSec = now * 0.001;
      const { minX, maxX } = boundsRef.current;
      const horizonY = height * 0.47;

      const rawT = Math.max(0, Math.min(1, (elapsed - HOLD_MS) / SCAN_MS));
      const scanEase =
        rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
      const scanX = minX + (maxX - minX) * scanEase;

      if (rawT >= 1 && !notified) {
        notified = true;
        onCompleteRef.current?.();
      }

      const lineFade =
        rawT < 1
          ? 0.22
          : Math.max(0, 0.22 * (1 - (elapsed - HOLD_MS - SCAN_MS) / 500));

      if (lineFade > 0.005) {
        ctx.beginPath();
        ctx.moveTo(minX - 24, horizonY);
        ctx.lineTo(maxX + 24, horizonY);
        ctx.strokeStyle = `rgba(34, 30, 28, ${lineFade})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const pts = particlesRef.current;
      const ptr = pointerRef.current;
      const repelRadius = width < 640 ? 70 : 105;
      const mode = dialModeRef.current;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const unlocked = elapsed > HOLD_MS && p.tx <= scanX;

        if (!unlocked) {
          const waveY = horizonY + Math.sin(p.phase + tSec * 3.2) * 3;
          p.x += (p.lineX - p.x) * 0.25;
          p.y += (waveY - p.y) * 0.25;
          p.vx = 0;
          p.vy = 0;
          p.energy = 0;
        } else {
          if (Math.abs(p.tx - scanX) < 26 && rawT < 1) {
            p.energy = Math.max(p.energy, 0.7);
          }

          // Compute dynamic target based on optional Rotary Dial Mode (used by Demo 4)
          let goalX = p.tx;
          let goalY = p.ty;
          if (mode === 1) {
            goalY = p.ty + Math.sin(p.tx * 0.02 + tSec * 3.2) * 14;
          } else if (mode === 2) {
            goalX = p.tx + Math.sin(p.phase * 1.7 + tSec * 1.6) * 28;
            goalY = p.ty + Math.cos(p.phase * 1.3 - tSec * 1.4) * 22;
          }

          if (interactiveBrush && ptr.active && rawT > 0.85) {
            const dx = p.x - ptr.x;
            const dy = p.y - ptr.y;
            const dist = Math.hypot(dx, dy);
            if (dist < repelRadius && dist > 0.1) {
              const force = Math.pow(1 - dist / repelRadius, 1.7) * 8;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
              p.energy = Math.min(1, p.energy + 0.22);
            }
          }

          p.vx = (p.vx + (goalX - p.x) * 0.105) * 0.79;
          p.vy = (p.vy + (goalY - p.y) * 0.105) * 0.79;
          p.x += p.vx;
          p.y += p.vy;
          p.energy *= 0.92;
        }

        ctx.beginPath();
        const r = p.size + p.energy * 0.85;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (p.energy > 0.16) {
          const e = Math.min(1, p.energy);
          ctx.fillStyle = `rgb(${Math.round(34 + 166 * e)}, ${Math.round(
            30 + 45 * e
          )}, ${Math.round(28 + 21 * e)})`;
        } else {
          ctx.fillStyle = unlocked ? '#221E1C' : 'rgba(34, 30, 28, 0.5)';
        }
        ctx.fill();
      }

      if (elapsed > HOLD_MS && rawT < 1) {
        const scanAlpha = Math.sin(rawT * Math.PI);
        const beamH = Math.min(height * 0.42, 230);
        const grad = ctx.createLinearGradient(
          scanX,
          horizonY - beamH / 2,
          scanX,
          horizonY + beamH / 2
        );
        grad.addColorStop(0, 'rgba(200, 75, 49, 0)');
        grad.addColorStop(0.5, `rgba(200, 75, 49, ${0.72 * scanAlpha})`);
        grad.addColorStop(1, 'rgba(200, 75, 49, 0)');
        ctx.beginPath();
        ctx.moveTo(scanX, horizonY - beamH / 2);
        ctx.lineTo(scanX, horizonY + beamH / 2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', buildParticles);
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseleave', onWindowLeave);
    };
  }, [replaySeed, interactiveBrush]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
