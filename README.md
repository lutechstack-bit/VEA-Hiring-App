# LevelUp Talent Network

A verified, admin-curated talent marketplace for **video editors** and **hiring
partners** in India. Dark-first, premium, purple-accented UI built with Vite +
React + TypeScript + Tailwind + Supabase.

## Stack

| Layer        | Choice                                                  |
| ------------ | ------------------------------------------------------- |
| Framework    | Vite 6 + React 18 + TypeScript (strict)                 |
| Styling      | Tailwind CSS (custom tokens, dark-only)                 |
| UI primitives| shadcn/ui style wrappers + Radix peer deps              |
| Icons        | lucide-react                                            |
| Routing      | react-router-dom v6                                     |
| Forms        | react-hook-form + zod                                   |
| Server state | TanStack Query                                          |
| Auth / DB    | Supabase (Postgres + Auth + Realtime + RLS)             |
| Deploy       | Vercel                                                  |

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your Supabase project details
cp .env.example .env.local

# 3. Run migrations and seed data in the Supabase SQL editor
#    (see `supabase/migrations/*.sql` in this repo — run in order)

# 4. Start the dev server
npm run dev
```

The dev server runs on `http://localhost:5173`.

## Environment variables

| Variable                  | Where to find it                                 |
| ------------------------- | ------------------------------------------------ |
| `VITE_SUPABASE_URL`       | Supabase → Project Settings → API → Project URL  |
| `VITE_SUPABASE_ANON_KEY`  | Supabase → Project Settings → API → anon public  |

## Project structure (high level)

```
src/
  main.tsx            — entry, providers (Query, Router, Auth, Toast)
  App.tsx             — routes
  lib/                — supabase client, shared types, utils, constants
  contexts/           — AuthContext
  hooks/              — useAuth, useProfile, useJobs, useApplications,
                        useMessages, useSavedJobs, useEditors, useAdmin, useToast
  components/
    ui/               — input, textarea, select, dialog, sheet wrappers
    shared/           — Card, GradientButton, StatusPill, MetricCard,
                        EyebrowLabel, StepBadge, EmptyState, Avatar, TagPill, …
    layout/           — AppShell, Sidebar, MobileNav, PageHeader
    auth/             — AuthLayout, LoginForm, SignupForm, RoleSelector, PendingApprovalScreen
    editor/           — EditorDashboard, EditorProfile, PlacementReadinessBar,
                        ProfileCompletionChecklist, SkillsSelector, PortfolioLinks,
                        MyApplications, SavedJobs, JumpBackIn
    partner/          — PartnerDashboard, PartnerProfile, BrowseEditors,
                        EditorCard, EditorDetailDrawer, NewJobForm, MyPostings, ApplicantsView
    jobs/             — JobsList, JobCard, JobDetail, EasyApplyBadge,
                        QualificationsMatch, JobFilters, JobTypeSelector
    messaging/        — MessagesLayout, ThreadList, ThreadView, MessageBubble, QuickReplies
    admin/            — AdminDashboard, AdminUsers, AdminJobs, AdminActivity,
                        ApprovalQueue, TagAssignment
  pages/              — one page per route (DashboardPage routes by role)
  routes/             — AppRoutes, ProtectedRoute, RoleRoute
supabase/
  migrations/
    001_initial_schema.sql  — tables, indexes, triggers, handle_new_user()
    002_rls_policies.sql    — row-level security for every table
    003_seed_data.sql       — demo users, profiles, jobs, applications, messages
  seed.sql                  — convenience wrapper (\i each migration)
```

## Core flows

### Editor

1. Sign up → role = editor → status = pending
2. Admin approves → editor lands on dashboard
3. Profile completion checklist guides them through bio/skills, portfolio, preferences
4. Placement readiness bar tracks 4 milestones
5. Browse `/jobs` and `/gigs`, see Easy Apply badge when skills overlap ≥ 50%
6. Apply → partner sees application
7. Real-time messaging with partner

### Hiring partner

1. Sign up → role = partner → status = pending
2. Admin approves → partner lands on dashboard
3. Browse verified editors, post jobs/gigs (goes into pending admin review)
4. Admin approves job → editors see it in the marketplace
5. Review applicants, change status to Shortlisted/Hired/Rejected
6. Message editors directly

### Admin

1. Admin user is manually promoted (see DEPLOY.md)
2. Overview dashboard shows network metrics and approval queue
3. Users screen → approve/reject, assign tags (Verified, Top Performer, Placement Ready)
4. Jobs screen → approve/reject/delete
5. Activity feed → last 30 admin events

## Seeded demo accounts

See `supabase/migrations/003_seed_data.sql`. After creating the matching
Supabase auth users (emails listed in that file), the script promotes them to
the right roles and populates profiles, jobs, applications, and messages.

## Design tokens

All custom tokens live in `tailwind.config.ts`. Highlights:

- **Background**: `background.primary` `#0A0A0F`, `background.secondary` `#151521`
- **Brand purple**: `brand.purple` `#8B5CF6`, `brand.purpleLight` `#A78BFA`
- **Gradient CTA**: `bg-gradient-to-r from-brand-purple to-brand-purpleLight`
- **Card hover**: `hover:border-brand-purple/30 hover:shadow-glow-md`
- **Radial glow**: `bg-radial-purple` (utility class) for hero sections

Satoshi is loaded from Fontshare in `index.html` with Inter / system-ui as
fallbacks.

## Scripts

| Command          | What it does                                             |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Vite dev server                                          |
| `npm run build`  | Type-check (tsc -b) then production build                |
| `npm run preview`| Preview the production build locally                     |
| `npm run typecheck` | `tsc -b --noEmit`                                     |

## Deployment

See [DEPLOY.md](./DEPLOY.md).
