import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Expense, BudgetCategory } from '../lib/types';
import { CATEGORY_LABELS } from '../lib/types';
import { DEFAULT_BUDGET_PER_PERSON, DEFAULT_NUM_PEOPLE } from '../data/months';

export function useBudget() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('budget-expenses', []);
  const [numPeople, setNumPeople] = useLocalStorage<number>('budget-num-people', DEFAULT_NUM_PEOPLE);
  const [budgetPerPerson, setBudgetPerPerson] = useLocalStorage<number>('budget-per-person', DEFAULT_BUDGET_PER_PERSON);

  const addExpense = useCallback(
    (description: string, amount: number, category: BudgetCategory) => {
      const expense: Expense = {
        id: crypto.randomUUID(),
        description,
        amount,
        category,
        date: new Date().toISOString().slice(0, 10),
      };
      setExpenses((prev) => [...prev, expense]);
    },
    [setExpenses],
  );

  const removeExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [setExpenses],
  );

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalBudget = useMemo(() => budgetPerPerson * numPeople, [budgetPerPerson, numPeople]);
  const perPersonSpent = useMemo(() => (numPeople > 0 ? totalSpent / numPeople : 0), [totalSpent, numPeople]);
  const remaining = useMemo(() => totalBudget - totalSpent, [totalBudget, totalSpent]);

  const byCategory = useMemo(() => {
    const map: Record<BudgetCategory, number> = {
      fly: 0,
      overnatting: 0,
      aktiviteter: 0,
      'mat-drikke': 0,
      annet: 0,
    };
    for (const e of expenses) {
      map[e.category] += e.amount;
    }
    return (Object.entries(map) as [BudgetCategory, number][]).map(([cat, amount]) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      amount,
      percent: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }));
  }, [expenses, totalSpent]);

  return {
    expenses,
    numPeople,
    setNumPeople,
    budgetPerPerson,
    setBudgetPerPerson,
    addExpense,
    removeExpense,
    totalSpent,
    totalBudget,
    perPersonSpent,
    remaining,
    byCategory,
  };
}
