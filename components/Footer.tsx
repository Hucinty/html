import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent border-t border-[var(--color-border-subtle)] py-4 mt-8 transition-colors duration-500 ease-in-out">
      <div className="container mx-auto px-4 text-center text-[var(--color-text-secondary)] text-sm">
        <p>Built by a world-class senior frontend React engineer.</p>
        <p>&copy; {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};