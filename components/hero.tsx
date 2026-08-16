'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Activity } from 'lucide-react'
import { NetworkCanvas } from './network-canvas'
import { MagneticButton } from './magnetic-button'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      <NetworkCanvas className="absolute inset-0 h-full w-full" density={1} />
      <div className="grid-backdrop absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 20%, oklch(0.78 0.13 205 / 12%), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, oklch(0.68 0.16 285 / 10%), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              KALKI VAULT
            </span>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-primary sm:text-sm"
          >
            Cybersecurity Awareness &bull; Research &bull; Innovation
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Security begins with{' '}
            <span className="text-primary text-glow">understanding.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Explore the threats shaping the digital world, understand how attacks
            happen, and build the knowledge required to stay ahead.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href="#awareness" variant="primary">
              Explore Cybersecurity
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="/vault" variant="ghost">
              Enter Kalki Vault
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll to explore
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <span className="absolute inset-x-0 top-0 h-4 bg-primary animate-scan" />
        </span>
      </motion.div>
    </section>
  )
}
