# repo-analyzer-ui

Next.js 15 frontend for the Repo Analyzer NestJS backend.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Auth | NextAuth v5 — credentials + optional GitHub OAuth |
| State | Zustand (analysis job cache) |
| Forms | react-hook-form + zod |
| Styles | Tailwind CSS v3 |
| Toasts | Sonner |
| Icons | Lucide React |

---

## Prerequisites

- Node.js 20+
- Your NestJS backend running via Docker on port 3000:

```bash
# in your NestJS repo
docker compose up -d
# postgres on 5432, redis on 6379, api on 3000
```

---

## Quick start

```bash
# 1. Clone / extract this project
cd repo-analyzer-ui

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
# NestJS backend URL (Docker container)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here

# Must match the port you run the UI on
NEXTAUTH_URL=http://localhost:3001

# Optional — GitHub OAuth for "My GitHub repos" tab
# Create at: https://github.com/settings/developers
# Callback URL: http://localhost:3001/api/auth/callback/github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

```bash
# 4. Start the dev server
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001)

---

## Phase 1 — Authentication ✅

### What was built

| File | Purpose |
|---|---|
| `auth.ts` | NextAuth config — credentials provider calls NestJS `/auth/login` + `/auth/me` |
| `middleware.ts` | Route guard — unauthenticated → `/login`, logged-in + visiting `/login` → `/dashboard` |
| `src/lib/api/client.ts` | Typed `apiFetch<T>` — auto-switches base URL between server and browser |
| `src/lib/api/auth.api.ts` | `loginUser`, `registerUser`, `getMe`, `generateApiKey`, `listApiKeys`, `revokeApiKey` |
| `src/app/(auth)/login/` | Login page — email/password form + optional GitHub OAuth |
| `src/app/(auth)/register/` | Register page — calls `/auth/register`, then auto-signs in |
| `src/app/(dashboard)/layout.tsx` | Authenticated shell with sidebar + topbar |

### Test Phase 1

1. Go to `http://localhost:3001/register`
2. Create an account — calls `POST /auth/register` on your NestJS backend
3. You land on `/dashboard` showing your user ID, email, role, and JWT (first 40 chars)
4. Click "Sign out" — redirects to `/login`
5. Sign in again — calls `POST /auth/login` on your NestJS backend

---

## Phase 2 — Analysis pipeline ✅

### What was built

| File | Purpose |
|---|---|
| `src/app/api/analyze/route.ts` | `POST /api/analyze` — proxies to NestJS with Bearer token |
| `src/app/api/analyze/[jobId]/route.ts` | `GET /api/analyze/:jobId` — fetches completed result |
| `src/app/api/analyze/[jobId]/progress/route.ts` | SSE proxy — forwards NestJS event stream to browser |
| `src/app/api/analyze/[jobId]/report/route.ts` | Report download proxy (markdown / html / json) |
| `src/app/api/github/repos/route.ts` | Lists authenticated user's GitHub repos |
| `src/app/api/github/repos/[owner]/[repo]/branches/route.ts` | Lists branches for a specific repo |
| `src/hooks/useAnalysisSSE.ts` | Native `EventSource` hook — streams job progress, fires `onComplete` |
| `src/hooks/useGitHubRepos.ts` | Fetches GitHub repos, handles 403 (not connected) |
| `src/features/analysis/store/analysis.store.ts` | Zustand — active jobId + result cache |
| `src/components/scan/ScanTabs.tsx` | Tab switcher — public URL vs GitHub repos |
| `src/components/scan/UrlScanner.tsx` | Public URL input with quick-pick links |
| `src/components/scan/GitHubRepoSelector.tsx` | Repo list + branch picker + scan config |
| `src/components/analysis/AnalyzeResultsView.tsx` | Full results — score, metrics, smells, cycles, diagrams |
| `src/app/(dashboard)/analyze/page.tsx` | `/analyze` — dual-mode scan entry |
| `src/app/(dashboard)/analyze/[jobId]/page.tsx` | `/analyze/:jobId` — SSE progress → results display |

### Test Phase 2

#### Scan a public repo

1. Go to `http://localhost:3001/analyze`
2. Tab: **Public URL scan**
3. Type `nestjs/nest` and click **ANALYZE →**
4. Watch the progress steps animate as SSE events arrive from NestJS
5. When complete, the full results render:
   - Score ring animates from 0 to the actual score
   - Detection chips show language / framework / ORM
   - Metrics grid — modules, deps, cycles, fan-out, density
   - Architecture smells with severity badges
   - Circular dependencies
   - Hotspots
   - Collapsible PlantUML diagrams
6. Download buttons: `.md`, `.html`, `.json` — proxy through `/api/analyze/:jobId/report`

#### Scan with GitHub OAuth (optional)

1. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env.local`
2. Sign out, then sign in via **Continue with GitHub**
3. Go to `/analyze` → **My GitHub repos** tab
4. Your repos appear in the list (public + private)
5. Select a repo, pick a branch, optionally set a subdirectory
6. Click **ANALYZE REPO →** — same progress + results flow

#### Navigate back

After viewing a result, click **New analysis** to return to `/analyze`.
Navigate back to the same `/analyze/:jobId` URL — results load instantly from the Zustand cache (no second fetch).

---

## How the SSE proxy works

```
Browser EventSource
  └── GET /api/analyze/:jobId/progress   (Next.js route)
        └── fetch(..., { headers: { Authorization: Bearer <token> } })
              └── GET /analyze/:jobId/progress  (NestJS SSE stream)
                    └── data: { jobId, status, message, progress }
```

The browser `EventSource` API doesn't support custom headers.
The Next.js proxy adds the `Authorization` header server-side and forwards the raw SSE byte stream.
The `useAnalysisSSE` hook closes the connection automatically when `status === 'complete'` or `status === 'failed'`.

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | NestJS backend base URL |
| `NEXTAUTH_SECRET` | Yes | Random string ≥ 32 chars |
| `NEXTAUTH_URL` | Yes | Full URL of the Next.js app |
| `GITHUB_CLIENT_ID` | Optional | Enables GitHub OAuth + repo picker |
| `GITHUB_CLIENT_SECRET` | Optional | Required if CLIENT_ID is set |
| `NEXT_PUBLIC_GITHUB_ENABLED` | Optional | Set to `true` to show GitHub button on login |

---

## Phases roadmap

| Phase | Status | Contents |
|---|---|---|
| 1 | ✅ Complete | Auth — register, login, session, JWT, route protection |
| 2 | ✅ Complete | Analyze — URL scanner, GitHub repo picker, SSE progress, results view |
| 3 | Planned | History, diff comparison, trend charts |
| 4 | Planned | LLM chat — context-scoped OpenAI streaming |
| 5 | Planned | Settings — API keys, webhooks, badges |
