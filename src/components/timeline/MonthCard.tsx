import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Month } from '../../lib/types';
import { TaskItem } from './TaskItem';

interface Props {
  month: Month;
  isCompleted: (taskId: string) => boolean;
  toggleTask: (taskId: string) => void;
  monthProgress: { done: number; total: number; percent: number };
  isMonthComplete: boolean;
}

export function MonthCard({ month, isCompleted, toggleTask, monthProgress, isMonthComplete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 40 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative"
    >
      <div
        className={`overflow-hidden rounded-2xl border backdrop-blur-sm transition-shadow duration-300
          ${isMonthComplete
            ? 'border-green-400/40 bg-green-50/80 shadow-lg shadow-green-500/10 dark:border-green-500/20 dark:bg-green-950/20'
            : 'border-slate-200 bg-white/70 shadow-sm hover:shadow-lg dark:border-white/5 dark:bg-white/[0.03] dark:hover:shadow-xl dark:hover:shadow-black/20'
          }`}
      >
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5"
        >
          {/* Month circle */}
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: month.accentBg, color: month.accentColor }}
          >
            M-{month.num}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-outfit text-base font-semibold text-slate-900 dark:text-white">
                {month.title}
              </h3>
              {isMonthComplete && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-sm"
                >
                  ✅
                </motion.span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{month.sub}</p>
          </div>

          {/* Badge */}
          <span
            className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
            style={{ backgroundColor: month.badgeBg, color: month.badgeColor }}
          >
            {month.badge}
          </span>

          {/* Mini progress + chevron */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="hidden text-xs tabular-nums text-slate-400 dark:text-slate-500 sm:inline">
              {monthProgress.done}/{monthProgress.total}
            </span>
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </button>

        {/* Mini progress bar under header */}
        <div className="mx-4 mb-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 sm:mx-5">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${month.accentColor}, ${month.accentColor}dd)` }}
            initial={{ width: 0 }}
            animate={{ width: `${monthProgress.percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Expandable tasks */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 px-4 pb-4 pt-2 dark:border-white/5 sm:px-5">
                {month.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    text={task.text}
                    checked={isCompleted(task.id)}
                    onToggle={() => toggleTask(task.id)}
                    accentColor={month.accentColor}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
