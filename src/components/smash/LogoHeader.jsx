import { motion } from 'framer-motion';

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
        src="https://cdn.discordapp.com/attachments/1310986121379057715/1428442742203224234/Sin_titulo-3.png?ex=68f28478&is=68f132f8&hm=5acfa8ff524b6dc800179a69f8c922972f073b36065de3642851be107a38d46b"
        alt="Custom Logo"
        className="h-9 md:h-11 w-auto hidden md:block"
        style={{ filter: 'invert(1) grayscale(1) drop-shadow(0 0 4px rgba(255,255,255,0.7))', opacity: 0.85 }}
      />
    </motion.div>
  );
}