/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: { DEFAULT: '#E8B4B8', dark: '#C47A82', light: '#F5D5D8' },
        gold: { DEFAULT: '#D4A574', light: '#E8C9A0' },
        charcoal: { DEFAULT: '#2D2D2D', light: '#3D3D3D' },
        cream: '#FAF7F2',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}