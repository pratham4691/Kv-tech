"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { NetworkCanvas } from "@/components/network-canvas"
import { MagneticButton } from "@/components/magnetic-button"
import type { VaultPath } from "@/lib/vault-paths"

const ACCENT_VAR: Record<VaultPath["accent"], string> = {
  primary: "var(--primary)",
  signal: "var(--signal)",
  warn: "var(--warn)",
}

export function ComingSoon({ path }: { path: VaultPath }) {
  const accent = ACCENT_VAR[path.accent]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <NetworkCanvas className="opacity-50" density={0.7} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to site
        </Link>
        <Link
          href="/vault"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Vault Core
        </Link>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: accent }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          </span>
          In Development
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.7 }}
          className="text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl"
        >
          {path.label} Vault
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.7 }}
          className="mt-3 font-mono text-sm uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {path.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.7 }}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {path.description}
        </motion.p>

        {/* planned capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.7 }}
          className="mt-12 w-full"
        >
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            What&apos;s being built
          </p>
          <ul className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            {path.planned.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3 text-left text-sm text-foreground/90 backdrop-blur-sm"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: accent }}
                  aria-hidden
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href="/#ecosystem">Explore the ecosystem</MagneticButton>
          <Link
            href="/vault"
            className="rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Return to Vault Core
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/60"
        >
          Kalki Vault {path.label} &middot; Arriving in a future release
        </motion.p>
      </div>
    </main>
  )
}
