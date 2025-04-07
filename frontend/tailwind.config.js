/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/ui/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#81B1D1",
        secondary: "#4E7D9C",
        secondary_light: "#D9F0F8",
        accent: "#FFBC70",
        brand: {
          light: "#FBF9E3",
          dark: "#0D263E",
        },
      },
    },
  },
  plugins: [],
};
