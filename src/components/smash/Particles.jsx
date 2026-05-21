import { useEffect, useRef } from 'react';

export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const CONFIG = [
      { color: 'rgba(59,185,255,0.7)',  shadow: 'rgba(59,185,255,0.6)',  size: [2, 4]  },
      { color: 'rgba(255,204,0,0.65)',  shadow: 'rgba(255,204,0,0.5)',   size: [1, 3]  },
      { color: 'rgba(255,255,255,0.5)', shadow: 'rgba(255,255,255,0.4)', size: [1, 2.5] },
      { color: 'rgba(160,80,255,0.6)',  shadow: 'rgba(160,80,255,0.5)',  size: [1, 3]  },
    ];

    // Mismo comportamiento: 60 partículas flotantes
    const floatingParticles = Array.from({ length: 60 }, () => {
      const cfg = CONFIG[Math.floor(Math.random() * CONFIG.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: (0.8 + Math.random() * 0.2) * window.innerHeight,
        size: cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]),
        color: cfg.color,
        shadowColor: cfg.shadow,
        vy: -(0.2 + Math.random() * 0.5), 
        vx: (Math.random() - 0.5) * 0.2,
      };
    });

    // Mismo comportamiento: 80 estrellas estáticas titilando
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.5,
      baseOpacity: 0.2 + Math.random() * 0.5,
      speed: 0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2
    }));

    let tick = 0;
    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar estrellas fijas
      stars.forEach(s => {
        const alpha = s.baseOpacity + Math.sin(tick * s.speed + s.phase) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, alpha))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dibujar partículas flotantes (sin sobrecargar el DOM)
      floatingParticles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;

        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.shadowColor;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
}