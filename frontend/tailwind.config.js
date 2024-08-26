/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width',
        'opacity': 'opacity',
      },
    },
    colors: {
      violet: '#766ED3',
      lightGray: '#D9D9D9',
      white: '#FFFFFF',
      black: '#000000',
      palePink: '#FBF8F8',
      red: '#FF0000',
    },
  },
  plugins: [],
}

