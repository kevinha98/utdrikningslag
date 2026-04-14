import { useEffect, useRef } from 'react';

const COLORS = ['#f59e0b', '#ec4899', '#8b5cf6', '#00695c', '#1976d2', '#c0392b'];
const SHAPES = ['circle', 'square', 'triangle'] as const;
const SPAWN_RATE = 3; // particles per move event
const MAX_PARTICLES = 120;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: (typeof SHAPES)[number];
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export function MouseConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnAt = (mx: number, my: number) => {
      for (let i = 0; i < SPAWN_RATE; i++) {
        if (particles.length >= MAX_PARTICLES) {
          // recycle oldest
          particles.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        const maxLife = 40 + Math.random() * 40;
        particles.push({
          x: mx,
          y: my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1, // slight upward bias
          size: Math.random() * 5 + 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          life: 0,
          maxLife,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      spawnAt(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) spawnAt(t.clientX, t.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.vy += 0.04; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const alpha = 1 - p.life / p.maxLife;
        const scale = 0.5 + 0.5 * alpha;
        const s = p.size * scale;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-s / 2, -s / 2, s, s);
        } else {
          // triangle
          ctx.beginPath();
          ctx.moveTo(0, -s / 2);
          ctx.lineTo(s / 2, s / 2);
          ctx.lineTo(-s / 2, s / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
