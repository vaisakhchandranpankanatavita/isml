import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { postsService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import type { Post, PostCategory } from '@/types';
import { useToast } from '@/hooks/useToast';

type Filter = 'all' | PostCategory;

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Post | null>(null);
  const { push } = useToast();

  useEffect(() => {
    const refresh = () => setPosts(postsService.list());
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    });
  }, [posts, filter, query]);

  const handleDelete = () => {
    if (!toDelete) return;
    postsService.remove(toDelete.id);
    push('success', `Post "${toDelete.title}" deleted.`);
    setToDelete(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="News & Posts"
        description="Manage news articles, events and circulars."
        actions={
          <Link to="/admin/posts/new" className="btn-primary">
            + New post
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-1 rounded-md border border-slate-200 bg-white p-1 text-xs">
          {(['all', 'news', 'event', 'announcement'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded px-3 py-1.5 capitalize ${
                filter === f ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No posts match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{p.title}</div>
                    <div className="text-xs text-slate-500">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.author}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(p.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/posts/${p.id}/edit`} className="text-brand-700 hover:underline">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setToDelete(p)}
                      className="ml-4 text-school-red hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete post?"
        message={`This will permanently remove "${toDelete?.title}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
