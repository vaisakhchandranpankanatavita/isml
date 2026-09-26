import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Media from '@/components/common/Media';
import type { HomeGalleryImage } from '@/types';
import './film-strip.css';

/**
 * The homepage photo section: a 3D film strip.
 *
 * The strip is one `motion.div` dragged along X (momentum swipe, snapping to
 * the nearest frame). A single motion value, `x`, is the playhead; every frame
 * derives its own pose from how far it sits from the stage centre:
 *
 *   centre frame   scale up, flat to the viewer, full brightness
 *   off-centre     rotateY toward ±45°, scale down, pushed back in Z, dimmed
 *
 * `perspective: 1200px` lives on the stage, so those rotations read as real
 * depth. Pure CSS 3D — no WebGL — so a photo that fails to load degrades to an
 * empty frame instead of throwing (see the carousel 404 incident).
 *
 * Input: drag/swipe, trackpad horizontal scroll, ← →, buttons, or click a
 * frame. Every transform is compositor-only. Reduced motion: moves are instant.
 */

const ASPECT = 1.3; // frame height / width
const GAP = 28; // px between frames
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  images: HomeGalleryImage[];
  heading: string;
  body?: string;
  siteName: string;
}

function Frame({
  img,
  idx,
  x,
  pitch,
  cw,
  ch,
  active,
  alt,
  onSelect,
}: {
  img: HomeGalleryImage;
  idx: number;
  x: MotionValue<number>;
  pitch: number;
  cw: number;
  ch: number;
  active: boolean;
  alt: string;
  onSelect: () => void;
}) {
  // d: signed distance from the stage centre, in frames (0 = centred).
  const d = useTransform(x, (v) => (v + idx * pitch) / pitch);
  const rotateY = useTransform(d, (v) => -clamp(v, -1, 1) * 45);
  const scale = useTransform(d, (v) => 1.12 - 0.42 * Math.min(Math.abs(v), 1));
  const z = useTransform(d, (v) => -Math.min(Math.abs(v), 2) * 150);
  const opacity = useTransform(d, (v) => 1 - (0.62 * Math.min(Math.abs(v), 1.6)) / 1.6);
  const lift = useTransform(d, (v) => Math.min(Math.abs(v), 1) * 18); // sinks toward the horizon

  return (
    <motion.figure
      className="fs__frame"
      data-active={active || undefined}
      style={{
        width: cw,
        height: ch,
        left: idx * pitch - cw / 2,
        marginTop: -ch / 2,
        rotateY,
        scale,
        z,
        y: lift,
        opacity,
      }}
      onTap={onSelect}
    >
      <Media src={img.url} alt={alt} />
      {/* Ambient dark wash — keeps the caption legible over any photograph. */}
      <span className="fs__wash" aria-hidden />
      <span className="fs__idx">{pad(idx + 1)}</span>
      <figcaption className="fs__cap">{img.caption || alt}</figcaption>
    </motion.figure>
  );
}

export default function FilmStrip({ images, heading, body, siteName }: Props) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const n = images.length;

  const [dim, setDim] = useState({ cw: 260, ch: 338 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const calc = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      const byW = w < 640 ? w * 0.62 : w * 0.27;
      const cw = Math.round(clamp(Math.min(byW, (h * 0.74) / ASPECT), 170, 360));
      setDim({ cw, ch: Math.round(cw * ASPECT) });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { cw, ch } = dim;
  const pitch = cw + GAP;
  const minX = -(n - 1) * pitch;

  // x = 0 → first frame centred; x = -i * pitch → frame i centred.
  const x = useMotionValue(0);
  const [active, setActive] = useState(0);
  useMotionValueEvent(x, 'change', (v) => {
    const i = clamp(Math.round(-v / pitch), 0, n - 1);
    setActive((prev) => (prev === i ? prev : i));
  });

  // Keep the same frame centred when a resize changes the pitch.
  const activeRef = useRef(0);
  activeRef.current = active;
  useEffect(() => {
    x.set(-activeRef.current * pitch);
  }, [pitch, x]);

  const goTo = useCallback(
    (i: number) => {
      const target = -clamp(i, 0, n - 1) * pitch;
      if (reduced) x.set(target);
      else animate(x, target, { type: 'spring', stiffness: 130, damping: 24, mass: 0.8 });
    },
    [n, pitch, reduced, x],
  );

  // Trackpad / horizontal wheel: scrub the strip, then settle on a frame.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical = page scroll
      e.preventDefault();
      x.set(clamp(x.get() - e.deltaX, minX, 0));
      clearTimeout(t);
      t = setTimeout(() => goTo(Math.round(-x.get() / pitch)), 140);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(t);
    };
  }, [goTo, minX, pitch, x]);

  const [touched, setTouched] = useState(false);
  const onStageDown = (e: PointerEvent) => {
    controls.start(e);
  };

  if (!n) return null;
  const current = images[active];

  return (
    <section data-dark-ground className="snap-section fs" aria-labelledby="fs-title">
      <div className="fs__head">
        <div>
          <p className="fs__kicker">
            <span className="fs__dot" /> Photo gallery
          </p>
          <h2 id="fs-title" className="fs__title">
            {heading}
          </h2>
        </div>
        {body && <p className="fs__body">{body}</p>}
      </div>

      <div
        ref={stageRef}
        className="fs__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${siteName} photo strip. Drag to browse, or use the arrow keys.`}
        tabIndex={0}
        onPointerDown={onStageDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') goTo(active + 1);
          if (e.key === 'ArrowLeft') goTo(active - 1);
        }}
      >
        <motion.div
          className="fs__track"
          drag="x"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.12}
          dragTransition={{
            power: 0.3,
            timeConstant: 240,
            // Momentum lands on a frame, never between two.
            modifyTarget: (t) => clamp(Math.round(t / pitch) * pitch, minX, 0),
          }}
          onDragStart={() => setTouched(true)}
          style={{ x }}
        >
          {images.map((img, i) => (
            <Frame
              key={img.id}
              img={img}
              idx={i}
              x={x}
              pitch={pitch}
              cw={cw}
              ch={ch}
              active={i === active}
              alt={img.caption ?? `${siteName} campus`}
              onSelect={() => goTo(i)}
            />
          ))}
        </motion.div>

        <p className="fs__hint" data-hidden={touched || undefined} aria-hidden>
          <span /> Drag to browse
        </p>
      </div>

      <div className="fs__bar">
        <p className="fs__count" aria-hidden>
          <b>{pad(active + 1)}</b>
          <span>/ {pad(n)}</span>
        </p>
        <p className="fs__now" aria-live="polite">
          {current.caption || `${siteName} campus`}
        </p>
        <div className="fs__controls">
          <button
            type="button"
            className="fs__btn"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous photo"
          >
            ←
          </button>
          <button
            type="button"
            className="fs__btn"
            onClick={() => goTo(active + 1)}
            disabled={active === n - 1}
            aria-label="Next photo"
          >
            →
          </button>
          <Link to="/gallery" className="fs__all">
            Full photo gallery <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
