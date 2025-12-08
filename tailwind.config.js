/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "ecare-teal": "#009688",
        "ecare-teal-dark": "#00796B",
        "ecare-light": "#E0F2F1",
        "text-main": "#1F2937",
        "text-muted": "#6B7280",
        "bg-main": "#F3F4F6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
