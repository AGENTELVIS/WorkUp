/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBg: "#F9FAFB",
        darkBg: "#1F2937",
        lightText: "#111827",
        darkText: "#F3F4F6",
        primary: "#3B82F6",
      },
    },
  },
  plugins: [],
};
