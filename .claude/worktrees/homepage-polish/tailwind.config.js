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
    // Neo-Academy Terminal rebrand: zero radius everywhere except the one
    // pill utility motion/UI already relies on (`rounded-full` badges,
    // toggle knobs). A blueprint terminal has no soft chrome at all —
    // corners are 90 degrees, panels are divided by hairlines, not curves.
    // Declared at `theme` level rather than inside `extend` so it fully
    // replaces Tailwind's scale rather than layering on top of it.
    borderRadius: {
      none: '0',
      sm: '0',
      DEFAULT: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '9999px',
    },
    extend: {
      colors: {
        // ------------------------------------------------------------------
        // Neo-Academy Terminal theme engine. `paper`/`ink` are the same
        // token names every existing page already uses (`bg-paper`,
        // `text-ink`, `border-paper-line`, `bg-paper-sunk/70`, …) — only what
        // they resolve to has changed. Values are read from CSS custom
        // properties set in `index.css`, so toggling `data-theme` on <html>
        // repaints the entire site with no class changes anywhere else.
        //
        // Two themes, both dark-terminal registers (this archetype has no
        // light-paper mode — "Studio" is the dimmer console, "Cinema" is
        // the deep-space console):
        //   Studio (default) — near-black #0c0c0e console, paper-white type.
        //   Cinema (dark)    — pure ink #070708 console, paper-white type.
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
        // Body and headline type — theme-reactive. Paper-white ink on both
        // consoles. Not to be confused with `obsidian` below, which is a
        // *fixed* dark surface independent of theme.
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted-rgb) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint-rgb) / <alpha-value>)',
        },
        // A fixed dark tone (independent of the theme toggle) reserved
        // for scrims under white caption text on a photograph — a photo
        // tile needs one regardless of which console tone surrounds it.
        obsidian: {
          DEFAULT: '#050506',
          light: '#0e0e10',
        },
        // Neo-Academy Terminal rebrand — `brand` now carries the structural
        // zinc scale (bounding lines, secondary text, inactive chrome)
        // instead of institutional navy. `600` is the workhorse mid-zinc for
        // borders and muted labels; there is no saturated color in this
        // ramp on purpose — color is reserved entirely for `marigold` below.
        brand: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#c9c9cf',
          300: '#9a9aa2',
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          900: '#0f0f11',
        },
        // Unused washes in this archetype — kept as flat neutral fallbacks
        // so nothing importing them breaks.
        sage: '#141416',
        lavender: '#141416',
        // The single isolated neon emission value the archetype calls for —
        // hyper-emerald. Used ONLY on tiny terminal cursors, indicator dots,
        // active nav underlines and interaction triggers, never as a fill or
        // a background wash. This is the one saturated color on the entire
        // site; `notice__flag`, the active nav state and button focus rings
        // all draw from it.
        marigold: {
          100: '#d1fae5',
          300: '#6ee7b7',
          500: '#34d976',
          700: '#15803d',
        },
        // Destructive actions only.
        clay: {
          500: '#f2495c',
          700: '#c22f40',
        },
        // Legacy accent names, re-pointed at the current palette so existing
        // `school-*` utilities keep working and land in-system.
        school: {
          green: '#34d976',
          greenDark: '#15803d',
          red: '#f2495c',
          redDark: '#c22f40',
          cream: '#141416',
          gold: '#34d976',
        },
      },
      fontFamily: {
        // Neo-Academy Terminal rebrand: Outfit carries every structural sans
        // role (headers, nav, body) — dual-typography here comes from
        // pairing it with `mono` (JetBrains Mono) for the tracking-spaced
        // technical index labels ("[SYS_REF // DEPT_01]"), not from a second
        // display face. `accent` (Reenie Beanie) is dropped from headings
        // and kept only where `.voice` still opts in.
        sans: ['Outfit Variable', 'Outfit Fallback', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Outfit Variable', 'Outfit Fallback', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Outfit Variable', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono Fallback', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
        // Neo-Academy Terminal has no drop shadows — elevation reads as a
        // hairline, never a blur. Kept as a border-colored 1px separator so
        // existing `shadow-lift`/`shadow-rail` call sites still resolve to
        // something, just not a soft glow.
        lift: '0 1px 0 var(--paper-line)',
        rail: '0 1px 0 var(--paper-line)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
