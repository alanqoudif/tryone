/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme (default)
        background: '#0B0F14',
        card: '#12161C',
        border: '#1C232C',
        text: '#EAF0F6',
        muted: '#A7B1BC',
        primary: '#2F81FF',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        // Light theme variants
        'light-background': '#FFFFFF',
        'light-card': '#F8FAFC',
        'light-border': '#E2E8F0',
        'light-text': '#1E293B',
        'light-muted': '#64748B',
      },
      borderRadius: {
        'card': '12px',
        'button': '24px',
      },
      spacing: {
        'grid': '8px',
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'h2': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'caption': ['13px', { lineHeight: '18px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

