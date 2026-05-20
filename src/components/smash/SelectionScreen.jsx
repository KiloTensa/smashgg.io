import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmashTitle from './SmashTitle';
import SmashButton from './SmashButton';
import CharacterCard from './CharacterCard';
import smashCharacters from '@/lib/smashCharacters';

export default function SelectionScreen({ gameState, onUpdateState, onReady, onBack }) {
  const { players, currentSelectionPlayer, charactersPerPlayer, listMode, playerCount } = gameState;
  const [, forceRender] = useState(0);

  const isComplete = currentSelectionPlayer >= playerCount;
  const currentPlayer = !isComplete ? players[currentSelectionPlayer] : null;
  const selectedCount = currentPlayer?.characters?.length || 0;

  const getDotsForChar = useCallback((charIndex) => {
    const dots = [];
    players.forEach((player, pIdx) => {
      if (player.characters.includes(charIndex)) {
        dots.push({ color: player.color, playerIndex: pIdx });
      }
    });
    return dots;
  }, [players]);

  const handleCharClick = (charIndex) => {
    if (isComplete || !currentPlayer) return;
    if (listMode === 'shared' && currentSelectionPlayer > 0) return;

    const newState = JSON.parse(JSON.stringify(gameState));
    const cp = newState.players[newState.currentSelectionPlayer];
    const idx = cp.characters.indexOf(charIndex);

    if (idx !== -1) {
      cp.characters.splice(idx, 1);
    } else {
      if (cp.characters.length >= newState.charactersPerPlayer) return;
      cp.characters.push(charIndex);

      if (cp.characters.length >= newState.charactersPerPlayer) {
        if (newState.listMode === 'shared' && newState.currentSelectionPlayer === 0) {
          const masterList = [...cp.characters];
          newState.players.forEach(p => { p.characters = [...masterList]; });
          newState.currentSelectionPlayer = newState.playerCount;
        } else {
          newState.currentSelectionPlayer++;
        }
      }
    }

    onUpdateState(newState);
    forceRender(v => v + 1);
  };

  const handleColorChange = (e) => {
    if (isComplete) return;
    const newState = JSON.parse(JSON.stringify(gameState));
    newState.players[newState.currentSelectionPlayer].color = e.target.value;
    onUpdateState(newState);
    forceRender(v => v + 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <SmashTitle subtitle="Elige tu roster">SELECCIÓN DE PERSONAJES</SmashTitle>

      {/* Status bar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isComplete ? 'complete' : currentSelectionPlayer}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-4 mb-4 px-6 py-3 rounded"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(10,8,22,0.9) 100%)',
            border: `2px solid ${isComplete ? '#ffcc00' : (currentPlayer?.color || '#3bb9ff')}`,
            boxShadow: `0 0 16px ${isComplete ? 'rgba(255,204,0,0.4)' : (currentPlayer?.color + '55' || 'rgba(59,185,255,0.35)')}`,
          }}
        >
          {isComplete ? (
            <span className="font-smash text-xl md:text-2xl" style={{ color: '#ffcc00' }}>
              ✓ ¡Selección completa! Listo para comenzar
            </span>
          ) : (
            <>
              <span
                className="font-smash text-xl md:text-2xl"
                style={{ color: currentPlayer?.color }}
              >
                {listMode === 'shared' ? players[0]?.name : currentPlayer?.name}
              </span>
              <span className="font-smash text-lg text-white/60">elige</span>
              {/* Progress pips */}
              <div className="flex gap-2 ml-2">
                {Array.from({ length: charactersPerPlayer }).map((_, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-sm border-2 transition-all duration-300"
                    style={{
                      background: i < selectedCount ? currentPlayer?.color : 'transparent',
                      borderColor: i < selectedCount ? currentPlayer?.color : 'rgba(255,255,255,0.2)',
                      boxShadow: i < selectedCount ? `0 0 8px ${currentPlayer?.color}` : 'none',
                    }}
                  />
                ))}
              </div>
              <span className="font-smash text-base text-white/40 ml-1">
                {selectedCount}/{charactersPerPlayer}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Color picker */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 mb-4 px-5 py-2 rounded"
          style={{
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span className="font-smash text-sm uppercase tracking-widest text-white/50">
            Color:
          </span>
          <input
            type="color"
            value={currentPlayer?.color || '#FFD700'}
            onChange={handleColorChange}
            className="w-10 h-7 border-2 rounded cursor-pointer bg-transparent"
            style={{ borderColor: currentPlayer?.color || '#FFD700' }}
          />
          <span className="font-smash text-base" style={{ color: currentPlayer?.color }}>
            {listMode === 'shared' ? players[0]?.name : currentPlayer?.name}
          </span>
        </motion.div>
      )}

      {/* Player overview pills */}
      <div className="flex gap-3 mb-4 flex-wrap justify-center">
        {players.map((p, i) => {
          const done = listMode === 'shared'
            ? (i === 0 ? currentSelectionPlayer >= 1 : currentSelectionPlayer >= playerCount)
            : currentSelectionPlayer > i;
          const active = listMode === 'shared' ? (i === 0 && !isComplete) : (currentSelectionPlayer === i);
          return (
            <div
              key={i}
              className="font-smash text-sm uppercase tracking-wider px-3 py-1 rounded border transition-all"
              style={{
                borderColor: p.color,
                color: active ? p.color : done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
                background: active ? `${p.color}22` : 'transparent',
                boxShadow: active ? `0 0 10px ${p.color}55` : 'none',
              }}
            >
              {done ? '✓ ' : active ? '▶ ' : ''}{p.name}
            </div>
          );
        })}
      </div>

      {/* Character grid */}
      <div
        className="grid gap-2 w-full overflow-y-auto p-3 rounded-lg border-2"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          maxHeight: '55vh',
          background: 'linear-gradient(160deg, rgba(8,6,20,0.97) 0%, rgba(4,4,14,0.99) 100%)',
          borderColor: 'rgba(59,185,255,0.4)',
          boxShadow: '0 0 30px rgba(59,185,255,0.2), inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {smashCharacters.map((char, i) => (
          <CharacterCard
            key={i}
            character={char}
            index={i}
            dots={getDotsForChar(i)}
            onClick={() => handleCharClick(i)}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 mt-5">
        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250 }}
          >
            <SmashButton onClick={onReady} size="large" variant="gold">¡LISTO! ▶</SmashButton>
          </motion.div>
        )}
        <button
          onClick={onBack}
          className="font-smash text-sm uppercase tracking-widest text-white/35 hover:text-white/70 transition-colors"
        >
          ← Volver a Configuración
        </button>
      </div>
    </div>
  );
}