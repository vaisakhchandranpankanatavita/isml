import clsx from 'clsx';
import { useTheme } from '@/hooks/useTheme';

/**
 * Studio/Cinema switch. `onDark` mirrors the prop Header already threads
 * through its nav items — the toggle needs to know whether it's currently
 * sitting over a dark hero/footer band so its own ink stays legible there,
 * independent of which site theme is active.
 */
export default function ThemeToggle({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
      aria-label={
        theme === 'studio' ? 'Switch to Cinema (dark) theme' : 'Switch to Studio (light) theme'
      }
      aria-pressed={theme === 'cinema'}
      className={clsx(
        'relative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors',
        onDark
          ? 'border-white/30 text-white hover:border-white/60'
          : 'border-paper-line text-ink hover:border-ink/40',
        className,
      )}
    >
      {/* A single glyph that flips between a filled and a ringed disc rather
          than swapping icon sets — the whole site avoids decorative icon
          libraries, so this stays a plain SVG. */}
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        {theme === 'studio' ? (
          <circle cx="10" cy="10" r="6" />
        ) : (
          <path d="M14.5 12.5A6 6 0 1 1 7.5 5.5a5 5 0 1 0 7 7z" fill="currentColor" stroke="none" />
        )}
      </svg>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
