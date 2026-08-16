import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getAdminUser } from '@/lib/supabase/authorization'

export default async function ControlPage() {
  const admin = await getAdminUser()

  if (!admin) {
    redirect('/control/login')
  }

  const stats = [
    { label: 'Published News', value: '0' },
    { label: 'Draft News', value: '0' },
    { label: 'Published Events', value: '0' },
    { label: 'Network Organizations', value: '0' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
      <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Control Panel</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Kalki Vault Administration</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-cyan-200">{admin.role}</span>
          <span>{admin.user.email ?? 'Administrator'}</span>
        </div>
      </header>

      <nav className="mb-10 flex flex-wrap gap-3 text-sm text-slate-300">
        {['Dashboard', 'News', 'Events', 'Network', 'Awareness', 'Media', 'Site Settings', 'Activity Log'].map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            {item}
          </span>
        ))}
      </nav>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
            <p className="mt-6 text-3xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Recent admin activity</h2>
          <ul className="mt-6 space-y-4 text-sm text-slate-300">
            <li className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
              <span>Admin logged in</span>
              <span className="text-slate-500">Now</span>
            </li>
            <li className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
              <span>Security review started</span>
              <span className="text-slate-500">Pending</span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span>Foundation migration prepared</span>
              <span className="text-slate-500">Ready</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Secure operations</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>Public visibility is limited to published content only.</p>
            <p>Uploads are validated for type, extension and size before storage.</p>
            <p>All admin access is checked server-side against the database authorization layer.</p>
          </div>
          <Link href="/" className="mt-6 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            Return to public site
          </Link>
        </div>
      </section>
    </div>
  )
}
