import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: {
          DEFAULT: '#4338ca',
          light: '#6366f1',
          dark: '#312e81'
        }
      }
    }
  },
  plugins: []
}
