import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SmashButton from './SmashButton';

function useConfetti(active) {
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9D65C9', '#3bb9ff', '#fff', '#ff8c00'];
    const COUNT = 180;

    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5 - canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 5 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      alpha: 1,
      decay: Math.random() * 0.008 + 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles.current) {
        if (p.alpha <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;
        p.vx *= 0.99;
      }
      if (alive) rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return canvasRef;
}

export default function WinnerModal({ winnerName, winnerColor = '#ffcc00', onRestart }) {
  const canvasRef = useConfetti(true);

  return (
    <>
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 210 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 200, background: 'rgba(0,0,0,0.82)' }}
      >
        {/* Big radial light burst behind modal */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(ellipse at center, #ffcc00 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
          className="relative text-center px-10 py-12 rounded-lg mx-4 max-w-lg w-full"
          style={{
            background: 'linear-gradient(160deg, rgba(5,4,15,0.99) 0%, rgba(20,16,0,0.98) 100%)',
            border: '3px solid #ffcc00',
            animation: 'winnerBgPulse 2s infinite alternate',
            zIndex: 5,
          }}
        >
          {/* Top gold bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-lg" style={{ background: 'linear-gradient(90deg, transparent, #ffcc00, transparent)' }} />

          {/* Trophy */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            className="text-7xl mb-4 leading-none"
          >
            🏆
          </motion.div>

          {/* Winner label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-bebas text-2xl tracking-widest text-white/50 uppercase mb-1"
          >
            ¡Ganador!
          </motion.div>

          {/* Winner name */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 250 }}
            className="font-smash uppercase mb-2"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              color: '#ffcc00',
              animation: 'winnerBlink 1.5s infinite',
              letterSpacing: '4px',
            }}
          >
            {winnerName}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-bebas text-xl tracking-widest text-white/40 uppercase mb-8"
          >
            gana el Gun Game
          </motion.p>

          {/* Decorative line */}
          <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,204,0,0.5), transparent)' }} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <SmashButton onClick={onRestart} size="large" variant="gold">
              REINICIAR
            </SmashButton>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}