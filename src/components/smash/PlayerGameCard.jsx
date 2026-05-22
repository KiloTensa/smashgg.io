import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmashButton from './SmashButton';
import smashCharacters from '@/lib/smashCharacters';

export default function PlayerGameCard({ player, playerIndex, onWinRound, onUndoRound }) {
  const [winFlash, setWinFlash] = useState(false);
  const [floatingText, setFloatingText] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimeRemaining, setUndoTimeRemaining] = useState(5);
  const [isKO, setIsKO] = useState(false);

  useEffect(() => {
    if (!showUndo) return;

    const interval = setInterval(() => {
      setUndoTimeRemaining(prev => {
        if (prev <= 1) {
          setShowUndo(false);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showUndo]);

  const currentCharIndex = player.currentCharIndex;
  const charData = smashCharacters[player.characters[currentCharIndex]];
  const totalChars = player.characters.length;
  const progress = currentCharIndex / totalChars;
  const isLastCharacter = currentCharIndex === totalChars - 1;

  if (!charData) return null;

  const handleWin = () => {
    setIsKO(true);
    setWinFlash(true);
    setFloatingText(`+1`);
    setUndoTimeRemaining(5);
    setShowUndo(true);
    setTimeout(() => setWinFlash(false), 400);
    setTimeout(() => setFloatingText(null), 700);
    setTimeout(() => setIsKO(false), 600);
    onWinRound(playerIndex);
  };

  const handleUndo = () => {
    setShowUndo(false);
    setUndoTimeRemaining(5);
    onUndoRound(playerIndex);
  };

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 30 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: 0,
        x: isKO ? [0, -12, 12, -8, 8, 0] : 0
      }}
      transition={{ 
        delay: playerIndex * 0.1, 
        type: 'spring', 
        stiffness: 200, 
        damping: 18,
        x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
      }}
      className="relative flex flex-col items-center rounded-lg overflow-hidden select-none"
      style={{
        minWidth: '220px',
        maxWidth: '280px',
        width: '100%',
        background: `linear-gradient(170deg, rgba(0,0,0,0.92) 0%, ${player.color}18 100%)`,
        border: isLastCharacter ? `3px solid #ff1a1a` : `2px solid ${player.color}`,
        boxShadow: isLastCharacter 
          ? `0 0 40px #ff0000aa, inset 0 0 25px #ff000044` 
          : `0 0 25px ${player.color}55, 0 0 60px ${player.color}22, inset 0 0 15px ${player.color}11`,
        animation: isLastCharacter ? 'lastStockPulse 1s infinite alternate' : 'none'
      }}
    >
      <style>{`
        @keyframes lastStockPulse {
          from { border-color: #ff1a1a; box-shadow: 0 0 40px #ff0000aa; }
          to { border-color: #ffffff; box-shadow: 0 0 60px #ff0000ee; }
        }
      `}</style>

      {/* Top color bar */}
      <div className="w-full h-1.5" style={{ background: `linear-gradient(90deg, transparent, ${player.color}, transparent)` }} />

      <AnimatePresence>
        {winFlash && (
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none z-20"
            style={{ background: `radial-gradient(ellipse at center, ${player.color}cc 0%, ${player.color}44 60%, transparent 100%)` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {floatingText && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute top-8 left-1/2 -translate-x-1/2 font-smash text-3xl z-30 pointer-events-none"
            style={{ color: player.color, textShadow: `0 0 10px ${player.color}, 0 2px 0 #000` }}
          >
            {floatingText}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pt-3 pb-1 w-full text-center">
        <div
          className="font-smash text-2xl md:text-3xl uppercase tracking-wider break-words leading-none"
          style={{
            color: player.color,
            textShadow: `0 0 12px ${player.color}88, 0 2px 0 #000`,
          }}
        >
          {player.name}
        </div>
      </div>

      <div className="w-full px-4 mb-2">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(progress) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${player.color}88, ${player.color})` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {player.characters.map((cIdx, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm transition-all duration-300"
              style={{
                background: i < currentCharIndex ? player.color : i === currentCharIndex ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
                boxShadow: i < currentCharIndex ? `0 0 6px ${player.color}` : 'none',
                animation: i < currentCharIndex ? `pipPop 0.3s ${i * 0.05}s both` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-40 h-40 md:w-48 md:h-48 flex items-center justify-center overflow-hidden z-10 my-2 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={charData.name}
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              scale: 2.2, 
              opacity: 0, 
              rotate: 15,
              filter: `brightness(3) drop-shadow(0 0 20px ${player.color})` 
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25,
              exit: { duration: 0.25, ease: "easeIn" }
            }}
            src={charData.image}
            alt={charData.name}
            className="w-full h-full object-contain max-h-full max-w-full"
            style={{
              filter: `drop-shadow(0 0 8px ${player.color}88) drop-shadow(0 4px 8px rgba(0,0,0,0.9))`,
            }}
          />
        </AnimatePresence>

        {/* KO burst effects (Smash style) */}
        <AnimatePresence>
          {isKO && (
            <>
              {/* Shockwave Ring */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                className="absolute inset-0 rounded-full z-20 pointer-events-none"
                style={{ border: `6px solid ${player.color}`, boxShadow: `0 0 30px ${player.color}` }}
              />
              {/* KO Cross Effect */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 1 }}
                animate={{ scale: 2.5, rotate: 90, opacity: 0 }}
                className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
              >
                <div className="w-full h-1.5 bg-white absolute" style={{ boxShadow: `0 0 20px ${player.color}` }} />
                <div className="w-1.5 h-full bg-white absolute" style={{ boxShadow: `0 0 20px ${player.color}` }} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        key={charData.name + '-name'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="font-smash text-xl md:text-2xl uppercase tracking-wider px-2 text-center"
        style={{ textShadow: '0 2px 0 #000, 0 0 12px rgba(59,185,255,0.5)' }}
      >
        {charData.name}
      </motion.div>

      <div className="font-smash text-sm uppercase tracking-widest text-white/40 mb-3 mt-0.5">
        Ronda {currentCharIndex + 1} / {totalChars}
      </div>

      <div className="pb-4 flex flex-col items-center gap-3 w-full px-4">
        <SmashButton onClick={handleWin} size="small" variant="green" className="w-full">
          ✔ GANÓ RONDA
        </SmashButton>
        
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence>
            {showUndo && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={handleUndo}
                className="group relative flex items-center gap-2 px-4 py-1 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 font-smash text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-500/20 hover:border-red-500 active:scale-95"
                title={`Deshacer ronda (${undoTimeRemaining}s)`}
              >
                <span className="text-sm">↶</span>
                <span>DESHACER ({undoTimeRemaining}S)</span>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-red-500/20 overflow-hidden">
                  <motion.div 
                    key={`undo-timer-${playerIndex}`}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-red-500"
                  />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom color bar */}
      <div className="w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${player.color}66, transparent)` }} />
    </motion.div>
  );
}