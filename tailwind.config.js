/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        charcoal: "#1c1c1e",
        graphite: "#3a3a3c",
        "soft-gray": "#8e8e93",
        "warm-gray": "#9c968c",
        "silver-gray": "#c7c7cc",
        white: "#ffffff",
        "off-white": "#faf9f7",
        "light-stone": "#f0ede7",
        beige: "#ece7de",
        platinum: "#d8d4cc",
        titanium: "#9a958c",
        silver: "#c9c9cd",
        ivory: "#f3ede1",
        champagne: "#e8dcc8",
        "ice-blue": "#dfe6ea",
        slate: "#5c6066",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": [
          "clamp(3.5rem, 7vw, 7rem)",
          { lineHeight: "1.0", letterSpacing: "-0.02em" },
        ],
        "display-xl": [
          "clamp(2.75rem, 5.5vw, 5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 4vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(1.75rem, 2.6vw, 2.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
        "heading-lg": ["1.5rem", { lineHeight: "1.3" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
        caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(10,10,10,0.04)",
        soft: "0 4px 16px rgba(10,10,10,0.06)",
        elevated: "0 12px 32px rgba(10,10,10,0.08)",
        floating: "0 24px 64px rgba(10,10,10,0.10)",
        "inner-line": "inset 0 0 0 1px rgba(10,10,10,0.06)",
        glass:
          "0 8px 32px rgba(10,10,10,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backdropBlur: {
        glass: "18px",
      },
      backgroundImage: {
        "metallic-sheen":
          "linear-gradient(115deg, #d8d4cc 0%, #f3ede1 35%, #c9c9cd 55%, #f3ede1 75%, #d8d4cc 100%)",
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        section: "clamp(5rem, 10vw, 10rem)",
      },
      maxWidth: {
        content: "1400px",
        prose: "68ch",
      },
      animation: {
        "marquee-1": "marquee-scroll-1 35s linear infinite",
        "marquee-2": "marquee-scroll-2 30s linear infinite",
      },
      keyframes: {
        "marquee-scroll-1": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-scroll-2": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
