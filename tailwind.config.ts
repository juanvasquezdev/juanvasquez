import type { Config } from "tailwindcss";

/**
 * Tokens propios, traducidos 1:1 desde las variables de css/style.css del sitio estático.
 * Nunca la paleta default de Tailwind (CLAUDE.md, regla #1) — todo lo de abajo referencia
 * las custom properties definidas en app/globals.css (:root), que deben mantenerse en
 * sincronía con estos mismos valores.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "rgb(var(--bg-rgb) / <alpha-value>)",
          alt: "var(--bg-alt)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          dim: "var(--accent-dim)",
          "dim-text": "var(--accent-dim-text)",
          bright: "var(--accent-bright)",
          soft: "var(--accent-soft)",
        },
        white: "var(--white)",
        silver: {
          DEFAULT: "var(--silver)",
          light: "var(--silver-light)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        ink: "var(--ink)",
        shadow: "rgb(var(--shadow-color-rgb) / <alpha-value>)",
      },
      spacing: {
        sm: "var(--space-sm)",
        lg: "var(--space-lg)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        "gradient-surface": "var(--gradient-surface)",
        "gradient-surface-reverse": "var(--gradient-surface-reverse)",
        "gradient-surface-deep": "var(--gradient-surface-deep)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
