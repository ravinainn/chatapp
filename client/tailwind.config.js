/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        font1: ["Arial", "Helvetica", "Tahoma", "Verdana"],
      },
      colors: {
        color1: "#4d4d4d",
      },
    },
  },
  plugins: [],
};
