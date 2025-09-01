
export interface Theme {
  [key: string]: string;
}

// Moods control the color palette of the application
export const moodThemes: { [key: string]: Theme } = {
  Futuristic: {
    '--color-bg': '#010A1A', // Deep Navy
    '--color-text-primary': '#EAEAEA', // Off-white
    '--color-text-secondary': '#8892B0', // Slate blue-gray
    '--color-text-accent': '#64FFDA', // Vibrant Cyan
    '--color-border': '#F500BD', // Vibrant Magenta
    '--color-border-subtle': 'rgba(245, 0, 189, 0.3)', // Subtle Magenta
    '--color-interactive-accent-bg': 'rgba(100, 255, 218, 0.1)', // Cyan tint bg
    '--color-interactive-accent-fg': '#EAEAEA',
    '--color-interactive-accent-border': '#F500BD', // Magenta border
    '--color-button-primary-bg': '#F500BD', // Magenta button
    '--color-button-primary-fg': '#EAEAEA',
    '--color-error-bg': 'rgba(255, 82, 82, 0.2)',
    '--color-error-fg': '#FF5252',
    '--color-error-border': '#FF5252',
  },
  Calm: {
    '--color-bg': '#f0f9ff', // sky-50
    '--color-text-primary': '#374151', // gray-700
    '--color-text-secondary': '#6b7280', // gray-500
    '--color-text-accent': '#0284c7', // sky-600
    '--color-border': '#e0e7ff', // indigo-100
    '--color-border-subtle': '#dbeafe', // blue-100
    '--color-interactive-accent-bg': '#e0f2fe', // sky-100
    '--color-interactive-accent-fg': '#0c4a6e', // sky-900
    '--color-interactive-accent-border': '#7dd3fc', // sky-300
    '--color-button-primary-bg': '#38bdf8', // sky-400
    '--color-button-primary-fg': '#ffffff',
    '--color-error-bg': 'rgba(239, 68, 68, 0.1)',
    '--color-error-fg': '#b91c1c', // red-800
    '--color-error-border': '#f87171', // red-400
  },
  Energetic: {
    '--color-bg': '#fffbeb', // yellow-50
    '--color-text-primary': '#422006', // amber-950
    '--color-text-secondary': '#92400e', // amber-700
    '--color-text-accent': '#f97316', // orange-500
    '--color-border': '#fde68a', // amber-200
    '--color-border-subtle': '#fee2e2', // red-100
    '--color-interactive-accent-bg': '#fff7ed', // orange-50
    '--color-interactive-accent-fg': '#9a3412', // orange-800
    '--color-interactive-accent-border': '#fb923c', // orange-400
    '--color-button-primary-bg': '#f97316', // orange-500
    '--color-button-primary-fg': '#ffffff',
    '--color-error-bg': 'rgba(127, 29, 29, 0.1)',
    '--color-error-fg': '#991b1b', // red-900
    '--color-error-border': '#dc2626', // red-600
  },
  Playful: {
    '--color-bg': '#fdf2f8', // pink-50
    '--color-text-primary': '#581c87', // purple-900
    '--color-text-secondary': '#9d174d', // pink-800
    '--color-text-accent': '#db2777', // pink-600
    '--color-border': '#fbcfe8', // pink-200
    '--color-border-subtle': '#e9d5ff', // purple-200
    '--color-interactive-accent-bg': '#f5d0fe', // fuchsia-200
    '--color-interactive-accent-fg': '#86198f', // fuchsia-900
    '--color-interactive-accent-border': '#c084fc', // purple-400
    '--color-button-primary-bg': '#d946ef', // fuchsia-500
    '--color-button-primary-fg': '#ffffff',
    '--color-error-bg': 'rgba(239, 68, 68, 0.1)',
    '--color-error-fg': '#b91c1c',
    '--color-error-border': '#f87171',
  },
  Professional: {
    '--color-bg': '#1A202C', // deep charcoal (slate-900)
    '--color-text-primary': '#E2E8F0', // slate gray (slate-200)
    '--color-text-secondary': '#A0AEC0', // slate-400
    '--color-text-accent': '#4FD1C5', // sharp teal (teal-400)
    '--color-border': '#4A5568', // slate-700
    '--color-border-subtle': '#2D3748', // slate-800
    '--color-interactive-accent-bg': 'rgba(79, 209, 197, 0.1)', // teal tint
    '--color-interactive-accent-fg': '#4FD1C5', // teal
    '--color-interactive-accent-border': '#4FD1C5', // teal
    '--color-button-primary-bg': '#4FD1C5', // teal
    '--color-button-primary-fg': '#1A202C', // deep charcoal
    '--color-error-bg': 'rgba(227, 52, 47, 0.2)', // red tint
    '--color-error-fg': '#E53E3E', // red-500
    '--color-error-border': '#C53030', // red-600
  },
  Luxurious: {
    '--color-bg': '#FDFBF7', // creamy off-white
    '--color-text-primary': '#3D2C2A', // deep espresso
    '--color-text-secondary': '#7A6A68', // softer brown
    '--color-text-accent': '#00695C', // emerald green
    '--color-border': '#DCD3C9', // light tan
    '--color-border-subtle': '#EAE5E0', // lighter tan
    '--color-interactive-accent-bg': '#E0F2F1', // light emerald tint
    '--color-interactive-accent-fg': '#004D40', // dark emerald
    '--color-interactive-accent-border': '#B2DFDB', // light emerald
    '--color-button-primary-bg': '#00695C', // emerald green
    '--color-button-primary-fg': '#FFFFFF',
    '--color-error-bg': 'rgba(206, 17, 38, 0.1)',
    '--color-error-fg': '#991b1b',
    '--color-error-border': '#fca5a5',
  },
  Nostalgic: {
    '--color-bg': '#f5f5f4', // stone-100
    '--color-text-primary': '#3f3c3a', // stone-700
    '--color-text-secondary': '#78716c', // stone-500
    '--color-text-accent': '#a16207', // yellow-700
    '--color-border': '#d6d3d1', // stone-300
    '--color-border-subtle': '#e7e5e4', // stone-200
    '--color-interactive-accent-bg': '#fef3c7', // amber-100
    '--color-interactive-accent-fg': '#b45309', // amber-700
    '--color-interactive-accent-border': '#fcd34d', // amber-300
    '--color-button-primary-bg': '#d97706', // amber-600
    '--color-button-primary-fg': '#ffffff',
    '--color-error-bg': 'rgba(239, 68, 68, 0.1)',
    '--color-error-fg': '#991b1b',
    '--color-error-border': '#fca5a5',
  },
  Minimal: {
    '--color-bg': '#ffffff',
    '--color-text-primary': '#000000',
    '--color-text-secondary': '#6b7280', // gray-500
    '--color-text-accent': '#111827', // gray-900
    '--color-border': '#e5e7eb', // gray-200
    '--color-border-subtle': '#f9fafb', // gray-50
    '--color-interactive-accent-bg': '#f3f4f6', // gray-100
    '--color-interactive-accent-fg': '#000000',
    '--color-interactive-accent-border': '#d1d5db', // gray-300
    '--color-button-primary-bg': '#000000',
    '--color-button-primary-fg': '#ffffff',
    '--color-error-bg': 'rgba(239, 68, 68, 0.1)',
    '--color-error-fg': '#b91c1c',
    '--color-error-border': '#f87171',
  },
};

// Styles control the application's architecture (fonts, shapes, shadows)
export const styleThemes: { [key: string]: Theme } = {
  Modern: {
    '--font-family': "'Inter', sans-serif",
    '--border-radius': '0.375rem', // rounded-md
    '--shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
  },
  Minimalist: {
    '--font-family': "'Inter', sans-serif",
    '--border-radius': '0rem',
    '--shadow': 'none',
  },
  Playful: {
    '--font-family': "'Poppins', sans-serif",
    '--border-radius': '0.75rem', // rounded-xl
    '--shadow': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
  },
  Corporate: {
    '--font-family': "'Inter', sans-serif",
    '--border-radius': '0.25rem', // rounded-sm
    '--shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow-sm
  },
  Brutalist: {
    '--font-family': "'Share Tech Mono', monospace",
    '--border-radius': '0rem',
    '--shadow': '4px 4px 0px var(--color-border)',
  },
  Cyberpunk: {
    '--font-family': "'Share Tech Mono', monospace",
    '--border-radius': '0rem',
    '--shadow': '0 0 8px var(--color-border), 0 0 4px var(--color-text-accent)',
  },
  Anime: {
    '--font-family': "'Poppins', sans-serif",
    '--border-radius': '0.5rem', // rounded-lg
    '--shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  Vintage: {
    '--font-family': "'Share Tech Mono', monospace",
    '--border-radius': '0.125rem', // rounded-xs
    '--shadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  Illustration: {
    '--font-family': "'Poppins', sans-serif",
    '--border-radius': '0.75rem',
    '--shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
};
