import { useEffect } from 'react';

/**
 * Global mouse tracker for `.spotlight-card` (see `index.css`) — a radial
 * highlight that follows the cursor across any image tile carrying that
 * class (baked into `.story__media` site-wide, plus opted into individually
 * elsewhere). One delegated listener rather than one per card, same pattern
 * `CustomCursor` uses for `data-cursor-magnetic`. Renders nothing; purely a
 * side-effect component.
 */
export default function SpotlightTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.spotlight-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return null;
}
