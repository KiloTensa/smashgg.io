import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import SmashButton from './SmashButton';

function useConfetti(active) {
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9D65C9', '#3BB9FF', '#FFFFFF', '#FF8C00'];
    const COUNT = 220;

    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * 4 + 3,
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.45 ? 'rect' : 'circle',
      alpha: 1,
      decay: Math.random() * 0.01 + 0.006,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticle = false;

      for (const particle of particles.current) {
        if (particle.alpha <= 0) continue;
        activeParticle = true;

        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);

        if (particle.shape === 'rect') {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.16;
        particle.rotation += particle.rotSpeed;
        particle.vx *= 0.98;
        particle.alpha -= particle.decay;
      }

      if (activeParticle) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return canvasRef;
}

export default function WinnerModal({ winnerName, winnerColor = '#ffd700', onRestart }) {
  const canvasRef = useConfetti(true);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const trophyRef = useRef(null);
  const winnerRef = useRef(null);
  const buttonRef = useRef(null);
  const burstRef = useRef(null);
  const ringRef = useRef(null);
  const sparkRefs = useRef([]);
  sparkRefs.current = [];

  const setSparkRef = (element) => {
    if (element && !sparkRefs.current.includes(element)) {
      sparkRefs.current.push(element);
    }
  };

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    const intro = anime.timeline({ easing: 'easeOutExpo' });

    intro
      .add({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 260,
      }, 0)
      .add({
        targets: burstRef.current,
        scale: [0.5, 1.18],
        opacity: [0, 0.55, 0],
        duration: 1100,
        easing: 'easeOutQuad',
      }, 0)
      .add({
        targets: ringRef.current,
        scale: [0.7, 1],
        opacity: [0, 1],
        duration: 730,
        easing: 'easeOutBack',
      }, 80)
      .add({
        targets: modalRef.current,
        opacity: [0, 1],
        scale: [0.72, 1.02, 1],
        rotateY: ['20deg', '0deg'],
        duration: 840,
      }, 0)
      .add({
        targets: trophyRef.current,
        translateY: [52, 0],
        rotate: ['-90deg', '18deg', '0deg'],
        scale: [0.44, 1.14, 1],
        opacity: [0, 1],
        duration: 920,
        elasticity: 700,
      }, '-=640')
      .add({
        targets: winnerRef.current,
        translateY: [24, 0],
        opacity: [0, 1],
        letterSpacing: ['0.95em', '0.14em'],
        duration: 740,
        easing: 'easeOutQuart',
      }, '-=520')
      .add({
        targets: buttonRef.current,
        opacity: [0, 1],
        translateY: [22, 0],
        scale: [0.92, 1],
        duration: 620,
        easing: 'easeOutBack',
      }, '-=360')
      .add({
        targets: sparkRefs.current,
        opacity: [0, 1, 0],
        scale: [0.4, 1.05, 0.8],
        translateY: [-26, 0, -10],
        duration: 950,
        delay: anime.stagger(80),
        easing: 'easeOutSine',
      }, '-=800');

    const spin = anime({
      targets: ringRef.current,
      rotate: '1turn',
      duration: 14000,
      easing: 'linear',
      loop: true,
    });

    return () => {
      intro.pause();
      spin.pause();
      anime.remove([
        overlayRef.current,
        modalRef.current,
        trophyRef.current,
        winnerRef.current,
        buttonRef.current,
        burstRef.current,
        ringRef.current,
        ...sparkRefs.current,
      ]);
    };
  }, [winnerColor]);

  useEffect(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const burst = burstRef.current;
    if (!modal || !overlay) return;

    // OPTIMIZADO: Mutación directa de estilos sin instanciar Anime.js en bucle masivo
    const handleMove = (event) => {
      const rect = modal.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

      modal.style.transform = `perspective(1400px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateX(${x * 6}px) translateY(${y * 4}px)`;
      if (burst) {
        burst.style.transform = `translateX(calc(-50% + ${x * 40}px)) translateY(${y * 30}px)`;
      }
      overlay.style.backgroundPosition = `${50 + x * 8}% ${45 + y * 6}%`;
    };

    const reset = () => {
      modal.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg) translateX(0px) translateY(0px)';
      if (burst) {
        burst.style.transform = 'translateX(-50%) translateY(0px)';
      }
      overlay.style.backgroundPosition = '50% 45%';
    };

    modal.addEventListener('mousemove', handleMove);
    modal.addEventListener('mouseleave', reset);

    return () => {
      modal.removeEventListener('mousemove', handleMove);
      modal.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 210 }}
      />

      <div
        ref={overlayRef}
        className="fixed inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          zIndex: 200,
          opacity: 0,
          background: 'radial-gradient(circle at top, rgba(255,210,80,0.08), transparent 28%), radial-gradient(circle at 35% 22%, rgba(255,255,255,0.08), transparent 22%), rgba(6,5,18,0.92)',
          backgroundSize: '240% 240%',
          backgroundPosition: '50% 45%',
        }}
      >
        <div
          ref={burstRef}
          className="absolute pointer-events-none transition-transform duration-300 ease-out"
          style={{
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '760px',
            height: '760px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(255,205,40,0.24), rgba(255,205,40,0.04) 40%, transparent 70%)',
            opacity: 0,
            filter: 'blur(20px)',
          }}
        />

        <div
          ref={ringRef}
          className="absolute pointer-events-none"
          style={{
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            border: `1px solid ${winnerColor}33`,
            boxShadow: `0 0 120px ${winnerColor}1a`,
            opacity: 0,
          }}
        />

        <div
          ref={modalRef}
          className="relative text-center px-10 py-12 rounded-[32px] mx-4 max-w-xl w-full transition-transform duration-300 ease-out"
          style={{
            background: 'linear-gradient(160deg, rgba(6,5,18,0.98) 0%, rgba(21,17,33,0.98) 100%)',
            border: '1px solid rgba(255,205,40,0.25)',
            boxShadow: '0 32px 140px rgba(0,0,0,0.42)',
            transformStyle: 'preserve-3d',
            perspective: '1400px',
            backdropFilter: 'blur(18px)',
            opacity: 0,
          }}
        >
          <div
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.09), transparent 22%), radial-gradient(circle at 20% 20%, rgba(255,205,40,0.07), transparent 14%)',
              mixBlendMode: 'screen',
            }}
          />

          <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[32px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,205,40,0.88), transparent)' }} />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[0.72rem] tracking-[0.24em] uppercase text-white/70 bg-white/5 border border-white/10">
                Victoria
              </span>
            </div>

            <div
              ref={trophyRef}
              className="text-[5.5rem] mb-4 leading-none relative"
              style={{
                opacity: 0,
                color: winnerColor,
                textShadow: '0 0 26px rgba(255, 201, 56, 0.28)',
              }}
            >
              <span className="inline-flex items-center justify-center">🏆</span>
            </div>

            <div className="relative z-10 w-full">
              <div className="font-bebas text-[1.05rem] tracking-[0.35em] text-white/60 uppercase mb-2">
                ¡Ganador!
              </div>

              <h2
                ref={winnerRef}
                className="font-smash uppercase mb-2"
                style={{
                  fontSize: 'clamp(3rem, 7vw, 4.8rem)',
                  color: '#ffdc6f',
                  textShadow: '0 0 32px rgba(255,215,96,0.3)',
                  opacity: 0,
                  letterSpacing: '0.12em',
                }}
              >
                {winnerName}
              </h2>

              <p className="font-bebas text-lg tracking-[0.22em] text-white/40 uppercase mb-8">
                domina el campo de batalla
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <span
                  key={index}
                  ref={setSparkRef}
                  className="block rounded-full bg-white/80"
                  style={{ width: 12, height: 12, opacity: 0, transform: 'translateY(-4px)' }}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,205,40,0.4), transparent)' }} />

          <div ref={buttonRef} className="relative z-10 opacity-0">
            <SmashButton onClick={onRestart} size="large" variant="gold">
              REINICIAR
            </SmashButton>
          </div>
        </div>
      </div>
    </>
  );
}