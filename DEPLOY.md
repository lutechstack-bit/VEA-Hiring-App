# Deployment guide — LevelUp Talent Network

This project deploys to **Vercel** with **Supabase** as the backend. Follow
these steps end-to-end the first time; you only need to repeat steps 4–5 if
you reset your database.

---

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: LevelUp Talent Network MVP"
git branch -M main
git remote add origin git@github.com:<your-user>/levelup-talent-network.git
git push -u origin main
```

## 2. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a region close to your users (ap-south-1 for India).
3. Save the **Project URL** and **anon public key** from Project Settings →
   API — you\u2019ll paste these into Vercel in step 4.

## 3. Run the migrations

Open Supabase → **SQL Editor** → **New query**. Paste and run each file in
order:

1. `supabase/migrations/001_initial_schema.sql` — tables, indexes, triggers
2. `supabase/migrations/002_rls_policies.sql` — row-level security
3. `supabase/migrations/003_seed_data.sql` — demo data (optional; only run
   after step 5 below, because it references auth users)

## 4. Create the first admin user

The seed migration assumes a set of demo auth users already exist. Create
these in Supabase → **Authentication** → **Users** → **Add user** →
**Create new user** (with password). Recommended demo set:

```
admin@levelup.com        admin1234    (this becomes the admin)
neha@editors.dev         editor1234
arjun@editors.dev        editor1234
sana@editors.dev         editor1234
pending@editors.dev      editor1234
priya@studios.co         partner1234
rahul@studios.co         partner1234
pending@studios.co       partner1234
```

The `handle_new_user()` trigger will insert rows in `public.users` and
`public.profiles` automatically. Then run `003_seed_data.sql` to promote
roles, approve statuses, and populate demo content.

Alternatively, to create just the admin manually:

```sql
-- after admin@levelup.com signs up via the Auth dashboard
update public.users
   set role = 'admin', status = 'approved', approved_at = now()
 where email = 'admin@levelup.com';
```

## 5. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add new project**.
2. Import the GitHub repo.
3. Framework preset: **Vite** (auto-detected).
4. Build command: `npm run build` — Output directory: `dist`.
5. Environment variables — add both:

   | Name                    | Value                          |
   | ----------------------- | ------------------------------ |
   | `VITE_SUPABASE_URL`     | your Supabase project URL      |
   | `VITE_SUPABASE_ANON_KEY`| your Supabase anon public key  |

6. Click **Deploy**. The SPA fallback is already configured via
   `vercel.json` so React Router\u2019s client-side routes work.

## 6. Post-deploy checks

1. Visit your Vercel URL. The landing page should load.
2. Sign in as `admin@levelup.com` — you should land on the admin dashboard.
3. In **Admin → Users**, approve the pending editors and partners.
4. Sign in as `neha@editors.dev` → should see the editor dashboard with
   placement readiness and latest openings.
5. Sign in as `priya@studios.co` → should see postings, applicants, and
   messages with Neha.

## 7. Optional — custom domain

In Vercel → **Settings → Domains** add your domain. Vercel will issue a TLS
cert automatically.

## 8. Supabase Auth redirect URLs

In Supabase → **Authentication → URL Configuration**, add your Vercel URL
(and custom domain, if any) to **Site URL** and **Redirect URLs**. This
keeps email-confirmation flows pointed at production.

---

### Troubleshooting

- **\"Missing VITE_SUPABASE_URL\"** in the console: Vercel env vars weren\u2019t
  applied to the build — redeploy after saving them.
- **RLS errors on login**: confirm the `handle_new_user()` trigger exists;
  if `public.users` has no row for the signed-in user, auth queries fail.
- **Messages aren\u2019t real-time**: verify `supabase_realtime` publication
  includes `public.messages` (migration 002 handles this).
- **Admin can\u2019t see pending users**: confirm the admin\u2019s row has
  `role = 'admin'` and `status = 'approved'`.
