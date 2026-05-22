import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BattleLog({ logs, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-4 top-24 z-40 flex flex-col items-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/60 hover:bg-black/80 border-2 border-white/20 p-2 rounded-lg backdrop-blur-md transition-all group"
        title="Historial de Batalla"
      >
        <div className="flex items-center gap-2 px-1">
          <span className="font-smash text-xs tracking-tighter text-white/70 group-hover:text-white">LOG</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-64 md:w-80 bg-black/90 border-2 border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col"
            style={{ maxHeight: '60vh' }}
          >
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-smash text-xs tracking-widest text-[#3bb9ff]">EVENTOS RECIENTES</span>
              <button 
                onClick={onClear}
                className="text-[10px] font-smash text-white/30 hover:text-red-400 transition-colors"
              >
                LIMPIAR
              </button>
            </div>

            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {!logs || logs.length === 0 ? (
                <div className="py-8 text-center text-white/20 font-smash text-[10px] italic">
                  Esperando KO...
                </div>
              ) : (
                logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-2 rounded bg-white/5 border-l-2 flex flex-col gap-1"
                    style={{ borderLeftColor: log.color }}
                  >
                    <span className="font-smash text-[11px] text-white/90 leading-tight uppercase italic">
                      {log.text}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-2 bg-black/40 text-center">
              <span className="text-[9px] font-bebas text-white/20 tracking-[0.2em]">SMASH GUN GAME ENGINE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}