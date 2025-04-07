/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/ui/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a5c8df",
        secondary: "#4E7D9C",
        secondary_hover: "#446D88",
        secondary_hover_light: "#6A96B4",
        secondary_hover_light2: "#85A9C1",
        secondary_light: "#cbebf6",
        secondary_dark: "#3E627A",
        accent: "#A72E1E",
        brand: {
          light: "#FCFBF1",
          dark: "#0D263E",
          dark_black: "#232323",
        },
      },
    },
  },
  plugins: [],
};
