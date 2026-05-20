import { motion } from 'framer-motion';
import SmashButton from './SmashButton';

const TITLE_LINES = ['SMASH', 'GUN GAME'];

export default function MainMenu({ onStart, onExit }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Big title with staggered letter animation */}
      <div className="flex flex-col items-center mb-4 select-none">
        {TITLE_LINES.map((line, li) => (
          <motion.div
            key={li}
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: li * 0.15, type: 'spring', stiffness: 200, damping: 18 }}
            className="font-smash text-center uppercase leading-none"
            style={{
              fontSize: li === 0 ? 'clamp(4rem, 14vw, 10rem)' : 'clamp(2.5rem, 9vw, 6.5rem)',
              letterSpacing: '6px',
              color: li === 0 ? '#fff' : '#ffcc00',
              textShadow: li === 0
                ? '0 0 30px rgba(59,185,255,1), 0 0 60px rgba(59,185,255,0.5), 0 5px 0 #000, 0 8px 20px rgba(0,0,0,0.8)'
                : '0 0 25px rgba(255,204,0,0.9), 0 0 50px rgba(255,204,0,0.4), 0 4px 0 #7a4d00, 0 6px 16px rgba(0,0,0,0.8)',
            }}
          >
            {line}
          </motion.div>
        ))}
        {/* Decorative separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 h-[3px] w-72 md:w-96 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #3bb9ff 30%, #ffcc00 70%, transparent)',
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-bebas text-white/50 text-xl tracking-widest mt-2 uppercase"
        >
          Super Smash Bros. Ultimate
        </motion.p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, type: 'spring', stiffness: 200 }}
        >
          <SmashButton onClick={onStart} size="large" variant="gold">▶ COMENZAR</SmashButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        >
          <SmashButton onClick={onExit} size="normal" variant="red">SALIR</SmashButton>
        </motion.div>
      </div>

      {/* Bottom version text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="font-bebas text-white/25 text-sm tracking-widest mt-10 uppercase"
      >
        Selector de Personajes · Gun Game Mode
      </motion.p>
    </div>
  );
}