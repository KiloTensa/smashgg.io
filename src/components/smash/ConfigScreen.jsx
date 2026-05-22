import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmashTitle from './SmashTitle';
import SmashButton from './SmashButton';
import { DEFAULT_PLAYER_COLORS } from '@/lib/smashCharacters';

const OPTION_STYLE_BASE = `
  font-smash text-sm md:text-base tracking-wider cursor-pointer select-none
  flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-150 w-full
`;

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label
      className={OPTION_STYLE_BASE}
      style={{
        background: checked ? 'rgba(59,185,255,0.25)' : 'rgba(255,255,255,0.02)',
        borderColor: checked ? '#3bb9ff' : 'rgba(255,255,255,0.1)',
        boxShadow: checked ? '0 0 20px rgba(59,185,255,0.2)' : 'none',
        color: checked ? '#3bb9ff' : 'rgba(255,255,255,0.7)',
      }}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

export default function ConfigScreen({ onContinue, onBack, savedConfig }) {
  const [playerCount, setPlayerCount] = useState(savedConfig?.playerCount || 2);
  const [charsPerPlayer, setCharsPerPlayer] = useState(savedConfig?.charactersPerPlayer || 3);
  const [selectionMode, setSelectionMode] = useState(savedConfig?.selectionMode || 'manual');
  const [listMode, setListMode] = useState(savedConfig?.listMode || 'shared');
  const [excludeDLC, setExcludeDLC] = useState(savedConfig?.excludeDLC || false);
  const [isTeamMode, setIsTeamMode] = useState(savedConfig?.isTeamMode || false);
  const [rememberPlayers, setRememberPlayers] = useState(true);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem('smashGG_Profiles') || '[]');
    
    const newPlayers = [];
    for (let i = 0; i < playerCount; i++) {
      const profile = savedProfiles[i];
      newPlayers.push({
        name: savedConfig?.players?.[i]?.name || profile?.name || `Jugador ${i + 1}`,
        color: savedConfig?.players?.[i]?.color || profile?.color || DEFAULT_PLAYER_COLORS[i % DEFAULT_PLAYER_COLORS.length]
      });
    }
    setPlayers(newPlayers);
  }, [playerCount]);

  useEffect(() => {
    if (playerCount < 3 && isTeamMode) setIsTeamMode(false);
  }, [playerCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue({
      playerCount,
      charactersPerPlayer: charsPerPlayer,
      selectionMode,
      listMode,
      excludeDLC,
      isTeamMode,
      rememberPlayers,
      players: players.map((p, i) => ({
        ...p,
        name: p.name.trim() || `P${i + 1}`
      })),
    });

    if (rememberPlayers) {
      const profiles = players.map(p => ({ name: p.name, color: p.color }));
      localStorage.setItem('smashGG_Profiles', JSON.stringify(profiles));
    }
  };

  const updatePlayer = (index, fields) => {
    const updated = [...players];
    updated[index] = { ...updated[index], ...fields };
    setPlayers(updated);
  };

  const sectionClass = 'flex flex-col gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5';
  const labelClass = 'font-smash text-xs md:text-sm uppercase tracking-[0.2em] text-[#3bb9ff] mb-1 flex items-center gap-2';

  return (
    <div className="flex flex-col items-center w-full">
      <SmashTitle subtitle="Configura tu partida">CONFIGURACIÓN</SmashTitle>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl flex flex-col gap-5 p-4 md:p-6 mx-4"
        style={{
          background: 'rgba(10, 10, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          animation: 'panelGlow 4s infinite alternate',
        }}
      >
        <div className={sectionClass}>
          <span className={labelClass}>
            <UsersIcon /> Cantidad de jugadores
          </span>
          <div className="flex gap-3">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayerCount(n)}
                className="font-smash text-2xl flex-1 h-14 rounded-lg border-2 transition-all duration-150 cursor-pointer"
                style={{
                  background: playerCount === n ? 'rgba(59,185,255,0.25)' : 'rgba(255,255,255,0.03)',
                  borderColor: playerCount === n ? '#3bb9ff' : 'rgba(255,255,255,0.1)',
                  color: playerCount === n ? '#3bb9ff' : 'rgba(255,255,255,0.6)',
                  boxShadow: playerCount === n ? '0 0 20px rgba(59,185,255,0.2)' : 'none',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <span className={labelClass}>
            <SwordIcon /> Personajes por jugador
          </span>
          <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => setCharsPerPlayer(Math.max(1, charsPerPlayer - 1))}
              className="font-smash text-2xl w-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 transition-all"
            >−</button>
            <span
              className="font-smash text-5xl"
              style={{ color: '#ffcc00', textShadow: '0 0 20px rgba(255,204,0,0.4)', minWidth: '2ch', textAlign: 'center' }}
            >
              {charsPerPlayer}
            </span>
            <button
              type="button"
              onClick={() => setCharsPerPlayer(charsPerPlayer + 1)}
              className="font-smash text-2xl w-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 transition-all"
            >+</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player, i) => (
            <div 
              key={i} 
              className="flex flex-col gap-3 p-4 rounded-xl border-2 transition-all bg-black/40"
              style={{ borderColor: `${player.color}44` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-smash text-[10px] tracking-widest opacity-50">PLAYER 0{i+1}</span>
                <input 
                  type="color" 
                  value={player.color} 
                  onChange={(e) => updatePlayer(i, { color: e.target.value })}
                  className="w-6 h-6 rounded-full overflow-hidden border-0 cursor-pointer bg-transparent"
                />
              </div>
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayer(i, { name: e.target.value })}
                placeholder={`Nombre P${i + 1}`}
                maxLength={14}
                className="font-smash text-lg uppercase tracking-wider px-3 py-2 rounded-lg bg-white/5 text-white outline-none border border-transparent focus:border-[#3bb9ff] transition-all w-full"
                style={{ color: player.color }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={sectionClass}>
            <span className={labelClass}><TrophyIcon /> Modo</span>
            <RadioOption name="selectionMode" value="manual" checked={selectionMode === 'manual'} onChange={() => setSelectionMode('manual')} label="Selección manual" />
            <RadioOption name="selectionMode" value="random" checked={selectionMode === 'random'} onChange={() => setSelectionMode('random')} label="Aleatorio" />
          </div>
          <div className={sectionClass}>
            <span className={labelClass}><LayersIcon /> Listas</span>
            <RadioOption name="listMode" value="shared" checked={listMode === 'shared'} onChange={() => setListMode('shared')} label="Misma lista para todos" />
            <RadioOption name="listMode" value="unique" checked={listMode === 'unique'} onChange={() => setListMode('unique')} label="Lista única por jugador" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={sectionClass}>
            <span className={labelClass}><ShieldIcon /> Restricciones</span>
            <label className="flex items-center gap-3 cursor-pointer text-sm font-smash text-white/70 hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={excludeDLC} 
                onChange={e => setExcludeDLC(e.target.checked)} 
                className="w-5 h-5 rounded border-white/20 bg-black/40 checked:bg-[#3bb9ff] accent-[#3bb9ff]" 
              />
              Excluir Personajes DLC
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-sm font-smash text-white/70 hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={rememberPlayers} 
                onChange={e => setRememberPlayers(e.target.checked)} 
                className="w-5 h-5 rounded border-white/20 bg-black/40 checked:bg-[#3bb9ff] accent-[#3bb9ff]" 
              />
              Recordar Jugadores
            </label>
          </div>

          {playerCount >= 3 && (
            <div className={sectionClass}>
              <span className={labelClass}><StarIcon /> Equipos</span>
              <label className="flex items-center gap-3 cursor-pointer text-sm font-smash text-white/70 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={isTeamMode} 
                  onChange={e => setIsTeamMode(e.target.checked)} 
                  className="w-5 h-5 rounded border-white/20 bg-black/40 checked:bg-[#ffcc00] accent-[#ffcc00]" 
                />
                Modo Team (P1 + P2 vs Resto)
              </label>
              <p className="text-[10px] text-white/30 italic leading-tight">P1 y P2 compartirán el mismo progreso de personajes.</p>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col items-center">
          <SmashButton type="submit" size="large" variant="gold" className="w-full">CONTINUAR ▶</SmashButton>
        </div>
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

const UsersIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SwordIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TrophyIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const LayersIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const ShieldIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const StarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;