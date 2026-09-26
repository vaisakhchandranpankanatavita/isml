import { useEffect, useState } from 'react';
import type { Page } from '@/types';
import { pagesService } from '@/services/cms.service';
import { storage } from '@/services/storage';

export function usePage(slug: string): Page | undefined {
  const [page, setPage] = useState<Page | undefined>(() => pagesService.getBySlug(slug));
  useEffect(() => {
    const refresh = () => setPage(pagesService.getBySlug(slug));
    refresh();
    return storage.subscribe(refresh);
  }, [slug]);
  return page;
}
