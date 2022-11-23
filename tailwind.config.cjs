/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          main: {
            100: "#0F3460",
            200: "#16213E"
          },
          secondary: {
            100: "#533483",
            200: '#402866'
          },
          secondaryVariant1: {
            100: "#E94560",
            200: "#e82e4d"
          }

        }
      }
    },
  },
  plugins: [],
};
