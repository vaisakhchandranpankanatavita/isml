/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // <Button> builds its variant class at runtime (`vc-btn--${variant}`), so
  // the scanner can't see those names; keep every variant.
  safelist: [{ pattern: /^vc-btn--/ }],
  // The stock container plugin derives each breakpoint's max-width from that
  // breakpoint's min-width, so it can't express "fluid, no cap" — every screen
  // step it emits *is* a cap. `.container` is therefore ours, defined in
  // index.css against the full viewport. See the note there.
  corePlugins: {
    container: false,
  },
  theme: {
    // Soft-studio rebrand: every container is generously rounded (2–4rem),
    // the opposite of the old flat "Cinematic Structuralism" scale. Declared
    // at `theme` level rather than inside `extend` so it fully replaces
    // Tailwind's scale rather than layering on top of it.
    // VCASS-derived radius scale: 8px on the nav bar and inline thumbnails,
    // 14–16px (`--variable-radius`) on media and panels, pills on buttons.
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      DEFAULT: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      full: "9999px",
    },
    extend: {
      colors: {
        // ------------------------------------------------------------------
        // Cinematic Structuralism theme engine. `paper`/`ink` are the same
        // token names every existing page already uses (`bg-paper`,
        // `text-ink`, `border-paper-line`, `bg-paper-sunk/70`, …) — only what
        // they `resolve to` has changed. Values are read from CSS custom
        // properties set in `index.css`, so toggling `data-theme` on <html>
        // repaints the entire site with no class changes anywhere else.
        //
        // Two themes:
        //   Studio (light, default) — alabaster #F6F6F6 canvas, obsidian type.
        //   Cinema (dark)           — obsidian #0A0A0B canvas, chalk-white type.
        //
        // `paper` and `paper-sunk` carry opacity modifiers elsewhere in the
        // codebase (`bg-paper/80`, `bg-paper-sunk/70`), so they're stored as
        // `r g b` triplets and composed with Tailwind's `<alpha-value>` —
        // `paper-line` never takes a modifier, so it's a plain var().
        paper: {
          DEFAULT: "rgb(var(--paper-rgb) / <alpha-value>)",
          sunk: "rgb(var(--paper-sunk-rgb) / <alpha-value>)",
          band: "rgb(var(--paper-band-rgb) / <alpha-value>)",
          line: "var(--paper-line)",
          light: "rgb(var(--paper-light-rgb) / <alpha-value>)",
          dark: "rgb(var(--paper-dark-rgb) / <alpha-value>)",
        },
        // Body and headline type — theme-reactive. Razor-sharp obsidian on
        // Studio, chalk-white on Cinema. Not to be confused with `obsidian`
        // below, which is a *fixed* dark surface independent of theme.
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          soft: "rgb(var(--ink-soft-rgb) / <alpha-value>)",
          muted: "rgb(var(--ink-muted-rgb) / <alpha-value>)",
          faint: "rgb(var(--ink-faint-rgb) / <alpha-value>)",
        },
        // A fixed dark tone (independent of the light/dark toggle) reserved
        // for scrims under white caption text on a photograph — a photo
        // tile needs one regardless of how warm the surrounding page is.
        obsidian: {
          DEFAULT: "#1f1e1d",
          light: "#363633",
        },
        // VCASS warm neutral ramp (`--neutral-1` … `--neutral-7`).
        neutral: {
          1: "#faf9f2",
          2: "#e6e5dd",
          3: "#dbdad4",
          4: "#a8a7a3",
          5: "#81807c",
          6: "#363633",
          7: "#1f1e1d",
        },
        // Soft-studio peach/coral — the primary accent (see brief: `#FFB7B2`
        // lives at `400`, the exact named colour, used for borders, glows,
        // focus rings and hover washes). `600` is a deeper, more saturated
        // shade of the same hue kept specifically for the one solid white-
        // text button ground (`Button.tsx`'s `primary` variant) — `400` is
        // too light to clear 4.5:1 with white, so don't use it there.
        // VCASS `theme-brand` amber. 50–500 are the reference ramp as-is;
        // 600+ are the deep browns it uses for type on the amber tints, and
        // the only steps that clear 4.5:1 under white text.
        brand: {
          50: "#fff8ee",
          100: "#fff2e0",
          200: "#ffdead",
          300: "#ffbc5e",
          400: "#f59d21",
          500: "#eb8900",
          600: "#a35400",
          700: "#854000",
          800: "#6a3300",
          900: "#4d2c00",
        },
        prestige: {
          gold: "#f59021",
          goldLight: "#ffbc5e",
          goldDark: "#eb8900",
        },
        // The two supporting washes from the brief — flat tints, not ramps,
        // used as section/card backgrounds alongside `paper`.
        sage: "#e8efe8",
        lavender: "#efedf4",
        // The warm counterweight to all that blue. Flags a new or pinned
        // notice and marks the active navigation item. Brightened from a
        // dark ochre to a sunny amber: as the only warm hue on the site it
        // was doing a lot of the emotional work and doing it too quietly.
        marigold: {
          100: "#fff2e0",
          300: "#ffbc5e",
          500: "#f59021",
          700: "#854000",
        },
        // Destructive actions only. Brightened in step with everything else
        // so Delete doesn't read as the one muddy thing left on the page.
        clay: {
          500: "#e2483a",
          700: "#b52f23",
        },
        // Legacy accent names, re-pointed at the current palette so existing
        // `school-*` utilities keep working and land in-system. The `green`
        // keys are historical — they resolve to the brand blue now. Prefer
        // `brand-*` / `clay-*` / `marigold-*` in new code.
        school: {
          green: "#eb8900",
          greenDark: "#854000",
          red: "#da251d",
          redDark: "#b01e17",
          cream: "#fff2e0",
          gold: "#f59021",
        },
      },
      fontFamily: {
        // VCASS pairs GT Walsheim (text), GT Walsheim Condensed (all display
        // type and labels, uppercase, 700–800) and GT Super Display (italic
        // serif accent). Those are commercial faces, so the free stand-ins
        // are: Outfit for Walsheim, Barlow Condensed for the condensed cut,
        // Playfair Display italic for Super Display.
        sans: [
          "Outfit Variable",
          "-apple-system",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Barlow Condensed",
          "Arial Narrow",
          "Helvetica",
          "sans-serif",
        ],
        condensed: [
          "Barlow Condensed",
          "Arial Narrow",
          "Helvetica",
          "sans-serif",
        ],
        serif: ["Playfair Display Variable", "Georgia", "serif"],
        accent: ["Playfair Display Variable", "Georgia", "serif"],
      },
      fontSize: {
        // A restrained, consistent scale keeps display hierarchy strong
        // without letting headings overwhelm the page.
        "2xs": ["0.6875rem", { lineHeight: "1.45" }],
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["0.9375rem", { lineHeight: "1.6" }],
        base: ["1.0625rem", { lineHeight: "1.65" }],
        lg: ["1.1875rem", { lineHeight: "1.6" }],
        xl: ["1.4375rem", { lineHeight: "1.4" }],
        "2xl": ["1.625rem", { lineHeight: "1.1" }],
        "3xl": ["2rem", { lineHeight: "1" }],
        "4xl": ["2.5rem", { lineHeight: "0.95" }],
        "5xl": ["3.25rem", { lineHeight: "0.92" }],
        "6xl": ["4rem", { lineHeight: "0.9" }],
        "7xl": ["5rem", { lineHeight: "0.88" }],
        display: [
          "clamp(2.75rem, 1.6rem + 5vw, 6.5rem)",
          { lineHeight: "0.88", letterSpacing: "-0.03em" },
        ],
      },
      maxWidth: {
        // Both stay under 80 characters at their respective sizes.
        prose: "34rem",
        measure: "40rem",
      },
      boxShadow: {
        // The one soft-studio shadow from the brief — barely-there, warm
        // rather than inky. Floating panels are the only thing that
        // separates from the ground by shadow.
        lift: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        rail: "0 1px 0 rgba(0, 0, 0, 0.08)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        // VCASS easing tokens.
        "vc-out": "cubic-bezier(0.34, 0.34, 0.02, 0.97)",
        "vc-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "vc-bounce": "cubic-bezier(0.32, 1.51, 0.36, 0.97)",
      },
    },
  },
  plugins: [],
};
