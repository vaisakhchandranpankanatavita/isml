import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SmoothScroll, { useLenis } from "@/components/common/SmoothScroll";
import { useReferenceMotion } from "@/motion/useReferenceMotion";

function RouteScrollReset() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    // `/about#principal`-style links: the target mounts with the route, so
    // wait a frame or two for it, then scroll it clear of the header.
    let tries = 0;
    let raf = 0;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        const offset = -(document.querySelector("[data-header]")?.getBoundingClientRect().bottom ?? 0) - 16;
        if (lenis) lenis.scrollTo(el, { offset });
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
      } else if (tries++ < 30) {
        raf = requestAnimationFrame(find);
      }
    };
    raf = requestAnimationFrame(find);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, lenis]);

  return null;
}

function Shell() {
  const { pathname } = useLocation();
  // One pass over the whole page: every `data-r` element gets its reveal.
  const scope = useReferenceMotion([pathname]);

  return (
    <div ref={scope} className="flex min-h-dvh flex-col bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-obsidian focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-neutral-1"
      >
        Skip to content
      </a>
      <RouteScrollReset />
      <Header />
      <main id="main" className={`flex-1 ${pathname !== "/" ? "public-inner-page" : ""}`}>
        <div key={pathname} className="route-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PublicLayout() {
  return (
    <SmoothScroll>
      <Shell />
    </SmoothScroll>
  );
}
