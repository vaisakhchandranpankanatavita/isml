import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/common/Media";
import { useReveal } from "@/components/motion/reveal";
import type { Post } from "@/types";

export const CATEGORY_LABEL: Record<Post["category"], string> = {
  news: "News",
  event: "Event",
  announcement: "Circular",
};

export function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

export default function NewsCarousel({
  posts,
  heading = "Latest news",
}: {
  posts: Post[];
  heading?: string;
}) {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const trackRef = useRef<HTMLDivElement>(null);
  if (posts.length === 0) return null;
  // Fewer stories than a row holds: lay them out as a grid (a lone story as
  // one wide feature card) instead of a carousel with empty track beside it.
  const layout =
    posts.length === 1
      ? " home-news__track--single"
      : posts.length < 4
        ? " home-news__track--grid"
        : "";
  const scrollable = layout === "";

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({
      left: step * direction,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      className="home-section home-section--alt home-news"
      aria-labelledby="home-news-title"
    >
      <div className="container">
        <div className="home-head">
          <motion.div {...reveal()}>
            <p className="home-eyebrow">
              <span className="home-eyebrow__index">05</span> Stories from our
              community
            </p>
            <h2 id="home-news-title" className="home-title">
              {heading}
            </h2>
          </motion.div>
          <motion.div className="home-head__aside" {...reveal(0.12)}>
            <p className="home-body">
              Moments, milestones and updates from life at ISML.
            </p>
            <div className="home-news__actions">
              {scrollable && (
                <div className="home-news__controls">
                  <button
                    type="button"
                    onClick={() => scrollBy(-1)}
                    aria-label="Previous stories"
                    className="home-news__arrow"
                  >
                    <ArrowIcon className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollBy(1)}
                    aria-label="Next stories"
                    className="home-news__arrow"
                  >
                    <ArrowIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              <Link to="/news" className="home-link">
                View all news <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div
          ref={trackRef}
          className={`home-news__track${layout}`}
          aria-label="Latest news stories"
        >
          {posts.map((post, index) => {
            const date = formatDate(post.publishedAt);
            return (
              <motion.article
                key={post.id}
                data-card
                className="home-news__card"
                {...reveal(0.08 * (index % 4), 14)}
              >
                <Link
                  to={`/news/${post.slug}`}
                  className="home-news__card-link"
                >
                  <div className="home-news__image">
                    <Media src={post.coverUrl} alt={post.title} />
                  </div>
                  <div className="home-news__content">
                    <div className="home-news__meta">
                      <span>{CATEGORY_LABEL[post.category]}</span>
                      {date && <time dateTime={post.publishedAt}>{date}</time>}
                    </div>
                    <h3 className="home-news__title">{post.title}</h3>
                    {post.excerpt && (
                      <p className="home-news__excerpt">{post.excerpt}</p>
                    )}
                    <div className="home-news__footer">
                      <span>{post.author}</span>
                      <span className="home-news__read">
                        Read story <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
