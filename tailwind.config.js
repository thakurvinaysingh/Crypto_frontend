/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      colors: {
        bg: {
          DEFAULT: '#0b1016',   // page background
          card: '#121826',      // glass/card background
        },
        primary: {
          DEFAULT: '#2F80ED',   // blue
          soft: '#58A6FF',
          dark: '#2563EB',
        },
        neutral: {
          800: '#1C2333',
          900: '#0E1524',
        }
      },
      boxShadow: {
        glass: '0 20px 70px rgba(0,0,0,.45)',
        innerGlow: 'inset 0 0 0 1px rgba(88,166,255,.2), 0 0 30px rgba(88,166,255,.15)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      spacing: {
        'safe': 'max(env(safe-area-inset-bottom), 20px)',
      }
    },
  },
  plugins: [],
}
