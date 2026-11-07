/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#0F1219',
        surface: '#1A1E28',
        elevated: '#252A37',
        line: '#343A4A',
        edge: '#7B8398', // borders of form controls: 4.6:1 on surface, meets 3:1 for UI components
        ink: '#F7F4EA',
        muted: '#A9AFBD',
        accent: { DEFAULT: '#FFC93C', dark: '#FFD76B' }, // duck yellow: primary buttons, selected states, rank 1
        orange: '#FF8A3D',
        info: '#3DB8C9',
        success: '#5BD38A',
        danger: '#FF6B6B',
        onduck: '#0F1219', // dark text on yellow
      },
      fontFamily: { sans: ['"Atkinson Hyperlegible"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'] },
    },
  },
  plugins: [],
}
