import type { MediaItem, Page, Post } from '@/types';
import { nowIso, slugify, storage, uid } from './storage';

const bySlug = <T extends { slug: string; id: string }>(list: T[], slug: string, ignoreId?: string) =>
  list.some((x) => x.slug === slug && x.id !== ignoreId);

function uniqueSlug<T extends { slug: string; id: string }>(list: T[], base: string, ignoreId?: string) {
  let candidate = slugify(base) || 'item';
  let i = 2;
  while (bySlug(list, candidate, ignoreId)) {
    candidate = `${slugify(base)}-${i++}`;
  }
  return candidate;
}

// ------- Pages -------
export const pagesService = {
  list(): Page[] {
    return [...storage.read().pages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get(id: string): Page | undefined {
    return storage.read().pages.find((p) => p.id === id);
  },
  getBySlug(slug: string): Page | undefined {
    return storage.read().pages.find((p) => p.slug === slug);
  },
  create(input: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }): Page {
    const db = storage.read();
    const now = nowIso();
    const page: Page = {
      id: uid(),
      title: input.title,
      slug: uniqueSlug(db.pages, input.slug || input.title),
      content: input.content,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };
    db.pages.push(page);
    storage.write(db);
    return page;
  },
  update(id: string, patch: Partial<Omit<Page, 'id' | 'createdAt'>>): Page | undefined {
    const db = storage.read();
    const idx = db.pages.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const next: Page = {
      ...db.pages[idx],
      ...patch,
      slug: patch.slug ? uniqueSlug(db.pages, patch.slug, id) : db.pages[idx].slug,
      updatedAt: nowIso(),
    };
    db.pages[idx] = next;
    storage.write(db);
    return next;
  },
  remove(id: string): void {
    const db = storage.read();
    db.pages = db.pages.filter((p) => p.id !== id);
    storage.write(db);
  },
};

// ------- Posts -------
export const postsService = {
  list(): Post[] {
    return [...storage.read().posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  listPublished(): Post[] {
    return this.list().filter((p) => p.status === 'published');
  },
  get(id: string): Post | undefined {
    return storage.read().posts.find((p) => p.id === id);
  },
  getBySlug(slug: string): Post | undefined {
    return storage.read().posts.find((p) => p.slug === slug);
  },
  create(input: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }): Post {
    const db = storage.read();
    const now = nowIso();
    const post: Post = {
      id: uid(),
      title: input.title,
      slug: uniqueSlug(db.posts, input.slug || input.title),
      excerpt: input.excerpt,
      content: input.content,
      coverUrl: input.coverUrl,
      category: input.category,
      status: input.status,
      publishedAt: input.publishedAt || now,
      author: input.author,
      createdAt: now,
      updatedAt: now,
    };
    db.posts.push(post);
    storage.write(db);
    return post;
  },
  update(id: string, patch: Partial<Omit<Post, 'id' | 'createdAt'>>): Post | undefined {
    const db = storage.read();
    const idx = db.posts.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const next: Post = {
      ...db.posts[idx],
      ...patch,
      slug: patch.slug ? uniqueSlug(db.posts, patch.slug, id) : db.posts[idx].slug,
      updatedAt: nowIso(),
    };
    db.posts[idx] = next;
    storage.write(db);
    return next;
  },
  remove(id: string): void {
    const db = storage.read();
    db.posts = db.posts.filter((p) => p.id !== id);
    storage.write(db);
  },
};

// ------- Media -------
export const mediaService = {
  list(): MediaItem[] {
    return [...storage.read().media].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  },
  async upload(file: File): Promise<MediaItem> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const type: MediaItem['type'] = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : 'document';
    const item: MediaItem = {
      id: uid(),
      url: dataUrl,
      name: file.name,
      type,
      size: file.size,
      uploadedAt: nowIso(),
    };
    const db = storage.read();
    db.media.push(item);
    storage.write(db);
    return item;
  },
  remove(id: string): void {
    const db = storage.read();
    db.media = db.media.filter((m) => m.id !== id);
    storage.write(db);
  },
};

// ------- Legacy shape (kept for existing consumers) -------
export const cmsService = {
  listPosts: () => Promise.resolve(postsService.listPublished()),
  getPost: (slug: string) => Promise.resolve(postsService.getBySlug(slug)),
  listPages: () => Promise.resolve(pagesService.list().filter((p) => p.status === 'published')),
  listMedia: () => Promise.resolve(mediaService.list()),
};
