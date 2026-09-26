import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Media from '@/components/common/Media';
import { Button } from '@/components/common/Button';
import type { HomeGalleryImage } from '@/types';

/**
 * The VCASS "ImageParallax" block: a 110lvh dark field with a centred
 * heading and button, surrounded by seven photographs scattered around the
 * edges. The photos drift against the pointer: each one's offset is the
 * pointer's distance from centre × its depth ÷ 20, eased toward that target
 * every frame, so deeper photos swing further.
 *
 * Layout (top/left/size/depth) is the reference's own table.
 */
const SLOTS = [
  { depth: 0.5, top: '8%', left: '2%', size: 'm' },
  { depth: 1, top: '2%', left: '32%', size: 's' },
  { depth: 2, top: '2%', left: '53%', size: 'm' },
  { depth: 1, top: '9%', left: '83%', size: 's' },
  { depth: 4, top: '73%', left: '15%', size: 'l' },
  { depth: 1, top: '80%', left: '50%', size: 'm' },
  { depth: 2, top: '70%', left: '77%', size: 'm' },
] as const;

const SIZE = {
  s: 'w-[24vw] md:w-[16vw]',
  m: 'w-[40vw] md:w-[24vw]',
  l: 'w-[50vw] md:w-[35vw]',
};

const SENSITIVITY = -1;
const EASE = 0.1;

export default function FloatingGallery({
  images,
  heading,
  body,
}: {
  images: HomeGalleryImage[];
  heading: string;
  body?: string;
}) {
  const reduce = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduce) return;
    const field = fieldRef.current;
    if (!field) return;

    const mouse = { x: 0, y: 0 };
    const pos = SLOTS.map(() => ({ x: 0, y: 0 }));
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const r = field.getBoundingClientRect();
      mouse.x = e.clientX - (r.left + r.width / 2);
      mouse.y = e.clientY - (r.top + r.height / 2);
    };

    const tick = () => {
      SLOTS.forEach((slot, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const k = (slot.depth * SENSITIVITY) / 20;
        pos[i].x += (mouse.x * k - pos[i].x) * EASE;
        pos[i].y += (mouse.y * k - pos[i].y) * EASE;
        el.style.transform = `translate3d(${pos[i].x}px, ${pos[i].y}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    // Only animate while the field is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(field);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduce]);

  const photos = images.filter((img) => img.url).slice(0, SLOTS.length);

  return (
    <section className="band-dark relative h-[110lvh] min-h-[640px] overflow-hidden">
      <div ref={fieldRef} className="absolute inset-0 overflow-clip">
        {photos.map((img, i) => {
          const slot = SLOTS[i];
          return (
            <div
              key={img.id}
              ref={(el) => (itemRefs.current[i] = el)}
              className="absolute will-change-transform"
              style={{ top: slot.top, left: slot.left }}
            >
              <motion.div
                className={`${SIZE[slot.size]} overflow-hidden rounded-[8px]`}
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="aspect-[4/3]">
                  <Media src={img.url} alt={img.caption ?? ''} />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center">
        <motion.div
          className="pointer-events-auto flex max-w-[90%] flex-col items-center gap-4 text-center"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-150px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="text-[clamp(2.5257rem,1.3817rem+4.8943vw,7.4506rem)] text-neutral-2">
            {heading}
          </h2>
          {body && <p className="max-w-md text-base text-neutral-4">{body}</p>}
          <Button variant="secondary" as="a" to="/gallery" className="mt-2">
            The gallery
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
