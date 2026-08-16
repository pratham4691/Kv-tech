'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldOff, ShieldCheck } from 'lucide-react'
import { attackLifecycle } from '@/lib/threats'
import { Reveal, SectionKicker } from './reveal'
import { cn } from '@/lib/utils'

export function AttackLifecycle() {
  const [active, setActive] = useState(0)
  const stage = attackLifecycle[active]

  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24 sm:py-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 15% 30%, oklch(0.63 0.2 22 / 8%), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionKicker>Educational Model</SectionKicker>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            How an attack unfolds.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            A conceptual view of how a digital attack can progress — and where
            defenders can break the chain. This is an awareness model, not an
            exploitation tutorial.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Stage rail */}
          <Reveal className="relative">
            <ol className="relative space-y-1">
              <span
                className="absolute left-[15px] top-2 bottom-2 w-px bg-border"
                aria-hidden="true"
              />
              <motion.span
                className="absolute left-[15px] top-2 w-px bg-primary"
                aria-hidden="true"
                animate={{
                  height: `${(active / (attackLifecycle.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ maxHeight: 'calc(100% - 16px)' }}
              />
              {attackLifecycle.map((s, i) => {
                const isActive = i === active
                const isPast = i < active
                return (
                  <li key={s.id} className="relative">
                    <button
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="flex w-full items-center gap-4 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-surface/50"
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <span
                        className={cn(
                          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-all',
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : isPast
                              ? 'border-primary/50 bg-primary/15 text-primary'
                              : 'border-border bg-background text-muted-foreground',
                        )}
                      >
                        {s.index}
                      </span>
                      <span
                        className={cn(
                          'font-display text-base transition-colors sm:text-lg',
                          isActive ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {s.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          {/* Stage detail */}
          <Reveal delay={0.1}>
            <div className="glass sticky top-28 overflow-hidden rounded-3xl p-7 sm:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                    Stage {stage.index} / {attackLifecycle.length}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {stage.name}
                  </h3>

                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
                    <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                        Defender&apos;s move
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {stage.defenderMove}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
