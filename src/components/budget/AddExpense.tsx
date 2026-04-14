import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BudgetCategory } from '../../lib/types';
import { CATEGORY_LABELS } from '../../lib/types';

interface Props {
  onAdd: (description: string, amount: number, category: BudgetCategory) => void;
}

const categories: BudgetCategory[] = ['fly', 'overnatting', 'aktiviteter', 'mat-drikke', 'annet'];

export function AddExpense({ onAdd }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<BudgetCategory>('annet');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numAmount) || numAmount <= 0) return;
    onAdd(description.trim(), numAmount, category);
    setDescription('');
    setAmount('');
    setCategory('annet');
    setOpen(false);
  };

  if (!open) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-500 dark:border-white/10 dark:text-slate-500 dark:hover:border-amber-400/40 dark:hover:text-amber-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Legg til utgift
      </motion.button>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-200 bg-white/80 p-4 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.03]"
    >
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Beskrivelse"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
          autoFocus
        />
        <input
          type="number"
          placeholder="Beløp (kr)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          step={1}
          className="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              category === cat
                ? 'bg-amber-400/20 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-amber-400 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
        >
          Legg til
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
        >
          Avbryt
        </button>
      </div>
    </motion.form>
  );
}
