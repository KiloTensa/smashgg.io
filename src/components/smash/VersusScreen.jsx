import { useEffect } from 'react';
import { motion } from 'framer-motion';
import smashCharacters from '@/lib/smashCharacters';

export default function VersusScreen({ players, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-7xl flex flex-wrap justify-center items-center gap-2 md:gap-8 px-4">
        
        <motion.div 
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span className="font-smash text-[50vw] text-white italic leading-none">VS</span>
        </motion.div>

        {players.map((player, i) => {
          const charIndex = player.characters[0];
          const charData = typeof charIndex === 'number' ? smashCharacters[charIndex] : null;
          const isLeft = i < players.length / 2;
          
          if (!charData) return null;

          return (
            <motion.div
              key={i}
              initial={{ 
                x: isLeft ? -800 : 800, 
                opacity: 0, 
                skewX: isLeft ? -15 : 15 
              }}
              animate={{ x: 0, opacity: 1, skewX: 0 }}
              transition={{ 
                delay: i * 0.1, 
                type: 'spring', 
                stiffness: 80, 
                damping: 15 
              }}
              className="relative flex flex-col items-center z-10"
              style={{ width: players.length > 2 ? '40%' : '45%' }}
            >
              <div 
                className="absolute inset-0 rounded-full blur-[100px] opacity-20"
                style={{ backgroundColor: player.color }}
              />

              <div className="relative h-60 md:h-[500px] w-full flex items-center justify-center">
                <motion.img
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1), duration: 0.6, ease: "easeOut" }}
                  src={charData.image}
                  alt={charData.name}
                  className="h-[85%] object-contain z-10"
                  style={{ 
                    filter: `drop-shadow(0 0 30px ${player.color}88)`,
                    transformOrigin: 'bottom center'
                  }}
                />
              </div>

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + (i * 0.1) }}
                className="text-center mt-2 md:mt-6 bg-black/40 p-3 rounded-lg backdrop-blur-md border-b-4"
                style={{ borderBottomColor: player.color }}
              >
                <div className="font-smash text-xl md:text-5xl text-white uppercase italic tracking-tighter">{player.name}</div>
                <div className="font-smash text-xs md:text-sm text-white/50 tracking-[0.4em] uppercase mt-1">
                  {charData.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 12 }}
        className="absolute z-50 pointer-events-none"
      >
        <div className="bg-white text-black font-smash text-4xl md:text-8xl px-6 md:px-12 py-2 md:py-4 italic -skew-x-12 border-8 border-black shadow-[0_0_50px_rgba(255,255,255,0.5)]">
          VS
        </div>
      </motion.div>
    </div>
  );
}