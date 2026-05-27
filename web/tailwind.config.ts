import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f0f2",
          100: "#ebe0e5",
          200: "#d4bcc6",
          300: "#b892a3",
          400: "#9a6a7f",
          500: "#7a2e47",
          600: "#6b2840",
          700: "#5c2230",
          800: "#4a1b27",
          900: "#3a1520",
        },
        violet: {
          accent: "#5c2fc0",
          deep: "#4a2599",
          light: "#ede9fe",
          soft: "#f3f0fa",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(122,46,71,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
