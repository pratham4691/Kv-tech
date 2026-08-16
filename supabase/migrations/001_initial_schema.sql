create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'public' check (role in ('public', 'student', 'researcher', 'company', 'admin')),
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  role text not null default 'SUPER_ADMIN' check (role in ('SUPER_ADMIN', 'CONTENT_ADMIN', 'EVENT_MANAGER', 'NETWORK_MANAGER', 'MEDIA_MANAGER', 'AUDITOR')),
  is_active boolean not null default true,
  permissions jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text,
  cover_image text,
  author text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  description text,
  event_date timestamptz,
  location text,
  institution text,
  event_type text,
  cover_image text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  published_at timestamptz
);

create table if not exists event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  media_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid
);

create table if not exists network_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  location text,
  country text,
  website text,
  organization_type text,
  engagement_type text,
  first_interaction_date timestamptz,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  published_at timestamptz
);

create table if not exists awareness_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  summary text,
  content text,
  cover_image text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null,
  bucket text not null,
  mime_type text not null,
  file_size bigint not null,
  category text,
  associated_resource text,
  associated_resource_id uuid,
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource text,
  resource_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_id on profiles (user_id);
create index if not exists idx_admin_users_user_id on admin_users (user_id);
create index if not exists idx_news_published on news (is_published, published_at desc);
create index if not exists idx_news_slug on news (slug);
create index if not exists idx_events_published on events (is_published, event_date desc);
create index if not exists idx_event_images_event_id on event_images (event_id);
create index if not exists idx_network_published on network_organizations (is_published, first_interaction_date desc);
create index if not exists idx_awareness_published on awareness_articles (is_published, published_at desc);
create index if not exists idx_media_assets_bucket on media_assets (bucket, created_at desc);
create index if not exists idx_activity_logs_created_at on activity_logs (created_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();

create or replace trigger admin_users_set_updated_at
before update on admin_users
for each row execute function set_updated_at();

create or replace trigger site_settings_set_updated_at
before update on site_settings
for each row execute function set_updated_at();

create or replace trigger news_set_updated_at
before update on news
for each row execute function set_updated_at();

create or replace trigger events_set_updated_at
before update on events
for each row execute function set_updated_at();

create or replace trigger event_images_set_updated_at
before update on event_images
for each row execute function set_updated_at();

create or replace trigger network_organizations_set_updated_at
before update on network_organizations
for each row execute function set_updated_at();

create or replace trigger awareness_articles_set_updated_at
before update on awareness_articles
for each row execute function set_updated_at();

create or replace trigger media_assets_set_updated_at
before update on media_assets
for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table admin_users enable row level security;
alter table site_settings enable row level security;
alter table news enable row level security;
alter table events enable row level security;
alter table event_images enable row level security;
alter table network_organizations enable row level security;
alter table awareness_articles enable row level security;
alter table media_assets enable row level security;
alter table activity_logs enable row level security;

create policy "Public can view published news"
on news for select using (is_published = true);

create policy "Public can view published events"
on events for select using (is_published = true);

create policy "Public can view published network organizations"
on network_organizations for select using (is_published = true);

create policy "Public can view published awareness articles"
on awareness_articles for select using (is_published = true);

create policy "Admins can view their own admin record"
on admin_users for select using (auth.uid() = user_id);

create policy "Super admins can manage admin_users"
on admin_users for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage news"
on news for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage events"
on events for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage event images"
on event_images for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage network organizations"
on network_organizations for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage awareness articles"
on awareness_articles for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage media assets"
on media_assets for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Admins can manage activity logs"
on activity_logs for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);

create policy "Users can view their own profile"
on profiles for select using (auth.uid() = user_id);

create policy "Users can update their own profile"
on profiles for update using (auth.uid() = user_id);

create policy "Authenticated users can insert their profile"
on profiles for insert with check (auth.uid() = user_id);

create policy "Public can read site settings when present"
on site_settings for select using (true);

create policy "Admins can manage site settings"
on site_settings for all using (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
) with check (
  exists (
    select 1 from admin_users au
    where au.user_id = auth.uid() and au.role = 'SUPER_ADMIN' and au.is_active = true
  )
);
