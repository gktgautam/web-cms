import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e2edff',
          200: '#c7dbff',
          300: '#a4c3ff',
          400: '#7aa3ff',
          500: '#4d7dff',
          600: '#325bf5',
          700: '#2444d7',
          800: '#1d38ad',
          900: '#1c2f84',
        },
      },
      boxShadow: {
        'glow': '0 10px 40px rgba(77, 125, 255, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config
