import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Media from '@/components/common/Media';
import PageHero from '@/components/common/PageHero';
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

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  useEffect(() => {
    if (!slug) return;
    const refresh = () => setPost(postsService.getBySlug(slug) ?? null);
    refresh();
    return storage.subscribe(refresh);
  }, [slug]);

  if (post === undefined) {
    return (
      <section className="section-lg pt-32">
        <div className="container">
          <p className="text-sm text-ink-muted">Opening this story.</p>
        </div>
      </section>
    );
  }

  if (post === null) {
    return (
      <>
        <PageHero
          title="This story is no longer available"
          subtitle="It may have been unpublished, or the link may be out of date."
          crumb="News"
        />
        <section className="section-lg">
          <div className="container">
            <Link
              to="/news"
              className="btn-primary"
              data-cursor-magnetic            >
              All news and circulars
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        eyebrow={CATEGORY_LABEL[post.category]}
        crumb="News"
      />

      <article className="section-lg">
        <div className="container">
          {/* Byline above the cover, the way a paper sets one. */}
          <p className="border-b border-paper-line pb-5 text-sm text-ink-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.author && <span> — {post.author}</span>}
          </p>

          {post.coverUrl && (
            <figure className="mt-10">
              <div className="aspect-[16/9] overflow-hidden bg-paper-band">
                <Media src={post.coverUrl} alt={post.title} />
              </div>
            </figure>
          )}

          <div className="cms-prose mt-10">{post.content}</div>

          <div className="mt-14 border-t border-paper-line pt-8">
            <Link
              to="/news"
              className="btn-outline"
              data-cursor-magnetic            >
              All news and circulars
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
