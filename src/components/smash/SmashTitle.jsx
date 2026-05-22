export default function SmashTitle({ children, className = '', subtitle = '' }) {
  return (
    <div className={`flex flex-col items-center mb-8 md:mb-10 ${className}`}>
      <h1
        className="font-smash text-white text-center uppercase"
        style={{
          fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
          letterSpacing: '5px',
          textShadow:
            '0 0 20px rgba(59,185,255,0.9), 0 0 40px rgba(59,185,255,0.4), 0 4px 0 #000, 0 6px 12px rgba(0,0,0,0.9)',
          animation: 'slideUp 0.5s ease-out both',
        }}
      >
        {children}
      </h1>
      <div
        className="mt-2 h-[3px] rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #3bb9ff, #ffcc00, #3bb9ff, transparent)',
          animation: 'lineExpand 0.6s 0.3s ease-out both',
          width: '80%',
          maxWidth: '500px',
        }}
      />
      {subtitle && (
        <p className="font-bebas text-white/60 text-lg tracking-widest mt-1 uppercase">{subtitle}</p>
      )}
    </div>
  );
}