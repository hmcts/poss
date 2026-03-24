import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        draft: '#d97706',
        live: '#16a34a',
        end: '#1e293b',
        uncertain: '#6b7280',
        warning: '#d97706',
      },
    },
  },
  plugins: [],
};

export default config;
