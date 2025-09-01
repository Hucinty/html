import React from 'react';
import { CodeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-[var(--color-bg)]/80 backdrop-blur-sm border-b border-[var(--color-border-subtle)] sticky top-0 z-10 transition-colors duration-500 ease-in-out">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <CodeIcon className="w-8 h-8 text-[var(--color-text-accent)]" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Image to HTML Converter
          </h1>
        </div>
        <p className="text-[var(--color-text-secondary)] text-sm ml-11">Powered by Gemini AI</p>
      </div>
    </header>
  );
};