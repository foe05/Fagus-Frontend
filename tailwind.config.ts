import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3E4E3A',
          light: '#6B8E5C',
        },
        secondary: {
          DEFAULT: '#9CAF88',
        },
        accent: {
          DEFAULT: '#8B7355',
        },
        text: {
          dark: '#2C2C2C',
          medium: '#616161',
          light: '#9E9E9E',
        },
        bg: {
          light: '#F8F8F8',
        },
        border: {
          light: '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-ring': 'pulse 2.5s ease-in-out infinite',
        'fade-in-pop': 'fadeInPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInPop: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
