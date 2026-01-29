/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "kt-surface": "#0f1115",
        "kt-card": "#141824",
        "kt-border": "#23283a",
        "kt-muted": "#8b92a7",
        "kt-accent": "#f97316",
      },
      boxShadow: {
        "soft-glow": "0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
