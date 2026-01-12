/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.jsx",
    "./src/**/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#374151',
        }
      }
    },
  },
  plugins: [],
}