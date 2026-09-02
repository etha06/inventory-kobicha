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
        canvas: {
          DEFAULT: '#e4ede3',
          light: '#edf3eb',
          dark: '#d6e2d4',
        },
        forest: {
          50: '#f4f7f3',
          100: '#e5ece3',
          500: '#4c6c44',
          700: '#31442c',
          800: '#243422',
          900: '#1a2618',
        },
        sage: {
          50: '#f4f7f3',
          100: '#e5ece3',
          200: '#ccd9c9',
          300: '#aabfa6',
          400: '#84a97c',
          500: '#608356',
          600: '#4c6c44',
          700: '#3d5637',
          800: '#32452d',
          900: '#2b3b27'
        },
        peach: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fbd7ac',
          300: '#f7bc77',
          400: '#f0b36c',
          500: '#e88b48',
          600: '#cf6621',
          700: '#ac4d1d',
          800: '#8b3f1f',
          900: '#72361d'
        },
        lilac: {
          50: '#fbf9fc',
          100: '#f4f0f7',
          200: '#ebdfee',
          300: '#dec6e2',
          400: '#caa4d1',
          500: '#b89fc8',
          600: '#9b66a5',
          700: '#815189',
          800: '#6b4470',
          900: '#4c2d5d'
        },
        rose: {
          50: '#faf5f5',
          100: '#f4e9e9',
          200: '#ebd5d5',
          300: '#ddb5b5',
          400: '#ca8c8c',
          500: '#d49292',
          600: '#a35353',
          700: '#874242',
          800: '#713939',
          900: '#612727'
        },
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
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(36, 52, 34, 0.07)',
        'floating': '0 20px 50px -10px rgba(36, 52, 34, 0.12)',
        'pill': '0 4px 14px rgba(232, 139, 72, 0.35)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
        rounded: ['"Nunito"', '"Quicksand"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Nunito"', '"Quicksand"', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
