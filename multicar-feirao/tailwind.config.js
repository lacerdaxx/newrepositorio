/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        coal: '#101010',
        brand: { DEFAULT: '#FF6A00', neon: '#FF8A00' },
        steel: '#A8A8A8',
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
