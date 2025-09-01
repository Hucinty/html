
import React from 'react';

interface TextPromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isProcessing: boolean;
}

export const TextPromptInput: React.FC<TextPromptInputProps> = ({ prompt, onPromptChange, isProcessing }) => {
  return (
    <div className="w-full">
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={isProcessing}
        placeholder="e.g., A 3-page portfolio website for a photographer with a gallery and a contact page. Use a minimalist style and a calm mood."
        className="w-full h-48 p-4 bg-[var(--color-interactive-accent-bg)] border-2 border-[var(--color-border)] rounded-[var(--border-radius)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-1 focus:ring-[var(--color-border)] focus:border-[var(--color-text-accent)] transition-colors duration-300 resize-none shadow-[var(--shadow)]"
        aria-label="Text prompt for HTML generation"
      />
    </div>
  );
};
