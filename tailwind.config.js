/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        va: {
          blue: '#003f72',
          deepblue: '#002855',
          gold: '#f5c400',
          cream: '#f5f0e8',
          muted: '#a8c4d8',
          panel: '#1a4a70',
          mapbg: '#ddeef8',
          statebg: '#dcddde',
          stroke: '#546670',
        },
      },
      fontFamily: {
        sans: ["'Myriad Pro'", "'Source Sans 3'", "'Source Sans Pro'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
