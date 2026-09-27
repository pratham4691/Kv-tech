'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Cpu, Zap, ArrowRight, Lock, KeyRound, Sparkles } from 'lucide-react'

const principles = [
  {
    num: '01',
    title: 'Zero Exposure Surface',
    tag: 'EPHEMERAL_INGRESS',
    lead: 'No public listeners. No perpetual perimeter.',
    description:
      'Traditional defensive architectures defend open gates. Kalki Vault eliminates the gate entirely. Ingress micro-tunnels are generated dynamically via cryptographic handshakes and dissolved immediately upon payload completion.',
    metric: '0.00% Static Exposure',
    telemetry: 'TLS 1.3 // DBSC_TPM_PINNED',
  },
  {
    num: '02',
    title: 'Post-Quantum Lattice Mesh',
    tag: 'NIST_FIPS_203',
    lead: 'Hardened against algorithmic quantum supremacy.',
    description:
      'Protecting current telemetry against "harvest-now, decrypt-later" adversarial campaigns. Every channel is encapsulated with Module-Lattice-Based Key-Encapsulation (ML-KEM) mathematics impervious to Shor&apos;s quantum factorization.',
    metric: '256-bit Post-Quantum Hardness',
    telemetry: 'KYBER_768 // DILITHIUM_V4',
  },
  {
    num: '03',
    title: 'Autonomous Anomaly Severance',
    tag: 'MACHINE_SPEED_INTERCEPT',
    lead: 'Mitigation measured in microseconds, not hours.',
    description:
      'Human response cycles cannot match automated credential stuffing or lateral ransomware propagation. Kalki Vault intercepts malicious execution trees at the hardware kernel level, severing the kill-chain before lateral propagation can begin.',
    metric: '&lt; 0.38ms Containment Latency',
    telemetry: 'KERNEL_ISOLATION // ZERO_DRIFT',
  },
]

export function KineticMonolith() {
  const [activeIdx, setActiveIdx] = useState(0)
  const current = principles[activeIdx]

  return (
    <section id="monolith" className="relative border-t border-white/[0.06] py-28 sm:py-36 px-6 sm:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-16 border-b border-white/[0.06]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400">
              Architectural Doctrine
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Three Laws of <span className="font-serif italic font-normal text-cyan-200">Sovereign</span> Defense.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-white/50 leading-relaxed font-light">
            Defensive systems must operate faster than adversary decision loops. 
            These are the foundational axioms governing the Kalki Vault mesh.
          </p>
        </div>

        {/* Interactive Kinetic Principles Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
          {/* Left: Principle Selector Nav */}
          <div className="space-y-4">
            {principles.map((p, idx) => {
              const isActive = idx === activeIdx
              return (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full text-left rounded-3xl p-6 sm:p-8 transition-all duration-500 border relative overflow-hidden group ${
                    isActive
                      ? 'border-cyan-400/40 bg-white/[0.03] shadow-[0_0_40px_rgba(6,182,212,0.12)]'
                      : 'border-white/[0.04] bg-transparent hover:border-white/20 hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Subtle active left highlight hairline */}
                  {isActive && (
                    <motion.div
                      layoutId="active-principle-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"
                    />
                  )}

                  <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase">
                    <span className={isActive ? 'text-cyan-400 font-bold' : 'text-white/40'}>
                      {p.num} // {p.tag}
                    </span>
                    <span className="text-white/30 text-[11px]">{p.metric.replace('&lt;', '<')}</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-100 transition-colors">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-white/50 line-clamp-1">
                    {p.lead}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Right: Deep Dimensional Detail Monolith */}
          <div className="relative min-h-[460px] rounded-3xl border border-white/[0.08] bg-[#050811]/70 p-8 sm:p-12 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            {/* Luminous background refraction */}
            <div 
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-[100px] opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)' }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.num}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col justify-between h-full space-y-8"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                    <span className="font-mono text-5xl sm:text-6xl font-extrabold text-white/20">
                      {current.num}
                    </span>
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                      {current.telemetry}
                    </span>
                  </div>

                  <h4 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-white">
                    {current.lead}
                  </h4>

                  <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed font-light">
                    {current.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>BENCHMARK: {current.metric.replace('&lt;', '<')}</span>
                  </div>
                  <span className="text-white/40">CALIBRATED ON 6 GLOBAL NODES</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
