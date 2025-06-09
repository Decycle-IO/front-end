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
          DEFAULT: '#0F4C3A',
          light: '#1A6E54',
          dark: '#0A3527',
        },
        'electric': {
          DEFAULT: '#4ADE80',
          dark: '#22C55E',
        },
        'charcoal': '#2D3748',
        'slate': '#4A5568',
        'cyan': '#00E5FF',
        'blue': {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        'turquoise': {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
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
