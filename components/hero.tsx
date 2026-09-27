'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, ShieldCheck, ShieldAlert, ArrowRight, Activity, 
  Terminal, Search, Zap, Lock, RefreshCw, CheckCircle2, 
  AlertTriangle, Copy, Sparkles, Cpu
} from 'lucide-react'
import { NetworkCanvas } from './network-canvas'
import { MagneticButton } from './magnetic-button'

// Sample preset security vectors for instant user testing
const presetVectors = [
  { label: 'Phishing Domain', val: 'https://security-verify-paypa1.com/login', type: 'url' },
  { label: 'Tor Exit Node', val: '198.51.100.24', type: 'ip' },
  { label: 'Weak Credential', val: 'CompanyAdmin2024!', type: 'password' },
  { label: 'Malicious Payload', val: 'powershell -nop -w hidden -enc JABz...', type: 'code' },
]

export function Hero() {
  const [inputVector, setInputVector] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [activeHeroTab, setActiveHeroTab] = useState<'analyzer' | 'telemetry' | 'protocols'>('analyzer')
  const [threatCount, setThreatCount] = useState(14892)

  // Subtle real-time threat counter increment to show live system pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setThreatCount(prev => prev + Math.floor(Math.random() * 2) + 1)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const runAnalysis = (vectorToTest?: string) => {
    const target = vectorToTest || inputVector
    if (!target.trim()) return

    setIsScanning(true)
    setScanResult(null)

    setTimeout(() => {
      // Calculate real Shannon entropy
      const str = target.trim()
      const len = str.length
      const freq: Record<string, number> = {}
      for (const char of str) {
        freq[char] = (freq[char] || 0) + 1
      }
      let entropy = 0
      for (const count of Object.values(freq)) {
        const p = count / len
        entropy -= p * Math.log2(p)
      }

      const isSuspiciousDomain = /paypa1|login|verify|update|account|secure.*\.com|bit\.ly/i.test(str)
      const isWeakPass = str.length < 10 || /123|admin|pass/i.test(str)
      const isScript = /powershell|cmd|sh|curl|wget|eval|enc/i.test(str)

      let riskScore = 18
      let riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL' = 'LOW'
      let mitreTag = 'T1071.001 - Web Protocols'
      let verdict = 'No anomalous heuristic indicators detected. Session transport appears secure.'
      let action = 'Enforce standard TLS 1.3 encryption and continuous zero-trust authorization.'

      if (isSuspiciousDomain) {
        riskScore = 89
        riskLevel = 'CRITICAL'
        mitreTag = 'T1566.002 - Spearphishing Link'
        verdict = 'Domain matches known typosquatting / credential harvesting signature patterns.'
        action = 'Isolate endpoint DNS, block ingress on perimeter firewall, and invalidate active cookies.'
      } else if (isScript) {
        riskScore = 94
        riskLevel = 'CRITICAL'
        mitreTag = 'T1059.001 - PowerShell Command Obfuscation'
        verdict = 'Base64 encoded execution string with hidden window flags detected.'
        action = 'Terminate child process tree, trigger EDR quarantine, and inspect parent PID.'
      } else if (isWeakPass) {
        riskScore = 72
        riskLevel = 'MEDIUM'
        mitreTag = 'T1110.001 - Password Guessing / Dictionary'
        verdict = 'Low complexity profile susceptible to hash-table precomputation and credential stuffing.'
        action = 'Rotate to 16+ character high-entropy passphrase with FIDO2 hardware MFA token.'
      }

      setScanResult({
        target,
        entropy: entropy.toFixed(2),
        riskScore,
        riskLevel,
        mitreTag,
        verdict,
        action,
        timestamp: new Date().toLocaleTimeString(),
      })
      setIsScanning(false)
    }, 700)
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      {/* Background Cyber Mesh */}
      <NetworkCanvas className="absolute inset-0 h-full w-full opacity-60" density={1.1} />
      <div className="grid-backdrop absolute inset-0 opacity-40" />

      {/* Luminous Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(6,182,212,0.14), transparent 70%), radial-gradient(ellipse 50% 40% at 85% 75%, rgba(139,92,246,0.1), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Badges & Tagline */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-200">
              Kalki Vault • Autonomous Cyber Shield
            </span>
            <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-slate-400">
              v2.4 Active
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 max-w-4xl font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Security begins with{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
              understanding.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            Explore real attack kill-chains, dissect digital threats in a live sandbox, 
            and experience zero-trust defensive architecture built for the post-quantum era.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton href="#threats" variant="primary">
              <ShieldAlert className="h-4 w-4" />
              Explore Threat Vectors
            </MagneticButton>
            <MagneticButton href="#attack-lab" variant="ghost">
              <Terminal className="h-4 w-4 text-cyan-400" />
              Interactive Kill-Chain Lab
            </MagneticButton>
          </motion.div>
        </div>

        {/* Dynamic Vesper-Style Kinetic Singularity & Interactive Security Console */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 relative"
        >
          {/* Kinetic Orbiting Ring Visualizer Behind Console */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[350px] pointer-events-none opacity-40 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-cyan-500/20 animate-[spin_40s_linear_infinite]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full border border-dashed border-cyan-400/25 animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-blue-500/20 animate-[spin_15s_linear_infinite]" />
          </div>

          {/* Floating Live Telemetry Badges (Vesper Style) */}
          <div className="hidden lg:grid grid-cols-4 gap-4 mb-4">
            <motion.div 
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  POST-QUANTUM
                </span>
                <span className="text-emerald-400 font-semibold">NIST FIPS 203</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">Kyber Lattice Shield</div>
              <div className="mt-0.5 text-[11px] text-slate-400">Hardware-level resistance</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  THREATS BLOCKED
                </span>
                <span className="text-cyan-300 font-semibold">LIVE</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {threatCount.toLocaleString()} Vectors
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">Zero-day packet drops</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-yellow-400" />
                  LATENCY
                </span>
                <span className="text-emerald-400 font-semibold">&lt; 0.4ms</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">Edge Interception</div>
              <div className="mt-0.5 text-[11px] text-slate-400">Decentralized mesh sync</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  ZERO-TRUST
                </span>
                <span className="text-emerald-400 font-semibold">100% HEALTH</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">Continuous Auth</div>
              <div className="mt-0.5 text-[11px] text-slate-400">Micro-segmented nodes</div>
            </motion.div>
          </div>

          {/* Core Interactive Security Workbench */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-5 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-white/10">
            {/* Top Bar of the Interactive Console */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">
                    Kalki Heuristic Vector Analyzer
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Real-time entropy & threat mitigation engine
                  </p>
                </div>
              </div>

              {/* Console Tabs */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('analyzer')}
                  className={`rounded-full px-3 py-1 transition-all ${
                    activeHeroTab === 'analyzer'
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Vector Analyzer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('protocols')}
                  className={`rounded-full px-3 py-1 transition-all ${
                    activeHeroTab === 'protocols'
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Shield Protocols
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab('telemetry')}
                  className={`rounded-full px-3 py-1 transition-all ${
                    activeHeroTab === 'telemetry'
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Global Telemetry
                </button>
              </div>
            </div>

            {/* TAB 1: Live Vector Analyzer */}
            {activeHeroTab === 'analyzer' && (
              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Enter Domain, URL, Hash, or Suspicious Credential to Inspect:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                      <input
                        type="text"
                        value={inputVector}
                        onChange={(e) => setInputVector(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                        placeholder="e.g. security-verify-paypa1.com or 198.51.100.24"
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => runAnalysis()}
                      disabled={isScanning}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Auditing Vector...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Run Deep Heuristic Scan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Preset Buttons for Quick Testing */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Quick Test Vectors:</span>
                    {presetVectors.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setInputVector(p.val)
                          runAnalysis(p.val)
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analysis Results Display */}
                <AnimatePresence>
                  {scanResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-5 backdrop-blur-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 items-center gap-1 rounded-full px-2.5 text-[10px] font-mono font-bold tracking-wider uppercase ${
                              scanResult.riskLevel === 'CRITICAL'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : scanResult.riskLevel === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {scanResult.riskLevel === 'CRITICAL' ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            RISK LEVEL: {scanResult.riskLevel} ({scanResult.riskScore}/100)
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            MITRE ATT&CK: <span className="text-cyan-300">{scanResult.mitreTag}</span>
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">
                          Audited at {scanResult.timestamp}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Shannon Entropy
                          </span>
                          <div className="mt-1 text-base font-bold text-white font-mono">
                            {scanResult.entropy} <span className="text-xs text-slate-400 font-normal">bits/char</span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3 sm:col-span-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Heuristic Vector Verdict
                          </span>
                          <p className="mt-1 text-xs text-slate-200 leading-relaxed">
                            {scanResult.verdict}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3.5 flex items-start gap-3">
                        <ShieldCheck className="h-4 w-4 text-cyan-300 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-200 font-semibold block">
                            Recommended Kalki Defense Rule:
                          </span>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {scanResult.action}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 2: Shield Protocols */}
            {activeHeroTab === 'protocols' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-semibold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20">1</span>
                    Zero-Trust Gateway
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Every packet, token, and payload is treated as adversarial until cryptographic verification passes.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-semibold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20">2</span>
                    Dynamic Deobfuscation
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Automated sandboxed string decompression, AST code disassembly, and MITRE mapping.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-semibold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20">3</span>
                    Kill-Chain Interruption
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Autonomous containment policies isolate infected sessions before privilege escalation.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Global Telemetry */}
            {activeHeroTab === 'telemetry' && (
              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2 text-[10px] uppercase">
                  <span>Source / Node</span>
                  <span>Threat Signature</span>
                  <span>Status</span>
                </div>
                {[
                  { node: 'AP-SOUTH-1 (Mumbai Node)', threat: 'T1566.002 Spearphishing URL', status: 'DROP & QUARANTINE' },
                  { node: 'EU-CENTRAL-1 (Frankfurt)', threat: 'T1078 Valid Account Takeover', status: 'MFA CHALLENGE' },
                  { node: 'US-EAST-1 (N. Virginia)', threat: 'T1110 Credential Stuffing (3k req/s)', status: 'RATE LIMIT & BLOCK' },
                  { node: 'AP-NORTHEAST-1 (Tokyo)', threat: 'T1059 Obfuscated PowerShell Shell', status: 'ISOLATED' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 text-slate-300">
                    <span className="text-cyan-300">{item.node}</span>
                    <span className="text-slate-400">{item.threat}</span>
                    <span className="text-emerald-400 font-semibold">{item.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Status Ticker */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Kalki Defense Mesh: All 6 Global Enclaves Synchronized</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-300">Entropy Baseline: 4.82</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">Zero Vulnerabilities Pending</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
