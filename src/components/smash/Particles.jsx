import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const CONFIG = [
      { color: 'rgba(59,185,255,0.7)',  shadow: '0 0 8px 2px rgba(59,185,255,0.6)',  size: [2, 4]  },
      { color: 'rgba(255,204,0,0.65)',  shadow: '0 0 8px 2px rgba(255,204,0,0.5)',   size: [1, 3]  },
      { color: 'rgba(255,255,255,0.5)', shadow: '0 0 5px 1px rgba(255,255,255,0.4)', size: [1, 2.5] },
      { color: 'rgba(160,80,255,0.6)',  shadow: '0 0 8px 2px rgba(160,80,255,0.5)', size: [1, 3]  },
    ];

    const frags = [];
    for (let i = 0; i < 60; i++) {
      const cfg = CONFIG[Math.floor(Math.random() * CONFIG.length)];
      const size = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
      const p = document.createElement('div');
      Object.assign(p.style, {
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${80 + Math.random() * 20}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: cfg.color,
        borderRadius: '50%',
        opacity: '0',
        boxShadow: cfg.shadow,
        animation: `particleFloat ${14 + Math.random() * 18}s ${Math.random() * 12}s infinite linear`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      });
      container.appendChild(p);
      frags.push(p);
    }

    // Static star layer
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      const sz = Math.random() * 1.5 + 0.5;
      Object.assign(s.style, {
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${sz}px`,
        height: `${sz}px`,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: `twinkle ${3 + Math.random() * 5}s ${Math.random() * 5}s infinite alternate`,
        pointerEvents: 'none',
      });
      container.appendChild(s);
      frags.push(s);
    }

    return () => { frags.forEach(f => f.remove()); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
}