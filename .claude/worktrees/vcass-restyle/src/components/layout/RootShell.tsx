import { Outlet } from 'react-router-dom';
import ChatBot from '@/components/chat/ChatBot';

/**
 * Pathless root of the whole route tree. Anything that must exist on every
 * route — public site, admin, login, 404 — mounts here once, so it persists
 * across client-side navigation instead of remounting per layout.
 */
export default function RootShell() {
  return (
    <>
      <Outlet />
      <ChatBot />
    </>
  );
}
