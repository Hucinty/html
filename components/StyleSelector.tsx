
import React from 'react';

const STYLES = ['Modern', 'Minimalist', 'Playful', 'Corporate', 'Brutalist', 'Anime', 'Vintage', 'Illustration', 'Cyberpunk'];

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, disabled }) => {
  return (
    <div className="w-full mt-6">
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2" id="style-label">Select a Style</label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" role="group" aria-labelledby="style-label">
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            disabled={disabled}
            aria-pressed={selectedStyle === style}
            className={`w-full text-center px-3 py-2 text-sm font-semibold rounded-[var(--border-radius)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-button-primary-bg)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow)]
              ${selectedStyle === style
                ? 'bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-fg)] border border-transparent'
                : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-interactive-accent-bg)] hover:border-[var(--color-border)]'
              }
            `}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};
