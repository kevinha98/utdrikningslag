import type { Expense } from '../../lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../lib/types';
import { motion } from 'framer-motion';

interface Props {
  expense: Expense;
  onRemove: (id: string) => void;
}

export function ExpenseRow({ expense, onRemove }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/50 px-3 py-2.5 dark:border-white/5 dark:bg-white/[0.02]"
    >
      <div
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
          {expense.description}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {CATEGORY_LABELS[expense.category]} · {expense.date}
        </p>
      </div>
      <span className="flex-shrink-0 font-outfit text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
        {expense.amount.toLocaleString('nb-NO')}&nbsp;kr
      </span>
      <button
        onClick={() => onRemove(expense.id)}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
        aria-label="Slett utgift"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}
