import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import RootShell from '@/components/layout/RootShell';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import RequireAuth from '@/components/auth/RequireAuth';

import Home from '@/pages/Home';
import About from '@/pages/About';
import Academics from '@/pages/Academics';
import Admissions from '@/pages/Admissions';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import Students from '@/pages/Students';
import Alumni from '@/pages/Alumni';
import PublicPage from '@/pages/PublicPage';
import NotFound from '@/pages/NotFound';

import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import PagesAdmin from '@/pages/admin/Pages';
import PageEditor from '@/pages/admin/PageEditor';
import PostsAdmin from '@/pages/admin/Posts';
import PostEditor from '@/pages/admin/PostEditor';
import MenusAdmin from '@/pages/admin/Menus';
import MenuEditor from '@/pages/admin/MenuEditor';
import MediaAdmin from '@/pages/admin/Media';
import UsersAdmin from '@/pages/admin/Users';
import UserEditor from '@/pages/admin/UserEditor';
import Settings from '@/pages/admin/Settings';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootShell />,
    errorElement: <NotFound />,
    children: [
      {
        element: <PublicLayout />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about', element: <About /> },
          { path: 'academics', element: <Academics /> },
          { path: 'admissions', element: <Admissions /> },
          { path: 'news', element: <News /> },
          { path: 'news/:slug', element: <NewsDetail /> },
          { path: 'gallery', element: <Gallery /> },
          { path: 'students', element: <Students /> },
          { path: 'alumni', element: <Alumni /> },
          { path: 'contact', element: <Contact /> },
          { path: 'p/:slug', element: <PublicPage /> },
        ],
      },
      { path: 'admin/login', element: <Login /> },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'pages', element: <PagesAdmin /> },
          { path: 'pages/new', element: <PageEditor /> },
          { path: 'pages/:id/edit', element: <PageEditor /> },
          { path: 'posts', element: <PostsAdmin /> },
          { path: 'posts/new', element: <PostEditor /> },
          { path: 'posts/:id/edit', element: <PostEditor /> },
          { path: 'menus', element: <MenusAdmin /> },
          { path: 'menus/new', element: <MenuEditor /> },
          { path: 'menus/:id/edit', element: <MenuEditor /> },
          { path: 'media', element: <MediaAdmin /> },
          { path: 'users', element: <UsersAdmin /> },
          { path: 'users/new', element: <UserEditor /> },
          { path: 'users/:id/edit', element: <UserEditor /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
