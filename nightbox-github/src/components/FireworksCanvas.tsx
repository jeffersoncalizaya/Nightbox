'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  flicker: boolean;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

const PALETTES = [
  // Ouro & Champanhe Super Brilhante
  ['#FFF275', '#FFD700', '#FFA500', '#FFE66D', '#FFFFFF', '#FFB703'],
  // Neon Magenta & Ciano Elétrico
  ['#FF007F', '#00F0FF', '#FF00A0', '#00FFFF', '#7000FF', '#FFFFFF'],
  // Esmeralda & Dourado Tropical
  ['#00FF88', '#00E5FF', '#FFD700', '#39FF14', '#7CFC00', '#FFFFFF'],
  // Rubi & Púrpura Imperial
  ['#FF1744', '#D500F9', '#FF4081', '#FF9100', '#FF3D00', '#FFFFFF'],
  // Arco-íris Vibrante
  ['#FF0055', '#FF7700', '#FFDD00', '#00FF66', '#00E5FF', '#BD00FF', '#FFFFFF']
];

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const createExplosion = (x: number, y: number, colorPalette: string[]) => {
      if (!isMounted) return;
      // Limite seguro de partículas na tela para desempenho leve
      if (particles.length > 350) return;

      const particleCount = Math.floor(40 + Math.random() * 30);
      const isRing = Math.random() > 0.65;
      const baseSpeed = Math.random() * 3.5 + 2.5;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.25 - 0.12);
        const speed = isRing ? baseSpeed : Math.random() * baseSpeed + 0.8;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.012,
          color,
          size: Math.random() * 2.5 + 1.2,
          flicker: Math.random() > 0.3,
          trail: []
        });
      }
    };

    const launchRocket = () => {
      if (!isMounted) return;
      const x = Math.random() * (width * 0.85) + width * 0.075;
      const targetY = Math.random() * (height * 0.45) + height * 0.08;
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const color = palette[0];

      rockets.push({
        x,
        y: height + 10,
        targetY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -(Math.random() * 3.5 + 8.5),
        color,
        size: 2.8,
        trail: []
      });
    };

    // Cliques em áreas vazias disparam fogos no local exato
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('button, a, input, select, textarea, [role="button"], [role="dialog"]')) {
        return;
      }
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      createExplosion(e.clientX, e.clientY, palette);
    };
    window.addEventListener('click', handleWindowClick);

    // Disparos iniciais de boas-vindas
    const timer1 = setTimeout(() => {
      launchRocket();
      const timer2 = setTimeout(launchRocket, 350);
      const timer3 = setTimeout(launchRocket, 800);
      return () => {
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, 200);

    let lastLaunch = Date.now();
    let launchInterval = 1300;

    const loop = () => {
      if (!isMounted) return;
      ctx.clearRect(0, 0, width, height);

      // Lança novos fogos periodicamente
      const now = Date.now();
      if (now - lastLaunch > launchInterval) {
        launchRocket();
        if (Math.random() > 0.55) {
          setTimeout(() => {
            if (isMounted) launchRocket();
          }, 280);
        }
        lastLaunch = now;
        launchInterval = Math.random() * 800 + 1000;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // Atualiza e desenha foguetes subindo com rastro incandescente
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.05; // leve gravidade

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 6) r.trail.shift();

        // Rastro luminoso do foguete
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.size;
        ctx.beginPath();
        if (r.trail.length > 1) {
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (let t = 1; t < r.trail.length; t++) {
            ctx.lineTo(r.trail[t].x, r.trail[t].y);
          }
        }
        ctx.stroke();

        // Ponta super brilhante
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.size * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Ápice da subida -> Detonação da queima de fogos
        if (r.vy >= -1.2 || r.y <= r.targetY) {
          const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
          createExplosion(r.x, r.y, palette);
          rockets.splice(i, 1);
        }
      }

      // Atualiza e desenha partículas da explosão com efeito de glitter e rastro
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.965; // arrasto do ar
        p.vy *= 0.965;
        p.vy += 0.07; // gravidade
        p.x += p.vx;
        p.y += p.vy;

        p.alpha -= p.decay;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const currentAlpha = p.flicker && Math.random() > 0.35 ? p.alpha * 0.55 : p.alpha;
        ctx.globalAlpha = Math.max(0, currentAlpha);

        // Cauda cintilante
        if (p.trail.length > 1) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.stroke();
        }

        // Ponto de luz da partícula
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer1);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
