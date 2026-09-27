'use client'

import Link from 'next/link'
import { ArrowUpRight, ShieldCheck, Terminal, Lock } from 'lucide-react'

export function CinematicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#020306] pt-24 pb-14 px-6 sm:px-10 overflow-hidden">
      {/* Ambient background bloom */}
      <div 
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full blur-[140px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Editorial Row */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] pb-16 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
                Kalki Vault Sovereign Mesh
              </span>
            </div>
            <p className="mt-6 font-display text-2xl sm:text-4xl font-bold text-white max-w-xl leading-tight">
              Security begins not with containment, but with{' '}
              <span className="font-serif italic font-normal text-cyan-200">sovereign</span> mathematical understanding.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono uppercase tracking-[0.2em]">
            <div>
              <span className="text-white/30 block mb-4">Architecture</span>
              <ul className="space-y-3 text-white/60">
                <li><Link href="#architecture" className="hover:text-white transition-colors">Enclaves</Link></li>
                <li><Link href="#monolith" className="hover:text-white transition-colors">Doctrine</Link></li>
                <li><Link href="#crypto-vault" className="hover:text-white transition-colors">Post-Quantum</Link></li>
              </ul>
            </div>

            <div>
              <span className="text-white/30 block mb-4">Intelligence</span>
              <ul className="space-y-3 text-white/60">
                <li><Link href="#threat-loom" className="hover:text-white transition-colors">Threat Loom</Link></li>
                <li><Link href="#attack-lab" className="hover:text-white transition-colors">Kill-Chain Lab</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">CVE Bulletins</Link></li>
              </ul>
            </div>

            <div>
              <span className="text-white/30 block mb-4">Access</span>
              <ul className="space-y-3 text-white/60">
                <li><Link href="/vault" className="hover:text-white transition-colors">Vault Gateway</Link></li>
                <li><Link href="/control/login" className="hover:text-white transition-colors">Operator Login</Link></li>
                <li>
                  <button onClick={scrollToTop} className="hover:text-cyan-300 transition-colors">
                    Ascend ↑
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Global Node Telemetry Grid */}
        <div className="py-8 border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-6 font-mono text-[10px] text-white/35 uppercase tracking-[0.25em]">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>GLOBAL SYNC: TOKYO // FRANKFURT // SAN JOSE // MUMBAI // SINGAPORE</span>
          </div>
          <div>
            <span>ALGORITHMIC STANDARD: NIST FIPS 203 // ML-KEM-768</span>
          </div>
        </div>

        {/* Monumental Watermark Branding */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-[11px] font-mono text-white/40 uppercase tracking-[0.2em]">
          <div>
            © 2026 KALKI VAULT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>ZERO-TRUST SOVEREIGN CORE</span>
            <span className="text-white/20">|</span>
            <span className="text-cyan-400/80">LATENCY 0.38MS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
