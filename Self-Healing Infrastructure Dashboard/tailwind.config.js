export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#070a12',
          850: '#0a0f1a',
          800: '#0d1420',
          750: '#111a29',
          700: '#16203180',
        },
        line: '#1c2637',
        ok: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
        info: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.45)' },
          '70%': { boxShadow: '0 0 0 8px rgba(34,197,94,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0)' },
        },
        flowDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'flow-down': 'flowDown 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
