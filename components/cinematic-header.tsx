'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, ArrowUpRight, Terminal, Menu, X, 
  Activity, Lock, Zap, Radio, Sparkles, Cpu
} from 'lucide-react'
import { CommandPalette } from './command-palette'

const navItems = [
  { label: 'Doctrine', href: '#monolith', badge: '03' },
  { label: 'Threat Loom', href: '#threat-loom', badge: '06' },
  { label: 'Kill-Chain Lab', href: '#attack-lab', badge: 'LIVE' },
  { label: 'Crypto Sandbox', href: '#crypto-vault', badge: 'PQC' },
  { label: 'Portals', href: '#architecture', badge: null },
]

export function CinematicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [entropyRate, setEntropyRate] = useState('4.82')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic subtle entropy jitter to make the nav feel alive
  useEffect(() => {
    const timer = setInterval(() => {
      const base = 4.82 + (Math.random() - 0.5) * 0.08
      setEntropyRate(base.toFixed(2))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5 sm:py-6'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={`relative mx-auto flex items-center justify-between rounded-full px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-500 ${
              scrolled
                ? 'bg-[#040711]/85 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.18)]'
                : 'bg-[#050814]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
            }`}
          >
            {/* 1. Holographic Kinetic Brand Crest */}
            <Link href="/" className="group flex items-center gap-3 pl-1">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/25 via-slate-900 to-purple-600/25 p-0.5 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.65)] transition-all duration-500">
                {/* Orbiting micro-satellite dot */}
                <div className="absolute inset-0 rounded-full animate-[spin_6s_linear_infinite]">
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
                </div>
                <ShieldCheck className="h-4 w-4 text-cyan-300 transition-transform duration-500 group-hover:scale-110" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm tracking-[0.22em] font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                    KALKI <span className="text-cyan-400 font-light">//</span> VAULT
                  </span>
                  <span className="hidden xl:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE
                  </span>
                </div>
                <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                  SOVEREIGN ENCLAVE
                </span>
              </div>
            </Link>

            {/* 2. Floating Animated Navigation Pill Deck (Desktop) */}
            <nav 
              className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 relative"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {navItems.map((item, idx) => {
                const isHovered = hoveredIdx === idx
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    className="relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                        item.badge === 'LIVE' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : item.badge === 'PQC'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Fluid Morphing Background Capsule */}
                    {isHovered && (
                      <motion.div
                        layoutId="nav-capsule-glide"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 shadow-[0_0_18px_rgba(6,182,212,0.25)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* 3. Right Telemetry & Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Dynamic Live Frequency Wave (Acoustic / Entropy Visualizer) */}
              <div 
                className="hidden xl:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] text-white/50"
                title="Real-Time Network Entropy & Defensive Telemetry"
              >
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_1s_ease-in-out_infinite] h-3" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_1.4s_ease-in-out_infinite] h-2" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3.5" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-1.5" />
                </div>
                <span className="text-cyan-300 font-bold">{entropyRate}</span>
                <span className="text-white/30">ENTROPY</span>
              </div>

              {/* Command Palette Probe Trigger (⌘K) */}
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 sm:px-3.5 py-1.5 text-xs font-mono text-white/60 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all duration-300 shadow-sm"
              >
                <Terminal className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline uppercase tracking-widest text-[11px]">AUDIT</span>
                <kbd className="rounded border border-white/15 bg-white/10 px-1 py-0.2 font-mono text-[9px] text-white/50 group-hover:text-cyan-200">
                  Ctrl+K
                </kbd>
              </button>

              {/* Radiant Post-Quantum Launch Action */}
              <Link
                href="/vault"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full p-[1px] font-mono text-xs uppercase tracking-wider transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)]"
              >
                {/* Rotating Laser Shimmer Border */}
                <span className="absolute inset-[-1000%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,#3b82f6_45%,#a855f7_75%,#06b6d4_100%)] opacity-85" />
                <span className="relative flex items-center gap-1.5 rounded-full bg-[#04060e] px-4 py-1.5 sm:py-2 text-white font-semibold group-hover:bg-[#070b1a] transition-colors">
                  <Lock className="h-3 w-3 text-cyan-400 group-hover:text-cyan-300" />
                  <span className="text-[11px] tracking-[0.18em]">ENTER VAULT</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:border-cyan-400 hover:text-white lg:hidden transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 4. Mobile Dynamic Control Deck (Slide-Down) */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2.5 rounded-3xl border border-cyan-500/25 bg-[#040711]/95 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] lg:hidden"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DEFENSE MESH: SYNCHRONIZED</span>
                  </div>
                  <span className="text-cyan-300 font-mono text-[11px]">
                    ENTROPY: {entropyRate}
                  </span>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white/80 hover:bg-cyan-500/10 hover:text-cyan-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setCmdOpen(true)
                    }}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Instant Security Audit (Ctrl+K)</span>
                    </div>
                    <span className="text-[10px] text-white/50">PROBE</span>
                  </button>

                  <Link
                    href="/vault"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-3 mt-3 text-center font-mono text-xs uppercase tracking-widest font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                  >
                    <Lock className="h-4 w-4" />
                    Enter Classified Vault Enclave
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Global Interactive Command Palette & Client Diagnostics Modal */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  )
}