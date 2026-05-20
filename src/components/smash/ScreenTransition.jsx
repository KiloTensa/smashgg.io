import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  initial: { opacity: 0, scale: 0.97, y: 20, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
  exit:    { opacity: 0, scale: 1.02, y: -15, filter: 'blur(6px)' },
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
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 md:py-12 relative"
        style={{ zIndex: 10 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}