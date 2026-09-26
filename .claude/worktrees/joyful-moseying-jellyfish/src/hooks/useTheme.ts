import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { createElement } from 'react';

export type Theme = 'studio' | 'cinema';

const STORAGE_KEY = 'isml-theme';
const THEME_COLOR = { studio: '#f6f6f6', cinema: '#0a0a0b' } as const;

interface ThemeContextValue {
  theme: Theme;
  /** Pass the click event so the ink-bleed sweep can radiate from where the
   * pointer actually is, per the brief — a themeless toggle has nowhere to
   * radiate from and falls back to the viewport centre. */
  toggleTheme: (e?: { clientX: number; clientY: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeColorMeta(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'studio';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'cinema' ? 'cinema' : 'studio';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    applyThemeColorMeta(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback((e?: { clientX: number; clientY: number }) => {
    const next: Theme = theme === 'studio' ? 'cinema' : 'studio';
    const root = document.documentElement;

    const x = e ? (e.clientX / window.innerWidth) * 100 : 50;
    const y = e ? (e.clientY / window.innerHeight) * 100 : 50;
    root.style.setProperty('--ink-x', `${x}%`);
    root.style.setProperty('--ink-y', `${y}%`);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const apply = () => setTheme(next);

    if (!reduceMotion && typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
