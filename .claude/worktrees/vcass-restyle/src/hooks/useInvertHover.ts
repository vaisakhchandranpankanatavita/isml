import { useCallback } from 'react';

/**
 * Powers `.btn-invert` (see `index.css`): stamps the pointer's entry point
 * onto the element as `--ex`/`--ey` (percent), which the CSS flood reads as
 * its `clip-path circle()` origin. `mix-blend-mode: difference` on the flood
 * is what inverts the button's fill and text colour simultaneously without
 * a duplicated text layer — wherever the flood covers, colours invert for
 * free.
 *
 * Without this, `.btn-invert` still works — it falls back to a centred
 * flood via the CSS custom properties' default values — just not anchored to
 * the cursor. Attach `onPointerEnter={useInvertHover()}` to opt a button
 * into the cursor-anchored version.
 */
export function useInvertHover() {
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--ex', `${x}%`);
    e.currentTarget.style.setProperty('--ey', `${y}%`);
  }, []);
}
