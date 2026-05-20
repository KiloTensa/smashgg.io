import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmashTitle from './SmashTitle';
import SmashButton from './SmashButton';

const OPTION_STYLE_BASE = `
  font-smash text-base md:text-lg tracking-wider cursor-pointer select-none
  flex items-center gap-3 px-4 py-2.5 rounded border-2 transition-all duration-150
`;

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label
      className={OPTION_STYLE_BASE}
      style={{
        background: checked ? 'rgba(59,185,255,0.18)' : 'rgba(255,255,255,0.04)',
        borderColor: checked ? 'rgba(59,185,255,0.9)' : 'rgba(255,255,255,0.15)',
        boxShadow: checked ? '0 0 12px rgba(59,185,255,0.35)' : 'none',
        color: checked ? '#3bb9ff' : 'rgba(255,255,255,0.7)',
      }}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
        style={{ borderColor: checked ? '#3bb9ff' : 'rgba(255,255,255,0.3)' }}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-primary block" />}
      </span>
      {label}
    </label>
  );
}

export default function ConfigScreen({ onContinue, onBack, savedConfig }) {
  const [playerCount, setPlayerCount] = useState(savedConfig?.playerCount || 2);
  const [charsPerPlayer, setCharsPerPlayer] = useState(savedConfig?.charactersPerPlayer || 3);
  const [selectionMode, setSelectionMode] = useState(savedConfig?.selectionMode || 'manual');
  const [listMode, setListMode] = useState(savedConfig?.listMode || 'shared');
  const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    const names = [];
    for (let i = 0; i < playerCount; i++) {
      names.push(savedConfig?.players?.[i]?.name || `Jugador ${i + 1}`);
    }
    setPlayerNames(names);
  }, [playerCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue({
      playerCount,
      charactersPerPlayer: charsPerPlayer,
      selectionMode,
      listMode,
      playerNames: playerNames.map((n, i) => n.trim() || `Jugador ${i + 1}`),
    });
  };

  const updateName = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  const sectionClass = 'flex flex-col gap-3';
  const labelClass = 'font-smash text-sm md:text-base uppercase tracking-widest text-white/50';

  return (
    <div className="flex flex-col items-center w-full">
      <SmashTitle subtitle="Configura tu partida">CONFIGURACIÓN</SmashTitle>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg flex flex-col gap-6 p-6 md:p-8 mx-4"
        style={{
          background: 'linear-gradient(160deg, rgba(10,10,28,0.97) 0%, rgba(6,6,18,0.98) 100%)',
          border: '2px solid rgba(59,185,255,0.5)',
          borderRadius: '8px',
          boxShadow: '0 0 30px rgba(59,185,255,0.3), 0 0 80px rgba(59,185,255,0.1), inset 0 0 20px rgba(59,185,255,0.1)',
          animation: 'panelGlow 4s infinite alternate',
        }}
      >
        {/* Player count */}
        <div className={sectionClass}>
          <span className={labelClass}>Cantidad de jugadores</span>
          <div className="flex gap-3">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayerCount(n)}
                className="font-smash text-2xl w-14 h-14 rounded border-2 transition-all duration-150 cursor-pointer"
                style={{
                  background: playerCount === n ? 'rgba(59,185,255,0.2)' : 'rgba(255,255,255,0.04)',
                  borderColor: playerCount === n ? 'rgba(59,185,255,0.9)' : 'rgba(255,255,255,0.15)',
                  color: playerCount === n ? '#3bb9ff' : 'rgba(255,255,255,0.6)',
                  boxShadow: playerCount === n ? '0 0 12px rgba(59,185,255,0.5)' : 'none',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Characters per player */}
        <div className={sectionClass}>
          <span className={labelClass}>Personajes por jugador</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCharsPerPlayer(Math.max(1, charsPerPlayer - 1))}
              className="font-smash text-2xl w-10 h-10 rounded border-2 border-white/20 bg-white/5 text-white/70 hover:border-primary hover:text-primary transition-all"
            >−</button>
            <span
              className="font-smash text-4xl"
              style={{ color: '#ffcc00', textShadow: '0 0 12px rgba(255,204,0,0.7)', minWidth: '2ch', textAlign: 'center' }}
            >
              {charsPerPlayer}
            </span>
            <button
              type="button"
              onClick={() => setCharsPerPlayer(charsPerPlayer + 1)}
              className="font-smash text-2xl w-10 h-10 rounded border-2 border-white/20 bg-white/5 text-white/70 hover:border-primary hover:text-primary transition-all"
            >+</button>
          </div>
        </div>

        {/* Player names */}
        <div className={sectionClass}>
          <span className={labelClass}>Nombres de jugadores</span>
          <div className="grid grid-cols-2 gap-3">
            {playerNames.map((name, i) => (
              <div key={i} className="flex flex-col gap-1">
                <label className="font-smash text-xs uppercase tracking-widest text-white/40">
                  Jugador {i + 1}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  placeholder={`Jugador ${i + 1}`}
                  maxLength={14}
                  className="font-smash text-base uppercase tracking-wider px-3 py-2 rounded border-2 bg-black/50 text-white outline-none transition-all focus:border-primary"
                  style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,185,255,0.8)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selection mode */}
        <div className={sectionClass}>
          <span className={labelClass}>Modo de selección</span>
          <div className="flex flex-col gap-2">
            <RadioOption name="selectionMode" value="manual" checked={selectionMode === 'manual'} onChange={() => setSelectionMode('manual')} label="Selección manual" />
            <RadioOption name="selectionMode" value="random" checked={selectionMode === 'random'} onChange={() => setSelectionMode('random')} label="Aleatorio" />
          </div>
        </div>

        {/* List mode */}
        <div className={sectionClass}>
          <span className={labelClass}>Asignación de lista</span>
          <div className="flex flex-col gap-2">
            <RadioOption name="listMode" value="shared" checked={listMode === 'shared'} onChange={() => setListMode('shared')} label="Misma lista para todos" />
            <RadioOption name="listMode" value="unique" checked={listMode === 'unique'} onChange={() => setListMode('unique')} label="Lista única por jugador" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,185,255,0.4), transparent)' }} />

        <SmashButton type="submit" size="large" variant="gold" className="self-center">CONTINUAR ▶</SmashButton>
      </motion.form>

      <button
        onClick={onBack}
        className="mt-5 font-smash text-base uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors flex items-center gap-2"
      >
        ← Volver al Menú
      </button>
    </div>
  );
}