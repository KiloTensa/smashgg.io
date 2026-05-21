import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -10, scale: 1.01 },
};

export default function ScreenTransition({ screenKey, children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        // Reducimos ligeramente la duración para que la app se sienta instantánea y responsiva
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 md:py-12 relative"
        style={{ 
          zIndex: 10,
          // Le dice al navegador que optimice este contenedor para animaciones fluidas
          willChange: 'transform, opacity' 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}