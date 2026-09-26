import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    // Run from a worktree (.claude/worktrees/<name>), pnpm's store lives in the
    // parent repo's node_modules, outside Vite's default serve root, so the
    // vendored fonts would 403 in dev. Allow the workspace up to the repo root.
    fs: { allow: [path.resolve(__dirname), path.resolve(__dirname, '../../..')] },
  },
});
