/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'cod-gray': '#0A0A0A',
        'storm-gray': '#717182',
        'vermilion': '#F54900',
        'jaguar': '#030213',
        'athens-gray': '#ECECF0',
        'persian-green': '#009689',
        'eden': '#104E64',
        'selective-yellow': '#FE9A00',
      }
    },
  },
  plugins: [],
}
