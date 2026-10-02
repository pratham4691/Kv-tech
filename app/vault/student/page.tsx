'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, Play, Lock, AlertCircle, Clock, 
  ArrowLeft, ShieldAlert, BookOpen, Video, 
  Terminal, X, FileText, Bell, CheckCircle2
} from 'lucide-react'

const trainingModules = [
  {
    id: 'phishing-deepdive',
    title: 'Phishing & Social Engineering Dissection',
    category: 'BEHAVIORAL DEFENSE',
    duration: '18 mins',
    level: 'Foundational',
    summary: 'Analyze weaponized spear-phishing payloads, homoglyph domains, and deepfake voice clone attacks targeting modern university students.',
  },
  {
    id: 'zero-trust-hygiene',
    title: 'Zero-Trust Principles & Endpoint Hygiene',
    category: 'IDENTITY ARCHITECTURE',
    duration: '24 mins',
    level: 'Intermediate',
    summary: 'Learn why static perimeters fail. Hands-on exploration of device attestation, hardware-bound tokens, and ephemeral credentials.',
  },
  {
    id: 'crypto-foundations',
    title: 'Modern Cryptography & Post-Quantum Transition',
    category: 'CRYPTOGRAPHY',
    duration: '32 mins',
    level: 'Advanced',
    summary: 'Master symmetric ciphers, asymmetric public keys, elliptic curves, and the upcoming migration to NIST post-quantum algorithms.',
  },
  {
    id: 'cloud-threat-vectors',
    title: 'Cloud Threat Vectors & Supply Chain Vulnerabilities',
    category: 'INFRASTRUCTURE',
    duration: '22 mins',
    level: 'Intermediate',
    summary: 'Understand misconfigured S3 buckets, exposed IAM credentials, CI/CD injection attacks, and container breakout forensics.',
  }
]

export default function StudentVaultPage() {
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const handleModuleClick = (title: string) => {
    setSelectedModule(title)
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

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>AUTHENTICATED // STUDENT IDENTITY VERIFIED</span>
          </div>
        </div>

        {/* PROMINENT BLOCK / HOLD NOTICE BANNER */}
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-red-950/20 to-black p-6 sm:p-8 backdrop-blur-xl mb-12 shadow-[0_0_50px_rgba(255,102,0,0.15)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>TRAINING VIDEOS TEMPORARILY UNAVAILABLE // ON HOLD</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Curriculum Upgrade & Media Infrastructure In Progress
                </h2>
                <p className="text-sm text-zinc-300 font-light max-w-3xl leading-relaxed">
                  The student cybersecurity video repository is currently undergoing scheduled platform re-indexing and secure enclave provisioning. 
                  All training videos and courseware modules are temporarily on hold. Please check back shortly or register for automatic notification upon release.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubscribed(true)}
              disabled={subscribed}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-amber-400 transition-colors shrink-0 disabled:opacity-50"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>{subscribed ? 'Waitlist Confirmed' : 'Notify When Available'}</span>
            </button>
          </div>
        </div>

        {/* Video Courseware Grid (Locked / Unavailable) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Academic Training Catalog</h3>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Scheduled instructional modules (Access restricted pending infrastructure maintenance)
              </p>
            </div>
            <span className="font-mono text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded">
              STATUS: LOCKED // INACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.title)}
                className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-white/[0.04] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-amber-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {module.level} • {module.duration}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                  {module.category}
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {module.title}
                </h4>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {module.summary}
                </p>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Clock className="h-3 w-3" /> Status: On Hold
                  </span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Access Stream <Lock className="h-3 w-3" />
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
              className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#0d0907] p-8 shadow-[0_0_80px_rgba(255,102,0,0.3)] text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <Lock className="h-7 w-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3">
                <span>MODULE CURRENTLY UNAVAILABLE</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {selectedModule || 'Training Video'}
              </h3>

              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                Streaming access to this course module is currently on hold while infrastructure security patches are deployed. 
                Please stand by for administrative verification.
              </p>

              <div className="rounded-lg bg-black/50 border border-white/10 p-3 font-mono text-xs text-zinc-400 mb-6">
                HOLD CODE: SEC-CURRICULUM-PENDING-2026
              </div>

              <button
                onClick={() => setShowBlockModal(false)}
                className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 font-mono text-xs font-semibold text-black hover:brightness-110 transition-all uppercase tracking-wider"
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
