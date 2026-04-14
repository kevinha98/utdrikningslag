import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_COLORS } from '../../lib/types';
import type { BudgetCategory, Expense } from '../../lib/types';
import { ExpenseRow } from './ExpenseRow';
import { AddExpense } from './AddExpense';

interface CategoryBreakdown {
  category: BudgetCategory;
  label: string;
  amount: number;
  percent: number;
}

interface Props {
  expenses: Expense[];
  totalSpent: number;
  totalBudget: number;
  perPersonSpent: number;
  remaining: number;
  numPeople: number;
  setNumPeople: (n: number | ((p: number) => number)) => void;
  budgetPerPerson: number;
  setBudgetPerPerson: (n: number | ((p: number) => number)) => void;
  byCategory: CategoryBreakdown[];
  addExpense: (description: string, amount: number, category: BudgetCategory) => void;
  removeExpense: (id: string) => void;
}

export function BudgetTracker({
  expenses,
  totalSpent,
  totalBudget,
  perPersonSpent,
  remaining,
  numPeople,
  setNumPeople,
  budgetPerPerson,
  setBudgetPerPerson,
  byCategory,
  addExpense,
  removeExpense,
}: Props) {
  const overBudget = remaining < 0;

  return (
    <section className="relative z-10 mt-10">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400"
      >
        Budsjettsporing
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        {/* Config row */}
        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
          <div className="flex items-center gap-2">
            <label htmlFor="num-people" className="text-xs text-slate-500 dark:text-slate-400">Antall personer:</label>
            <input
              id="num-people"
              type="number"
              min={1}
              max={50}
              value={numPeople}
              onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-sm tabular-nums dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="budget-pp" className="text-xs text-slate-500 dark:text-slate-400">Budsjett/pers (kr):</label>
            <input
              id="budget-pp"
              type="number"
              min={0}
              step={500}
              value={budgetPerPerson}
              onChange={(e) => setBudgetPerPerson(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-sm tabular-nums dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Totalt brukt" value={`${totalSpent.toLocaleString('nb-NO')} kr`} />
          <SummaryCard label="Totalbudsjett" value={`${totalBudget.toLocaleString('nb-NO')} kr`} />
          <SummaryCard label="Per person" value={`${Math.round(perPersonSpent).toLocaleString('nb-NO')} kr`} />
          <SummaryCard
            label="Gjenstår"
            value={`${Math.abs(remaining).toLocaleString('nb-NO')} kr`}
            highlight={overBudget ? 'red' : 'green'}
          />
        </div>

        {/* Category breakdown bars */}
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Fordeling per kategori
          </h3>
          <div className="space-y-2.5">
            {byCategory.map((cat) => (
              <div key={cat.category}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">{cat.label}</span>
                  <span className="tabular-nums text-slate-500 dark:text-slate-400">
                    {cat.amount.toLocaleString('nb-NO')} kr ({cat.percent}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense list */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} onRemove={removeExpense} />
            ))}
          </AnimatePresence>
        </div>

        {/* Add expense */}
        <AddExpense onAdd={addExpense} />
      </motion.div>
    </section>
  );
}

function SummaryCard({ label, value, highlight }: { label: string; value: string; highlight?: 'red' | 'green' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 font-syne text-lg font-bold tabular-nums ${
          highlight === 'red'
            ? 'text-red-500'
            : highlight === 'green'
              ? 'text-emerald-500'
              : 'text-slate-900 dark:text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
