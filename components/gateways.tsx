'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, GraduationCap, FlaskConical, Building2 } from 'lucide-react'

const gateways = [
  {
    num: '01',
    category: 'STUDENT // SCHOLAR',
    title: 'The Academic Enclave',
    tagline: 'Defensive fluency forged through direct systemic comprehension.',
    description:
      'Interactive packet inspection sandboxes, cryptographic primitives analysis, and hands-on kill-chain disruption models. Designed for researchers and students shaping tomorrow&apos;s defensive protocols.',
    href: '/vault/student',
    icon: GraduationCap,
    badge: 'CLEARANCE_L1',
  },
  {
    num: '02',
    category: 'RESEARCHER // ANALYST',
    title: 'Offensive Disclosure Labs',
    tagline: 'Rigorous vulnerability dissection and post-quantum cryptanalysis.',
    description:
      'Reverse engineering zero-day threat telemetry, observing lattice cryptography avalanche dynamics, and contributing to verifiable responsible disclosure registries.',
    href: '/vault/researcher',
    icon: FlaskConical,
    badge: 'CLEARANCE_L2',
  },
  {
    num: '03',
    category: 'ENTERPRISE // INFRASTRUCTURE',
    title: 'Sovereign Enterprise Mesh',
    tagline: 'Autonomous zero-exposure isolation for mission-critical nodes.',
    description:
      'Continuous kernel verification, dynamic ephemeral ingress tunnels, and hardware TPM-bound session authentication designed for post-quantum defense.',
    href: '/vault/company',
    icon: Building2,
    badge: 'CLEARANCE_L3',
  },
]

export function Gateways() {
  return (
    <section id="architecture" className="relative border-t border-white/[0.06] py-28 sm:py-36 px-6 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-16 border-b border-white/[0.06]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400">
              Taxonomy of Access
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Three Portals to the <span className="font-serif italic font-normal text-cyan-200">Vault.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-white/50 leading-relaxed font-light">
            Kalki Vault unites scholarly education, responsible cryptographic research, 
            and enterprise defensive infrastructure under a singular architecture.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {gateways.map((g) => {
            const Icon = g.icon
            return (
              <motion.article
                key={g.num}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.06] bg-[#050811]/60 p-8 sm:p-10 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/40 hover:bg-[#060a16]/90 hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)]"
              >
                {/* Luminous ambient top glow */}
                <div 
                  className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full blur-[70px] opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)' }}
                />

                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <span className="font-mono text-3xl font-extrabold text-white/20 group-hover:text-cyan-400/40 transition-colors">
                      {g.num}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/50">
                      {g.badge}
                    </span>
                  </div>

                  <span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                    {g.category}
                  </span>

                  <h3 className="mt-2 font-display text-2xl font-bold text-white group-hover:text-cyan-100 transition-colors">
                    {g.title}
                  </h3>

                  <p className="mt-3 text-xs font-mono text-white/60">
                    {g.tagline}
                  </p>

                  <p className="mt-4 text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                    {g.description}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-white/[0.06]">
                  <Link
                    href={g.href}
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 group-hover:text-white transition-colors"
                  >
                    <span>Request Protocol Clearance</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
