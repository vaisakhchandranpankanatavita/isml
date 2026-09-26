import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/hooks/useTheme';
import AppLoader from '@/components/common/AppLoader';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Root-level so the Studio/Cinema tokens reach admin routes too, even
        though the cinematic motion layer (CustomCursor, SmoothScroll) stays
        scoped to PublicLayout — the CMS should stay fast and plain. */}
    <ThemeProvider>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            {/* Sibling to the router, not a wrapper around it — it's a
                fixed full-screen overlay that unmounts itself once the
                first-load beat is over. Lives here, once, so a client-side
                route change never re-triggers it. */}
            <AppLoader />
            <RouterProvider router={router} />
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
