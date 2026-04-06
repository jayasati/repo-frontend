import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',   // ← MISSING
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',       // ← MISSING
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',   // ← MISSING
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',         // ← MISSING
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT:  '#09090B',
          surface:  '#111113',
          surface2: '#18181B',
        },
        border: {
          DEFAULT: '#27272A',
          2:       '#3F3F46',
        },
        text: {
          DEFAULT: '#FAFAFA',
          muted:   '#71717A',
          dim:     '#52525B',
        },
        accent: {
          DEFAULT: '#A3E635',
          dim:     '#1a2d06',
        },
        ra: {
          amber:       '#FCD34D',
          'amber-dim': '#2d1f04',
          red:         '#F87171',
          'red-dim':   '#2d0f0f',
          blue:        '#60A5FA',
          'blue-dim':  '#0d1f3a',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
        sans: ['var(--font-sans)', 'IBM Plex Sans', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config