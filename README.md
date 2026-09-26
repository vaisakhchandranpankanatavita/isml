# ISML — School CMS (React UI Skeleton)

A responsive React + TypeScript + Vite skeleton for a school website with a headless-CMS-style admin area. Styled with Tailwind CSS and routed with React Router.

## Features

- **Public site**: Home, About, Academics, Admissions, News & Events (with detail), Gallery, Contact.
- **CMS admin**: Login, Dashboard, Pages, Posts, Media, Users, Settings.
- **Responsive layout**: mobile-first navigation, sticky header, collapsible admin sidebar.
- **Auth scaffold**: React Context + protected routes + token stub (swap the mock in `src/services/auth.service.ts` for your API).
- **API layer**: Typed `apiFetch` helper reading `VITE_API_BASE_URL`.
- **Path alias**: `@/*` → `src/*`.

## Tech stack

- React 18 + TypeScript
- Vite 5
- React Router 6
- Tailwind CSS 3
- clsx

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The site runs at http://localhost:5173.

Sign in to the CMS at `/admin/login` — in demo mode any email/password works.

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start Vite dev server           |
| `npm run build`   | Type-check and build production |
| `npm run preview` | Preview the production build    |
| `npm run lint`    | Run ESLint                      |
| `npm run format`  | Format with Prettier            |

## Project structure

```
src/
├── components/
│   ├── auth/            # RequireAuth guard
│   ├── common/          # Reusable UI (SectionHeading, PageHero, …)
│   └── layout/          # PublicLayout, AdminLayout, Header, Footer
├── config/              # Site-wide config (nav, constants)
├── context/             # React contexts (AuthContext)
├── hooks/               # Custom hooks (useAuth)
├── pages/               # Route components
│   └── admin/           # CMS admin pages
├── router/              # Route definitions
├── services/            # API client + feature services
├── types/               # Shared TypeScript types
├── index.css            # Tailwind entry + design tokens
└── main.tsx             # App bootstrap
```

## Connecting to a real backend

1. Point `VITE_API_BASE_URL` at your API.
2. Replace mock returns in `src/services/*.ts` with `apiFetch(...)` calls.
3. Update `AuthContext` if your backend uses cookies instead of bearer tokens.

## Roadmap ideas

- Rich-text editor for pages/posts (e.g. TipTap).
- Image upload with signed URLs.
- Role-based route guards (admin/editor/author).
- Server-side search & pagination.
- i18n for multi-language content.
# isml
# isml
