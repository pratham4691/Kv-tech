# Kalki Vault

Kalki Vault is a cybersecurity awareness and research ecosystem. This first foundation phase establishes the secure public site, admin access model, storage strategy and the database structure needed for future content growth.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Framer Motion

## Required environment variables

Copy `.env.example` and fill in the values for your Supabase project:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`

Important: never commit real secrets. Keep service-role keys on the server only.

## First admin setup

1. Create a Supabase project.
2. In the Supabase dashboard, go to Authentication > Users and create the first administrator account with an email and password.
3. Open SQL editor and run the migration in `supabase/migrations/001_initial_schema.sql`.
4. Insert the authenticated user's UUID into `admin_users` as `SUPER_ADMIN`.
5. Sign in to `/control/login` with that account.
6. Once the account is authorized, the protected dashboard becomes available.

## Database migration

Run the SQL in `supabase/migrations/001_initial_schema.sql` before using any admin features.

## Storage strategy

- Store user-generated assets in Supabase Storage.
- Keep metadata in PostgreSQL.
- Use buckets under `public-media/*` for public media assets.
- Validate uploads by MIME type, extension and file size before saving.

## Current foundation scope

This first brick intentionally includes:

- secure public website foundation
- admin-only `/control` route with database-backed authorization checks
- database schema for public content and admin controls
- secure upload validation for images
- awareness/news/public content structure
- onboarding documentation for Supabase setup

The advanced student, researcher, company and product systems remain for later phases.
