const colors = require("tailwindcss/colors");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-background",
    "bg-card",
    "text-text",
    "text-white",
    "text-xl",
    "p-6",
    "min-h-screen",
    "bg-primary/10",
    "text-primary",
    "bg-dramatic-radial",
    "glint-mask", // ← 👈 Added comma and cleaned comment
  ],
  theme: {
    extend: {
      colors: {
        ...colors, // 🧩 Reintroduce Tailwind's built-in color palette
        patternColor: "#B75634",
        background: "#F6F5EF",
        card: "#FFFFFF",
        text: "#111827",
        primary: "#4F46E5",

        daily: "#69A5D1",
        weekly: "#B75634",
        monthly: "#EFB643",
        quarterly: "#6AA968",
      },
      fontFamily: {
        sans: ["Lato", "ui-sans-serif", "system-ui"],
        serif: ["Calistoga", "Georgia", "serif"],
        opensans: ["Open Sans", "sans-serif"],
        condensed: ['"Open Sans Condensed"', "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 6px rgba(0, 0, 0, 0.05)",
        dashboard: "0 4px 12px rgba(0, 0, 0, 0.05)",
        modal: "0 8px 20px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        card: "1rem",
      },
      spacing: {
        section: "2rem",
        gutter: "1.5rem",
        block: "1rem",
      },
      animation: {
        gradient: "gradient 15s ease infinite",
        'gradient-pulse': 'gradientPulse 30s ease infinite',
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        gradientPulse: {
          '0%, 100%': { backgroundSize: '150% 150%' },
          '50%': { backgroundSize: '180% 180%' },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
      backgroundImage: {
        'dramatic-radial': 'radial-gradient(ellipse at center, #F6F5EF, #C1BBA3)',
      },
    },
  },
  plugins: [],
};
