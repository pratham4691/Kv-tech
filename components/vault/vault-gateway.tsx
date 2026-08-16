'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  GraduationCap,
  FlaskConical,
  Building2,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Eye,
  EyeOff,
  ShieldHalf,
} from 'lucide-react'
import { vaultPaths, getVaultPath, type VaultPath } from '@/lib/vault-paths'
import { isVaultPathEnabled, type VaultPathId } from '@/lib/feature-flags'
import { NetworkCanvas } from '@/components/network-canvas'
import { cn } from '@/lib/utils'

const icons: Record<VaultPathId, typeof GraduationCap> = {
  student: GraduationCap,
  researcher: FlaskConical,
  company: Building2,
}

const accentText: Record<VaultPath['accent'], string> = {
  primary: 'text-primary',
  signal: 'text-signal',
  warn: 'text-warn',
}
const accentRing: Record<VaultPath['accent'], string> = {
  primary: 'ring-primary/30',
  signal: 'ring-signal/30',
  warn: 'ring-warn/30',
}

type Stage = 'select' | 'credentials' | 'status'

export function VaultGateway() {
  const [stage, setStage] = useState<Stage>('select')
  const [selected, setSelected] = useState<VaultPathId | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const path = selected ? getVaultPath(selected) : null

  function choose(id: VaultPathId) {
    setSelected(id)
    setStage('credentials')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    // Feature flags govern availability. Every path is disabled today, so we
    // never claim authentication succeeded — we surface an honest status.
    if (isVaultPathEnabled(selected)) {
      // Future: route to the activated dashboard.
      return
    }
    setStage('status')
  }

  function reset() {
    setStage('select')
    setSelected(null)
    setShowPassword(false)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      <NetworkCanvas className="absolute inset-0 h-full w-full opacity-60" density={0.8} />
      <div className="grid-backdrop absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 45%, oklch(0.78 0.13 205 / 12%), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="absolute left-4 top-6 sm:left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </div>

      <div className="relative w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {stage === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <span className="absolute h-16 w-16 rounded-full border border-primary/40 animate-pulse-ring" />
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/30">
                  <ShieldHalf className="h-7 w-7" />
                </span>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                Vault Core
              </span>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Choose your path
              </h1>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Three pathways lead into Kalki Vault. Select the one that matches
                who you are.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {vaultPaths.map((p) => {
                  const Icon = icons[p.id]
                  return (
                    <button
                      key={p.id}
                      onClick={() => choose(p.id)}
                      className="glass group flex flex-col items-center rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
                    >
                      <span
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl bg-background/60 ring-1',
                          accentText[p.accent],
                          accentRing[p.accent],
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">
                        {p.label}
                      </span>
                      <span className={cn('mt-1 text-xs', accentText[p.accent])}>
                        {p.tagline}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                        Continue <ArrowRight className="h-3 w-3" />
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {stage === 'credentials' && path && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-md"
            >
              <div className="glass rounded-3xl p-8">
                <button
                  onClick={reset}
                  className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Choose a different path
                </button>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl bg-background/60 ring-1',
                      accentText[path.accent],
                      accentRing[path.accent],
                    )}
                  >
                    {(() => {
                      const Icon = icons[path.id]
                      return <Icon className="h-5 w-5" />
                    })()}
                  </span>
                  <div className="text-left">
                    <h1 className="font-display text-xl font-semibold uppercase tracking-wide">
                      {path.label} Access
                    </h1>
                    <p className={cn('text-xs', accentText[path.accent])}>
                      {path.tagline}
                    </p>
                  </div>
                </div>

                <form onSubmit={submit} className="mt-7 space-y-4 text-left">
                  <div>
                    <label
                      htmlFor="identifier"
                      className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                    >
                      Email / Username
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-ring"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-ring"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-muted-foreground">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input bg-background/60 accent-primary"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="glow-primary w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign in
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  New to Kalki Vault?{' '}
                  <button className="text-primary transition-colors hover:underline">
                    Create account
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {stage === 'status' && path && (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-lg"
              role="alertdialog"
              aria-labelledby="status-title"
            >
              <div className="glass rounded-3xl p-8 text-center sm:p-10">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <span className="absolute h-16 w-16 rounded-full border border-warn/40 animate-pulse-ring" />
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warn/12 text-warn ring-1 ring-warn/30">
                    <ShieldAlert className="h-7 w-7" />
                  </span>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-warn/40 bg-warn/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-warn">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warn" />
                  Access Status: Not Yet Available
                </div>

                <h1 id="status-title" className="mt-5 font-display text-2xl font-semibold tracking-tight text-balance">
                  {path.lockedTitle}
                </h1>
                <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground text-pretty">
                  {path.lockedMessage}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={reset}
                    className="glow-primary w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                  >
                    Return to Vault
                  </button>
                  <Link
                    href={`/vault/${path.id}`}
                    className="w-full rounded-full border border-border bg-surface/50 px-6 py-3 text-sm text-foreground transition-colors hover:border-primary/50 sm:w-auto"
                  >
                    Preview {path.label} path
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
