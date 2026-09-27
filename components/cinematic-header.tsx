'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Terminal, Menu, X } from 'lucide-react'
import { CommandPalette } from './command-palette'

export function CinematicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toISOString().slice(11, 19) + ' UTC')
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? 'py-4 backdrop-blur-xl bg-[#030508]/70 border-b border-white/[0.04]' : 'py-7'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 flex items-center justify-between">
          {/* Typographic Brand Identity */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm tracking-[0.28em] uppercase text-white font-bold group-hover:text-cyan-200 transition-colors">
                KALKI <span className="text-white/30 font-normal">//</span> VAULT
              </span>
            </div>
          </Link>

          {/* Understated Editorial Coordinates / Telemetry (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 font-mono text-[11px] text-white/40 tracking-[0.2em] uppercase">
            <span>DEFENSIVE ARCHITECTURE</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-cyan-400/80 font-medium">{time || '00:00:00 UTC'}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>NODE 01_VERIFIED</span>
          </div>

          {/* Minimal Navigation & Understated Actions */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-7 text-[12px] font-mono uppercase tracking-[0.18em] text-white/60">
              <Link href="#architecture" className="hover:text-white transition-colors">
                Architecture
              </Link>
              <Link href="#monolith" className="hover:text-white transition-colors">
                Principles
              </Link>
              <Link href="#threat-loom" className="hover:text-white transition-colors">
                Threat Matrix
              </Link>
              <Link href="#crypto-vault" className="hover:text-white transition-colors">
                Enclave
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {/* Minimal Command Key Shortcut */}
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-white/50 hover:border-white/30 hover:text-white transition-all"
              >
                <Terminal className="h-3 w-3 text-cyan-400" />
                <span>AUDIT</span>
                <kbd className="text-[9px] text-white/30">⌘K</kbd>
              </button>

              {/* Restrained Luxury CTA */}
              <Link
                href="/vault"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-400/30 bg-white/[0.04] px-5 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-500 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
              >
                <span>ENTER VAULT</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-white"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Panel */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-3 mx-4 rounded-2xl border border-white/10 bg-[#030508]/95 p-6 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-[0.2em]">
              <Link
                href="#architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                Architecture
              </Link>
              <Link
                href="#monolith"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                Principles
              </Link>
              <Link
                href="#threat-loom"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                Threat Matrix
              </Link>
              <Link
                href="#crypto-vault"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                Enclave
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setCmdOpen(true)
                }}
                className="text-left text-cyan-400 py-1"
              >
                Run System Audit (⌘K)
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  )
}
