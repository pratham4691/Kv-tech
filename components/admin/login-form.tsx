'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    const client = createSupabaseBrowserClient()

    if (!client) {
      setError('Supabase environment variables are not configured yet. Add your project URL and anon key.')
      setIsLoading(false)
      return
    }

    const { error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    router.push('/control')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-500/10">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Secure access</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Administrator login</h1>
      </div>

      <label className="block text-sm text-slate-300">
        <span className="mb-2 block">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
          placeholder="admin@yourdomain.com"
        />
      </label>

      <label className="block text-sm text-slate-300">
        <span className="mb-2 block">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
          placeholder="Enter your password"
        />
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? 'Signing in...' : 'Access control'}
      </button>
    </form>
  )
}
