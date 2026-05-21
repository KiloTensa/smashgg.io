import { motion } from 'framer-motion';
import KTBLANCO from '@/components/img/KTBLANCO.png';

export default function LogoHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-4 left-4 flex items-center gap-3"
      style={{ zIndex: 100 }}
    >
      <img
        src="https://cdn2.steamgriddb.com/logo_thumb/0498cae30ceca924f76c2b0832c14f34.png"
        alt="Smash Ultimate Logo"
        className="w-14 md:w-18 h-auto"
        style={{ animation: 'logoPulse 3s infinite alternate', filter: 'drop-shadow(0 0 8px rgba(59,185,255,0.9))' }}
      />
      <div
        className="w-px h-8 hidden md:block"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)' }}
      />
      <img
        src={KTBLANCO}
        alt="KT566"
        className="h-9 md:h-11 w-auto hidden md:block"
        style={{ filter: 'invert(0) grayscale(1) drop-shadow(0 0 8px rgba(255,255,255,0.7))', opacity: 0.85 }}
      />
    </motion.div>
  );
}