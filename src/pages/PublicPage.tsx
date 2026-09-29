import { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import { pagesService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import type { Page } from '@/types';

export default function PublicPage() {
  const { slug = '' } = useParams();
  const { pathname, hash } = useLocation();
  const [page, setPage] = useState<Page | undefined>(() => pagesService.getBySlug(slug));
  useEffect(() => {
    setPage(pagesService.getBySlug(slug));
    return storage.subscribe(() => setPage(pagesService.getBySlug(slug)));
  }, [slug]);

  // CMS pages live at `/<slug>`, matching the original site; `/p/<slug>`
  // (old links, bookmarks, menu items saved before the change) redirects there.
  if (pathname.startsWith('/p/')) return <Navigate to={`/${slug}${hash}`} replace />;

  if (!page || page.status !== 'published') {
    return (
      <>
        <PageHero
          title="This page isn't available"
          subtitle="The address may have moved, or the page may not be published yet."
        />
        <section className="section-lg">
          <div className="container">
            <Link
              to="/"
              className="btn-primary"              data-cursor-magnetic
            >
              Back to home
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero title={page.title} crumb={page.title} />

      <section className="section-lg">
        <div className="container">
          {page.coverUrl && (
            <figure className="mb-10">
              <div className="aspect-[16/9] overflow-hidden bg-paper-band">
                <img
                  src={page.coverUrl}
                  alt={page.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </figure>
          )}

          <article className="cms-prose">{page.content}</article>
        </div>
      </section>
    </>
  );
}
