import { useEffect, useRef, useCallback, useMemo } from 'react';
import anime from 'animejs/lib/anime.es.js';
import SmashButton from './SmashButton';

function useConfetti(active) {
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: true });
    ctxRef.current = ctx;
    let resizeTimeout;

    // Detectar dispositivo de baja potencia
    const isLowEnd = navigator.deviceMemory <= 2 || window.innerWidth < 768;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Usa escala DPI para evitar blurriness en alta densidad
      const dpi = window.devicePixelRatio || 1;
      if (dpi > 1) {
        canvas.style.transform = `scale(${1 / dpi})`;
        canvas.style.transformOrigin = '0 0';
      }
    };

    const handleResize = () => {
      if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(resize);
    };

    resize();
    window.addEventListener('resize', handleResize, { passive: true });

    const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9D65C9', '#3BB9FF', '#FFFFFF', '#FF8C00'];
    // Reducir partículas en móviles o dispositivos de baja memoria
    const COUNT = reduceMotion ? 0 : (isLowEnd ? 80 : 220);

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

    // Optimize drawing con batching
    const draw = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticle = false;

      const len = particles.current.length;
      // Batch particles by shape para reducir context switches
      const rects = [];
      const circles = [];

      for (let i = 0; i < len; i++) {
        const particle = particles.current[i];
        if (particle.alpha <= 0) continue;
        activeParticle = true;

        if (particle.shape === 'rect') {
          rects.push(particle);
        } else {
          circles.push(particle);
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.16;
        particle.rotation += particle.rotSpeed;
        particle.vx *= 0.98;
        particle.alpha -= particle.decay;
      }

      // Draw all rects
      rects.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.5);
        ctx.restore();
      });

      // Draw all circles
      circles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (activeParticle) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
      window.removeEventListener('resize', handleResize, { passive: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctxRef.current = null;
      particles.current = [];
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
  const shineRef = useRef(null);
  
  const sparkRefs = useRef([]);
  const isIntroFinished = useRef(false);
  const tickingRef = useRef(false);
  const animeInstancesRef = useRef({ timeline: null, pulse: null });

  const setSparkRef = useCallback((element) => {
    if (element && !sparkRefs.current.includes(element)) {
      sparkRefs.current.push(element);
    }
  }, []);

  const sparkArray = useMemo(() => 
    Array.from({ length: 8 }, (_, index) => index),
    []
  );
  const burstStyle = useMemo(() => ({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) translateZ(0)',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle at center, ${winnerColor} 0%, transparent 60%)`,
    opacity: 0,
    filter: 'blur(30px)',
    mixBlendMode: 'screen',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    contain: 'layout style paint',
  }), [winnerColor]);

  const ringStyle = useMemo(() => ({
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: `solid ${winnerColor}`,
    opacity: 0,
    willChange: 'transform, opacity, border-width',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    contain: 'layout style paint',
  }), [winnerColor]);

  const modalStyle = useMemo(() => ({
    background: 'linear-gradient(160deg, rgba(6,5,18,0.98) 0%, rgba(21,17,33,0.98) 100%)',
    border: `2px solid ${winnerColor}88`,
    boxShadow: `0 0 80px ${winnerColor}33, 0 32px 140px rgba(0,0,0,0.8)`,
    transformStyle: 'preserve-3d',
    perspective: '1400px',
    backdropFilter: 'blur(18px)',
    opacity: 0,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    contain: 'layout style paint',
  }), [winnerColor]);

  const topGradientStyle = useMemo(() => ({
    background: `linear-gradient(90deg, transparent, ${winnerColor}, transparent)`
  }), [winnerColor]);

  const badgeStyle = useMemo(() => ({
    color: winnerColor,
    backgroundColor: `${winnerColor}15`,
    border: `1px solid ${winnerColor}44`
  }), [winnerColor]);

  const trophyStyle = useMemo(() => ({
    opacity: 0,
    color: winnerColor,
    textShadow: `0 0 40px ${winnerColor}aa`,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    contain: 'layout style paint',
  }), [winnerColor]);

  const winnerNameStyle = useMemo(() => ({
    fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
    color: '#ffffff',
    textShadow: `0 0 20px ${winnerColor}, 0 0 40px ${winnerColor}`,
    opacity: 0,
    willChange: 'transform, filter, opacity',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    contain: 'layout style paint',
  }), [winnerColor]);

  const dividerStyle = useMemo(() => ({
    background: `linear-gradient(90deg, transparent, ${winnerColor}88, transparent)`
  }), [winnerColor]);

  const sparkStyle = useMemo(() => ({
    width: 8,
    height: 8,
    backgroundColor: winnerColor,
    opacity: 0,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
  }), [winnerColor]);

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    anime.remove([
      overlayRef.current, modalRef.current, trophyRef.current,
      winnerRef.current, buttonRef.current, burstRef.current,
      ringRef.current, shineRef.current, ...sparkRefs.current,
    ]);

    isIntroFinished.current = false;

    const victoryTimeline = anime.timeline({ autoplay: true });
    victoryTimeline
      .add({
        targets: overlayRef.current,
        opacity: [0, 1],
        backgroundColor: ['rgba(0,0,0,1)', 'rgba(6,5,18,0.92)'],
        backdropFilter: ['blur(0px)', 'blur(20px)'],
        duration: 400,
        easing: 'easeOutExpo',
      }, 0)
      .add({
        targets: modalRef.current,
        opacity: [0, 1],
        scale: [4, 1],
        translateY: [-400, 0],
        rotateZ: [-10, 0],
        duration: 450,
        easing: 'easeInCubic',
      }, 100)
      .add({
        targets: modalRef.current,
        translateX: [
          { value: 20, duration: 40 }, { value: -20, duration: 40 },
          { value: 15, duration: 40 }, { value: -15, duration: 40 },
          { value: 10, duration: 40 }, { value: -10, duration: 40 },
          { value: 0, duration: 50 }
        ],
        translateY: [
          { value: 15, duration: 40 }, { value: -15, duration: 40 },
          { value: 10, duration: 40 }, { value: -10, duration: 40 },
          { value: 0, duration: 50 }
        ],
        easing: 'easeInOutQuad',
      }, 550)
      .add({
        targets: burstRef.current,
        scale: [0, 4.5],
        opacity: [1, 0],
        duration: 800,
        easing: 'easeOutExpo',
      }, 550)
      .add({
        targets: ringRef.current,
        scale: [0, 3],
        opacity: [1, 0],
        borderWidth: ['20px', '1px'],
        duration: 700,
        easing: 'easeOutCirc',
      }, 550)
      .add({
        targets: shineRef.current,
        opacity: [0, 1, 0],
        backgroundPosition: ['-200% 0%', '200% 0%'],
        duration: 800,
        easing: 'easeOutQuad'
      }, 550)
      .add({
        targets: sparkRefs.current,
        opacity: [1, 0],
        scale: [0, 2.5],
        translateX: () => anime.random(-250, 250),
        translateY: () => anime.random(-150, 250),
        duration: 700,
        easing: 'easeOutExpo',
      }, 550)
      .add({
        targets: trophyRef.current,
        opacity: [0, 1],
        scale: [3, 1],
        rotate: ['-1080deg', '0deg'],
        duration: 900,
        easing: 'easeOutExpo',
      }, 700)
      .add({
        targets: winnerRef.current,
        opacity: [0, 1, 0.2, 1, 0, 1],
        scale: [1.2, 1],
        filter: ['brightness(4) blur(10px)', 'brightness(1) blur(0px)'],
        duration: 800,
        easing: 'steps(5)',
      }, 900)
      .add({
        targets: buttonRef.current,
        opacity: [0, 1],
        translateX: [150, 0],
        skewX: ['-35deg', '0deg'],
        duration: 600,
        easing: 'easeOutBack',
      }, 1200);
    const energyPulse = anime({
      targets: ringRef.current,
      scale: [1, 1.05],
      opacity: [0, 0.3],
      direction: 'alternate',
      loop: true,
      duration: 1500,
      easing: 'easeInOutSine',
      autoplay: false,
    });

    animeInstancesRef.current = { timeline: victoryTimeline, pulse: energyPulse };

    victoryTimeline.complete = () => {
      isIntroFinished.current = true;
      energyPulse.play();
      if (shineRef.current) shineRef.current.style.opacity = '1';
    };

    return () => {
      victoryTimeline.pause();
      energyPulse.pause();
      animeInstancesRef.current = { timeline: null, pulse: null };
    };
  }, [winnerColor]);

  useEffect(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const burst = burstRef.current;
    const shine = shineRef.current;
    if (!modal || !overlay) return;

    let throttleTimer = null;
    let lastX = 0;
    let lastY = 0;

    const handleMove = (event) => {
      if (!isIntroFinished.current || throttleTimer) return;

      lastX = event.clientX;
      lastY = event.clientY;

      throttleTimer = requestAnimationFrame(() => {
        const rect = modal.getBoundingClientRect();
        const x = (lastX - rect.left - rect.width / 2) / rect.width;
        const y = (lastY - rect.top - rect.height / 2) / rect.height;

        // Use translateZ for GPU acceleration
        modal.style.transform = `perspective(1400px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateX(${x * 8}px) translateY(${y * 5}px) translateZ(0)`;
        
        if (burst) {
          burst.style.transform = `translateX(calc(-50% + ${x * 40}px)) translateY(${y * 30}px) translateZ(0)`;
        }
        
        if (shine) {
          const percentagePosition = 50 + (x * 120);
          shine.style.backgroundPosition = `${percentagePosition}% 50%`;
        }

        overlay.style.backgroundPosition = `${50 + x * 10}% ${45 + y * 8}%`;
        throttleTimer = null;
      });
    };

    const reset = () => {
      if (!isIntroFinished.current) return;
      modal.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg) translateX(0px) translateY(0px) translateZ(0)';
      if (burst) {
        burst.style.transform = 'translateX(-50%) translateY(0px) translateZ(0)';
      }
      if (shine) {
        shine.style.backgroundPosition = '50% 50%';
      }
      overlay.style.backgroundPosition = '50% 45%';
    };

    modal.addEventListener('mousemove', handleMove, { passive: true });
    modal.addEventListener('mouseleave', reset, { passive: true });

    return () => {
      if (throttleTimer) cancelAnimationFrame(throttleTimer);
      modal.removeEventListener('mousemove', handleMove);
      modal.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none" 
        style={{ 
          zIndex: 210,
          contain: 'layout style paint',
          backfaceVisibility: 'hidden',
        }} 
      />

      <div
        ref={overlayRef}
        className="fixed inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          zIndex: 200,
          opacity: 0,
          backgroundSize: '240% 240%',
          backgroundPosition: '50% 45%',
          willChange: 'backdrop-filter, opacity, background-color',
          contain: 'layout style paint',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          ref={burstRef}
          className="absolute pointer-events-none"
          style={burstStyle}
        />

        <div
          ref={ringRef}
          className="absolute pointer-events-none"
          style={ringStyle}
        />

        {/* CONTENEDOR PRINCIPAL */}
        <div
          ref={modalRef}
          className="relative text-center px-10 py-12 rounded-[32px] mx-4 max-w-xl w-full overflow-hidden"
          style={modalStyle}
        >
          <div
            ref={shineRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.0) 43%, rgba(255, 255, 255, 0.28) 49%, rgba(255, 255, 255, 0.73) 50%, rgba(255, 255, 255, 0.28) 51%, rgba(255, 255, 255, 0.0) 57%, transparent 65%)',
              backgroundSize: '280% 100%',
              backgroundPosition: '-200% 0%',
              mixBlendMode: 'overlay',
              zIndex: 5,
              opacity: 0,
              willChange: 'background-position, opacity',
              contain: 'layout style paint',
              backfaceVisibility: 'hidden',
            }}
          />

          <div className="absolute inset-x-0 top-0 h-2 rounded-t-[32px]" style={topGradientStyle} />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-4 py-1 rounded-full text-[0.8rem] font-bold tracking-[0.3em] uppercase" style={badgeStyle}>
                VICTORIA ABSOLUTA
              </span>
            </div>

            <div
              ref={trophyRef}
              className="text-[6rem] mb-4 leading-none relative"
              style={trophyStyle}
            >
              <span className="inline-flex items-center justify-center">🏆</span>
            </div>

            <div className="relative z-10 w-full">
              <h2
                ref={winnerRef}
                className="font-smash uppercase mb-2"
                style={winnerNameStyle}
              >
                {winnerName}
              </h2>

              <p className="font-bebas text-xl tracking-[0.3em] text-white/50 uppercase mb-8">
                Ha reclamado la gloria
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="absolute top-1/2 left-1/2">
              {sparkArray.map((index) => (
                <span
                  key={index}
                  ref={setSparkRef}
                  className="absolute rounded-full"
                  style={sparkStyle}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-px mb-8" style={dividerStyle} />

          <div ref={buttonRef} className="relative z-10 opacity-0" style={{ willChange: 'transform, opacity', contain: 'layout style paint', backfaceVisibility: 'hidden' }}>
            <SmashButton onClick={onRestart} size="large" variant="gold">
              NUEVO COMBATE
            </SmashButton>
          </div>
        </div>
      </div>
    </>
  );
}