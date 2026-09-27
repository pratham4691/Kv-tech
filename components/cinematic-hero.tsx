'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Shield, Lock, Radio, Zap } from 'lucide-react'
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
      {/* Central Vivid Holographic Singularity (Lively Colorful Motion) */}
      <motion.div
        style={{ y: yVisual, x: lensX, translateY: lensY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] opacity-75 z-0"
      >
        {/* Animated concentric cyber orbits */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/25 animate-[spin_50s_linear_infinite]" />
        <div className="absolute inset-14 rounded-full border border-dashed border-purple-400/30 animate-[spin_35s_linear_infinite_reverse]" />
        <div className="absolute inset-28 rounded-full border border-pink-400/20 animate-[spin_25s_linear_infinite]" />

        {/* Dynamic, Vivid Radiant Chromatic Core */}
        <div 
          className="absolute inset-36 rounded-full blur-[110px] animate-[pulse_6s_ease-in-out_infinite]"
          style={{
            background: `
              radial-gradient(circle, 
                rgba(34, 211, 238, 0.65) 0%, 
                rgba(217, 70, 239, 0.45) 40%, 
                rgba(99, 102, 241, 0.35) 65%, 
                transparent 85%
              )
            `
          }}
        />

        {/* Micro-calibration markers */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyan-300 font-bold tracking-[0.35em] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          00°_AZIMUTH // LIVE DEFENSE CORE
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-purple-300 tracking-[0.35em]">
          LATTICE_ENCLAVE_PQC // FIPS 203
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 flex flex-col justify-center">
        {/* Colorful Glowing Tagline Chip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-4 py-1.5 backdrop-blur-xl shadow-[0_0_25px_rgba(34,211,238,0.3)] font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-200 mb-8 w-fit"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <span className="font-semibold">Autonomous Cyber Shield Active</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-purple-300 hidden sm:inline">Quantum Enclave v2.4</span>
        </motion.div>

        {/* Massive Editorial Headline with Radiant Gradient Lighting */}
        <motion.div
          style={{ y: yHeadline, opacity: opacityHeadline }}
          variants={wordContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-bold tracking-[-0.04em] text-white leading-[0.95] text-balance">
            <motion.span variants={wordItem} className="block text-white">
              THE ARCHITECTURE
            </motion.span>
            <motion.span variants={wordItem} className="block font-serif font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 my-1 sm:my-2 tracking-normal drop-shadow-[0_0_35px_rgba(217,70,239,0.35)]">
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
          className="mt-10 sm:mt-14 grid gap-8 sm:grid-cols-[1.5fr_1fr] items-end border-t border-white/[0.12] pt-8 max-w-5xl"
        >
          <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light text-pretty max-w-xl">
            Kalki Vault constructs zero-exposure cryptographic enclaves and autonomous incident severance systems. 
            Engineered to isolate anomalies at machine speed, before breach becomes compromise.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-end">
            <Link
              href="#monolith"
              className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-cyan-400 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-500 hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]"
            >
              <span>Explore Architecture</span>
              <ArrowDown className="h-3.5 w-3.5 text-cyan-300 transition-transform group-hover:translate-y-0.5" />
            </Link>

            <Link
              href="#threat-loom"
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 hover:text-white transition-colors py-2"
            >
              <span>Threat Loom</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Bottom Telemetry Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 mx-auto w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 pt-10 text-[10px] font-mono text-white/60 uppercase tracking-[0.25em]"
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-white font-medium">ZERO TRUST LATTICE: ONLINE</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:inline text-cyan-300">NIST FIPS 203 VERIFIED</span>
        </div>

        <div className="flex items-center gap-2 text-white/50">
          <span>SCROLL TO DESCEND</span>
          <span className="h-4 w-px bg-cyan-400/40" />
        </div>
      </motion.div>
    </section>
  )
}