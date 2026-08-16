'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, Crosshair, ArrowRight } from 'lucide-react'
import { threats, type Threat } from '@/lib/threats'
import { Reveal, SectionKicker } from './reveal'
import { cn } from '@/lib/utils'

const severityMeta: Record<Threat['severity'], { level: number; color: string }> = {
  Elevated: { level: 2, color: 'text-warn' },
  High: { level: 3, color: 'text-warn' },
  Critical: { level: 4, color: 'text-destructive' },
}

export function ThreatExplorer() {
  const [active, setActive] = useState<Threat>(threats[0])

  return (
    <section
      id="awareness"
      className="relative border-t border-border/60 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionKicker>Awareness Experience</SectionKicker>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            The threat landscape, made understandable.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Select a threat to see how it works conceptually — and, just as
            importantly, how defenders interrupt it. Everything here is
            educational and defensive.
          </p>
        </Reveal>

        <div id="threats" className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Threat nodes */}
          <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {threats.map((t) => {
              const isActive = t.id === active.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t)}
                  onMouseEnter={() => setActive(t)}
                  aria-pressed={isActive}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300',
                    isActive
                      ? 'border-primary/60 bg-primary/10 glow-primary'
                      : 'border-border bg-surface/40 hover:border-primary/40 hover:bg-surface',
                  )}
                >
                  <span
                    className={cn(
                      'block h-2 w-2 rounded-full transition-colors',
                      isActive ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                  />
                  <span className="mt-3 block font-display text-sm font-medium leading-tight">
                    {t.name}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block font-mono text-[10px] uppercase tracking-wider',
                      severityMeta[t.severity].color,
                    )}
                  >
                    {t.severity}
                  </span>
                </button>
              )
            })}
          </Reveal>

          {/* Detail panel */}
          <Reveal delay={0.1}>
            <div className="glass relative h-full overflow-hidden rounded-3xl p-7 sm:p-9">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl"
                style={{ background: 'oklch(0.78 0.13 205 / 30%)' }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl font-semibold tracking-tight">
                      {active.name}
                    </h3>
                    <div className="flex items-center gap-1" aria-label={`Severity ${active.severity}`}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            'h-4 w-1.5 rounded-full transition-colors',
                            i < severityMeta[active.severity].level
                              ? active.severity === 'Critical'
                                ? 'bg-destructive'
                                : 'bg-warn'
                              : 'bg-border',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Risk level: {active.severity}
                  </p>

                  <p className="mt-6 text-base leading-relaxed text-foreground/90">
                    {active.summary}
                  </p>

                  <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                      <div className="flex items-center gap-2 text-signal">
                        <Crosshair className="h-4 w-4" />
                        <span className="font-mono text-[11px] uppercase tracking-widest">
                          How it works
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {active.mechanism}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="font-mono text-[11px] uppercase tracking-widest">
                          Recommended defense
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                        {active.defense}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex items-center gap-2 border-t border-border/60 pt-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                {threats.findIndex((t) => t.id === active.id) + 1} / {threats.length} threat vectors
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
