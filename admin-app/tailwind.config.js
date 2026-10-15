/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        desk: "#12110f",
        panel: "#1c1a17",
        ivory: "#f4f0e8",
        copper: "#b5683d",
        mist: "#a39e94",
        line: "#2a2723",
      },
      fontFamily: {
        sans: ["Libre Franklin", "Segoe UI", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
