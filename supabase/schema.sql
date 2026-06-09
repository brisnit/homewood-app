-- ─────────────────────────────────────────────────────────────────────────────
-- Homewood Living Ministries — Supabase schema (MVP)
-- Apply with: supabase db push   (or paste into the SQL editor)
-- Mirrors src/types/models.ts. Row Level Security enabled with owner policies.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- Profiles (1:1 with auth.users) ---------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique not null,
  avatar_url text,
  personal_statement text,
  friends_count int not null default 0,
  following_count int not null default 0,
  streak_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists privacy_acceptances (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now()
);

-- Devotionals & plans ---------------------------------------------------------
create table if not exists devotional_categories (
  key text primary key,
  label text not null,
  accent text not null
);

create table if not exists devotionals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text references devotional_categories(key),
  estimated_minutes int not null default 5,
  body text not null,
  scripture_ref text not null,
  image_color text not null default 'navy',
  created_at timestamptz not null default now()
);

create table if not exists plans (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text references devotional_categories(key),
  days int not null,
  description text not null,
  cover_color text not null default 'navy'
);

create table if not exists plan_days (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references plans(id) on delete cascade,
  day_number int not null,
  title text not null,
  scripture_ref text not null,
  devotional_body text not null,
  prompt text,
  unique (plan_id, day_number)
);

create table if not exists user_plan_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references plans(id) on delete cascade,
  completed_days int[] not null default '{}',
  notes jsonb not null default '{}',
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

-- Verse of the day ------------------------------------------------------------
create table if not exists verse_of_the_day (
  id uuid primary key default uuid_generate_v4(),
  date date not null unique,
  reference text not null,
  book text not null,
  chapter int not null,
  text text not null,
  translation text not null default 'NIV',
  likes int not null default 0,
  comments int not null default 0,
  downloads int not null default 0
);

-- Bible-in-a-year -------------------------------------------------------------
create table if not exists bible_reading_days (
  id uuid primary key default uuid_generate_v4(),
  day_number int not null unique,
  old_testament jsonb not null,
  new_testament jsonb not null,
  psalm_or_proverb jsonb
);

create table if not exists user_bible_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  completed_days int[] not null default '{}',
  translation text not null default 'NIV',
  red_letters bool not null default true,
  show_audio bool not null default true
);

-- Social ----------------------------------------------------------------------
create table if not exists friends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  since timestamptz not null default now(),
  unique (user_id, friend_id)
);

create table if not exists friend_requests (
  id uuid primary key default uuid_generate_v4(),
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now()
);

-- Badges & streaks ------------------------------------------------------------
create table if not exists badges (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  title text not null,
  description text not null,
  icon text not null,
  color text not null default 'brass'
);

create table if not exists user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  earned bool not null default false,
  earned_at timestamptz,
  progress real,
  primary key (user_id, badge_id)
);

-- Notes / highlights / prayers / saved ---------------------------------------
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists highlights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null,
  snippet text not null,
  color text not null default 'brass',
  created_at timestamptz not null default now()
);

create table if not exists prayers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  answered bool not null default false,
  created_at timestamptz not null default now()
);

create table if not exists saved_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('devotional','plan','verse')),
  ref_id uuid not null,
  title text not null,
  saved_at timestamptz not null default now()
);

create table if not exists notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  verse_of_the_day bool not null default true,
  plan_reminders bool not null default true,
  friend_activity bool not null default true,
  quiet_hours_start text not null default '21:00',
  quiet_hours_end text not null default '07:00'
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- Per-user tables: owner can read/write their own rows.
do $$
declare t text;
begin
  foreach t in array array[
    'privacy_acceptances','user_plan_progress','user_bible_progress',
    'friends','notes','highlights','prayers','saved_items',
    'notification_preferences','user_badges'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format($f$create policy "owner_all_%1$s" on %1$I
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);$f$, t);
  end loop;
end $$;

-- Profiles: anyone authenticated can read; only the owner can write.
alter table profiles enable row level security;
create policy "profiles_read" on profiles for select using (true);
create policy "profiles_write" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Friend requests: visible to either party; sender/recipient can act.
alter table friend_requests enable row level security;
create policy "fr_read" on friend_requests for select using (auth.uid() in (from_user_id, to_user_id));
create policy "fr_write" on friend_requests for all using (auth.uid() in (from_user_id, to_user_id))
  with check (auth.uid() in (from_user_id, to_user_id));

-- Public content tables (devotionals, plans, verses, bible, badges) are
-- readable by all and managed via the service role.
