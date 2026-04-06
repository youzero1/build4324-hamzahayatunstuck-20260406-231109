import { HabitLog, WeekDay } from '@/types/habit';

export function getTodayKey(): string {
  const now = new Date();
  return formatDateKey(now);
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWeekDays(): WeekDay[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days: WeekDay[] = [];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shorts = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const key = formatDateKey(date);
    days.push({
      key,
      label: labels[i],
      short: shorts[i],
      isToday: key === getTodayKey()
    });
  }
  return days;
}

export function calculateStreak(habitId: string, logs: HabitLog): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = formatDateKey(date);
    if ((logs[key] || []).includes(habitId)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(formatDateKey(date));
  }
  return days;
}
