# Noorvi Poetry & Moments

A Next.js 16 App Router project for a shayari-focused landing page, category-based story experience, and Atlas-backed admin workflow.

## Stack

- Next.js 16.2.1
- React 19.2.4
- Tailwind CSS 4
- ESLint 9
- MongoDB driver

## Project Shape

- `src/app/page.js`: homepage with profile hero, category entry cards, and download sections
- `src/app/category/[mood]/page.js`: dynamic mood routes backed by the shared content repository
- `src/app/admin/`: protected admin pages for login, posts, socials, and category settings
- `src/app/api/`: public read-only content APIs plus protected admin APIs under `api/admin`
- `src/lib/content/repository.js`: public repository layer with seed fallback support
- `src/lib/content/admin-repository.js`: admin CRUD helpers for Mongo-backed content management
- `src/lib/admin/`: session, permission, password, and user helpers for role-based admin access
- `src/proxy.js`: Next 16 proxy-based optimistic guard for `/admin` and `/api/admin`
- `public/`: local audio plus SVG placeholder brand, icon, and preview assets

## Environment

Copy the values you need into `.env.local`:

```env
MONGODB_URI=...
MONGODB_DB=noorvi_shayari
ADMIN_SESSION_SECRET=...
```

`ADMIN_SESSION_SECRET` is required for signing the admin session cookie.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:seed
npm run db:setup
npm run db:setup:seed-only
npm run db:dns-check
npm run auth:create-user -- --email you@example.com --password your-password --role admin
```

## Admin Flow

1. Create your first super admin account:
   `npm run auth:create-user -- --email you@example.com --password your-password --role admin`
2. Create Noorvi's editor account:
   `npm run auth:create-user -- --email noorvi@email.com --password her-password --role editor`
3. Visit `/admin/login` and sign in with email plus password.
4. Editors can create and update posts.
5. Super admins can also delete posts, edit categories, and edit social links.

## Notes

- This repo uses a newer Next.js version than older training-era conventions. Check local docs in `node_modules/next/dist/docs/` before making framework-level changes.
- Proxy is only used for optimistic redirects. The route handlers and server pages still enforce authorization directly.
- Video downloads currently use poster placeholders until real clip assets are added.
- If `MONGODB_URI` is configured, the public app reads content from MongoDB; otherwise it falls back to the local seed data in `src/data/posts.js`.
- Seed the database with the current local content using `npm run db:seed`.
- Run `npm run db:setup` to validate `.env.local`, seed MongoDB, lint the repo, and verify a production build in one command.
