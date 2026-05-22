import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmashTitle from './SmashTitle';
import SmashButton from './SmashButton';
import CharacterCard from './CharacterCard';
import smashCharacters, { DLC_CHARACTER_NAMES } from '@/lib/smashCharacters';

export default function SelectionScreen({ gameState, onUpdateState, onReady, onBack }) {
  const { players, currentSelectionPlayer, charactersPerPlayer, listMode, playerCount, excludeDLC } = gameState;

  const isComplete = currentSelectionPlayer >= playerCount;
  const currentPlayer = !isComplete ? players[currentSelectionPlayer] : null;
  const selectedCount = currentPlayer?.characters?.length || 0;

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(24);

  useEffect(() => {
    if (visibleLimit < smashCharacters.length) {
      const timer = setTimeout(() => {
        setVisibleLimit(prev => Math.min(prev + 20, smashCharacters.length));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visibleLimit]);

  const dotsMap = useMemo(() => {
    const map = {};
    players.forEach((player, pIdx) => {
      player.characters.forEach(charIndex => {
        if (!map[charIndex]) map[charIndex] = [];
        map[charIndex].push({ color: player.color, playerIndex: pIdx });
      });
    });
    return map;
  }, [players]);

  const filteredCharacters = useMemo(() => {
    let list = smashCharacters.map((char, index) => ({ ...char, originalIndex: index }));

    if (excludeDLC) {
      list = list.filter(char => !DLC_CHARACTER_NAMES.includes(char.name));
    }

    if (searchTerm) {
      list = list.filter(char => char.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return list;
  }, [searchTerm, excludeDLC]);

  const charactersToRender = filteredCharacters.slice(0, visibleLimit);

  const handleCharClick = (charIndex) => {
    const newState = JSON.parse(JSON.stringify(gameState));

    if (gameState.selectionMode === 'random') {
      if (!newState.bannedCharacters) newState.bannedCharacters = [];
      const bIdx = newState.bannedCharacters.indexOf(charIndex);
      if (bIdx !== -1) newState.bannedCharacters.splice(bIdx, 1);
      else newState.bannedCharacters.push(charIndex);
      onUpdateState(newState);
      return;
    }

    if (isComplete || !currentPlayer) return;
    if (listMode === 'shared' && currentSelectionPlayer > 0) return;

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
  };

  const handleRandomIndividual = () => {
    if (isComplete || !currentPlayer) return;
    if (listMode === 'shared' && currentSelectionPlayer > 0) {
      console.warn('⚠️ Solo el primer jugador puede usar Random en modo compartido');
      return;
    }

    const newState = JSON.parse(JSON.stringify(gameState));
    const cp = newState.players[newState.currentSelectionPlayer];
    const spotsNeeded = newState.charactersPerPlayer - cp.characters.length;

    if (spotsNeeded <= 0) {
      console.warn('⚠️ Este jugador ya completó su lista');
      return;
    }

    let available = [];
    if (newState.listMode === 'shared') {
      available = [...Array(smashCharacters.length).keys()].filter(i => !cp.characters.includes(i));
    } else {
      const used = new Set();
      newState.players.forEach(p => p.characters.forEach(ci => used.add(ci)));
      available = [...Array(smashCharacters.length).keys()].filter(i => !used.has(i));
    }

    if (available.length === 0) {
      console.warn('❌ No hay personajes disponibles');
      return;
    }

    const toAssign = Math.min(spotsNeeded, available.length);
    for (let i = 0; i < toAssign; i++) {
      const rIdx = Math.floor(Math.random() * available.length);
      const charIdx = available.splice(rIdx, 1)[0];
      cp.characters.push(charIdx);
    }

    if (cp.characters.length >= newState.charactersPerPlayer) {
      if (newState.listMode === 'shared' && newState.currentSelectionPlayer === 0) {
        const masterList = [...cp.characters];
        newState.players.forEach(p => { p.characters = [...masterList]; });
        newState.currentSelectionPlayer = newState.playerCount;
      } else {
        newState.currentSelectionPlayer++;
      }
    }

    console.log(`🎲 [${cp.name}] ${toAssign} personajes aleatorios asignados`);
    onUpdateState(newState);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-2">
      <style>{`
        @keyframes smashCardEnter {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes smashCardFlash {
          from { opacity: 0.6; }
          to { opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59,185,255,0.3);
          border-radius: 4px;
        }
      `}</style>

      <SmashTitle subtitle="Elige tu roster">SELECCIÓN DE PERSONAJES</SmashTitle>

      <div className="w-full max-w-md mb-4 relative z-10">
        <input
          type="text"
          placeholder="🔍 BUSCAR PERSONAJE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/80 border-2 border-white/20 rounded px-4 py-1.5 font-smash text-sm text-white tracking-widest text-center focus:outline-none focus:border-[#3bb9ff] transition-colors"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isComplete ? 'complete' : currentSelectionPlayer}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-4 mb-3 px-5 py-2.5 rounded"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(10,8,22,0.9) 100%)',
            border: `2px solid ${isComplete ? '#ffcc00' : (currentPlayer?.color || '#3bb9ff')}`,
          }}
        >
          {isComplete ? (
            <span className="font-smash text-lg md:text-xl" style={{ color: '#ffcc00' }}>
              ✓ ¡Selección completa!
            </span>
          ) : (
            <>
              <span className="font-smash text-lg md:text-xl" style={{ color: currentPlayer?.color }}>
                {listMode === 'shared' ? players[0]?.name : currentPlayer?.name}
              </span>
              <div className="flex gap-1.5 ml-1">
                {Array.from({ length: charactersPerPlayer }).map((_, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-sm border"
                    style={{
                      background: i < selectedCount ? currentPlayer?.color : 'transparent',
                      borderColor: i < selectedCount ? currentPlayer?.color : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>
              <span className="font-smash text-sm text-white/40">
                {selectedCount}/{charactersPerPlayer}
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {!isComplete && (
        <div className="flex items-center justify-center mb-4 px-4 py-1.5 rounded bg-black/60 border border-white/10">
          <button
            onClick={handleRandomIndividual}
            disabled={isComplete}
            className="font-smash text-xs uppercase tracking-widest px-3 py-1 rounded border-2 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'rgba(255,200,0,0.5)',
              color: 'rgba(255,200,0,0.8)',
              background: 'rgba(255,200,0,0.1)',
            }}
            onMouseEnter={(e) => {
              if (!isComplete) {
                e.target.style.borderColor = 'rgba(255,200,0,0.9)';
                e.target.style.background = 'rgba(255,200,0,0.2)';
                e.target.style.boxShadow = '0 0 12px rgba(255,200,0,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255,200,0,0.5)';
              e.target.style.background = 'rgba(255,200,0,0.1)';
              e.target.style.boxShadow = 'none';
            }}
            title="Asignar personajes aleatorios"
          >
            🎲 RANDOM
          </button>
        </div>
      )}

      <div
        className="grid gap-2 w-full overflow-y-auto p-3 rounded-lg border-2 custom-scrollbar"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
          maxHeight: '48vh',
          background: 'rgba(6, 4, 14, 0.96)',
          borderColor: 'rgba(59,185,255,0.3)',
        }}
      >
        {charactersToRender.map((char) => (
          <CharacterCard
            key={char.originalIndex}
            character={char}
            index={char.originalIndex}
            dots={dotsMap[char.originalIndex] || []}
            onClick={() => handleCharClick(char.originalIndex)}
          />
        ))}

        {filteredCharacters.length === 0 && (
          <div className="col-span-full text-center py-12 font-smash text-white/30 text-sm tracking-widest">
            NO SE ENCONTRARON PERSONAJES
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        {players.map((p, i) => {
          const done = listMode === 'shared'
            ? (i === 0 ? currentSelectionPlayer >= 1 : currentSelectionPlayer >= playerCount)
            : currentSelectionPlayer > i;
          const active = listMode === 'shared' ? (i === 0 && !isComplete) : (currentSelectionPlayer === i);
          return (
            <div
              key={i}
              className="font-smash text-xs uppercase px-2.5 py-0.5 rounded border transition-all"
              style={{
                borderColor: p.color,
                color: active ? p.color : done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                background: active ? `${p.color}15` : 'transparent',
              }}
            >
              {done ? '✓ ' : active ? '▶ ' : ''}{p.name}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        {isComplete && (
          <SmashButton onClick={onReady} size="large" variant="gold">¡LISTO! ▶</SmashButton>
        )}
        <button
          onClick={onBack}
          className="font-smash text-xs uppercase tracking-widest text-white/30 hover:text-white/60 mt-1"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}