import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── BRAND COLORS ────────────────────────────────────────
      colors: {
        terra: {
          DEFAULT: '#C4622D',
          light:   '#D97B48',
          pale:    '#F5EBE0',
          dark:    '#8B3D18',
        },
        gold: {
          DEFAULT: '#C9972B',
          light:   '#E8B84B',
          pale:    '#FBF3DC',
          dark:    '#8B6618',
        },
        ink: {
          DEFAULT: '#1A1208',
          soft:    '#2D1F10',
          muted:   '#5C3A1E',
        },
        cream: {
          DEFAULT: '#FAF6EF',
          dark:    '#F0EAE0',
        },
        'warm-white': '#FFFDF9',
        'muted-brand': '#8C7B6B',
        'border-warm': '#E8DDD0',

        // Portal accents
        portal: {
          customer:  '#C4622D',  // terra
          driver:    '#059669',  // emerald
          dispatch:  '#2563EB',  // blue
          admin:     '#C4622D',  // terra
          warehouse: '#7C3AED',  // violet
          agent:     '#C9972B',  // gold
          customs:   '#0891B2',  // cyan
          analytics: '#DB2777',  // pink
        },
      },

      // ── TYPOGRAPHY ──────────────────────────────────────────
      fontFamily: {
        playfair:   ['var(--font-playfair)', 'Georgia', 'serif'],
        instrument: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        mono:       ['var(--font-mono)', 'Courier New', 'monospace'],
      },

      // ── SHADOWS ─────────────────────────────────────────────
      boxShadow: {
        'card':    '0 1px 4px rgba(26,18,8,0.07), 0 4px 16px rgba(26,18,8,0.06)',
        'card-md': '0 4px 16px rgba(26,18,8,0.10)',
        'card-lg': '0 8px 40px rgba(26,18,8,0.12)',
        'terra':   '0 4px 14px rgba(196,98,45,0.3)',
        'gold':    '0 4px 14px rgba(201,151,43,0.3)',
      },

      // ── BORDER RADIUS ────────────────────────────────────────
      borderRadius: {
        brand: '6px',
        'brand-lg': '10px',
        'brand-xl': '14px',
      },

      // ── ANIMATIONS ───────────────────────────────────────────
      keyframes: {
        'live-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(34,197,94,0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 1.8s infinite',
        'slide-up':   'slide-up 0.4s ease forwards',
        'fade-in':    'fade-in 0.3s ease forwards',
        'marquee':    'marquee 20s linear infinite',
        'float':      'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
