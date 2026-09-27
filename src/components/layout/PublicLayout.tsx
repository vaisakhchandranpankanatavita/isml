import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./Header";
import Footer from "./Footer";
import CustomCursor from "@/components/common/CustomCursor";
import SmoothScroll, { useLenis } from "@/components/common/SmoothScroll";
import SpotlightTracker from "@/components/common/SpotlightTracker";

/**
 * The VCASS route curtain: a near-black sheet carrying the crest covers the
 * page as each route mounts, then wipes off upward. Its clip closes from the
 * bottom while it drifts up 10% over 0.6s, the same values the reference
 * site's `background-anim` uses. The first route of a hard load is skipped,
 * because AppLoader's curtain already covers it.
 */
let firstRoute = true;
gsap.registerPlugin(ScrollTrigger);

function usePageParallax(pathname: string) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const touched = new Set<HTMLImageElement>();
    const main = document.querySelector("#main");
    if (!main) return;
    const images = new Set<HTMLImageElement>();
    const animations: gsap.core.Tween[] = [];

    const initialize = () => {
      const candidates = Array.from(
        main.querySelectorAll<HTMLImageElement>("img"),
      ).filter((image) => {
        const bounds = image.getBoundingClientRect();
        return (
          getComputedStyle(image).objectFit === "cover" &&
          bounds.width > 120 &&
          bounds.height > 80 &&
          !images.has(image) &&
          !image.closest('[data-parallax="off"]')
        );
      });

      candidates.forEach((image) => {
        images.add(image);
        const offset = { y: -10 };
        animations.push(
          gsap.to(offset, {
            y: 10,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              onUpdate: () => {
                image.style.setProperty(
                  "translate",
                  `0 ${offset.y.toFixed(1)}px`,
                );
                image.style.setProperty("scale", "1.04");
              },
            },
          }),
        );
        touched.add(image);
      });

      if (candidates.length) ScrollTrigger.refresh();
    };

    initialize();
    const observer = new MutationObserver(initialize);
    observer.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      animations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
      touched.forEach((image) => {
        image.style.removeProperty("translate");
        image.style.removeProperty("scale");
      });
    };
  }, [pathname]);
}

function RouteCurtain() {
  const reduce = useReducedMotion();
  const [skip] = useState(() => {
    const was = firstRoute;
    firstRoute = false;
    return was;
  });
  if (reduce || skip) return null;
  return (
    <motion.div
      aria-hidden
      className="vc-curtain"
      initial={{ clipPath: "inset(0% 0% 0% 0%)", y: "0%" }}
      animate={{
        clipPath: "inset(0% 0% 90% 0%)",
        y: "-10%",
        transitionEnd: { display: "none" },
      }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      <motion.img
        src="/logo.png"
        alt=""
        className="w-24 md:w-32"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function RouteScrollReset() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, lenis]);

  return null;
}

/**
 * Public shell: floating header, content in normal flow, footer. The header
 * is `fixed`, so pages are responsible for their own top padding to clear
 * it (PageHero does), and `scroll-padding-top` in index.css keeps in-page
 * anchors clear of it.
 */
export default function PublicLayout() {
  const { pathname } = useLocation();
  usePageParallax(pathname);

  return (
    <SmoothScroll>
      <RouteScrollReset />
      <div className="flex min-h-screen flex-col bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]
                     focus:rounded-full focus:bg-neutral-1 focus:px-5 focus:py-2.5 focus:font-display
                     focus:text-sm focus:font-bold focus:uppercase focus:text-neutral-7"
        >
          Skip to content
        </a>

        <CustomCursor />
        <SpotlightTracker />
        <Header />

        <main
          id="main"
          className={`flex-1 ${pathname !== "/" ? "public-inner-page" : ""}`}
        >
          <div key={pathname}>
            <RouteCurtain />
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
