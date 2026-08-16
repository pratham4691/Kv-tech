# Admin setup guide

This foundation does not ship with any hardcoded admin account or password. The first administrator is created through Supabase Auth.

## 1. Create the Supabase project

- Create a Supabase project in the Supabase dashboard.
- Keep the project URL and anon key for the frontend.
- Keep the service role key server-side only.

## 2. Create the first admin user

In the Supabase dashboard:

- Open Authentication > Users
- Create the first account for your administrator
- Use a strong password generated securely through the Supabase account flow

Do not add any admin credentials to source files.

## 3. Run the database migration

Run the SQL in `supabase/migrations/001_initial_schema.sql` inside the Supabase SQL editor.

This creates the tables and Row Level Security policies used for:

- `profiles`
- `admin_users`
- `site_settings`
- `news`
- `events`
- `event_images`
- `network_organizations`
- `awareness_articles`
- `media_assets`
- `activity_logs`

## 4. Assign administrator privileges

After the migration, insert your authenticated user record into `admin_users` with the user UUID from the Supabase auth user record.

Example:

```sql
INSERT INTO admin_users (user_id, role, is_active)
VALUES ('<uuid-from-auth-user>', 'SUPER_ADMIN', true);
```

This is the authorization record that allows `/control` access server-side.

## 5. Configure environment variables

Add the required variables to your local environment or deployment platform:

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=
```

## 6. Sign in to the control panel

Open:

- `/control/login`

Sign in with the first administrator account. The private dashboard is protected by server-side checks against the `admin_users` table.

## 7. Private admin controls

Only authorized admins can manage:

- News
- Events
- Network organizations
- Awareness articles
- Media assets
- Site settings
- Activity logs

Public visitors can only read published public content.
