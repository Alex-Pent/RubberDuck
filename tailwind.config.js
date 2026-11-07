/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F0',
        ink: '#1F2933',
        muted: '#4A5560',
        // One accent: deep teal. #0F5F5C on white = 7.6:1
        accent: { DEFAULT: '#0F5F5C', dark: '#0A4745', soft: '#E3F2F0' },
        line: '#D9D2C5',
      },
      fontFamily: { sans: ['"Atkinson Hyperlegible"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'] },
    },
  },
  plugins: [],
}
