import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Media from '@/components/common/Media';
import type { HomeGalleryImage, Post } from '@/types';

/**
 * News & Events — a light, editorial two-column layout matching the
 * reference brief: a numbered headline list on the left, one featured story
 * with an image and caption plate on the right, and a short photo/quote row
 * beneath. Replaces the old dark, scroll-driven newsroom scene
 * (`NewsShowcase.tsx`, kept but unused) with the site's ordinary paper
 * canvas — this section reads as one page with the rest of the homepage,
 * not a separate dark set piece.
 */

const pad = (n: number) => String(n).padStart(2, '0');
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

interface Props {
  posts: Post[];
  siteName: string;
  galleryImages?: HomeGalleryImage[];
}

export default function NewsEvents({ posts, siteName, galleryImages = [] }: Props) {
  const [lead, ...rest] = posts;
  const list = rest.slice(0, 4);
  if (!lead) return null;

  return (
    <section className="band band-line py-20 md:py-28">
      <div className="container">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------------------------------------------------- left column */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">News &amp; Events</h2>
              <Link to="/news" className="link inline-flex items-center gap-1 text-sm font-semibold">
                View all news <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="body-copy mt-4">
              Stay informed with the latest news, achievements and events from {siteName}.
            </p>

            <ol className="mt-8 border-t border-paper-line">
              {list.map((post, i) => (
                <motion.li
                  key={post.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
                  className="border-b border-paper-line"
                >
                  <Link to={`/news/${post.slug}`} className="group flex items-start gap-4 py-4">
                    <span className="w-6 shrink-0 pt-0.5 font-display text-sm text-ink-faint">
                      {pad(i + 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-ink-muted">{formatDate(post.publishedAt)}</span>
                      <span className="mt-1 block text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-marigold-500">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="mt-1 line-clamp-1 block text-xs text-ink-muted">{post.excerpt}</span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className="pt-0.5 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* --------------------------------------------------- lead story */}
          <Link
            to={`/news/${lead.slug}`}
            aria-label={lead.title}
            className="spotlight-card group relative block aspect-[4/3] overflow-hidden bg-paper-sunk lg:aspect-auto lg:h-full lg:min-h-[26rem]"
          >
            <Media src={lead.coverUrl} alt={lead.title} />
            <span
              aria-hidden
              className="absolute left-3 top-3 z-10 border border-marigold-500 bg-marigold-500/10 px-2.5 py-1 text-2xs font-semibold uppercase tracking-widest text-marigold-500"
            >
              Featured
            </span>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent pb-6 pt-20"
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-xs text-white/70">{formatDate(lead.publishedAt)}</span>
              <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-white md:text-xl">
                {lead.title}
              </h3>
              {lead.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-white/80">{lead.excerpt}</p>
              )}
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-marigold-500">
                Read more <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* -------------------------------------------------------- photo row */}
        {galleryImages.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-8">
            {galleryImages.slice(0, 2).map((img) => (
              <div key={img.id} className="spotlight-card aspect-square overflow-hidden bg-paper-sunk">
                <Media src={img.url} alt={img.caption || ''} />
              </div>
            ))}
            <div className="col-span-2 flex flex-col justify-center gap-3 bg-brand-900 p-6 text-white">
              <span className="h-px w-8 bg-marigold-400" />
              <p className="font-display text-lg font-semibold leading-snug md:text-xl">
                Building brighter futures together
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
