/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
    borderRadius: {
      none: '0',
      sm: '1rem',
      DEFAULT: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem',
      '2xl': '3.5rem',
      '3xl': '4rem',
      full: '9999px',
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
          DEFAULT: 'rgb(var(--paper-rgb) / <alpha-value>)',
          sunk: 'rgb(var(--paper-sunk-rgb) / <alpha-value>)',
          band: 'rgb(var(--paper-band-rgb) / <alpha-value>)',
          line: 'var(--paper-line)',
          light: 'rgb(var(--paper-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--paper-dark-rgb) / <alpha-value>)',
        },
        // Body and headline type — theme-reactive. Razor-sharp obsidian on
        // Studio, chalk-white on Cinema. Not to be confused with `obsidian`
        // below, which is a *fixed* dark surface independent of theme.
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted-rgb) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint-rgb) / <alpha-value>)',
        },
        // A fixed dark tone (independent of the light/dark toggle) reserved
        // for scrims under white caption text on a photograph — a photo
        // tile needs one regardless of how warm the surrounding page is.
        obsidian: {
          DEFAULT: '#0a0a0b',
          light: '#1a1a1c',
        },
        // Soft-studio peach/coral — the primary accent (see brief: `#FFB7B2`
        // lives at `400`, the exact named colour, used for borders, glows,
        // focus rings and hover washes). `600` is a deeper, more saturated
        // shade of the same hue kept specifically for the one solid white-
        // text button ground (`Button.tsx`'s `primary` variant) — `400` is
        // too light to clear 4.5:1 with white, so don't use it there.
        brand: {
          50: '#fff5f3',
          100: '#ffe7e2',
          200: '#ffd3cb',
          300: '#ffc0b6',
          400: '#ffb7b2',
          500: '#ef8b82',
          600: '#c14f44',
          700: '#9c3c33',
          800: '#742c25',
          900: '#4a1c18',
        },
        // The two supporting washes from the brief — flat tints, not ramps,
        // used as section/card backgrounds alongside `paper`.
        sage: '#e8efe8',
        lavender: '#efedf4',
        // The warm counterweight to all that blue. Flags a new or pinned
        // notice and marks the active navigation item. Brightened from a
        // dark ochre to a sunny amber: as the only warm hue on the site it
        // was doing a lot of the emotional work and doing it too quietly.
        marigold: {
          100: '#fff5d6',
          300: '#ffd85e',
          500: '#f9ab12',
          700: '#b3700a',
        },
        // Destructive actions only. Brightened in step with everything else
        // so Delete doesn't read as the one muddy thing left on the page.
        clay: {
          500: '#e2483a',
          700: '#b52f23',
        },
        // Legacy accent names, re-pointed at the current palette so existing
        // `school-*` utilities keep working and land in-system. The `green`
        // keys are historical — they resolve to the brand blue now. Prefer
        // `brand-*` / `clay-*` / `marigold-*` in new code.
        school: {
          green: '#2570eb',
          greenDark: '#1d5bd0',
          red: '#e2483a',
          redDark: '#b52f23',
          cream: '#eff6ff',
          gold: '#f9ab12',
        },
      },
      fontFamily: {
        // Soft-studio rebrand: one geometric sans (Outfit, vendored via
        // Fontsource — see the `@import`s at the top of `index.css`) for
        // everything, body copy and headings alike. `serif`/`accent` are
        // Reenie Beanie, a single-weight cursive kept for the one
        // expressive-emphasis spot (`.voice`, the principal's quote).
        sans: ['Outfit Variable', 'Outfit Fallback', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Outfit Variable', 'Outfit Fallback', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Reenie Beanie', 'cursive'],
        accent: ['Reenie Beanie', 'cursive'],
      },
      fontSize: {
        // Modular scale, roughly 1.25. The low end is tight because this site
        // carries a lot of metadata — dates, grades, categories. `6xl`/`7xl`
        // are new: the "massive heading" register the editorial grid needs
        // for a hero headline or a watermark acronym, which nothing below
        // `5xl` was ever meant to reach.
        '2xs': ['0.6875rem', { lineHeight: '1.45' }],
        xs: ['0.8125rem', { lineHeight: '1.5' }],
        sm: ['0.9375rem', { lineHeight: '1.6' }],
        base: ['1.0625rem', { lineHeight: '1.65' }],
        lg: ['1.1875rem', { lineHeight: '1.6' }],
        xl: ['1.4375rem', { lineHeight: '1.4' }],
        '2xl': ['1.75rem', { lineHeight: '1.3' }],
        '3xl': ['2.1875rem', { lineHeight: '1.2' }],
        '4xl': ['2.75rem', { lineHeight: '1.12' }],
        '5xl': ['3.4375rem', { lineHeight: '1.06' }],
        '6xl': ['4.5rem', { lineHeight: '1.0' }],
        '7xl': ['6rem', { lineHeight: '0.96' }],
      },
      maxWidth: {
        // Both stay under 80 characters at their respective sizes.
        prose: '34rem',
        measure: '40rem',
      },
      boxShadow: {
        // The one soft-studio shadow from the brief — barely-there, warm
        // rather than inky. Floating panels are the only thing that
        // separates from the ground by shadow.
        lift: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        rail: '0 1px 0 rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
