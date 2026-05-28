import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F9F8F5',
        ink: {
          DEFAULT: '#3A3533',
          mid: '#6B6868',
          light: '#C9C5B9',
          soft: '#B0AEAD',
        },
        red: {
          brand: '#E81C24',
        },
      },
      fontFamily: {
        slab: ['"Roboto Slab"', 'Georgia', 'serif'],
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pill: '0 0 1px rgba(58,53,51,0.2), 0 2px 6px rgba(58,53,51,0.1)',
        bar: '0 0 0.5px rgba(58,53,51,0.25), 0 1px 2px rgba(58,53,51,0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
