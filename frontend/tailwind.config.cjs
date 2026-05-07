module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        label: ['"Space Grotesk"', 'sans-serif'],
        sora: ['"Sora"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        base: {
          900: '#0b0f14',
          800: '#111827',
          700: '#1f2937'
        },
        cyber: {
          300: '#5ef2d9',
          400: '#2de2c4',
          500: '#12c7b3',
          600: '#0ea59a'
        },
        neon: {
          400: '#69f0ff',
          500: '#22d3ee'
        },
        accent: {
          400: '#f5a524',
          500: '#f97316'
        },
        'surface-container-high': '#242a34',
        'tertiary-fixed-dim': 'rgb(var(--color-tertiary-fixed-dim) / <alpha-value>)',
        'secondary-fixed-dim': 'rgb(var(--color-secondary-fixed-dim) / <alpha-value>)',
        'surface-container-lowest': '#080f18',
        'surface-dim': '#0d141d',
        'secondary-container': 'rgb(var(--color-secondary-container) / <alpha-value>)',
        'on-secondary-fixed-variant': '#5700c9',
        'on-primary-fixed-variant': '#004f54',
        'on-primary-fixed': '#002022',
        'inverse-primary': '#006970',
        'error-container': '#93000a',
        'on-error': '#690005',
        error: '#ffb4ab',
        'on-tertiary-fixed-variant': '#005231',
        'inverse-on-surface': '#2a313b',
        'on-surface': '#dce3f0',
        'outline-variant': '#3b494b',
        background: '#0d141d',
        'surface-variant': '#2e353f',
        'surface-tint': '#00dbe9',
        'on-surface-variant': '#b9cacb',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'on-tertiary-fixed': '#002111',
        'on-secondary': '#3c0090',
        'primary-fixed-dim': 'rgb(var(--color-primary-fixed-dim) / <alpha-value>)',
        'on-tertiary-container': '#006d43',
        'surface-container-highest': '#2e353f',
        'surface-container-low': '#151c26',
        outline: '#849495',
        'on-error-container': '#ffdad6',
        'tertiary-fixed': '#52ffac',
        'secondary-fixed': '#e9ddff',
        'surface-container': '#19202a',
        'primary-fixed': '#7df4ff',
        tertiary: '#daffe4',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'on-secondary-container': '#ddcdff',
        'inverse-surface': '#dce3f0',
        'tertiary-container': '#00f89e',
        'on-primary-container': '#006970',
        'on-background': '#dce3f0',
        'on-tertiary': '#003920',
        surface: '#0d141d',
        'on-secondary-fixed': '#23005b',
        'on-primary': '#00363a',
        'surface-bright': '#333a44',
        'primary-container': 'rgb(var(--color-primary-container) / <alpha-value>)'
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 238, 0.35)'
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at 1px 1px, rgba(94, 242, 217, 0.15) 1px, transparent 0)',
        'hero-glow': 'radial-gradient(circle at top, rgba(18, 199, 179, 0.25), transparent 60%)'
      }
    }
  },
  plugins: []
};
