import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ADMIN_NAV_SECTIONS, SITE_NAME } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import AdminIcon from '@/components/admin/AdminIcon';

function currentPageTitle(pathname: string) {
  for (const section of ADMIN_NAV_SECTIONS) {
    for (const item of section.items) {
      if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
        return item.label;
      }
    }
  }
  if (pathname.startsWith('/admin/posts/')) return 'News & Posts';
  if (pathname.startsWith('/admin/pages/')) return 'Pages';
  if (pathname.startsWith('/admin/menus/')) return 'Menus';
  if (pathname.startsWith('/admin/users/')) return 'Users';
  return 'Dashboard';
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageTitle = currentPageTitle(pathname);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const initials = (user?.name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-emerald-900 text-emerald-50 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight">
              is<span className="text-emerald-300">ml</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-100/70 hover:bg-white/10 lg:hidden"
          >
            <AdminIcon name="menu" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/70">
                {section.heading}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    end={item.to === '/admin/dashboard'}
                    className={({ isActive }) =>
                      clsx(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-emerald-500/20 text-white ring-1 ring-emerald-400/40'
                          : 'text-emerald-100/80 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    <AdminIcon
                      name={item.icon}
                      className="h-4 w-4 text-emerald-200 group-hover:text-white"
                    />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-auto rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300/70">
              Site
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{SITE_NAME}</p>
            <Link
              to="/"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-200 hover:text-white"
            >
              View site
              <AdminIcon name="external" className="h-3 w-3" />
            </Link>
          </div>
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle sidebar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <AdminIcon name="menu" className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <AdminIcon name="grid" className="h-4 w-4" />
              </span>
              <h1 className="text-base font-semibold text-slate-900">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 sm:inline-flex"
            >
              <AdminIcon name="bell" className="h-5 w-5" />
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
            </div>

            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800"
            >
              {initials || 'U'}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="relative flex-1 overflow-hidden">
          {/* Soft green gradient wash at the top of every admin page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-100/70 via-emerald-50/40 to-transparent"
          />
          <div className="relative p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
