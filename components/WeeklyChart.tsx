'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Habit, HabitLog, WeekDay } from '@/types/habit';

interface WeeklyChartProps {
  habits: Habit[];
  logs: HabitLog;
  weekDays: WeekDay[];
}

interface ChartDataItem {
  day: string;
  completed: number;
  total: number;
  isToday: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataItem }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px'
      }}>
        <p style={{ color: '#94a3b8', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#6366f1', fontWeight: 700 }}>
          {data.completed} / {data.total} habits
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyChart({ habits, logs, weekDays }: WeeklyChartProps) {
  const chartData: ChartDataItem[] = weekDays.map(day => ({
    day: day.label,
    completed: (logs[day.key] || []).filter(id => habits.some(h => h.id === id)).length,
    total: habits.length,
    isToday: day.isToday
  }));

  const totalThisWeek = chartData.reduce((sum, d) => sum + d.completed, 0);
  const maxPossible = habits.length * 7;
  const weeklyRate = maxPossible > 0 ? Math.round((totalThisWeek / maxPossible) * 100) : 0;

  return (
    <div>
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(8px)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Weekly Progress</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>This week&apos;s completion</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1', lineHeight: 1 }}>{weeklyRate}%</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{totalThisWeek} completions</div>
          </div>
        </div>

        {habits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '14px' }}>
            Add habits to see your progress
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={24}
                allowDecimals={false}
                domain={[0, habits.length > 0 ? habits.length : 1]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)', radius: 6 }} />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isToday ? '#6366f1' : entry.completed > 0 ? '#4f46e5' : '#1e293b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '20px 24px',
        backdropFilter: 'blur(8px)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Streaks</h3>
        {habits.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '12px 0' }}>No habits yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {habits
              .map(habit => ({
                habit,
                streak: calculateStreakLocal(habit.id, logs)
              }))
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 5)
              .map(({ habit, streak }) => (
                <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{habit.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {habit.name}
                    </div>
                    <div style={{ height: '4px', background: '#0f172a', borderRadius: '2px', marginTop: '4px' }}>
                      <div style={{
                        height: '100%',
                        background: habit.color,
                        borderRadius: '2px',
                        width: `${Math.min(streak * 10, 100)}%`,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: streak > 0 ? '#f59e0b' : '#64748b', fontWeight: 700, flexShrink: 0 }}>
                    {streak > 0 ? `🔥 ${streak}` : '—'}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function calculateStreakLocal(habitId: string, logs: HabitLog): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    if ((logs[key] || []).includes(habitId)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
