export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export type HabitLog = Record<string, string[]>;

export interface WeekDay {
  key: string;
  label: string;
  short: string;
  isToday: boolean;
}
