import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/common/Media";
import { Button } from "@/components/common/Button";
import type { Post } from "@/types";

const CATEGORY_LABEL: Record<Post["category"], string> = {
  news: "News",
  event: "Event",
  announcement: "Circular",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

/**
 * The VCASS "BlockCardCarousel" in its `light` / `theme-brand` dress: a
 * cream-amber band with the heading on the left, the call to action on the
 * right, a hairline, then a horizontally scrolling row of post cards. A post
 * card's hover panel grows *past* the card edge in amber.
 */
export default function NewsCarousel({
  posts,
  heading = "Latest news",
}: {
  posts: Post[];
  heading?: string;
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  if (posts.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * dir, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="band-brand home-section">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="home-title">
            {heading}
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous stories"
              className="vc-icon-btn [--btn-bg:#ffdead] [--btn-fg:#4d2c00]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16M13 5l7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next stories"
              className="vc-icon-btn [--btn-bg:#ffdead] [--btn-fg:#4d2c00]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16M13 5l7 7-7 7" />
              </svg>
            </button>
            <Button variant="primary" as="a" to="/news">
              All news
            </Button>
          </div>
        </div>

        <div className="relative mt-6 pt-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[#ffdead]">
          <div
            ref={trackRef}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                data-card
                className="vc-card vc-card--post w-[80%] shrink-0 snap-start !p-0 [--vc-card-hover:#f59d21] sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 * (i % 4),
                  ease: "easeOut",
                }}
              >
                <Link
                  to={`/news/${post.slug}`}
                  data-cursor-text="Read"
                  className="flex h-full flex-col"
                >
                  <div className="vc-card__media aspect-[4/3] bg-[#ffdead]">
                    <Media src={post.coverUrl} alt={post.title} />
                    <span className="vc-label absolute bottom-3 left-3 rounded-full bg-[#fff2e0] px-3 py-1.5 text-xs text-[#854000]">
                      {CATEGORY_LABEL[post.category]}
                    </span>
                  </div>
                  <div className="flex-1 py-6">
                    <h3 className="vc-card__title text-2xl text-[#854000] md:text-3xl">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="vc-card__text mt-3 line-clamp-3 text-sm leading-relaxed text-[#854000]/80">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="vc-card__text flex justify-between gap-2 border-t border-[#ffdead] pt-4 text-xs text-[#854000]">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>{post.author}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
