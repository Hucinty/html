
import React from 'react';

const TARGETS = [
    { label: 'Web Page', value: 'web' },
    { label: 'Email', value: 'email' },
];

interface TargetSelectorProps {
  selectedTarget: string;
  onTargetChange: (target: string) => void;
  disabled: boolean;
}

export const TargetSelector: React.FC<TargetSelectorProps> = ({ selectedTarget, onTargetChange, disabled }) => {
  return (
    <div className="w-full mt-6">
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2" id="target-label">Select Output Target</label>
      <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="target-label">
        {TARGETS.map((target) => (
          <button
            key={target.value}
            onClick={() => onTargetChange(target.value)}
            disabled={disabled}
            aria-pressed={selectedTarget === target.value}
            className={`w-full text-center px-3 py-2 text-sm font-semibold rounded-[var(--border-radius)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-button-primary-bg)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow)]
              ${selectedTarget === target.value
                ? 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-fg)] border border-transparent'
                : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-interactive-accent-bg)] hover:border-[var(--color-border)]'
              }
            `}
          >
            {target.label}
          </button>
        ))}
      </div>
    </div>
  );
};
