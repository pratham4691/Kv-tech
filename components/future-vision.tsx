'use client'

import { motion } from 'framer-motion'
import { NetworkCanvas } from './network-canvas'
import { MagneticButton } from './magnetic-button'
import { Reveal, SectionKicker } from './reveal'

const stages = ['Awareness', 'Learning', 'Research', 'Innovation', 'Enterprise Security']

export function FutureVision() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-28 sm:py-36">
      <NetworkCanvas className="absolute inset-0 h-full w-full opacity-50" density={0.7} interactive={false} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.68 0.16 285 / 12%), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <div className="flex justify-center">
            <SectionKicker>Future Vision</SectionKicker>
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
            The Vault is only the{' '}
            <span className="text-primary text-glow">beginning.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Kalki Vault is being built as an evolving cybersecurity ecosystem —
            growing outward from awareness into a platform where students,
            researchers and organizations meet.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-3 sm:gap-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                  className="rounded-full border border-border bg-surface/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground/90 backdrop-blur sm:text-sm"
                >
                  {s}
                </motion.span>
                {i < stages.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.26 + i * 0.12 }}
                    className="text-primary"
                    aria-hidden="true"
                  >
                    &rarr;
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-14 flex justify-center">
            <MagneticButton href="/vault" variant="primary">
              Enter the Vault
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
