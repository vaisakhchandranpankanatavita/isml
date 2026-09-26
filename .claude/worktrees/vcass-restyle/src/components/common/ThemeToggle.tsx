import clsx from 'clsx';
import { useTheme } from '@/hooks/useTheme';

/**
 * Light/dark switch, drawn as a VCASS round icon button. It only ever sits
 * on the dark navigation bar, so its own chip is always the pale one.
 */
export default function ThemeToggle({ className }: { onDark?: boolean; className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
      aria-label={theme === 'studio' ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={theme === 'cinema'}
      className={clsx('vc-icon-btn [--btn-bg:#363633] [--btn-fg:#faf9f2]', className)}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        {theme === 'studio' ? (
          <circle cx="10" cy="10" r="5.5" />
        ) : (
          <path d="M14.5 12.5A6 6 0 1 1 7.5 5.5a5 5 0 1 0 7 7z" fill="currentColor" stroke="none" />
        )}
      </svg>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
