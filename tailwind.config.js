/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7f4',
          100: '#f6ede7',
          200: '#edd9ce',
          300: '#debea9',
          400: '#cb9c80',
          500: '#b87c5c',
          600: '#a36447',
          700: '#854e38',
          800: '#6c4130',
          900: '#58362a',
          950: '#321c15',
        },
        kobicha: {
          light: '#f5f0eb',
          DEFAULT: '#6B4423',
          dark: '#3d2512',
          accent: '#c89d7c',
          warm: '#dfcbba'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
