/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#07050E',
          900: '#0D091B',
          850: '#130E26',
          800: '#1B1436',
          700: '#2A1F52',
        },
        champagne: {
          100: '#FDFBF7',
          200: '#F7F0E3',
          300: '#EDE0C8',
          400: '#E1CDA8',
          500: '#D4AF37',
          600: '#B8902A',
        },
        rose: {
          100: '#FBF0F1',
          200: '#F4D8DB',
          300: '#E7B7BD',
          400: '#D58F99',
          500: '#BC6B77',
          600: '#9E4E5A',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FAF7F0',
          200: '#F3EDE2',
          300: '#E8DFC8',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'flame-flicker': 'flameFlicker 0.4s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        flameFlicker: {
          '0%': { transform: 'scale(1) skewX(-1.5deg)', filter: 'drop-shadow(0 0 10px rgba(255, 180, 80, 0.8))' },
          '50%': { transform: 'scale(1.04, 0.96) skewX(1deg)', filter: 'drop-shadow(0 0 14px rgba(255, 195, 100, 0.95))' },
          '100%': { transform: 'scale(0.97, 1.05) skewX(-0.5deg)', filter: 'drop-shadow(0 0 9px rgba(255, 170, 70, 0.75))' },
        }
      }
    },
  },
  plugins: [],
}
