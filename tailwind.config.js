/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080b",
        surface: "#101015",
        "surface-light": "#171720",
        "surface-card": "#13131b",
        border: "#242432",
        "border-light": "#323245",
        rockstar: {
          50: "#fff1f2",
          500: "#e50914",
          600: "#dc2626",
          700: "#b91c1c",
          glow: "rgba(229, 9, 20, 0.35)",
        },
        gold: {
          500: "#f59e0b",
          600: "#d97706",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        "rockstar-glow": "0 0 25px -5px rgba(229, 9, 20, 0.4)",
        "card-glow": "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
      }
    },
  },
  plugins: [],
};
