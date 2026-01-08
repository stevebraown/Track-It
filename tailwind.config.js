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
        // Design tokens: neutral base with accent colors
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          hover: '#2563eb',    // blue-600
          light: '#dbeafe',    // blue-100
        },
        success: {
          DEFAULT: '#10b981', // emerald-500
          hover: '#059669',    // emerald-600
          light: '#d1fae5',    // emerald-100
        },
        destructive: {
          DEFAULT: '#ef4444', // red-500
          hover: '#dc2626',    // red-600
          light: '#fee2e2',    // red-100
        },
        // Neutral palette (stone/gray)
        background: {
          light: '#ffffff',
          dark: '#0f172a',     // slate-900
        },
        surface: {
          light: '#f8fafc',    // slate-50
          dark: '#1e293b',     // slate-800
        },
        border: {
          light: '#e2e8f0',    // slate-200
          dark: '#334155',     // slate-700
        },
        text: {
          primary: {
            light: '#0f172a',  // slate-900
            dark: '#f1f5f9',   // slate-100
          },
          secondary: {
            light: '#64748b',  // slate-500
            dark: '#94a3b8',   // slate-400
          },
        },
      },
      spacing: {
        // 4/8/12/16/24 scale
        '4': '0.25rem',   // 4px
        '8': '0.5rem',    // 8px
        '12': '0.75rem',  // 12px
        '16': '1rem',     // 16px
        '24': '1.5rem',   // 24px
      },
      borderRadius: {
        // 4/8 scale
        '4': '0.25rem',   // 4px
        '8': '0.5rem',    // 8px
      },
      fontSize: {
        // Heading sizes
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        // Body
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
