/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/ui/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a5c8df",
        primary_light: "#B5D1E3",
        secondary: "#4E7D9C",
        secondary_hover: "#446D88",
        secondary_hover_light: "#6A96B4",
        secondary_hover_light2: "#85A9C1",
        secondary_light: "#cbebf6",
        secondary_dark: "#3E627A",
        brown_color: "#6A5431",
        accent: "#A72E1E",
        brand: {
          light: "#FCFBF1",
          dark: "#0D263E",
          dark_black: "#232323",
        },
      },
      boxShadow: {
        "soft-light": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "soft-dark": "0 4px 6px rgba(0, 0, 0, 0.73)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0.2" },
          "20%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 1.4s infinite both",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    extend: {
      boxShadow: ["dark"],
    },
  },
};
