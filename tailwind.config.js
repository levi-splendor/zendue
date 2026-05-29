/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e6edff",
          200: "#c7d9ff",
          300: "#8bb3ff",
          400: "#4a8dff",
          500: "#0056cc",
          600: "#0048b3",
          700: "#003a8a",
          800: "#002c6b",
          900: "#001a40",
        },
        chronos: "#0056cc",
      },
      animation: {
        ring: "ring 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
