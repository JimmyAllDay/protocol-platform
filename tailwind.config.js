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
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      colors: {
        accent: '#B4FEE7',
        accent2: '#FFADD3',
        accent3: '#6495ED',
        accentGrey: '#3C3C3C',
        background: '#000000',
      },
      backgroundColor: {
        primary: '#000000',
      },
      textColor: {
        primary: '#ffffff',
      },
      gridTemplateRows: {
        10: 'repeat(10, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
