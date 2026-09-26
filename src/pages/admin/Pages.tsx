import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { pagesService } from '@/services/cms.service';
import { storage } from '@/services/storage';
import type { Page } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([]);
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Page | null>(null);
  const { push } = useToast();

  useEffect(() => {
    const refresh = () => setPages(pagesService.list());
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [pages, query]);

  const handleDelete = () => {
    if (!toDelete) return;
    pagesService.remove(toDelete.id);
    push('success', `Page "${toDelete.title}" deleted.`);
    setToDelete(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Static pages available across the website."
        actions={
          <Link to="/admin/pages/new" className="btn-primary">
            + New page
          </Link>
        }
      />

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages…"
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No pages match your search.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.coverUrl ? (
                        <img
                          src={p.coverUrl}
                          alt=""
                          className="h-10 w-14 flex-none rounded-md object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="flex h-10 w-14 flex-none items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-400 ring-1 ring-slate-200">
                          No img
                        </div>
                      )}
                      <span className="font-medium text-slate-900">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">/{p.slug}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/pages/${p.id}/edit`}
                      className="text-brand-700 hover:underline"
                    >
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
        title="Delete page?"
        message={`This will permanently remove "${toDelete?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function StatusPill({ status }: { status: Page['status'] }) {
  const cls =
    status === 'published'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
