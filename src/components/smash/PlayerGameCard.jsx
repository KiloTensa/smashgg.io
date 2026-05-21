import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmashButton from './SmashButton';
import smashCharacters from '@/lib/smashCharacters';

export default function PlayerGameCard({ player, playerIndex, onWinRound }) {
  const [winFlash, setWinFlash] = useState(false);
  const [floatingText, setFloatingText] = useState(null);

  const currentCharIndex = player.currentCharIndex;
  const charData = smashCharacters[player.characters[currentCharIndex]];
  const totalChars = player.characters.length;
  const progress = currentCharIndex / totalChars;

  if (!charData) return null;

  const handleWin = () => {
    setWinFlash(true);
    setFloatingText(`+1`);
    setTimeout(() => setWinFlash(false), 400);
    setTimeout(() => setFloatingText(null), 700);
    onWinRound(playerIndex);
  };

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: playerIndex * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
      className="relative flex flex-col items-center rounded-lg overflow-hidden select-none"
      style={{
        minWidth: '220px',
        maxWidth: '280px',
        width: '100%',
        background: `linear-gradient(170deg, rgba(0,0,0,0.92) 0%, ${player.color}18 100%)`,
        border: `2px solid ${player.color}`,
        boxShadow: `0 0 25px ${player.color}55, 0 0 60px ${player.color}22, inset 0 0 15px ${player.color}11`,
      }}
    >
      {/* Top color bar */}
      <div className="w-full h-1.5" style={{ background: `linear-gradient(90deg, transparent, ${player.color}, transparent)` }} />

      {/* Win flash overlay */}
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

      {/* Floating +1 */}
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

      {/* Player name */}
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

      {/* Progress bar */}
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

      {/* Character art */}
      <motion.img
        key={charData.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        src={charData.image}
        loading="eager"
        alt={charData.name}
        className="w-36 md:w-44 h-auto"
        style={{
          filter: `drop-shadow(0 0 8px ${player.color}88) drop-shadow(0 4px 8px rgba(0,0,0,0.9))`,
          zIndex: 2,
        }}
      />

      {/* Character name */}
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

      {/* Round counter */}
      <div className="font-smash text-sm uppercase tracking-widest text-white/40 mb-3 mt-0.5">
        Ronda {currentCharIndex + 1} / {totalChars}
      </div>

      {/* Win button */}
      <div className="pb-4">
        <SmashButton onClick={handleWin} size="small" variant="green">
          ✔ GANÓ RONDA
        </SmashButton>
      </div>

      {/* Bottom color bar */}
      <div className="w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${player.color}66, transparent)` }} />
    </motion.div>
  );
}