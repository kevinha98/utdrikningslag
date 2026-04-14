import { motion } from 'framer-motion';
import { months } from '../../data/months';
import { MonthCard } from './MonthCard';

interface Props {
  isCompleted: (taskId: string) => boolean;
  toggleTask: (taskId: string) => void;
  monthProgress: (monthNum: number) => { done: number; total: number; percent: number };
  isMonthComplete: (monthNum: number) => boolean;
}

export function TimelineView({ isCompleted, toggleTask, monthProgress, isMonthComplete }: Props) {
  return (
    <section className="relative z-10 mt-10">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400"
      >
        12-månedersplan
      </motion.h2>

      {/* Timeline line */}
      <div className="relative">
        <div className="absolute left-[1.65rem] top-0 hidden h-full w-px bg-gradient-to-b from-amber-400/30 via-pink-500/30 to-violet-500/30 sm:block" />

        <motion.div
          className="grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
            hidden: {},
          }}
        >
          {months.map((month) => (
            <MonthCard
              key={month.num}
              month={month}
              isCompleted={isCompleted}
              toggleTask={toggleTask}
              monthProgress={monthProgress(month.num)}
              isMonthComplete={isMonthComplete(month.num)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
