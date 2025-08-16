const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        golden: '#D4AF37',
        stone: '#1A1A1A',
        'text-active': '#FFFFFF',
        'text-inactive': '#C7C7C7',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'ui-serif', 'serif'],
        'body': ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'display-bold': '700',
        'display-black': '800',
        'body-normal': '400',
        'body-medium': '500',
      },
      letterSpacing: {
        'display': '0.06em',
        'wide': '0.025em',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        'golden': '0 4px 20px rgba(212, 175, 55, 0.2)',
        'golden-lg': '0 10px 40px rgba(212, 175, 55, 0.3)',
        'glow': '0 0 60px rgba(100, 100, 255, 0.1), 0 0 100px rgba(150, 50, 200, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'custom': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}

export default config