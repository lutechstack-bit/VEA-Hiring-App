import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          primary: '#0A0A0F',
          secondary: '#151521',
          tertiary: '#1E1B2E',
          elevated: '#252339',
        },
        brand: {
          purple: '#8B5CF6',
          purpleLight: '#A78BFA',
          purpleDeep: '#6D28D9',
          purpleGlow: '#C4B5FD',
        },
        border: {
          subtle: 'rgba(139, 92, 246, 0.1)',
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(139, 92, 246, 0.3)',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
          muted: '#71717A',
          accent: '#A78BFA',
        },
        status: {
          success: '#10B981',
          successBg: 'rgba(16, 185, 129, 0.1)',
          warning: '#F59E0B',
          warningBg: 'rgba(245, 158, 11, 0.1)',
          danger: '#EF4444',
          dangerBg: 'rgba(239, 68, 68, 0.1)',
          info: '#8B5CF6',
          infoBg: 'rgba(139, 92, 246, 0.1)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 30px rgba(139, 92, 246, 0.15)',
        'glow-lg': '0 0 48px rgba(139, 92, 246, 0.2)',
      },
      backgroundImage: {
        'radial-purple':
          'radial-gradient(ellipse at center, rgba(139,92,246,0.12), transparent 70%)',
        'gradient-brand':
          'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
        'gradient-brand-pressed':
          'linear-gradient(90deg, #6D28D9 0%, #8B5CF6 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.35)' },
          '50%': { boxShadow: '0 0 0 8px rgba(139, 92, 246, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
