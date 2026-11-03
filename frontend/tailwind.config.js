/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        primary: { 50:'#f0f4ff', 100:'#dce6ff', 200:'#b9ccff', 300:'#87a4ff', 400:'#536fff', 500:'#2847f5', 600:'#1a31d9', 700:'#1425b0', 800:'#152190', 900:'#161f73' },
        gold: { 400:'#f0b429', 500:'#de911d', 600:'#cb6e17' }
      }
    }
  },
  plugins: []
}
