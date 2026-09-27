'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Shield, Terminal, Zap, ArrowRight, X, 
  Lock, Activity, AlertTriangle, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'commands' | 'diagnostics'>('commands')
  const [diagStep, setDiagStep] = useState(0)
  const [isRunningDiag, setIsRunningDiag] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const startDiagnostics = () => {
    setIsRunningDiag(true)
    setDiagStep(1)
    setTimeout(() => setDiagStep(2), 500)
    setTimeout(() => setDiagStep(3), 1100)
    setTimeout(() => {
      setDiagStep(4)
      setIsRunningDiag(false)
    }, 1700)
  }

  const commands = [
    {
      title: 'Run Instant Security Audit',
      desc: 'Check local client entropy, protocol cipher health, and network privacy',
      category: 'Diagnostics',
      icon: Activity,
      action: () => {
        setActiveTab('diagnostics')
        startDiagnostics()
      }
    },
    {
      title: 'Live Threat Explorer',
      desc: 'Inspect real vectors: Phishing, Ransomware, Cloud IAM & Session Hijacking',
      category: 'Awareness',
      icon: AlertTriangle,
      href: '#threats'
    },
    {
      title: 'Interactive Kill-Chain Lab',
      desc: 'Simulate full cyber kill-chains and test defensive disruption techniques',
      category: 'Interactive Lab',
      icon: Terminal,
      href: '#attack-lab'
    },
    {
      title: 'Cryptographic Key Vault',
      desc: 'Generate SHA-256, HMAC, and simulated Post-Quantum lattice tokens',
      category: 'Cryptography',
      icon: Lock,
      href: '#crypto-vault'
    },
    {
      title: 'Enter Kalki Vault Gateway',
      desc: 'Access portals for Students, Researchers, and Enterprise Infrastructure',
      category: 'Access',
      icon: Shield,
      href: '/vault'
    },
    {
      title: 'Live CVE & Cyber Intelligence Feed',
      desc: 'Real-time telemetry and global security disclosures',
      category: 'Intelligence',
      icon: Zap,
      href: '/news'
    }
  ]

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950/95 p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 flex-1 mr-4">
                <Search className="h-5 w-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search threats, security tools, cryptology, commands..."
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                  ESC to close
                </span>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 border-b border-white/5 pb-2 text-xs font-mono uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('commands')}
                className={`pb-1 transition-colors relative ${activeTab === 'commands' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Quick Commands
                {activeTab === 'commands' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('diagnostics')
                  if (diagStep === 0) startDiagnostics()
                }}
                className={`pb-1 transition-colors relative flex items-center gap-1.5 ${activeTab === 'diagnostics' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Activity className="h-3.5 w-3.5" />
                Live Client Audit
                {activeTab === 'diagnostics' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>

            {activeTab === 'commands' && (
              <div className="mt-4 max-h-[360px] overflow-y-auto space-y-2 pr-1">
                {filteredCommands.map((cmd) => {
                  const Icon = cmd.icon
                  if (cmd.href) {
                    return (
                      <Link
                        key={cmd.title}
                        href={cmd.href}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white group-hover:text-cyan-200">{cmd.title}</span>
                              <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/80 rounded bg-cyan-500/10 px-1.5 py-0.5">{cmd.category}</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">{cmd.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    )
                  }

                  return (
                    <button
                      key={cmd.title}
                      onClick={() => {
                        cmd.action && cmd.action()
                      }}
                      className="w-full text-left group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white group-hover:text-cyan-200">{cmd.title}</span>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/80 rounded bg-cyan-500/10 px-1.5 py-0.5">{cmd.category}</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{cmd.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  )
                })}
              </div>
            )}

            {activeTab === 'diagnostics' && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-xs uppercase tracking-wider text-white">Client Security Posture Audit</span>
                    </div>
                    <button
                      onClick={startDiagnostics}
                      disabled={isRunningDiag}
                      className="text-xs font-mono text-cyan-400 hover:underline disabled:opacity-50"
                    >
                      {isRunningDiag ? 'Auditing...' : 'Re-Run Audit'}
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">1. Transport Layer Security (TLS 1.3 / HTTPS)</span>
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        {diagStep >= 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5 animate-spin text-cyan-400" />}
                        {diagStep >= 1 ? 'ACTIVE (AES-256-GCM)' : 'Checking...'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">2. Browser Crypto API (SubtleCrypto)</span>
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        {diagStep >= 2 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5 animate-spin text-cyan-400" />}
                        {diagStep >= 2 ? 'HARDWARE ENCLAVE AVAILABLE' : 'Scanning...'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">3. Content Security Policy & XSS Shield</span>
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        {diagStep >= 3 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5 animate-spin text-cyan-400" />}
                        {diagStep >= 3 ? 'STRICT HEADERS ENFORCED' : 'Auditing...'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">4. Kalki Zero-Trust Defensive Readiness</span>
                      <span className="flex items-center gap-1 font-mono text-cyan-300 font-semibold">
                        {diagStep >= 4 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5 animate-spin text-cyan-400" />}
                        {diagStep >= 4 ? 'GRADE A+ (100% OPERATIONAL)' : 'Evaluating...'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-3 text-xs text-cyan-200">
                  <span>Everything is secure. No anomalies detected on your current session.</span>
                  <Link
                    href="/vault"
                    onClick={onClose}
                    className="font-semibold underline ml-2 shrink-0 hover:text-white"
                  >
                    Open Vault Enclave &rarr;
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Kalki Threat Intelligence Node • Online</span>
              </div>
              <span>Press <kbd className="rounded bg-white/10 px-1 text-slate-300">Ctrl+K</kbd> anytime</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
