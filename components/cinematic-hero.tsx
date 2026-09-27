
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ShieldCheck, Cpu, ArrowRight, Lock, Zap, Radio, ChevronDown, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Scroll parallax for typography and visual core
  const yHeadline = useTransform(scrollY, [0, 500], [0, 80])
  const opacityHeadline = useTransform(scrollY, [0, 400], [1, 0.25])
  const yVisual = useTransform(scrollY, [0, 500], [0, 140])

  // Mouse parallax for subtle depth
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lensX = useSpring(mouseX, { stiffness: 40, damping: 25 })
  const lensY = useSpring(mouseY, { stiffness: 40, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const nx = (clientX / innerWidth - 0.5) * 30
    const ny = (clientY / innerHeight - 0.5) * 30
    mouseX.set(nx)
    mouseY.set(ny)
  }

  // Word-by-word animation variants with smooth fade and sharp de-blur
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex flex-col justify-between pt-32 sm:pt-36 pb-12 px-6 sm:px-10 overflow-hidden"
    >
      {/* Subtle Central Cyber Ring Animation (Backdrop element, non-obtrusive) */}
      <motion.div
        style={{ y: yVisual, x: lensX, translateY: lensY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] opacity-30 z-0"
      >
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-16 rounded-full border border-dashed border-indigo-500/25 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-32 rounded-full border border-cyan-400/15 animate-[spin_30s_linear_infinite]" />
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 flex flex-col justify-center my-auto">
        {/* Enterprise Security Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-[#040816]/90 px-4 py-1.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)] font-mono text-[11px] uppercase tracking-wider text-cyan-200 mb-6 w-fit"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-semibold text-white">AUTONOMOUS THREAT SHIELD ACTIVE</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-cyan-300 font-mono hidden sm:inline">NIST FIPS 203 (ML-KEM) VERIFIED</span>
        </motion.div>

        {/* Balanced, Authoritative Enterprise Headline */}
        <motion.div
          style={{ y: yHeadline, opacity: opacityHeadline }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.2rem] font-extrabold tracking-[-0.03em] text-white leading-[1.1] text-balance drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            <motion.span variants={wordVariants} className="inline-block mr-3">
              AUTONOMOUS
            </motion.span>
            <motion.span variants={wordVariants} className="inline-block mr-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              THREAT
            </motion.span>
            <motion.span variants={wordVariants} className="inline-block mr-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-emerald-300">
              ELIMINATION
            </motion.span>
            <motion.span variants={wordVariants} className="block mt-1 sm:mt-2 text-white">
              &amp; QUANTUM-RESILIENT ENCLAVES.
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle & Value Proposition with High Contrast Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-3xl"
        >
          <div className="rounded-2xl border border-white/10 bg-[#030614]/80 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal text-pretty">
              Kalki Vault constructs zero-exposure cryptographic enclaves and machine-speed anomaly severance systems. 
              Engineered to detect, isolate, and neutralize zero-day breaches at sub-millisecond velocity before compromise occurs.
            </p>

            {/* Core Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              <Link
                href="#attack-lab"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl border border-cyan-400 bg-cyan-500/20 px-6 py-3 text-xs font-mono uppercase tracking-wider text-white font-bold backdrop-blur-md transition-all duration-300 hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>Launch Attack Lab</span>
                <ArrowRight className="h-3.5 w-3.5 text-cyan-300 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#crypto-vault"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-mono uppercase tracking-wider text-slate-200 hover:border-cyan-400/40 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                <span>PQC Crypto Sandbox</span>
              </Link>

              <Link
                href="#threat-loom"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 hover:text-white transition-colors px-2 py-1"
              >
                <span>Live Telemetry</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 4 Professional Enterprise Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl"
        >
          <div className="rounded-xl border border-white/10 bg-[#040816]/85 p-4 backdrop-blur-xl shadow-lg hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-[10px] font-mono uppercase tracking-wider mb-1">
              <span>LATENCY</span>
              <Activity className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 tracking-tight">
              &lt; 0.8ms
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">
              Autonomous Anomaly Severance
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#040816]/85 p-4 backdrop-blur-xl shadow-lg hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-[10px] font-mono uppercase tracking-wider mb-1">
              <span>HARDNESS</span>
              <Lock className="h-3 w-3 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-300 tracking-tight">
              256-Bit
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">
              ML-KEM Post-Quantum Lattice
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#040816]/85 p-4 backdrop-blur-xl shadow-lg hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-[10px] font-mono uppercase tracking-wider mb-1">
              <span>RELIABILITY</span>
              <Cpu className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300 tracking-tight">
              99.999%
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">
              Zero-Trust Enclave Availability
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#040816]/85 p-4 backdrop-blur-xl shadow-lg hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-[10px] font-mono uppercase tracking-wider mb-1">
              <span>EXPOSURE</span>
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 tracking-tight">
              0.00%
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">
              Plaintext Ingress Surface
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Telemetry & Navigation Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 mx-auto w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 pt-8 text-[11px] font-mono text-white/70 uppercase tracking-widest border-t border-white/10 mt-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-white font-semibold">SECURITY ENGINE: RUNNING</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:inline text-cyan-300">NIST SP 800-207 ZERO TRUST</span>
        </div>

        <Link
          href="#monolith"
          className="flex items-center gap-1.5 text-white/60 hover:text-cyan-300 transition-colors"
        >
          <span>EXPLORE DEFENSE DOCTRINE</span>
          <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  )
}
