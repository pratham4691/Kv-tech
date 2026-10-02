'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, ShieldCheck, Flame, Zap, Cpu, RefreshCw, 
  Terminal, Lock, ArrowRight, Activity, Sparkles, Orbit
} from 'lucide-react'

// Particle count for embers
const EMBER_COUNT = 32

export function PhoenicxScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [simulatingBreach, setSimulatingBreach] = useState(false)
  const [manualPurgeCount, setManualPurgeCount] = useState(142)

  // Scroll tracking across the 380vh scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth springs for buttery responsiveness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  })

  // Stage 1 -> Stage 2: Breach & Vault Core Transformation
  const vaultScale = useTransform(smoothProgress, [0, 0.25, 0.5, 0.8], [1, 1.25, 0.9, 0.75])
  const vaultRotate = useTransform(smoothProgress, [0, 0.5], [0, 180])
  const breachOpacity = useTransform(smoothProgress, [0, 0.18, 0.32], [1, 0.9, 0])
  
  // Stage 2 -> Stage 3: Phoenix Wingspan & Plasma Bloom
  const phoenixOpacity = useTransform(smoothProgress, [0.15, 0.32, 0.9, 1], [0, 1, 1, 0.4])
  const wingSpan = useTransform(smoothProgress, [0.2, 0.65], [0.15, 1])
  const wingAngleLeft = useTransform(smoothProgress, [0.2, 0.65], [-35, 0])
  const wingAngleRight = useTransform(smoothProgress, [0.2, 0.65], [35, 0])
  const phoenixY = useTransform(smoothProgress, [0.25, 0.75, 1], [120, -20, -100])
  const shockwaveScale = useTransform(smoothProgress, [0.4, 0.75], [0.5, 2.4])
  const shockwaveOpacity = useTransform(smoothProgress, [0.4, 0.55, 0.75], [0, 0.8, 0])

  // Stage 4: Cards and Sovereign Enclave Reveal
  const cardsY = useTransform(smoothProgress, [0.65, 0.88], [160, 0])
  const cardsOpacity = useTransform(smoothProgress, [0.68, 0.88], [0, 1])
  const crestGlow = useTransform(smoothProgress, [0.7, 1], [0.3, 1])

  // Dynamic status text based on scroll progress
  const [currentStage, setCurrentStage] = useState('STAGE 01: ZERO-DAY BREACH')
  const [stageColor, setStageColor] = useState('text-rose-400')

  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      if (latest < 0.28) {
        setCurrentStage('STAGE 01 // HEURISTIC BREACH INTRUSION')
        setStageColor('text-rose-400')
      } else if (latest < 0.55) {
        setCurrentStage('STAGE 02 // PHOENICX PLASMA IGNITION')
        setStageColor('text-amber-400')
      } else if (latest < 0.78) {
        setCurrentStage('STAGE 03 // WINGSPAN PURIFICATION MESH')
        setStageColor('text-cyan-300')
      } else {
        setCurrentStage('STAGE 04 // SOVEREIGN ENCLAVE RESTORED')
        setStageColor('text-emerald-400')
      }
    })
  }, [smoothProgress])

  const triggerManualPurge = () => {
    setSimulatingBreach(true)
    setTimeout(() => {
      setManualPurgeCount((prev) => prev + 1)
      setSimulatingBreach(false)
    }, 1800)
  }

  // Pre-generate embers positions
  const embers = Array.from({ length: EMBER_COUNT }, (_, i) => ({
    id: i,
    left: `${(i * 13) % 96 + 2}%`,
    duration: 3 + (i % 5) * 1.2,
    delay: (i % 6) * 0.4,
    size: 2 + (i % 3) * 2,
  }))

  const resiliencePillars = [
    {
      id: 0,
      title: 'Ephemeral Silicon Incineration',
      tag: 'HARDWARE_RESET',
      badge: '< 40ns',
      lead: 'Zero-taint memory unmapping.',
      desc: 'The instant heuristic anomalous execution is identified, Phoenicx triggers a hardware-level bus reset. The contaminated micro-enclave is obliterated from memory, leaving zero residual telemetry for attackers to inspect.',
    },
    {
      id: 1,
      title: 'ML-KEM-1024 Lattice Rebirth',
      tag: 'NIST_FIPS_203',
      badge: '256-BIT PQC',
      lead: 'Quantum-impervious session rebirth.',
      desc: 'Reconstitution occurs at machine speed. New cryptographic identities are derived using Module-Lattice Key Encapsulation (ML-KEM) mathematics, immunizing the freshly spawned enclave against quantum decryption.',
    },
    {
      id: 2,
      title: 'Autonomous Global Mesh Immunity',
      tag: 'ZERO_DRIFT',
      badge: 'REAL-TIME',
      lead: 'Instant cross-enclave vaccine distribution.',
      desc: 'The signature that attempted the intrusion is converted into a mathematical zero-knowledge proof and broadcast to all federated Kalki nodes, permanently vaccinating the global mesh within 0.084ms.',
    },
  ]

  return (
    <section 
      ref={containerRef} 
      id="phoenicx"
      className="relative h-[380vh] bg-[#010309] text-white"
    >
      {/* Sticky Cinematic Stage Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none">
        
        {/* Dynamic Dark Cyber Grids & Radial Energy Glow */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(6,182,212,0.12),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
          
          {/* Animated Floating Embers */}
          <div className="absolute inset-0 overflow-hidden">
            {embers.map((ember) => (
              <motion.div
                key={ember.id}
                initial={{ y: '105vh', opacity: 0 }}
                animate={{ 
                  y: '-10vh', 
                  opacity: [0, 0.8, 0.8, 0],
                  scale: [0.6, 1.2, 0.4]
                }}
                transition={{
                  duration: ember.duration,
                  repeat: Infinity,
                  delay: ember.delay,
                  ease: 'linear',
                }}
                style={{
                  left: ember.left,
                  width: ember.size,
                  height: ember.size,
                }}
                className="absolute rounded-full bg-gradient-to-t from-rose-500 via-amber-400 to-cyan-300 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
              />
            ))}
          </div>
        </div>

        {/* 1. TOP TELEMETRY HUD & SCROLL MONITOR */}
        <div className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Flame className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black tracking-[0.25em] text-sm text-white">
                  PHOENICX <span className="text-cyan-400">//</span> REBIRTH
                </span>
                <span className="text-[10px] font-mono rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">
                  SCROLL-DRIVEN
                </span>
              </div>
              <span className={`font-mono text-[11px] font-semibold tracking-wider ${stageColor} transition-colors duration-500`}>
                {currentStage}
              </span>
            </div>
          </div>

          {/* Real-time telemetry indicators */}
          <div className="flex items-center gap-6 font-mono text-[11px] text-white/60">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-white/40 text-[9px] uppercase tracking-widest">Enclave Status</span>
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                IMMUTABLE MESH
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-white/40 text-[9px] uppercase tracking-widest">Purge Cycles</span>
              <span className="text-white font-bold">{manualPurgeCount} EXECUTED</span>
            </div>

            {/* Live Interactive Manual Rebirth Trigger */}
            <button
              onClick={triggerManualPurge}
              disabled={simulatingBreach}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-mono text-cyan-200 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${simulatingBreach ? 'animate-spin text-amber-400' : ''}`} />
              <span>{simulatingBreach ? 'INCINERATING...' : 'TEST INTRUSION'}</span>
            </button>
          </div>
        </div>

        {/* 2. THE CENTERPIECE: 3D TRANSFORMING PHOENICX & VAULT CORE */}
        <div className="relative z-20 mx-auto my-auto flex w-full max-w-5xl flex-1 items-center justify-center">
          
          {/* Expanding Plasma Shockwave on Wingspan Activation */}
          <motion.div
            style={{
              scale: shockwaveScale,
              opacity: shockwaveOpacity,
            }}
            className="pointer-events-none absolute h-[500px] w-[500px] rounded-full border border-cyan-400/50 bg-radial from-cyan-500/30 via-indigo-600/10 to-transparent shadow-[0_0_80px_rgba(6,182,212,0.5)]"
          />

          {/* STAGE 1: Compromised Vault Core (Transforms as you scroll) */}
          <motion.div
            style={{
              scale: vaultScale,
              rotate: vaultRotate,
              opacity: breachOpacity,
            }}
            className="absolute flex items-center justify-center"
          >
            {/* Outer Broken Security Rings */}
            <div className="relative flex h-64 w-64 sm:h-80 sm:w-80 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-500/60 animate-[spin_18s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-rose-500/30 animate-[spin_24s_linear_infinite_reverse]" />
              
              {/* Breach alert core */}
              <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl bg-[#120408]/90 border border-rose-500/70 shadow-[0_0_60px_rgba(244,63,94,0.6)] backdrop-blur-2xl">
                <div className="flex flex-col items-center gap-2 text-center p-3">
                  <ShieldAlert className="h-10 w-10 text-rose-500 animate-bounce" />
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-rose-300">
                    ZERO-DAY INTRUSION
                  </span>
                  <span className="font-mono text-[8px] text-rose-400/80">
                    MEM_FAULT: 0x7FFF9A
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STAGE 2 & 3: THE ASCENDANT PHOENICX (Unique Vector Cyber-Phoenix) */}
          <motion.div
            style={{
              opacity: phoenixOpacity,
              y: phoenixY,
            }}
            className="relative flex w-full max-w-4xl flex-col items-center justify-center pointer-events-none"
          >
            <div className="relative flex w-full items-center justify-center">
              
              {/* LEFT CYBER-WING */}
              <motion.div
                style={{
                  scaleX: wingSpan,
                  scaleY: wingSpan,
                  rotate: wingAngleLeft,
                  transformOrigin: 'right center',
                }}
                className="w-1/2 pr-2"
              >
                <svg viewBox="0 0 400 280" className="w-full drop-shadow-[0_0_35px_rgba(6,182,212,0.7)]" fill="none">
                  {/* Wing Primary Plasma Spine */}
                  <path
                    d="M 390 140 Q 280 40 100 20 Q 30 80 10 130 Q 120 120 260 145 Z"
                    fill="url(#wingGradientCyan)"
                    fillOpacity="0.85"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                  />
                  {/* Feather Blade 1 */}
                  <path
                    d="M 360 140 Q 240 80 80 70 Q 20 130 50 170 Q 180 150 330 150 Z"
                    fill="url(#wingGradientPurple)"
                    fillOpacity="0.75"
                    stroke="#a855f7"
                    strokeWidth="1.2"
                  />
                  {/* Feather Blade 2 */}
                  <path
                    d="M 330 150 Q 200 120 70 140 Q 40 190 90 220 Q 210 180 300 160 Z"
                    fill="url(#wingGradientCyan)"
                    fillOpacity="0.6"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />
                  {/* Outer Trailing Cyber Conduit */}
                  <path
                    d="M 280 160 Q 160 170 80 220 Q 120 260 180 250 Q 240 210 270 170 Z"
                    fill="url(#wingGradientPurple)"
                    fillOpacity="0.45"
                    stroke="#818cf8"
                    strokeWidth="1"
                  />
                  {/* Circuit Traces across wing */}
                  <line x1="380" y1="135" x2="160" y2="50" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="320" y1="145" x2="110" y2="100" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="260" y1="155" x2="140" y2="190" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
                </svg>
              </motion.div>

              {/* CENTRAL PHOENICX CREST & QUANTUM HEART */}
              <div className="relative z-20 flex h-32 w-32 sm:h-44 sm:w-44 flex-shrink-0 items-center justify-center">
                {/* Multi-layer pulsating holographic halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-60 blur-2xl animate-pulse" />
                
                {/* Rotating Cyber-Shield Geometry */}
                <div className="absolute inset-1 rounded-2xl border border-cyan-400/50 bg-[#020716]/90 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.8)] rotate-45 flex items-center justify-center" />
                <div className="absolute inset-3 rounded-2xl border border-indigo-400/40 bg-transparent rotate-12 animate-[spin_20s_linear_infinite]" />
                
                {/* Phoenix Avian Crown & Visor SVG */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-20 w-20 drop-shadow-[0_0_15px_#22d3ee]">
                    {/* Phoenix Head Geometry */}
                    <polygon points="50,15 65,40 50,48 35,40" fill="#22d3ee" fillOpacity="0.9" />
                    {/* Crown Feathers */}
                    <polygon points="50,8 55,20 45,20" fill="#a855f7" />
                    <polygon points="40,12 47,24 38,24" fill="#06b6d4" />
                    <polygon points="60,12 53,24 62,24" fill="#06b6d4" />
                    {/* Visor Sensor */}
                    <polygon points="44,34 56,34 50,42" fill="#ffffff" />
                    {/* Heart Reactor */}
                    <circle cx="50" cy="62" r="14" fill="url(#coreGradient)" stroke="#67e8f9" strokeWidth="2" />
                    <circle cx="50" cy="62" r="6" fill="#ffffff" className="animate-ping" />
                  </svg>
                  <span className="font-mono text-[9px] font-black tracking-widest text-cyan-200 mt-1">
                    PHOENICX::CORE
                  </span>
                </div>
              </div>

              {/* RIGHT CYBER-WING */}
              <motion.div
                style={{
                  scaleX: wingSpan,
                  scaleY: wingSpan,
                  rotate: wingAngleRight,
                  transformOrigin: 'left center',
                }}
                className="w-1/2 pl-2"
              >
                <svg viewBox="0 0 400 280" className="w-full drop-shadow-[0_0_35px_rgba(6,182,212,0.7)]" fill="none">
                  {/* Wing Primary Plasma Spine */}
                  <path
                    d="M 10 140 Q 120 40 300 20 Q 370 80 390 130 Q 280 120 140 145 Z"
                    fill="url(#wingGradientCyan)"
                    fillOpacity="0.85"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                  />
                  {/* Feather Blade 1 */}
                  <path
                    d="M 40 140 Q 160 80 320 70 Q 380 130 350 170 Q 220 150 70 150 Z"
                    fill="url(#wingGradientPurple)"
                    fillOpacity="0.75"
                    stroke="#a855f7"
                    strokeWidth="1.2"
                  />
                  {/* Feather Blade 2 */}
                  <path
                    d="M 70 150 Q 200 120 330 140 Q 360 190 310 220 Q 190 180 100 160 Z"
                    fill="url(#wingGradientCyan)"
                    fillOpacity="0.6"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />
                  {/* Outer Trailing Cyber Conduit */}
                  <path
                    d="M 120 160 Q 240 170 320 220 Q 280 260 220 250 Q 160 210 130 170 Z"
                    fill="url(#wingGradientPurple)"
                    fillOpacity="0.45"
                    stroke="#818cf8"
                    strokeWidth="1"
                  />
                  {/* Circuit Traces */}
                  <line x1="20" y1="135" x2="240" y2="50" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="80" y1="145" x2="290" y2="100" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="155" x2="260" y2="190" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
                </svg>
              </motion.div>

            </div>

            {/* Gradient Definitions for SVG */}
            <svg className="absolute h-0 w-0">
              <defs>
                <linearGradient id="wingGradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="wingGradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
                <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </radialGradient>
              </defs>
            </svg>

            {/* Rebirth Title Banner Under Phoenix */}
            <motion.div 
              style={{ opacity: crestGlow }}
              className="mt-8 flex flex-col items-center text-center"
            >
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
                POST-INCIDENT RESURRECTION PROTOCOL
              </span>
              <h3 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Immortal Cryptographic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300">Resilience.</span>
              </h3>
            </motion.div>
          </motion.div>

        </div>

        {/* 3. STAGE 4: THREE PILLARS OF PHOENICX INTERACTIVE CARDS */}
        <motion.div
          style={{
            y: cardsY,
            opacity: cardsOpacity,
          }}
          className="relative z-30 mx-auto w-full max-w-6xl"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {resiliencePillars.map((pillar, idx) => {
              const isSelected = activeTab === idx
              return (
                <div
                  key={pillar.id}
                  onClick={() => setActiveTab(idx)}
                  className={`group relative cursor-pointer rounded-2xl border p-5 sm:p-6 backdrop-blur-2xl transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-400/60 bg-[#050b1d]/90 shadow-[0_15px_40px_rgba(6,182,212,0.25)]'
                      : 'border-white/[0.08] bg-[#030611]/70 hover:border-white/20 hover:bg-[#050816]/80'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase">
                    <span className="text-cyan-400 tracking-wider font-semibold">{pillar.tag}</span>
                    <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-cyan-300 border border-cyan-500/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {pillar.title}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-light line-clamp-3">
                    {pillar.desc}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono">
                    <span className="text-white/40">Doctrine 0{idx + 1}</span>
                    <span className="text-cyan-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Explore Enclave <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Scroll Progress Bar */}
          <div className="mt-5 flex items-center justify-between gap-4 font-mono text-[10px] text-white/40">
            <span>0% BREACH DETECTED</span>
            <div className="relative h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400"
              />
            </div>
            <span>100% PHOENICX REBORN</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
