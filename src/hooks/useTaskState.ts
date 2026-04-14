import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { months } from '../data/months';

type TaskMap = Record<string, boolean>;

export function useTaskState() {
  const [completed, setCompleted] = useLocalStorage<TaskMap>('tasks-completed', {});

  const toggle = useCallback(
    (taskId: string) => {
      setCompleted((prev) => {
        const next = { ...prev };
        if (next[taskId]) {
          delete next[taskId];
        } else {
          next[taskId] = true;
        }
        return next;
      });
    },
    [setCompleted],
  );

  const isCompleted = useCallback((taskId: string) => !!completed[taskId], [completed]);

  const totalTasks = useMemo(() => months.reduce((s, m) => s + m.tasks.length, 0), []);
  const completedCount = useMemo(() => Object.keys(completed).length, [completed]);
  const progressPercent = useMemo(
    () => (totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100)),
    [completedCount, totalTasks],
  );

  const monthProgress = useCallback(
    (monthNum: number) => {
      const month = months.find((m) => m.num === monthNum);
      if (!month) return { done: 0, total: 0, percent: 0 };
      const total = month.tasks.length;
      const done = month.tasks.filter((t) => completed[t.id]).length;
      return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
    },
    [completed],
  );

  const isMonthComplete = useCallback(
    (monthNum: number) => {
      const { done, total } = monthProgress(monthNum);
      return total > 0 && done === total;
    },
    [monthProgress],
  );

  return {
    completed,
    toggle,
    isCompleted,
    totalTasks,
    completedCount,
    progressPercent,
    monthProgress,
    isMonthComplete,
  };
}
