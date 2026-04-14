import { ThemeToggle } from '../theme/ThemeToggle';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="relative z-10 flex flex-col items-center gap-4 pb-2 pt-8 sm:flex-row sm:justify-between sm:pt-12">
      <div className="text-center sm:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500 bg-clip-text font-syne text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl"
        >
          Utdrikningslag
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-1 text-sm text-slate-400 dark:text-slate-400"
        >
          12-månedersplan — Hardangerfjorden-edition
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <ThemeToggle />
      </motion.div>
    </header>
  );
}
