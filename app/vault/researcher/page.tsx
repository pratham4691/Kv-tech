'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FlaskConical, Lock, AlertCircle, ArrowLeft, 
  Terminal, ShieldAlert, Cpu, Bell, KeyRound
} from 'lucide-react'

const researchLabs = [
  {
    id: 'lab-quantum-01',
    name: 'Kyber / ML-KEM Lattice Cryptanalysis',
    classification: 'RESTRICTED // LEVEL-4',
    runtime: 'Hardware TPM Enclave',
    description: 'Differential power and cache timing analysis sandbox for post-quantum key encapsulation algorithms.',
  },
  {
    id: 'lab-kernel-02',
    name: 'Zero-Day Kernel Memory Corruption Fuzzing',
    classification: 'CONFIDENTIAL // ISOLATED',
    runtime: 'Bare-Metal MicroVM Cluster',
    description: 'Autonomous symbolic execution and eBPF kernel tracing harness for zero-day memory corruption discovery.',
  },
  {
    id: 'lab-protocol-03',
    name: 'Side-Channel Token Forgery & SAML Replay',
    classification: 'SECRET // OFFENSIVE',
    runtime: 'Ephemeral Virtual SOC',
    description: 'Attack simulation framework testing timing leaks in cryptographic SAML and FIDO2 authentication bridges.',
  }
]

export default function ResearcherVaultPage() {
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedLab, setSelectedLab] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const handleLabClick = (name: string) => {
    setSelectedLab(name)
    setShowBlockModal(true)
  }

  return (
    <div className="min-h-screen bg-[#030206] text-[#f4f6fa] pt-24 pb-20 px-6 sm:px-12 selection:bg-amber-500/25 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Public Radar</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-[11px] text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>RESEARCHER CLEARANCE VERIFIED</span>
          </div>
        </div>

        {/* PROMINENT BLOCK / HOLD NOTICE BANNER */}
        <div className="rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-950/40 via-red-950/20 to-black p-6 sm:p-8 backdrop-blur-xl mb-12 shadow-[0_0_50px_rgba(255,80,0,0.15)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-orange-400 font-bold mb-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>RESEARCH LABS CURRENTLY ON HOLD // ACCESS TEMPORARILY UNAVAILABLE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Sandbox Infrastructure Maintenance & Hardware Recalibration
                </h2>
                <p className="text-sm text-zinc-300 font-light max-w-3xl leading-relaxed">
                  Post-quantum attack reproduction testbeds and kernel simulation enclaves are temporarily held 
                  for scheduled isolation verification. Interactive fuzzing environments are temporarily unavailable. 
                  Please stand by while hardware integrity checks complete.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubscribed(true)}
              disabled={subscribed}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-orange-400 transition-colors shrink-0 disabled:opacity-50"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>{subscribed ? 'Queue Registered' : 'Notify On Lab Release'}</span>
            </button>
          </div>
        </div>

        {/* Research Labs Catalog (Locked) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Cryptographic & Offensive Research Labs</h3>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Isolated sandbox instances (Held for enclave security recalibration)
              </p>
            </div>
            <span className="font-mono text-xs text-orange-400/80 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded">
              STATE: MAINTENANCE // RESTRICTED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchLabs.map((lab) => (
              <div
                key={lab.id}
                onClick={() => handleLabClick(lab.name)}
                className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-orange-500/40 hover:bg-white/[0.04] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-orange-400 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      {lab.classification}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors mb-2">
                    {lab.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                    {lab.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-zinc-400">
                  <span className="text-zinc-500">{lab.runtime}</span>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Launch <Lock className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BLOCK MODAL DIALOG */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-orange-500/40 bg-[#0d0907] p-8 shadow-[0_0_80px_rgba(255,80,0,0.3)] text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
                <Lock className="h-7 w-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-3">
                <span>SANDBOX CURRENTLY UNAVAILABLE</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {selectedLab || 'Research Lab'}
              </h3>

              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                Direct bare-metal compute execution is paused while hardware TPM enclave verification runs. 
                Please stand by; research nodes will re-enable following compliance certification.
              </p>

              <div className="rounded-lg bg-black/50 border border-white/10 p-3 font-mono text-xs text-zinc-400 mb-6">
                LOCKOUT STATUS: ENCLAVE-RECALIBRATION-2026
              </div>

              <button
                onClick={() => setShowBlockModal(false)}
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 py-2.5 font-mono text-xs font-semibold text-black hover:brightness-110 transition-all uppercase tracking-wider"
              >
                Acknowledge & Stand By
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
