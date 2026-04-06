'use client';

import { Habit, HabitLog } from '@/types/habit';
import { getTodayKey, calculateStreak } from '@/utils/dateUtils';

interface StatsBarProps {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  habits: Habit[];
  logs: HabitLog;
}

export default function StatsBar({ totalHabits, completedToday, completionRate, habits, logs }: StatsBarProps) {
  const bestStreak = habits.length > 0
    ? Math.max(...habits.map(h => calculateStreak(h.id, logs)))
    : 0;

  const today = getTodayKey();
  const todayLogs = logs[today] || [];
  const allDoneToday = totalHabits > 0 && todayLogs.length >= totalHabits;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px'
    }}>
      <StatCard
        icon="📋"
        label="Total Habits"
        value={String(totalHabits)}
        color="#6366f1"
        sub="being tracked"
      />
      <StatCard
        icon="✅"
        label="Done Today"
        value={`${completedToday}/${totalHabits}`}
        color={allDoneToday ? '#10b981' : '#f59e0b'}
        sub={allDoneToday ? '🎉 All done!' : 'Keep going!'}
      />
      <StatCard
        icon="📊"
        label="Today's Rate"
        value={`${completionRate}%`}
        color="#06b6d4"
        sub="completion"
        showBar
        barValue={completionRate}
      />
      <StatCard
        icon="🔥"
        label="Best Streak"
        value={`${bestStreak} days`}
        color="#f59e0b"
        sub={bestStreak > 7 ? 'Amazing!' : bestStreak > 0 ? 'Keep it up!' : 'Start today'}
      />
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
  sub: string;
  showBar?: boolean;
  barValue?: number;
}

function StatCard({ icon, label, value, color, sub, showBar, barValue }: StatCardProps) {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid #334155',
      borderRadius: '14px',
      padding: '20px',
      backdropFilter: 'blur(8px)',
      borderTop: `3px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9', lineHeight: 1, marginBottom: '6px' }}>
        {value}
      </div>
      {showBar && typeof barValue === 'number' && (
        <div style={{ height: '4px', background: '#0f172a', borderRadius: '2px', margin: '8px 0' }}>
          <div style={{
            height: '100%',
            background: color,
            borderRadius: '2px',
            width: `${barValue}%`,
            transition: 'width 0.5s ease'
          }} />
        </div>
      )}
      <div style={{ fontSize: '12px', color: '#64748b' }}>{sub}</div>
    </div>
  );
}
