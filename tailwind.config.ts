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
          DEFAULT: "#2D9B83",
          hover: "#238A72",
          subtle: "#E8F5F2",
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
      },
      fontSize: {
        "hero": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "section": ["40px", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};
export default config;
