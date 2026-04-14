export interface Task {
  id: string;
  text: string;
}

export interface Month {
  num: number;
  title: string;
  sub: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  accentColor: string;
  accentBg: string;
  tasks: Task[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: BudgetCategory;
  date: string;
}

export type BudgetCategory =
  | 'transport'
  | 'overnatting'
  | 'aktiviteter'
  | 'mat-drikke'
  | 'annet';

export const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  transport: 'Transport',
  overnatting: 'Overnatting',
  aktiviteter: 'Aktiviteter',
  'mat-drikke': 'Mat & Drikke',
  annet: 'Annet',
};

export const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  transport: '#8b5cf6',
  overnatting: '#ec4899',
  aktiviteter: '#f59e0b',
  'mat-drikke': '#10b981',
  annet: '#6366f1',
};
