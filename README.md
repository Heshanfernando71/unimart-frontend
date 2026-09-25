# UniMart Frontend

UniMart is a responsive university marketplace frontend built with React, TypeScript, Vite, Redux Toolkit/RTK Query, Material UI, Tailwind CSS v4, React Hook Form, and Zod.

## Requirements

- Node.js 22.12 or newer
- npm
- The UniMart API running locally or reachable from the browser

## Local setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and update the public API base URL if needed:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Start the development server:

```bash
npm run dev
```

The browser sends cookies with API requests. Access tokens returned by login/refresh are held only in Redux memory and are never written to browser storage.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## API integration notes

The frontend uses only these documented resources: `/auth/login`, `/auth/refresh`, `/listings`, `/listings/{id}`, `/listings/{id}/reviews`, and `/reviews` (including the documented write methods).

- The assignment describes login/refresh data as an access token and current user but does not provide the exact DTO. The single adapter is `src/features/auth/authTypes.ts`; update `AuthResponse` there if the backend uses different names.
- No categories endpoint is documented, so listing search and forms use a numeric category ID.
- No current-user listings endpoint or documented seller filter is available. `MyListingsPage` temporarily requests up to 100 listings through the documented endpoint and filters by `sellerId` in the client. Replace the clearly marked adapter when a backend contract exists.
- Sign out clears memory and RTK Query cache. No server logout endpoint is called because none is documented.

## Production container

Build with an API URL appropriate for the deployment:

```bash
docker build --build-arg VITE_API_BASE_URL=/api/v1 -t unimart-frontend .
docker run --rm -p 8081:80 unimart-frontend
```

Nginx is configured to fall back to `index.html` for React Router routes.
