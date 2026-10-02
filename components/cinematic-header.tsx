'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Threat Radar', href: '#threat-news' },
  { label: 'Live CVEs', href: '#threat-news' },
  { label: 'Portals', href: '/vault' },
]

export function CinematicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3.5 bg-[#030206]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : 'py-5 bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-12 flex items-center justify-between">
        
        {/* Clean Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:border-amber-400 transition-colors">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold tracking-[0.18em] text-white">
            KALKI <span className="text-amber-500 font-light">//</span> VAULT
          </span>
        </Link>

        {/* Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Portal CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-300 hover:bg-amber-500 hover:text-black transition-all shadow-[0_0_15px_rgba(255,140,0,0.15)]"
          >
            <Lock className="h-3 w-3" />
            <span>Vault Access</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden mx-6 mt-3 rounded-xl border border-white/10 bg-[#0c0806]/95 p-4 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white py-1.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
