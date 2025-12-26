/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': {
          DEFAULT: '#328e60',
          light: '#4aa874',
          dark: '#256d48',
        },
        'electric': {
          DEFAULT: '#beec71',
          light: '#d0f29a',
          dark: '#a2d84a',
        },
        'sky': {
          DEFAULT: '#5aade2',
          light: '#79bee8',
          dark: '#3b9acc',
        },
        'charcoal': '#000000',
        'slate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          DEFAULT: '#4A5568',
        },
        'white': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
