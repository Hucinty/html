
import React from 'react';

const MOODS = ['Futuristic', 'Calm', 'Energetic', 'Playful', 'Professional', 'Luxurious', 'Nostalgic', 'Minimal'];

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
  disabled: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodChange, disabled }) => {
  return (
    <div className="w-full mt-6">
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2" id="mood-label">Select a Mood</label>
      <div className="grid grid-cols-4 gap-2" role="group" aria-labelledby="mood-label">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => onMoodChange(mood)}
            disabled={disabled}
            aria-pressed={selectedMood === mood}
            className={`w-full text-center px-3 py-2 text-sm font-semibold rounded-[var(--border-radius)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-button-primary-bg)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow)]
              ${selectedMood === mood
                ? 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-fg)] border border-transparent'
                : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-interactive-accent-bg)] hover:border-[var(--color-border)]'
              }
            `}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};
