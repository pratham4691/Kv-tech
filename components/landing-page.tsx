'use client'

import { Navigation } from './navigation'
import { Hero } from './hero'
import { ThreatExplorer } from './threat-explorer'
import { AttackLab } from './attack-lab'
import { CryptoVault } from './crypto-vault'
import { AttackLifecycle } from './attack-lifecycle'
import { Ecosystem } from './ecosystem'
import { Audiences } from './audiences'
import { About } from './about'
import { SiteFooter } from './site-footer'
import { LoadingScreen } from './loading-screen'
import type { HomepageData } from '@/lib/site-data'
import { Reveal, SectionKicker } from './reveal'
import { Radio, MapPinned, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function LandingPage({ data }: { data: HomepageData }) {
  return (
    <div className="relative min-h-screen bg-[#030914] text-foreground selection:bg-cyan-500/30">
      {/* Quick session boot screen */}
      <LoadingScreen />

      {/* Global Professional Floating Navbar */}
      <Navigation />

      {/* Hero Section with Kinetic Singularity & Heuristic Vector Analyzer */}
      <Hero />

      {/* Threat Explorer (Awareness & Threat Vectors) */}
      <ThreatExplorer />

      {/* Live Kill-Chain Simulator (Interactive Defense Lab) */}
      <AttackLab />

      {/* Post-Quantum Cryptographic Vault Enclave */}
      <CryptoVault />

      {/* Attack Lifecycle Model */}
      <AttackLifecycle />

      {/* Kalki Vault Ecosystem (3 Paths) */}
      <Ecosystem />

      {/* Audience Pathways */}
      <Audiences />

      {/* Live Intelligence & Recent Community Activities Feed */}
      {data && (data.updates?.length > 0 || data.activities?.length > 0) && (
        <section className="relative border-t border-border/60 py-24 sm:py-32 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <SectionKicker>Intelligence & Community</SectionKicker>
              <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl text-white">
                Live Bulletins & Field Activities.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Continuous security advisories, vulnerability disclosures, and educational workshop activities from across the network.
              </p>
            </Reveal>

            {/* Updates Grid */}
            {data.updates && data.updates.length > 0 && (
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {data.updates.slice(0, 3).map((alert) => (
                  <Reveal key={alert.title}>
                    <article className="h-full flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl hover:border-cyan-500/40 transition-all">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                          <span className="flex items-center gap-1.5">
                            <Radio className="h-3 w-3 animate-pulse text-cyan-400" />
                            ADVISORY
                          </span>
                          <span className="text-slate-500">
                            {new Date(alert.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-bold text-white">
                          {alert.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                          {alert.summary}
                        </p>
                      </div>
                      <Link
                        href="/news"
                        className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 hover:text-white"
                      >
                        Read Full Bulletin <ArrowRight className="h-3 w-3" />
                      </Link>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Activities Grid */}
            {data.activities && data.activities.length > 0 && (
              <div className="mt-14">
                <div className="mb-6 font-mono text-xs uppercase tracking-widest text-slate-400">
                  Recent Educational Workshops & Research Engagements
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.activities.slice(0, 3).map((activity) => (
                    <Reveal key={`${activity.title}-${activity.date}`}>
                      <article className="h-full rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                              {activity.title}
                            </span>
                            <h3 className="mt-2 text-lg font-bold text-white">
                              {activity.institution}
                            </h3>
                          </div>
                          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-mono text-cyan-200">
                            {new Date(activity.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <MapPinned className="h-3.5 w-3.5 text-cyan-300" />
                          {activity.location}
                        </div>
                        <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                          {activity.description}
                        </p>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <About />

      {/* Complete Site Footer */}
      <SiteFooter />
    </div>
  )
}
