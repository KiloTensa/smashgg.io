export default function SmashButton({ children, onClick, className = '', size = 'normal', type = 'button', variant = 'blue', disabled = false }) {
  const sizeClasses = size === 'small'
    ? 'text-base md:text-lg px-6 py-2'
    : size === 'large'
    ? 'text-3xl md:text-4xl px-14 py-4'
    : 'text-xl md:text-2xl px-10 py-3';

  const colors = {
    blue:  {
      border: '#3bb9ff',
      glow: 'rgba(59,185,255,0.55)',
      glowHover: 'rgba(59,185,255,1)',
      topLine: 'rgba(59,185,255,0.9)',
      bgFrom: '#0e1f33',
      bgTo: '#06111e',
      shine: 'rgba(59,185,255,0.25)',
    },
    gold:  {
      border: '#ffcc00',
      glow: 'rgba(255,204,0,0.5)',
      glowHover: 'rgba(255,204,0,0.95)',
      topLine: 'rgba(255,230,80,0.95)',
      bgFrom: '#2a1f00',
      bgTo: '#140f00',
      shine: 'rgba(255,230,80,0.3)',
    },
    red:   {
      border: '#ff4040',
      glow: 'rgba(255,64,64,0.5)',
      glowHover: 'rgba(255,64,64,0.95)',
      topLine: 'rgba(255,100,80,0.9)',
      bgFrom: '#2a0808',
      bgTo: '#160404',
      shine: 'rgba(255,80,80,0.25)',
    },
    green: {
      border: '#3ce878',
      glow: 'rgba(60,232,120,0.5)',
      glowHover: 'rgba(60,232,120,0.95)',
      topLine: 'rgba(100,255,160,0.9)',
      bgFrom: '#082a14',
      bgTo: '#041508',
      shine: 'rgba(60,232,120,0.25)',
    },
  };
  const c = colors[variant] || colors.blue;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden font-smash uppercase tracking-widest
        cursor-pointer select-none
        transition-all duration-150 ease-out active:scale-95
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${sizeClasses} ${className}
      `}
      style={{
        // Smash-style: sharp bottom-right & top-left corners, beveled edges
        background: `linear-gradient(170deg, ${c.bgFrom} 0%, ${c.bgTo} 100%)`,
        color: '#ffffff',
        letterSpacing: '3px',
        // Multi-layer border: outer dark frame + colored inner glow border
        outline: `2px solid rgba(0,0,0,0.9)`,
        outlineOffset: '0px',
        border: `2px solid ${c.border}`,
        borderRadius: '3px',
        boxShadow: [
          `0 0 0 1px rgba(0,0,0,0.8)`,
          `0 0 18px ${c.glow}`,
          `0 4px 16px rgba(0,0,0,0.7)`,
          `inset 0 1px 0 ${c.topLine}`,
          `inset 0 -2px 0 rgba(0,0,0,0.6)`,
          `inset 1px 0 0 rgba(255,255,255,0.07)`,
          `inset -1px 0 0 rgba(0,0,0,0.4)`,
        ].join(', '),
        textShadow: `0 0 12px ${c.glow}, 0 2px 0 rgba(0,0,0,0.9)`,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'scale(1.07) translateY(-2px)';
        e.currentTarget.style.boxShadow = [
          `0 0 0 1px rgba(0,0,0,0.8)`,
          `0 0 32px ${c.glowHover}`,
          `0 8px 24px rgba(0,0,0,0.7)`,
          `inset 0 1px 0 rgba(255,255,255,0.55)`,
          `inset 0 -2px 0 rgba(0,0,0,0.6)`,
          `inset 1px 0 0 rgba(255,255,255,0.12)`,
          `inset -1px 0 0 rgba(0,0,0,0.4)`,
        ].join(', ');
        e.currentTarget.style.background = `linear-gradient(170deg, #3a3a55 0%, ${c.bgFrom} 50%, ${c.bgTo} 100%)`;
        const shine = e.currentTarget.querySelector('.shine-effect');
        if (shine) shine.style.animation = 'shineSweep 0.5s ease forwards';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = [
          `0 0 0 1px rgba(0,0,0,0.8)`,
          `0 0 18px ${c.glow}`,
          `0 4px 16px rgba(0,0,0,0.7)`,
          `inset 0 1px 0 ${c.topLine}`,
          `inset 0 -2px 0 rgba(0,0,0,0.6)`,
          `inset 1px 0 0 rgba(255,255,255,0.07)`,
          `inset -1px 0 0 rgba(0,0,0,0.4)`,
        ].join(', ');
        e.currentTarget.style.background = `linear-gradient(170deg, ${c.bgFrom} 0%, ${c.bgTo} 100%)`;
        const shine = e.currentTarget.querySelector('.shine-effect');
        if (shine) shine.style.animation = 'none';
      }}
    >
      {/* Top highlight streak */}
      <span
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent 5%, ${c.topLine} 40%, rgba(255,255,255,0.6) 50%, ${c.topLine} 60%, transparent 95%)`,
        }}
      />
      {/* Diagonal shine sweep on hover */}
      <span
        className="shine-effect absolute top-0 h-full w-1/2 pointer-events-none"
        style={{
          left: '-100%',
          background: `linear-gradient(90deg, transparent, ${c.shine}, transparent)`,
          transform: 'skewX(-18deg)',
        }}
      />
      {/* Bottom shadow line */}
      <span
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.7), transparent)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}