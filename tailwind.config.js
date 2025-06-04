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
        },
        'electric': {
          DEFAULT: '#00FF88',
          dark: '#00CC6E',
        },
        'charcoal': '#2D3748',
        'slate': '#4A5568',
        'cyan': '#00E5FF',
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
