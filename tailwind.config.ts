import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1B3A6B",
          hover: "#152D54",
          subtle: "#EEF2F9",
        },
        navy: {
          50: "#EEF2F9",
          100: "#D4DEEF",
          500: "#2B5BA8",
          600: "#1B3A6B",
          700: "#152D54",
          900: "#0B1929",
        },
        ink: {
          DEFAULT: "#0F1117",
          muted: "#9CA3AF",
          secondary: "#6B7280",
          body: "#374151",
        },
        surface: {
          warm: "#FAFAF8",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
      fontSize: {
        hero: [
          "64px",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        section: [
          "40px",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
