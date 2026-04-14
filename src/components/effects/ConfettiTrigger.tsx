import { useEffect, useRef } from 'react';
import { fireConfetti, fireBigConfetti } from '../../lib/confetti';

interface Props {
  progressPercent: number;
  completedMonths: number[];
}

export function ConfettiTrigger({ progressPercent, completedMonths }: Props) {
  const prevProgress = useRef(progressPercent);
  const prevMonths = useRef<number[]>(completedMonths);

  useEffect(() => {
    // Check if a new month was just completed
    const newlyCompleted = completedMonths.filter((m) => !prevMonths.current.includes(m));
    if (newlyCompleted.length > 0) {
      fireConfetti();
    }

    // Check if we just hit 100%
    if (progressPercent === 100 && prevProgress.current < 100) {
      setTimeout(() => fireBigConfetti(), 400);
    }

    prevProgress.current = progressPercent;
    prevMonths.current = completedMonths;
  }, [progressPercent, completedMonths]);

  return null;
}
