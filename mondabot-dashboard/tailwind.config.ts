import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/ui/**/*.{js,ts,jsx,tsx}',
    './src/dashboard/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#170F3A',              // Updated brand color
        'brand-primary': '#170F3A',      // Brand primary color
        'brand-secondary': '#2D1B69',    // Brand secondary color
        background: '#FFF9F9',
        'content-bg': '#FFFFFF',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'sidebar-bg': '#FFFFFF',
        'icon-color': '#6B7280',
        'status-building': '#EC4899',    // Pink
        'status-testing': '#007AFF',     // Blue
        'status-review': '#FF6B35',      // Orange-Red
        'status-live': '#34C759',        // Green
        // Additional premium colors
        'gray-50': '#F8FAFC',
        'gray-100': '#F1F5F9',
        'gray-200': '#E2E8F0',
        'gray-300': '#CBD5E1',
        'gray-400': '#94A3B8',
        'gray-500': '#64748B',
        'gray-600': '#475569',
        'gray-700': '#334155',
        'gray-800': '#1E293B',
        'gray-900': '#0F172A',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.1)',
        'premium': '0 10px 40px rgba(23, 15, 58, 0.1)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        '0.75': '0.1875rem',
      },
    },
  },
  plugins: [],
};

export default config; 