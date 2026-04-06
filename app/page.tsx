'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import HabitCard from '@/components/HabitCard';
import AddHabitModal from '@/components/AddHabitModal';
import WeeklyChart from '@/components/WeeklyChart';
import StatsBar from '@/components/StatsBar';
import { Habit, HabitLog } from '@/types/habit';
import { getTodayKey, getWeekDays, calculateStreak } from '@/utils/dateUtils';

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedHabits = localStorage.getItem('habits');
    const savedLogs = localStorage.getItem('habitLogs');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('habitLogs', JSON.stringify(logs));
    }
  }, [logs, mounted]);

  const addHabit = (name: string, color: string, icon: string) => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      color,
      icon,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
    setShowModal(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        if (updated[date]) {
          updated[date] = updated[date].filter(hid => hid !== id);
        }
      });
      return updated;
    });
  };

  const toggleHabit = (habitId: string) => {
    const today = getTodayKey();
    setLogs(prev => {
      const todayLogs = prev[today] || [];
      const isChecked = todayLogs.includes(habitId);
      return {
        ...prev,
        [today]: isChecked
          ? todayLogs.filter(id => id !== habitId)
          : [...todayLogs, habitId]
      };
    });
  };

  const isCompletedToday = (habitId: string): boolean => {
    const today = getTodayKey();
    return (logs[today] || []).includes(habitId);
  };

  const getStreak = (habitId: string): number => {
    return calculateStreak(habitId, logs);
  };

  const weekDays = getWeekDays();
  const totalCompleted = (logs[getTodayKey()] || []).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: '#94a3b8', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <header style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1e293b',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🎯</span>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>Habit Tracker</h1>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Build better habits daily</p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedHabit(null); setShowModal(true); }}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <span style={{ fontSize: '18px' }}>+</span> Add Habit
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <StatsBar
          totalHabits={totalHabits}
          completedToday={totalCompleted}
          completionRate={completionRate}
          habits={habits}
          logs={logs}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', marginTop: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>Today&apos;s Habits</h2>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {habits.length === 0 ? (
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '2px dashed #334155',
                borderRadius: '16px',
                padding: '60px 40px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🌱</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>No habits yet</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Start building better habits today!</p>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 28px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Create your first habit
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completed={isCompletedToday(habit.id)}
                    streak={getStreak(habit.id)}
                    weekDays={weekDays}
                    logs={logs}
                    onToggle={() => toggleHabit(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <WeeklyChart habits={habits} logs={logs} weekDays={weekDays} />
          </div>
        </div>
      </main>

      {showModal && (
        <AddHabitModal
          onAdd={addHabit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
