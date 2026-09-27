'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Shield, Lock, Radio } from 'lucide-react'
import Link from 'next/link'

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Scroll parallax for typography and visual core
  const yHeadline = useTransform(scrollY, [0, 600], [0, 100])
  const opacityHeadline = useTransform(scrollY, [0, 450], [1, 0.2])
  const yVisual = useTransform(scrollY, [0, 600], [0, 180])

  // Mouse parallax for the central refractive lens
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lensX = useSpring(mouseX, { stiffness: 40, damping: 25 })
  const lensY = useSpring(mouseY, { stiffness: 40, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const nx = (clientX / innerWidth - 0.5) * 50
    const ny = (clientY / innerHeight - 0.5) * 50
    mouseX.set(nx)
    mouseY.set(ny)
  }

  // Word-by-word animation variants with progressive blur-in
  const wordContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  }

  const wordItem = {
    hidden: { opacity: 0, y: 35, filter: 'blur(12px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-between pt-36 pb-14 px-6 sm:px-10 overflow-hidden"
    >
      {/* Central Refractive Singularity / Lens (Visual Environment) */}
      <motion.div
        style={{ y: yVisual, x: lensX, translateY: lensY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] opacity-40 z-0"
      >
        {/* Luminous orbital rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/[0.08] animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-16 rounded-full border border-dashed border-white/[0.06] animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-32 rounded-full border border-white/[0.04]" />

        {/* Central radiant focal point */}
        <div 
          className="absolute inset-40 rounded-full blur-[90px]"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 75%)'
          }}
        />

        {/* Micro-calibration markers */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyan-400/50 tracking-[0.3em]">
          00°_AZIMUTH // 44.82N
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white/30 tracking-[0.3em]">
          LATTICE_ENCLAVE_PQC
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 flex flex-col justify-center">
        {/* Minimal Sub-header / Status Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/80 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Sovereign Defensive Intelligence</span>
          <span className="h-px w-8 bg-cyan-500/30" />
          <span className="text-white/40 hidden sm:inline">Genesis Protocol 01</span>
        </motion.div>

        {/* Massive Editorial Headline */}
        <motion.div
          style={{ y: yHeadline, opacity: opacityHeadline }}
          variants={wordContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-bold tracking-[-0.04em] text-white leading-[0.95] text-balance">
            <motion.span variants={wordItem} className="block text-white/90">
              THE ARCHITECTURE
            </motion.span>
            <motion.span variants={wordItem} className="block font-serif font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-100 to-indigo-300 my-1 sm:my-2 tracking-normal">
              of autonomous
            </motion.span>
            <motion.span variants={wordItem} className="block text-white">
              DEFENSE.
            </motion.span>
          </h1>
        </motion.div>

        {/* Narrative Description & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-14 grid gap-8 sm:grid-cols-[1.5fr_1fr] items-end border-t border-white/[0.08] pt-8 max-w-5xl"
        >
          <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light text-pretty max-w-xl">
            Kalki Vault constructs zero-exposure cryptographic enclaves and autonomous incident severance systems. 
            Engineered to isolate anomalies at machine speed, before breach becomes compromise.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-end">
            <Link
              href="#monolith"
              className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-500/[0.08] px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-500 hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            >
              <span>Explore Architecture</span>
              <ArrowDown className="h-3.5 w-3.5 text-cyan-300 transition-transform group-hover:translate-y-0.5" />
            </Link>

            <Link
              href="#threat-loom"
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors py-2"
            >
              <span>Threat Loom</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Bottom Telemetry Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 mx-auto w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 pt-10 text-[10px] font-mono text-white/35 uppercase tracking-[0.25em]"
      >
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ZERO TRUST LATTICE: ONLINE</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline">NIST FIPS 203 VERIFIED</span>
        </div>

        <div className="flex items-center gap-2 text-white/40">
          <span>SCROLL TO DESCEND</span>
          <span className="h-4 w-px bg-white/20" />
        </div>
      </motion.div>
    </section>
  )
}
