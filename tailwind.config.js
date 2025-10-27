// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#FFFAE6",
          100: "#FFF3C4",
          200: "#FFE89A",
          300: "#FFE070",
          400: "#FFD700",  // primary gold
          500: "#E6BE8A",  // warm muted gold
          600: "#D4AF37",  // classic gold
          700: "#B8860B",  // dark goldenrod
          800: "#8B6B05",
          900: "#5A4300",
        },
      },
    },
  },
  plugins: [],
};
