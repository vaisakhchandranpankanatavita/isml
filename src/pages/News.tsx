import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import Media from '@/components/common/Media';
import { useInvertHover } from '@/hooks/useInvertHover';
import { postsService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import type { Post, PostCategory } from '@/types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const CATEGORY_LABEL: Record<PostCategory, string> = {
  news: 'News',
  event: 'Event',
  announcement: 'Circular',
};

/**
 * Filters. These exist because the main navigation already links to
 * `/news?category=event` and `/news?category=announcement` — the links were
 * live before anything read the parameter.
 */
const FILTERS: { label: string; value: PostCategory | 'all' }[] = [
  { label: 'Everything', value: 'all' },
  { label: 'News', value: 'news' },
  { label: 'Events', value: 'event' },
  { label: 'Circulars', value: 'announcement' },
];

const isCategory = (v: string | null): v is PostCategory =>
  v === 'news' || v === 'event' || v === 'announcement';

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const onInvertHover = useInvertHover();

  const raw = params.get('category');
  const active: PostCategory | 'all' = isCategory(raw) ? raw : 'all';

  useEffect(() => {
    const refresh = () => {
      setPosts(postsService.listPublished());
      setLoading(false);
    };
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const shown = active === 'all' ? posts : posts.filter((p) => p.category === active);

  const select = (value: PostCategory | 'all') => {
    if (value === 'all') setParams({}, { replace: true });
    else setParams({ category: value }, { replace: true });
  };

  return (
    <>
      <PageHero
        title="News and events"
        subtitle="Circulars, results, events and announcements from the school office."
      />

      <section className="section-lg">
        <div className="container">
          {/* Filters are a real control, so they are buttons that change the
              URL — the state is shareable and the back button works. */}
          <nav aria-label="Filter by type" className="border-b border-paper-line">
            <ul className="-mb-px flex flex-wrap gap-x-7">
              {FILTERS.map((f) => {
                const selected = f.value === active;
                return (
                  <li key={f.value}>
                    <button
                      type="button"
                      onClick={() => select(f.value)}
                      aria-current={selected ? 'true' : undefined}
                      className={
                        selected
                          ? 'border-b-2 border-brand-600 pb-3 text-sm font-semibold text-ink'
                          : 'border-b-2 border-transparent pb-3 text-sm font-semibold text-ink-muted hover:text-school-red'
                      }
                    >
                      {f.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {loading ? (
            <p className="mt-12 text-sm text-ink-muted">Loading stories.</p>
          ) : shown.length === 0 ? (
            <div className="mt-12 max-w-measure">
              <h2 className="text-xl">
                {active === 'all' ? 'Nothing published yet' : 'Nothing in this section yet'}
              </h2>
              <p className="body-copy mt-3">
                {active === 'all'
                  ? 'When the school office publishes a circular or a story, it will appear here.'
                  : 'Try another section, or look through everything the office has published.'}
              </p>
              {active === 'all' ? (
                <Link
                  to="/"
                  className="btn-outline btn-invert mt-7"
                  data-cursor-magnetic
                  onPointerEnter={onInvertHover}
                >
                  Back to home
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => select('all')}
                  className="btn-outline btn-invert mt-7"
                  data-cursor-magnetic
                  onPointerEnter={onInvertHover}
                >
                  Show everything
                </button>
              )}
            </div>
          ) : (
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((post) => (
                <article key={post.id}>
                  <Link to={`/news/${post.slug}`} className="group block">
                    <div className="story__media">
                      <Media src={post.coverUrl} alt={post.title} />
                    </div>
                    <p className="story__cat">{CATEGORY_LABEL[post.category]}</p>
                    <h2 className="story__title">{post.title}</h2>
                    <p className="story__excerpt">{post.excerpt}</p>
                    <p className="story__meta">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      {post.author && <span className="text-ink-faint"> — {post.author}</span>}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
