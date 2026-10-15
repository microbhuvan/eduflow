/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f3efe7",
        ink: "#1c1917",
        pine: "#1f3d36",
        pineDeep: "#142924",
        line: "#e4ddd2",
        brass: "#8a5a32",
      },
      fontFamily: {
        sans: ["Libre Franklin", "Segoe UI", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
