import { useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StatsBar } from './components/dashboard/StatsBar';
import { TimelineView } from './components/timeline/TimelineView';
import { BudgetTracker } from './components/budget/BudgetTracker';
import { ParticleBackground } from './components/effects/ParticleBackground';
import { ConfettiTrigger } from './components/effects/ConfettiTrigger';
import { useTaskState } from './hooks/useTaskState';
import { useBudget } from './hooks/useBudget';
import { months } from './data/months';

export default function App() {
  const {
    toggle,
    isCompleted,
    totalTasks,
    completedCount,
    progressPercent,
    monthProgress,
    isMonthComplete,
  } = useTaskState();

  const budget = useBudget();

  const completedMonths = useMemo(
    () => months.filter((m) => isMonthComplete(m.num)).map((m) => m.num),
    [completedCount],
  );

  return (
    <>
      <ParticleBackground />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Header />
        <StatsBar
          completedCount={completedCount}
          totalTasks={totalTasks}
          progressPercent={progressPercent}
        />
        <TimelineView
          isCompleted={isCompleted}
          toggleTask={toggle}
          monthProgress={monthProgress}
          isMonthComplete={isMonthComplete}
        />
        <BudgetTracker
          expenses={budget.expenses}
          totalSpent={budget.totalSpent}
          totalBudget={budget.totalBudget}
          perPersonSpent={budget.perPersonSpent}
          remaining={budget.remaining}
          numPeople={budget.numPeople}
          setNumPeople={budget.setNumPeople}
          budgetPerPerson={budget.budgetPerPerson}
          setBudgetPerPerson={budget.setBudgetPerPerson}
          byCategory={budget.byCategory}
          addExpense={budget.addExpense}
          removeExpense={budget.removeExpense}
        />
        <Footer />
      </div>
      <ConfettiTrigger
        progressPercent={progressPercent}
        completedMonths={completedMonths}
      />
    </>
  );
}
