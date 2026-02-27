import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'rgba(44, 62, 80, 0.12)',
        input: 'rgba(44, 62, 80, 0.12)',
        ring: '#2D6CDF',
        background: '#FDF6E3',
        foreground: '#2C3E50',
        primary: {
          DEFAULT: '#8B7355',
          foreground: '#FFFFFF',
          light: '#A48F76',
          dark: '#6E5A43',
        },
        secondary: {
          DEFAULT: '#E2725B',
          foreground: '#FFFFFF',
          light: '#E8917D',
          dark: '#C45D48',
        },
        accent: {
          DEFAULT: '#87A96B',
          foreground: '#2C3E50',
          light: '#9FBA88',
          dark: '#6F8A56',
        },
        info: {
          DEFAULT: '#2D6CDF',
          foreground: '#FFFFFF',
        },
        header: {
          DEFAULT: '#1E3A8A',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#C2413A',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        error: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2C3E50',
        },
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        script: ['var(--font-dancing-script)', 'cursive'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(139, 115, 85, 0.08)',
        DEFAULT: '0 4px 12px rgba(139, 115, 85, 0.1)',
        md: '0 6px 16px rgba(139, 115, 85, 0.12)',
        lg: '0 8px 24px rgba(139, 115, 85, 0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

export default config