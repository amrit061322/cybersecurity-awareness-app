module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif']
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
        }
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
