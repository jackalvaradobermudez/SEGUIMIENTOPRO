import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "var(--bg-app)",
        canvas: "var(--bg-canvas)",
        shell: "var(--bg-shell)",
        surface1: "var(--surface-1)",
        surface2: "var(--surface-2)",
        surface3: "var(--surface-3)",
        brand: {
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
        },
        info: "var(--info-500)",
        success: "var(--success-500)",
        warning: "var(--warning-500)",
        danger: "var(--danger-500)",
      },
      borderRadius: {
        '4xl': '28px',
      },
      boxShadow: {
        surface: '0 10px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.03)',
        brand: '0 12px 28px rgba(124,92,255,0.24)',
      }
    },
  },
  plugins: [],
};
export default config;
