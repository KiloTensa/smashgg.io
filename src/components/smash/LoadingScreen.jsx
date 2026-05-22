import { motion } from 'framer-motion';

export default function LoadingScreen({ progress }) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md gap-6">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-24 h-24"
      >
        <img 
          src="https://cdn2.steamgriddb.com/logo_thumb/0498cae30ceca924f76c2b0832c14f34.png" 
          alt="Loading" 
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,185,255,0.5)]"
        />
      </motion.div>

      <div className="flex flex-col items-center w-full gap-3">
        <div className="flex justify-between w-full font-smash text-[10px] tracking-[0.3em] text-white/40 uppercase">
          <span>Preparando Combatientes...</span>
          <span className="text-[#3bb9ff]">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#3bb9ff] via-[#ffcc00] to-[#ff4040] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
      
      <p className="font-bebas text-white/10 text-[10px] tracking-[0.5em] uppercase italic">
        Super Smash Bros. Ultimate · Engine
      </p>
    </div>
  );
}