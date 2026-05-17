/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#2353E8',
          600: '#1a3cc4',
          50:  '#EEF2FF',
          100: '#E0E7FF',
        },
      },
    },
  },
  plugins: [],
};
