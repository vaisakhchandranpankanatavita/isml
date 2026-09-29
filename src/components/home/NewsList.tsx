import { Link } from "react-router-dom";
import Media from "@/components/common/Media";
import { CATEGORY_LABEL, formatDate } from "@/lib/format";
import type { Post } from "@/types";

/** Latest posts: three-up grid, each card fading up with a small stagger. */
export default function NewsList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="news" className="container home-section" aria-labelledby="news-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p data-r="fade-up" className="vc-label">
            News &amp; events
          </p>
          <h2
            id="news-title"
            data-r="words"
            className="mt-6 text-[clamp(2.75rem,10vw,10rem)] leading-[1.02] tracking-[-0.02em]"
          >
            What&rsquo;s happening
          </h2>
        </div>
        <Link to="/news" data-r="fade-up" className="r-nav-link">
          All news ↗
        </Link>
      </div>

      <ul className="home-gap grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.id} data-r="fade-up" data-delay={String(0.2 + (i % 3) * 0.15)}>
            <Link to={`/news/${post.slug}`} className="group block">
              <div className="r-img aspect-[4/3] !rounded-[0.5rem]">
                <Media
                  src={post.coverUrl}
                  alt=""
                  className="transition-transform duration-[900ms] ease-ref-image group-hover:scale-105"
                />
              </div>
              <p className="mt-5 flex gap-3 text-sm font-semibold text-ink-muted">
                <span className="rounded-full bg-lime px-3 py-0.5 text-ink">{CATEGORY_LABEL[post.category]}</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </p>
              <h3 className="mt-3 text-3xl leading-[1.02] group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-3 line-clamp-2 text-base font-medium text-ink-soft">{post.excerpt}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
