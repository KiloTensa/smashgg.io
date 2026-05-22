import { useState, useEffect, memo } from 'react';

function CharacterCard({ character, index, dots, onClick }) {
  const isSelected = dots && dots.length > 0;
  const [flash, setFlash] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    setFlash(true);
    onClick();
  };


  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const primaryColor = isSelected ? dots[0].color : null;

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center justify-end p-2 cursor-pointer select-none overflow-hidden transition-all duration-200 hover:scale-[1.07] hover:z-20 active:scale-[0.94]"
      style={{
        minHeight: '145px',
        borderRadius: '6px',
        background: isSelected
          ? `linear-gradient(160deg, rgba(0,0,0,0.85) 0%, ${primaryColor}22 100%)`
          : 'linear-gradient(160deg, rgba(18,16,36,0.92) 0%, rgba(10,8,22,0.95) 100%)',
        border: isSelected
          ? `2px solid ${primaryColor}`
          : '2px solid rgba(255,255,255,0.12)',
        boxShadow: isSelected
          ? `0 0 18px ${primaryColor}99, 0 0 6px ${primaryColor}55, inset 0 0 12px ${primaryColor}22`
          : '0 2px 8px rgba(0,0,0,0.6)',
        animation: 'smashCardEnter 0.22s ease-out forwards',
        animationDelay: `${index * 3}ms`,
        opacity: 0,
      }}
    >
      {isSelected && (
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t"
          style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}
        />
      )}

      {isSelected && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 5 }}>
          {dots.map((dot, i) => (
            <span
              key={i}
              className="block w-3 h-3 rounded-full border border-black/40"
              style={{
                backgroundColor: dot.color,
                boxShadow: `0 0 6px 2px ${dot.color}`,
                animation: `pulseGlow 1.2s ${i * 0.2}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {flash && (
        <div
          className="absolute inset-0 rounded pointer-events-none bg-white"
          style={{
            zIndex: 10,
            animation: 'smashCardFlash 0.3s ease-out forwards',
          }}
        />
      )}

<img
  src={character.image}
  alt={character.name}
  className={`w-20 h-auto mb-1 relative transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
  style={{
    filter: isSelected
      ? `drop-shadow(0 0 6px ${primaryColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.9))`
      : 'drop-shadow(0 2px 6px rgba(0,0,0,0.8)) brightness(0.9)',
    transition: 'filter 0.2s',
    zIndex: 2,
  }}
  decoding="async"
  onLoad={() => setIsLoaded(true)}
/>
      <div
        className="text-center font-smash text-xs uppercase tracking-wide w-full"
        style={{
          color: isSelected ? primaryColor : 'rgba(255,255,255,0.85)',
          textShadow: '0 1px 4px rgba(0,0,0,1)',
          zIndex: 2,
          lineHeight: 1.2,
        }}
      >
        {character.name}
      </div>
    </div>
  );
}

export default memo(CharacterCard);