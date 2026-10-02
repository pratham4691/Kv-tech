'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ShieldAlert, ArrowRight, Lock, ChevronDown, Radio, Activity } from 'lucide-react'
import { PhoenixCanvas } from './phoenix-canvas'

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgressVal, setScrollProgressVal] = useState(0)
  const [flightPassed, setFlightPassed] = useState(false)

  // Scroll track for flight progression & smooth unveiling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      setScrollProgressVal(latest)
      if (latest > 0.05) {
        setFlightPassed(true)
      }
    })
  }, [smoothProgress])

  // Content fades in gently after the initial bird pass (or immediately on user scroll)
  const contentOpacity = useTransform(smoothProgress, [0, 0.15], [flightPassed ? 1 : 0.85, 0])
  const contentY = useTransform(smoothProgress, [0, 0.15], [0, -40])

  return (
    <section
      ref={containerRef}
      className="relative h-[180vh] w-full bg-[#030206] text-white select-none"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-8 px-6 sm:px-12">
        
        {/* Subtle Ambient Vignette */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,102,0,0.08)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_50%,transparent_100%)] opacity-30" />
        </div>

        {/* 1. MINIMAL PROFESSIONAL METADATA BAR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative z-20 flex items-center justify-between border-b border-white/5 pb-4 font-mono text-[11px] text-zinc-500"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">TELEMETRY RADAR: ACTIVE</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-zinc-500">FEED // KV-GLOBAL-SURVEILLANCE</span>
            <Link 
              href="/vault" 
              className="text-amber-400/90 hover:text-amber-300 font-semibold tracking-wider transition-colors uppercase flex items-center gap-1.5"
            >
              <Lock className="h-3 w-3" />
              <span>Portal Access</span>
            </Link>
          </div>
        </motion.div>

        {/* 2. CENTER STAGE: THE MAJESTIC PHOENIX IN PRECISE 1/8TH SCREEN PROPORTION */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <PhoenixCanvas 
            scrollProgress={scrollProgressVal} 
            onFlightPassComplete={() => setFlightPassed(true)}
          />
        </div>

        {/* 3. CLEAN EDITORIAL HEADLINE & THREAT SUMMARY */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center mt-auto mb-10 pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-400/90 mb-4">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            <span>KALKI VAULT CYBERSECURITY INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-5 leading-[1.08]">
            Global Cyber Threat <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Intelligence Radar
            </span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-zinc-400 font-light leading-relaxed mb-8">
            Continuous real-time monitoring of verified zero-day vulnerabilities, active exploit campaigns, 
            and global threat advisories. Sourced for security analysts, institutions, and enterprise defenders.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/vault"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-black transition-all hover:brightness-110 shadow-[0_0_25px_rgba(255,120,0,0.3)]"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Enter Vault</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#threat-news"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
            >
              <Radio className="h-3.5 w-3.5 text-amber-400" />
              <span>Live CVE Advisories</span>
            </a>
          </div>
        </motion.div>

        {/* 4. BOTTOM STATUS BAR */}
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="relative z-20 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>CVE FEEDS: CONTINUOUS</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <span>SCROLL FOR INTELLIGENCE FEED</span>
            <ChevronDown className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
          </div>

          <div className="hidden sm:block">
            <span>DISCLOSURE LEVEL: PUBLIC</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
