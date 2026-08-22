export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        canvas: '#f8fafc',
        surface: '#ffffff',
        hairline: '#e2e8f0',
        ink: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
          soft: '#94a3b8',
        },
        status: {
          present: '#16a34a',
          halfday: '#f59e0b',
          absent: '#dc2626',
          leave: '#0ea5e9',
        },
      },
      boxShadow: {
        panel: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        pop: '0 12px 32px -8px rgba(15, 23, 42, 0.18)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
