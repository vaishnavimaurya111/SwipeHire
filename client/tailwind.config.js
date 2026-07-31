/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f0c20',
          card: '#181432',
          purple: '#6366f1',
          pink: '#ec4899',
          orange: '#f97316',
          gradientStart: '#1e1b4b',
          gradientMid: '#831843',
          gradientEnd: '#431407',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
};
