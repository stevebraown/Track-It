/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design tokens: TimePad-inspired palette
        primary: {
          DEFAULT: '#6C5DD3',
          hover: '#5A4DC8',
          light: '#E8E4FB',
          start: '#6C5DD3',
          end: '#8B7FE8',
        },
        success: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          light: '#dcfce7',
        },
        destructive: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          light: '#fee2e2',
        },
        background: {
          light: '#F5F5F7',
          dark: '#1A1D29',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#252836',
        },
        border: {
          light: '#E6E7EC',
          dark: '#2F3349',
        },
        text: {
          primary: {
            light: '#1B1E28',
            dark: '#E4E4E7',
          },
          secondary: {
            light: '#6B7280',
            dark: '#A1A1AA',
          },
        },
        pastel: {
          pink: '#F6A8C6',
          orange: '#F7B267',
          green: '#7CD992',
          cyan: '#7FD1E8',
        },
        category: {
          health: '#10B981',
          fitness: '#F59E0B',
          learning: '#3B82F6',
          productivity: '#8B5CF6',
          social: '#EC4899',
          mindfulness: '#14B8A6',
          creativity: '#F97316',
          finance: '#06B6D4',
          sleep: '#6366F1',
          nutrition: '#84CC16',
          reading: '#A855F7',
          hobby: '#EAB308',
        },
        state: {
          completed: '#10B981',
          missed: '#EF4444',
          future: '#D1D5DB',
        },
      },
      spacing: {
        // 4/8/12/16/20/24 scale
        '4': '0.25rem',
        '8': '0.5rem',
        '12': '0.75rem',
        '16': '1rem',
        '20': '1.25rem',
        '24': '1.5rem',
      },
      borderRadius: {
        '4': '0.25rem',
        '8': '0.5rem',
        '12': '0.75rem',
        '16': '1rem',
        '20': '1.25rem',
        '24': '1.5rem',
      },
      fontSize: {
        'display': ['2.75rem', { lineHeight: '3.25rem', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'h3': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'DEFAULT': '0 6px 16px rgba(16, 24, 40, 0.08)',
        'md': '0 12px 24px rgba(16, 24, 40, 0.12)',
        'lg': '0 20px 32px rgba(16, 24, 40, 0.16)',
        'card': '0 8px 20px rgba(16, 24, 40, 0.08)',
        'card-hover': '0 16px 32px rgba(16, 24, 40, 0.14)',
      },
    },
  },
  plugins: [],
}
