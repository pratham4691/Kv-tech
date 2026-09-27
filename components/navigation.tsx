'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, Menu, X, ArrowUpRight, Search, 
  Terminal, Activity, Sparkles, Lock, Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommandPalette } from './command-palette'

const links = [
  { label: 'Awareness', href: '#awareness' },
  { label: 'Threat Explorer', href: '#threats' },
  { label: 'Kill-Chain Lab', href: '#attack-lab' },
  { label: 'Crypto Sandbox', href: '#crypto-vault' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'About', href: '#about' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled ? 'py-2.5' : 'py-5'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            className={cn(
              'relative flex items-center justify-between rounded-full px-4 py-2 transition-all duration-300',
              scrolled
                ? 'bg-slate-950/80 backdrop-blur-xl border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.1)]'
                : 'bg-slate-950/40 backdrop-blur-md border border-white/10 hover:border-white/20'
            )}
            aria-label="Primary Navigation"
          >
            {/* Brand Logo with Hologram Effect */}
            <Link
              href="/"
              className="group flex items-center gap-3 font-display tracking-wider"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-purple-500/20 p-0.5 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
                <span className="absolute inset-0 rounded-xl bg-cyan-400/10 animate-ping opacity-25" />
                <ShieldCheck className="h-5 w-5 text-cyan-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-[0.22em] text-white group-hover:text-cyan-200 transition-colors">
                    KALKI VAULT
                  </span>
                  <span className="hidden xl:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SHIELD ACTIVE
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-400">
                  Defensive Architecture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Animated Pill */}
            <ul 
              className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-2 py-1 relative"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {links.map((link, idx) => (
                <li key={link.label} className="relative">
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    className={cn(
                      'relative z-10 block px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors',
                      hoveredIdx === idx ? 'text-white' : 'text-slate-300 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>

                  {hoveredIdx === idx && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Command Palette / Audit Trigger */}
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all shadow-sm"
                title="Quick Security Audit & Commands"
              >
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>Audit</span>
                <kbd className="rounded border border-white/10 bg-white/10 px-1 py-0.2 font-mono text-[9px] text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              {/* Enter Vault CTA */}
              <Link
                href="/vault"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full p-[1px] font-medium text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,#3b82f6_50%,#06b6d4_100%)] opacity-80" />
                <span className="relative flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-white group-hover:bg-slate-900 transition-colors">
                  <Lock className="h-3.5 w-3.5 text-cyan-400 group-hover:text-cyan-300" />
                  <span>Enter Vault</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white lg:hidden transition-colors"
                aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="mt-2 rounded-3xl border border-cyan-500/20 bg-slate-950/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-slate-300 uppercase tracking-widest">
                      Kalki Defense Mesh: Online
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      setCmdOpen(true)
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/30"
                  >
                    <Terminal className="h-3 w-3" /> Audit (Ctrl+K)
                  </button>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-200 transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                      </Link>
                    </li>
                  ))}
                  <li className="mt-3 border-t border-white/10 pt-3">
                    <Link
                      href="/vault"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                      <Lock className="h-4 w-4" />
                      Enter Classified Vault Enclave
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Global Command Palette & Client Diagnostics Modal */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  )
}
