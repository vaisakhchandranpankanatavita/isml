import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the viewport vertically and translates ordinary mouse-wheel scroll
 * into horizontal track movement — for a gallery or a campus-architecture
 * sweep, per the brief. Under reduced motion the pin never engages and the
 * wrapper falls back to a plain horizontally-scrollable strip (`overflow-x-
 * auto`) — the content stays reachable by swipe/drag, just without the
 * vertical-to-horizontal translation.
 */
export default function HorizontalScrollSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setPinned(true);
    const distance = () => Math.max(track.scrollWidth - wrapper.clientWidth, 0);

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={clsx(pinned ? 'overflow-hidden' : 'overflow-x-auto', className)}
    >
      <div ref={trackRef} className="flex w-max gap-4">
        {children}
      </div>
    </div>
  );
}
