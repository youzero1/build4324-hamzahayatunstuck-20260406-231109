'use client';

import { useState } from 'react';

interface AddHabitModalProps {
  onAdd: (name: string, color: string, icon: string) => void;
  onClose: () => void;
}

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
];

const ICONS = [
  '🏃', '💪', '📚', '🧘', '💧', '🥗', '😴', '🎯',
  '✍️', '🎨', '🎵', '🌿', '🏊', '🚴', '🧠', '❤️'
];

export default function AddHabitModal({ onAdd, onClose }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter a habit name');
      return;
    }
    onAdd(name.trim(), selectedColor, selectedIcon);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '32px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>Add New Habit</h2>
          <button
            onClick={onClose}
            style={{
              background: '#334155',
              border: 'none',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
            HABIT NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="e.g., Morning Run, Read 30 mins..."
            maxLength={50}
            style={{
              width: '100%',
              background: '#0f172a',
              border: `1px solid ${error ? '#ef4444' : '#334155'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f1f5f9',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onBlur={e => (e.currentTarget.style.borderColor = error ? '#ef4444' : '#334155')}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            autoFocus
          />
          {error && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>{error}</p>}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '12px' }}>
            ICON
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
            {ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                style={{
                  background: selectedIcon === icon ? selectedColor + '30' : '#0f172a',
                  border: `2px solid ${selectedIcon === icon ? selectedColor : '#334155'}`,
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '20px',
                  transition: 'all 0.15s',
                  aspectRatio: '1'
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '12px' }}>
            COLOR
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: color,
                  border: selectedColor === color ? '3px solid white' : '3px solid transparent',
                  outline: selectedColor === color ? `3px solid ${color}` : 'none',
                  outlineOffset: '2px',
                  transition: 'all 0.15s',
                  boxShadow: `0 4px 12px ${color}50`
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#334155',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              color: '#94a3b8',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}cc)`,
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: `0 4px 16px ${selectedColor}50`
            }}
          >
            {selectedIcon} Create Habit
          </button>
        </div>
      </div>
    </div>
  );
}
