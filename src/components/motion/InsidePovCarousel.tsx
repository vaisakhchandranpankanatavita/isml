import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import clsx from 'clsx';
import './insidepov-carousel.css';

export interface PovItem {
  src: string;
  alt?: string;
}

interface Props {
  items: PovItem[];
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
  /** Screen-reader-only summary — the carousel itself renders no visible label. */
  label?: string;
}

const AUTO_ROTATE_SPEED = 0.04;
const DRAG_SENSITIVITY = 0.28;
const INERTIA_FRICTION = 0.94;
const MIN_VELOCITY = 0.01;
const KEYBOARD_STEP = 8;

/**
 * Inside-perspective 3D carousel: the viewer stands at the centre of a large
 * outer ring, looking outward — the opposite of a typical card carousel
 * (which stacks cards toward the viewer). Ported from a supplied Next.js/
 * CSS-Modules reference to this app's actual stack (Vite, plain CSS files
 * following the `fs__`/`cb__` class-prefix convention already used by
 * FilmStrip/ChatBot) and actual data — this section's photographs, not
 * video. `requestAnimationFrame` drives every rotation, per the brief; no
 * animation library, no visible controls, labels or hint text.
 */
export default function InsidePovCarousel({
  items,
  autoRotate = true,
  interactive = true,
  className,
  label,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const [isAutoEnabled, setIsAutoEnabled] = useState(autoRotate);
  const [dragging, setDragging] = useState(false);
  const safeItems = useMemo(() => items.filter((item) => item.src), [items]);
  const step = safeItems.length > 0 ? 360 / safeItems.length : 25.714285;

  const setRotation = useCallback((next: number) => {
    rotationRef.current = next;
    rootRef.current?.style.setProperty('--pov-rotation', `${next}deg`);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty('--pov-step', `${step}deg`);
    root.style.setProperty('--pov-rotation', `${rotationRef.current}deg`);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [step]);

  useEffect(() => setIsAutoEnabled(autoRotate), [autoRotate]);

  useEffect(() => {
    if (safeItems.length === 0) return;

    const tick = () => {
      const shouldAutoRotate =
        isAutoEnabled && !reducedMotionRef.current && !isDraggingRef.current && !isHoveredRef.current;

      let next = rotationRef.current;
      if (shouldAutoRotate) next += AUTO_ROTATE_SPEED;

      if (!isDraggingRef.current && Math.abs(velocityRef.current) > MIN_VELOCITY) {
        next += velocityRef.current;
        velocityRef.current *= INERTIA_FRICTION;
      }

      setRotation(next);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isAutoEnabled, safeItems.length, setRotation]);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!interactive || !isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    const deltaDeg = dx * DRAG_SENSITIVITY;
    velocityRef.current = deltaDeg;
    lastXRef.current = e.clientX;
    setRotation(rotationRef.current + deltaDeg);
  };

  const endDrag = (e: PointerEvent<HTMLElement>) => {
    if (!interactive) return;
    isDraggingRef.current = false;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!interactive) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      velocityRef.current = 0;
      setRotation(rotationRef.current - KEYBOARD_STEP);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      velocityRef.current = 0;
      setRotation(rotationRef.current + KEYBOARD_STEP);
    }
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsAutoEnabled((v) => !v);
    }
  };

  if (safeItems.length === 0) return null;

  return (
    <section
      ref={rootRef}
      className={clsx('ipc', dragging && 'ipc--dragging', !interactive && 'ipc--static', className)}
      tabIndex={interactive ? 0 : -1}
      role="group"
      aria-roledescription="3D carousel"
      aria-label={label}
      onPointerDown={interactive ? onPointerDown : undefined}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerUp={interactive ? endDrag : undefined}
      onPointerCancel={interactive ? endDrag : undefined}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onKeyDown={onKeyDown}
    >
      <div className="ipc__stage">
        <div className="ipc__world">
          {safeItems.map((item, i) => (
            <figure
              key={`${item.src}-${i}`}
              className="ipc__card"
              style={{ '--i': i } as CSSProperties}
            >
              <img className="ipc__img" src={item.src} alt={item.alt ?? ''} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
