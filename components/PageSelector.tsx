
import React from 'react';

const PAGE_OPTIONS = [1, 2, 3, 4, 5];

interface PageSelectorProps {
  selectedPages: number;
  onPagesChange: (pages: number) => void;
  disabled: boolean;
}

export const PageSelector: React.FC<PageSelectorProps> = ({ selectedPages, onPagesChange, disabled }) => {
  return (
    <div className="w-full mt-6">
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2" id="pages-label">Number of Pages</label>
      <div className="grid grid-cols-5 gap-2" role="group" aria-labelledby="pages-label">
        {PAGE_OPTIONS.map((num) => (
          <button
            key={num}
            onClick={() => onPagesChange(num)}
            disabled={disabled}
            aria-pressed={selectedPages === num}
            className={`w-full text-center px-3 py-2 text-sm font-semibold rounded-[var(--border-radius)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-button-primary-bg)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow)]
              ${selectedPages === num
                ? 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-fg)] border border-transparent'
                : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-interactive-accent-bg)] hover:border-[var(--color-border)]'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};
