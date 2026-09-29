/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // `.container` is defined in index.css (fluid, capped at 120rem).
  corePlugins: {
    container: false,
  },
  theme: {
    borderRadius: {
      none: "0",
      sm: "0.375rem",
      DEFAULT: "0.375rem",
      md: "0.75rem",
      lg: "1.25rem",
      xl: "1.25rem",
      "2xl": "2.5rem",
      "3xl": "2.5rem",
      full: "9999px",
    },
    extend: {
      colors: {
        // Cream canvas + near-black ink. Values live in index.css so the
        // alpha modifiers (`bg-paper/80`) keep working.
        paper: {
          DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)",
          sunk: "rgb(var(--paper-sunk-rgb) / <alpha-value>)",
          band: "rgb(var(--paper-band-rgb) / <alpha-value>)",
          line: "var(--paper-line)",
          light: "rgb(var(--paper-light-rgb) / <alpha-value>)",
          dark: "rgb(var(--paper-dark-rgb) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          soft: "rgb(var(--ink-soft-rgb) / <alpha-value>)",
          muted: "rgb(var(--ink-muted-rgb) / <alpha-value>)",
          faint: "rgb(var(--ink-faint-rgb) / <alpha-value>)",
        },
        obsidian: {
          DEFAULT: "#1c1c1c",
          light: "#252525",
        },
        neutral: {
          1: "#f4f3ed",
          2: "#e9e9e7",
          3: "#e0dfdd",
          4: "#b3b3b3",
          5: "#939393",
          6: "#434343",
          7: "#1c1c1c",
        },
        // Lime: the soft-green button ground. 600+ are deep olive tones that
        // clear 4.5:1 under white text.
        lime: {
          DEFAULT: "#e1edba",
          soft: "#eef5d3",
          deep: "#2b3814",
        },
        // `brand` keeps the semantic name the admin area uses, now lime/olive.
        brand: {
          50: "#f6f9e8",
          100: "#eef5d3",
          200: "#e1edba",
          300: "#cfe08f",
          400: "#b9d16a",
          500: "#9fba48",
          600: "#3d4f1a",
          700: "#2b3814",
          800: "#1f2910",
          900: "#151c0a",
        },
        // Signal orange (the reference's accent).
        signal: {
          DEFAULT: "#ff6f26",
          deep: "#f75c0e",
        },
        blue: {
          signal: "#5356ff",
        },
        prestige: {
          gold: "#ff6f26",
          goldLight: "#ff9a5f",
          goldDark: "#f75c0e",
        },
        sage: "#f3f3f0",
        lavender: "#e9e9e7",
        marigold: {
          100: "#ffe9dc",
          300: "#ff9a5f",
          500: "#ff6f26",
          700: "#a33a08",
        },
        clay: {
          500: "#e2483a",
          700: "#b52f23",
        },
        school: {
          green: "#3d4f1a",
          greenDark: "#2b3814",
          red: "#f75c0e",
          redDark: "#a33a08",
          cream: "#f4f3ed",
          gold: "#ff6f26",
        },
      },
      fontFamily: {
        // Values live in index.css (--font-sans / --font-display).
        sans: ["var(--font-sans)"],
        serif: ["var(--font-sans)"],
        accent: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        condensed: ["var(--font-display)"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1.45" }],
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["0.9375rem", { lineHeight: "1.6" }],
        base: ["1.0625rem", { lineHeight: "1.65" }],
        lg: ["1.1875rem", { lineHeight: "1.6" }],
        xl: ["1.4375rem", { lineHeight: "1.4" }],
        "2xl": ["1.75rem", { lineHeight: "1.15" }],
        "3xl": ["2.25rem", { lineHeight: "1.05" }],
        "4xl": ["3rem", { lineHeight: "1" }],
        "5xl": ["4rem", { lineHeight: "0.95" }],
        "6xl": ["5rem", { lineHeight: "0.92" }],
        "7xl": ["6.5rem", { lineHeight: "0.9" }],
        display: [
          "var(--fs-hero)",
          { lineHeight: "0.9", letterSpacing: "-0.03em" },
        ],
      },
      maxWidth: {
        prose: "34rem",
        measure: "40rem",
      },
      boxShadow: {
        lift: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
        rail: "0 1px 0 rgba(0, 0, 0, 0.08)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        "ref-out": "cubic-bezier(0.5, 1, 0.89, 1)",
        "ref-image": "cubic-bezier(0.32, 0, 0.29, 0.99)",
      },
    },
  },
  plugins: [],
};
