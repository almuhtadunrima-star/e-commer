/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nike: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        nike: {
          dark: '#111111',
          gray: '#707072',
          lightgray: '#F5F5F5',
          border: '#E5E5E5',
          accent: '#FA5400',
        }
      }
    },
  },
  plugins: [],
};
