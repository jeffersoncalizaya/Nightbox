import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b0e",
        surface: {
          50: "#1f1f26",
          100: "#18181f",
          200: "#131318",
          300: "#0e0e12",
          DEFAULT: "#141419",
        },
        card: "#121216",
        night: {
          red: {
            400: "#f43f5e",
            500: "#e11d48",
            600: "#e50914",
            700: "#dc2626",
            DEFAULT: "#e11d48",
            hover: "#be123c",
          },
          border: "#23232b",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
