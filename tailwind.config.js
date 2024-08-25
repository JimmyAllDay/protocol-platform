/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
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
        accent: '#C0C0C0',
        accentDark: '#B4FEE7',
        accent2: '#404040',
        accent2Dark: '#FFADD3',
        accent3: '#00000066',
        accent3Dark: '#6495ED',
        accentGrey: '#3C3C3C',
        accentGreyDark: '#3C3C3C',
        background: '#FF6347',
        backgroundDark: '#000000',
        border: '#000000',
        borderDark: '#FFFFFF',
      },
      backgroundColor: {
        primary: '#FF6347',
        primaryDark: '#000000',
      },
      textColor: {
        primary: '#000000',
        primaryDark: '#ffffff',
      },
      gridTemplateRows: {
        10: 'repeat(10, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
