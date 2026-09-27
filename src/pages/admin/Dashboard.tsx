import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminIcon from "@/components/admin/AdminIcon";
import {
  pagesService,
  postsService,
  mediaService,
} from "@/services/cms.service";
import { usersService } from "@/services/users.service";
import { storage } from "@/services/storage";
import type { Post, Page } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface Stats {
  pages: number;
  posts: number;
  media: number;
  users: number;
}

const KPI_STYLES: Record<string, { icon: string; wash: string; text: string }> =
  {
    pages: { icon: "file", wash: "bg-brand-50", text: "text-brand-700" },
    posts: { icon: "newspaper", wash: "bg-sky-50", text: "text-sky-700" },
    media: { icon: "image", wash: "bg-amber-50", text: "text-amber-700" },
    users: { icon: "users", wash: "bg-violet-50", text: "text-violet-700" },
  };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    posts: 0,
    media: 0,
    users: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentPages, setRecentPages] = useState<Page[]>([]);

  useEffect(() => {
    const refresh = () => {
      setStats({
        pages: pagesService.list().length,
        posts: postsService.list().length,
        media: mediaService.list().length,
        users: usersService.list().length,
      });
      setRecentPosts(postsService.list().slice(0, 5));
      setRecentPages(pagesService.list().slice(0, 5));
    };
    refresh();
    return storage.subscribe(refresh);
  }, []);

  const cards = [
    { key: "pages", label: "Pages", value: stats.pages, to: "/admin/pages" },
    { key: "posts", label: "Posts", value: stats.posts, to: "/admin/posts" },
    { key: "media", label: "Media", value: stats.media, to: "/admin/media" },
    { key: "users", label: "Users", value: stats.users, to: "/admin/users" },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          {user ? user.name : "Editor"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Here's a snapshot of your site's content.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const s = KPI_STYLES[c.key];
          return (
            <Link
              key={c.key}
              to={c.to}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${s.wash} ${s.text}`}
              >
                <AdminIcon name={s.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                  {c.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {c.value}
                </p>
              </div>
              <span className="ml-auto text-slate-300 transition-colors group-hover:text-brand-600">
                <AdminIcon name="chevron" className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Recent posts / pages */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Latest posts
              </h2>
              <p className="text-xs text-slate-500">
                Most recent news & posts.
              </p>
            </div>
            <Link
              to="/admin/posts"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-4 hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:grid">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
          </div>

          <ul className="divide-y divide-slate-100 text-sm">
            {recentPosts.length === 0 && (
              <li className="py-6 text-center text-slate-500">No posts yet.</li>
            )}
            {recentPosts.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto] sm:gap-4"
              >
                <Link
                  to={`/admin/posts/${p.id}/edit`}
                  className="min-w-0 truncate font-medium text-slate-900 hover:text-brand-700"
                >
                  {p.title}
                </Link>
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {p.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    p.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Latest pages
              </h2>
              <p className="text-xs text-slate-500">
                Recently added or edited pages.
              </p>
            </div>
            <Link
              to="/admin/pages"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-4 hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-100 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:grid">
            <span>Title</span>
            <span>Slug</span>
            <span>Status</span>
          </div>

          <ul className="divide-y divide-slate-100 text-sm">
            {recentPages.length === 0 && (
              <li className="py-6 text-center text-slate-500">No pages yet.</li>
            )}
            {recentPages.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto] sm:gap-4"
              >
                <Link
                  to={`/admin/pages/${p.id}/edit`}
                  className="min-w-0 truncate font-medium text-slate-900 hover:text-brand-700"
                >
                  {p.title}
                </Link>
                <span className="hidden truncate text-xs text-slate-500 sm:inline">
                  /{p.slug}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    p.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
