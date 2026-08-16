import Link from 'next/link'

import { LoginForm } from '@/components/admin/login-form'

export default function ControlLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16 md:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Private access</p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Control access is restricted to authorized admins.</h1>
          <p className="max-w-lg text-lg text-slate-300">
            This area is intentionally not listed in the public navigation. Access is granted only to authenticated and database-authorized administrators.
          </p>
          <Link href="/" className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Return to public website
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
