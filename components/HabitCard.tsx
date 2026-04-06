'use client';

import { useState } from 'react';
import { Habit, HabitLog, WeekDay } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  streak: number;
  weekDays: WeekDay[];
  logs: HabitLog;
  onToggle: () => void;
  onDelete: () => void;
}

export default function HabitCard({
  habit,
  completed,
  streak,
  weekDays,
  logs,
  onToggle,
  onDelete
}: HabitCardProps) {
  const [showDelete, setShowDelete] = useState(false);

  const isCompletedOnDay = (dayKey: string): boolean => {
    return (logs[dayKey] || []).includes(habit.id);
  };

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: `1px solid ${completed ? habit.color + '40' : '#334155'}`,
        borderRadius: '14px',
        padding: '18px 20px',
        transition: 'all 0.2s',
        backdropFilter: 'blur(8px)',
        boxShadow: completed ? `0 4px 20px ${habit.color}20` : 'none'
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: `2px solid ${completed ? habit.color : '#475569'}`,
            background: completed ? habit.color : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: completed ? `0 0 12px ${habit.color}60` : 'none'
          }}
        >
          {completed ? '✓' : ''}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>{habit.icon}</span>
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: completed ? '#f1f5f9' : '#94a3b8',
              textDecoration: completed ? 'none' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {habit.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: streak > 0 ? '#f59e0b' : '#64748b' }}>
              {streak > 0 ? `🔥 ${streak} day streak` : '💤 No streak yet'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {weekDays.map(day => (
            <div
              key={day.key}
              title={day.label}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: isCompletedOnDay(day.key)
                  ? habit.color
                  : day.isToday
                    ? 'rgba(99, 102, 241, 0.15)'
                    : '#1e293b',
                border: day.isToday ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: isCompletedOnDay(day.key) ? 'white' : '#64748b',
                fontWeight: 600,
                transition: 'all 0.2s',
                boxShadow: isCompletedOnDay(day.key) ? `0 2px 8px ${habit.color}50` : 'none'
              }}
            >
              {day.short}
            </div>
          ))}
        </div>

        <button
          onClick={onDelete}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            fontSize: '16px',
            opacity: showDelete ? 1 : 0,
            transition: 'opacity 0.2s',
            padding: '4px 8px',
            borderRadius: '6px',
            flexShrink: 0
          }}
          title="Delete habit"
        >
          ×
        </button>
      </div>
    </div>
  );
}
