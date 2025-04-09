/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'empire-yellow': '#FFDD00',
        'empire-white-70': 'rgba(255, 255, 255, 0.7)',
        'empire-dark': '#0F1515',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        'archivo-narrow': ['"Archivo Narrow"', 'sans-serif'],
        'archivo': ['Archivo', 'sans-serif'],
      },
      fontSize: {
        'heading': '34px',
        'nav': '20px',
        'nav-mobile': '14px',
        'xs': '12px',
      },
      lineHeight: {
        'heading': '40px',
        'nav': '30px',
        'nav-mobile': '20px',
      },
      width: {
        'container': '1440px',
        'content': '1145px',
      },
      height: {
        'footer': {
          'DEFAULT': '360px',
          'mobile': '280px',
        },
      },
    },
  },
  plugins: [],
}
