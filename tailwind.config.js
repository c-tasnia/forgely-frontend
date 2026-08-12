/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // indigo — primary brand color
          light: "#818CF8",
          dark: "#3730A3",
        },
        accent: {
          DEFAULT: "#14B8A6", // teal — secondary accent (GitHub/activity signals)
          light: "#5EEAD4",
          dark: "#0F766E",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};
