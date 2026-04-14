import { motion } from 'framer-motion';
import { ProgressRing } from './ProgressRing';
import { CountdownTimer } from './CountdownTimer';
import { BUDGET_MIN, BUDGET_MAX } from '../../data/months';

interface Props {
  completedCount: number;
  totalTasks: number;
  progressPercent: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

function StatCard({ label, value, custom }: { label: string; value: string; custom: number }) {
  return (
    <motion.div
      variants={cardVariants}
      custom={custom}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-outfit text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </motion.div>
  );
}

export function StatsBar({ completedCount, totalTasks, progressPercent }: Props) {
  return (
    <section className="relative z-10 mt-8 space-y-8">
      {/* Countdown */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Nedtelling til avreise
        </h2>
        <CountdownTimer />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Måneder igjen" value="12" custom={0} />
        <StatCard label="Budsjett/pers" value={`${BUDGET_MIN / 1000}–${BUDGET_MAX / 1000}k`} custom={1} />
        <StatCard label="Oppgaver fullført" value={`${completedCount}/${totalTasks}`} custom={2} />
        <StatCard label="Fokus" value="Fest + aktiviteter" custom={3} />
      </div>

      {/* Progress ring — centered */}
      <div className="flex justify-center">
        <ProgressRing percent={progressPercent} />
      </div>
    </section>
  );
}
