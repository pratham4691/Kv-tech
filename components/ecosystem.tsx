'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowUpRight, GraduationCap, FlaskConical, Building2 } from 'lucide-react'
import { vaultPaths, type VaultPath } from '@/lib/vault-paths'
import { isVaultPathEnabled, type VaultPathId } from '@/lib/feature-flags'
import { Reveal, SectionKicker } from './reveal'
import { cn } from '@/lib/utils'

const icons: Record<VaultPathId, typeof GraduationCap> = {
  student: GraduationCap,
  researcher: FlaskConical,
  company: Building2,
}

const accentClasses: Record<VaultPath['accent'], { text: string; ring: string; glow: string }> = {
  primary: { text: 'text-primary', ring: 'ring-primary/25', glow: 'oklch(0.78 0.13 205 / 22%)' },
  signal: { text: 'text-signal', ring: 'ring-signal/25', glow: 'oklch(0.68 0.16 285 / 22%)' },
  warn: { text: 'text-warn', ring: 'ring-warn/25', glow: 'oklch(0.78 0.14 65 / 20%)' },
}

export function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="relative border-t border-border/60 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <SectionKicker>The Kalki Vault Ecosystem</SectionKicker>
          </div>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            One Vault. Three Paths.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            The architecture of what Kalki Vault is becoming. Each path is being
            prepared — the structure is here today, the services arrive as the
            Vault opens.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {vaultPaths.map((path, i) => {
            const enabled = isVaultPathEnabled(path.id)
            const Icon = icons[path.id]
            const accent = accentClasses[path.accent]
            return (
              <Reveal key={path.id} delay={i * 0.1}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface/40 p-8"
                >
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: accent.glow }}
                  />

                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl bg-background/60 ring-1',
                        accent.text,
                        accent.ring,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest',
                        enabled
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border bg-background/50 text-muted-foreground',
                      )}
                    >
                      {enabled ? (
                        'Live'
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          Coming to the Vault
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold uppercase tracking-wide">
                    {path.label}
                  </h3>
                  <p className={cn('mt-1 text-sm font-medium', accent.text)}>
                    {path.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {path.description}
                  </p>

                  <div className="mt-6 border-t border-border/60 pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Planned
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {path.planned.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <span
                            className={cn('h-1 w-1 rounded-full', accent.text)}
                            style={{ backgroundColor: 'currentColor' }}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 flex-1" />
                  <Link
                    href={`/vault/${path.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
                  >
                    Preview the {path.label} path
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
