/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        surface: '#121212',
        primary: '#D4AF37',
        primaryHover: '#F4D061',
        text: '#F8F8F8',
        'text-secondary': '#9CA3AF',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Prata', 'serif'],
      },
    },
  },
  plugins: [],
}
