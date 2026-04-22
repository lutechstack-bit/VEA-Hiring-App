-- =========================================================================
-- 003_seed_data.sql — Demo data
--
-- NOTE: Supabase Auth users must be created in the Auth dashboard first,
-- or via the service-role API. This seed file inserts matching rows into
-- public.users/profiles ONLY if corresponding auth.users rows already
-- exist. For the quickest path, create the following accounts via the
-- Auth → Users screen, then run this file:
--
--   admin@levelup.com    / admin1234     (role=admin)
--   neha@editors.dev     / editor1234
--   arjun@editors.dev    / editor1234
--   sana@editors.dev     / editor1234
--   pending@editors.dev  / editor1234
--   priya@studios.co     / partner1234
--   rahul@studios.co     / partner1234
--   pending@studios.co   / partner1234
--
-- The handle_new_user() trigger will create the public.users rows. After
-- those exist, this script promotes them to the right roles and fills in
-- profiles, jobs, applications, messages.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1) Promote / approve the demo users
-- -------------------------------------------------------------------------
update public.users set role = 'admin',   status = 'approved', approved_at = now(),
       name = 'LevelUp Admin'
  where email = 'admin@levelup.com';

update public.users set role = 'editor',  status = 'approved', approved_at = now(),
       name = 'Neha Kapoor'
  where email = 'neha@editors.dev';

update public.users set role = 'editor',  status = 'approved', approved_at = now(),
       name = 'Arjun Menon'
  where email = 'arjun@editors.dev';

update public.users set role = 'editor',  status = 'approved', approved_at = now(),
       name = 'Sana Iyer'
  where email = 'sana@editors.dev';

update public.users set role = 'editor',  status = 'pending',
       name = 'Pending Editor'
  where email = 'pending@editors.dev';

update public.users set role = 'partner', status = 'approved', approved_at = now(),
       name = 'Priya Shah'
  where email = 'priya@studios.co';

update public.users set role = 'partner', status = 'approved', approved_at = now(),
       name = 'Rahul Khanna'
  where email = 'rahul@studios.co';

update public.users set role = 'partner', status = 'pending',
       name = 'Pending Partner'
  where email = 'pending@studios.co';

-- -------------------------------------------------------------------------
-- 2) Profiles
-- -------------------------------------------------------------------------
update public.profiles p set
  bio = 'Narrative-driven editor with a focus on long-form YouTube & brand films. 4+ years cutting for creators and D2C brands.',
  location = 'Mumbai, MH',
  experience = 'Advanced',
  skills = array['Premiere Pro','DaVinci Resolve','Color Grading','Sound Design','Motion Graphics','Storytelling'],
  portfolio_links = '[{"label":"Showreel 2025","url":"https://vimeo.com/example"},{"label":"Brand film — Lumio","url":"https://youtu.be/example"}]'::jsonb,
  tags = array['Verified','Top Performer','Placement Ready'],
  qualifications = array['Meets a tight deadline','Communicates clearly','Takes feedback well']
from public.users u where p.user_id = u.id and u.email = 'neha@editors.dev';

update public.profiles p set
  bio = 'Gaming & podcast editor. Multi-cam, dynamic cuts, punchy shorts. Currently cutting two weekly podcasts.',
  location = 'Bengaluru, KA',
  experience = 'Intermediate',
  skills = array['Final Cut Pro','Premiere Pro','Multi-cam','Sound Design','Shorts'],
  portfolio_links = '[{"label":"Podcast showreel","url":"https://youtu.be/example-pod"}]'::jsonb,
  tags = array['Verified'],
  qualifications = array['Works async','Meets a tight deadline']
from public.users u where p.user_id = u.id and u.email = 'arjun@editors.dev';

update public.profiles p set
  bio = 'Wedding & travel film editor. Cinematic pacing, warm colour palette, hand-picked music.',
  location = 'Chennai, TN',
  experience = 'Beginner',
  skills = array['Premiere Pro','Color Grading','Music Sync'],
  portfolio_links = '[{"label":"Wedding reel","url":"https://youtu.be/example-wed"}]'::jsonb,
  tags = array['Placement Ready'],
  qualifications = array['Takes feedback well']
from public.users u where p.user_id = u.id and u.email = 'sana@editors.dev';

update public.profiles p set
  bio = 'Hiring for narrative short-form content at Lumio Studios.',
  location = 'Mumbai, MH',
  website = 'https://lumiostudios.co'
from public.users u where p.user_id = u.id and u.email = 'priya@studios.co';

update public.profiles p set
  bio = 'Creative director at Orbit Films — long-form documentaries and branded series.',
  location = 'Delhi, DL',
  website = 'https://orbitfilms.in'
from public.users u where p.user_id = u.id and u.email = 'rahul@studios.co';

-- -------------------------------------------------------------------------
-- 3) Jobs (3 approved, 1 pending)
-- -------------------------------------------------------------------------
insert into public.jobs (posted_by, type, employment_type, title, company, location, work_mode, budget, budget_type, description, skills, qualifications, experience, status, approved_at)
select u.id,
       'job','Full-time',
       'Lead Video Editor — YouTube Channel',
       'Lumio Studios',
       'Mumbai, MH',
       'Hybrid',
       '₹80,000 – ₹1,20,000 / month',
       'salary',
       E'We are hiring a lead editor to own a weekly long-form show.\n\nYou will:\n• Cut 1 long-form (15–25 min) episode per week\n• Co-own story and pacing with the host\n• Deliver 2–3 shorts per episode\n\nYou will NOT be doing motion graphics work — we have a designer for that. We want somebody who cares about story above all.',
       array['Premiere Pro','Color Grading','Storytelling','Sound Design'],
       array['Meets a tight deadline','Communicates clearly','Takes feedback well'],
       'Advanced','approved', now()
from public.users u where u.email = 'priya@studios.co'
on conflict do nothing;

insert into public.jobs (posted_by, type, employment_type, title, company, location, work_mode, budget, budget_type, description, skills, qualifications, experience, status, approved_at)
select u.id,
       'gig','Freelance',
       'Short-form editor — 8-episode podcast series',
       'Lumio Studios',
       'Remote',
       'Remote',
       '₹8,000 / episode',
       'project',
       E'Cut 8 episodes over 10 weeks. Each ep gives you 2 hours of multi-cam podcast footage; deliverable is a 30–40 min edit plus 3 shorts.',
       array['Premiere Pro','Multi-cam','Shorts','Sound Design'],
       array['Works async','Meets a tight deadline'],
       'Intermediate','approved', now()
from public.users u where u.email = 'priya@studios.co'
on conflict do nothing;

insert into public.jobs (posted_by, type, employment_type, title, company, location, work_mode, budget, budget_type, description, skills, qualifications, experience, status, approved_at)
select u.id,
       'job','Contract',
       'Documentary editor — 6-month contract',
       'Orbit Films',
       'Delhi, DL',
       'On-site',
       '₹1,20,000 / month',
       'salary',
       E'Edit a 4-part documentary series. 6-month rolling contract with Orbit Films. Work alongside our director and DOP on a story about independent musicians in India.',
       array['DaVinci Resolve','Color Grading','Storytelling'],
       array['Takes feedback well','Communicates clearly'],
       'Advanced','approved', now()
from public.users u where u.email = 'rahul@studios.co'
on conflict do nothing;

insert into public.jobs (posted_by, type, employment_type, title, company, location, work_mode, budget, budget_type, description, skills, qualifications, experience, status)
select u.id,
       'gig','Freelance',
       'Wedding highlight reel — 4 min',
       'Orbit Films',
       'Delhi, DL',
       'Hybrid',
       '₹25,000 / project',
       'project',
       'Edit a 4-min wedding highlight reel from 8 hours of footage. Music will be provided.',
       array['Premiere Pro','Music Sync','Color Grading'],
       array['Meets a tight deadline'],
       'Beginner','pending'
from public.users u where u.email = 'rahul@studios.co'
on conflict do nothing;

-- -------------------------------------------------------------------------
-- 4) Applications
-- -------------------------------------------------------------------------
insert into public.applications (job_id, editor_id, status, note)
select j.id, u.id, 'Shortlisted', 'Strong fit; partner invited to call.'
from public.jobs j
join public.users u on u.email = 'neha@editors.dev'
where j.title = 'Lead Video Editor — YouTube Channel'
on conflict do nothing;

insert into public.applications (job_id, editor_id, status, note)
select j.id, u.id, 'Applied', null
from public.jobs j
join public.users u on u.email = 'arjun@editors.dev'
where j.title = 'Short-form editor — 8-episode podcast series'
on conflict do nothing;

insert into public.applications (job_id, editor_id, status, note)
select j.id, u.id, 'Applied', null
from public.jobs j
join public.users u on u.email = 'sana@editors.dev'
where j.title = 'Documentary editor — 6-month contract'
on conflict do nothing;

-- -------------------------------------------------------------------------
-- 5) Messages (between Priya ↔ Neha for the lead editor role)
-- -------------------------------------------------------------------------
insert into public.messages (thread_id, from_user_id, to_user_id, text)
select
  least(p.id::text, n.id::text) || ':' || greatest(p.id::text, n.id::text),
  p.id, n.id,
  'Hi Neha — loved your showreel. Free for a 20-min call this week?'
from public.users p, public.users n
where p.email = 'priya@studios.co' and n.email = 'neha@editors.dev';

insert into public.messages (thread_id, from_user_id, to_user_id, text)
select
  least(p.id::text, n.id::text) || ':' || greatest(p.id::text, n.id::text),
  n.id, p.id,
  'Thanks Priya! Thursday or Friday afternoon works great.'
from public.users p, public.users n
where p.email = 'priya@studios.co' and n.email = 'neha@editors.dev';

insert into public.messages (thread_id, from_user_id, to_user_id, text)
select
  least(p.id::text, n.id::text) || ':' || greatest(p.id::text, n.id::text),
  p.id, n.id,
  'Perfect — Thursday 4pm. Calendar invite incoming.'
from public.users p, public.users n
where p.email = 'priya@studios.co' and n.email = 'neha@editors.dev';
