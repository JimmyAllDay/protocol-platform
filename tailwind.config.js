/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        accent: '#B4FEE7',
        accent2: '#FFADD3',
        accentGrey: '#3C3C3C',
      },
      backgroundColor: {
        primary: '#000000', // Set the default background color to black
      },
      textColor: {
        primary: '#ffffff', // Set the default text color to white
      },
    },
  },
  plugins: [],
};
