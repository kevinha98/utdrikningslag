import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_DATE } from '../../data/months';

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white/80 shadow-lg backdrop-blur-sm dark:bg-white/5 sm:h-16 sm:w-16">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 20, opacity: 0, rotateX: -45 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-outfit text-xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-2xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-slate-200/50 dark:bg-white/5" />
      </div>
      <span className="mt-1.5 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft(EVENT_DATE));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(EVENT_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-center gap-2 sm:gap-3"
    >
      <Digit value={time.days} label="dager" />
      <span className="pb-5 font-outfit text-xl font-bold text-slate-300 dark:text-slate-600">:</span>
      <Digit value={time.hours} label="timer" />
      <span className="pb-5 font-outfit text-xl font-bold text-slate-300 dark:text-slate-600">:</span>
      <Digit value={time.minutes} label="min" />
      <span className="pb-5 font-outfit text-xl font-bold text-slate-300 dark:text-slate-600">:</span>
      <Digit value={time.seconds} label="sek" />
    </motion.div>
  );
}
