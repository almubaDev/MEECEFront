/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors: {
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },
      },
      spacing: {
        '128': '32rem',
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}