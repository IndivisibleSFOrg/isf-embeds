/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
      colors: {
        'isf-blue': {
          dark: '#1a3570',
          DEFAULT: '#2547a0',
          light: '#3a6bbf',
        },
        'isf-red': {
          dark: '#a8180f',
          DEFAULT: '#c1211f',
          bright: '#e8463f',
        },
        'isf-gold': {
          deep: '#f5b800',
          DEFAULT: '#f9c430',
          pale: '#fde68a',
        },
        'isf-navy': '#1c2440',
        'isf-slate': '#6b7a99',
        'isf-tinted': '#e8edf5',
        'isf-success': '#2d8a55',
      },
    },
  },
  plugins: [],
}
