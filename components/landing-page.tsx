'use client'

import { CinematicBackground } from './cinematic-background'
import { CinematicHeader } from './cinematic-header'
import { CinematicHero } from './cinematic-hero'
import { KineticMonolith } from './kinetic-monolith'
import { ThreatLoom } from './threat-loom'
import { AttackLab } from './attack-lab'
import { CryptoVault } from './crypto-vault'
import { Gateways } from './gateways'
import { CinematicFooter } from './cinematic-footer'
import type { HomepageData } from '@/lib/site-data'
import { Radio, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export function LandingPage({ data }: { data: HomepageData }) {
  return (
    <div className="relative min-h-screen bg-[#030508] text-[#f4f6fa] selection:bg-cyan-500/25 selection:text-white">
      {/* 1. Multi-layered, living cinematic background with micro-dust & light fields */}
      <CinematicBackground />

      {/* 2. Minimal, editorial header with live telemetry & command trigger */}
      <CinematicHeader />

      {/* 3. Full-screen, high-depth cinematic hero with oversized typography */}
      <CinematicHero />

      {/* 4. Three Laws of Sovereign Defense (The Kinetic Monolith) */}
      <KineticMonolith />

      {/* 5. The Threat Loom (Vector Dissection & Forensic Telemetry) */}
      <ThreatLoom />

      {/* 6. Live Interactive Kill-Chain Lab (Attack & Defensive Disruption Simulation) */}
      <AttackLab />

      {/* 7. Post-Quantum Cryptographic Sandbox (ML-KEM / Kyber Lattice & SHA-256) */}
      <CryptoVault />

      {/* 8. The Three Gateways (Student, Researcher, Enterprise Taxonomy) */}
      <Gateways />

      {/* 9. Live Intelligence & CVE Field Activities */}
      {data && data.updates && data.updates.length > 0 && (
        <section className="relative border-t border-white/[0.06] py-28 sm:py-36 px-6 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-16 border-b border-white/[0.06]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400">
                  Global Telemetry
                </span>
                <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                  Field Dispatches & <span className="font-serif italic font-normal text-cyan-200">Advisories.</span>
                </h2>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 hover:text-white transition-colors"
              >
                <span>View Global Threat Stream</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {data.updates.slice(0, 3).map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/[0.06] bg-[#050811]/60 p-8 backdrop-blur-2xl flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-500"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                      <span className="flex items-center gap-1.5">
                        <Radio className="h-3 w-3 animate-pulse" />
                        ADVISORY
                      </span>
                      <span className="text-white/40">
                        {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold text-white leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.04]">
                    <Link
                      href="/news"
                      className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/80 hover:text-white transition-colors"
                    >
                      Read Full Disclosure →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Atmospheric Cinematic Footer */}
      <CinematicFooter />
    </div>
  )
}
